import config from '../../config'
import { DateTimeService } from '../index'
import * as EsQueryBuilder from '../../utils/EsQueryBuilder'
import * as AmbarLogMapping from './AmbarLogMapping.json'
import * as AmbarFileDataMapping from './AmbarFileDataMapping.json'

const MAPPING_ANALYZER_REGEX = /\$\{ANALYZER\}/g

const ES_LOG_INDEX_NAME = "ambar_log_record_data"
const ES_LOG_TYPE_NAME = "ambar_log_record"
const ES_FILE_INDEX_NAME = "ambar_file_data"
const ES_FILE_TYPE_NAME = "ambar_file"
const ES_FILE_TAG_TYPE_NAME = "ambar_file_tag"

const transformTagsStat = (esResponse) => {
    const resp = []

    esResponse.aggregations.tags.buckets.forEach(tag => {
        tag.type.buckets.forEach(tagType => {
            resp.push({ name: tag.key, type: tagType.key, filesCount: tagType.doc_count })
        })
    })

    return resp
}

const normalizeHitContentHighlights = (hit) => {
    const ALLOWED_TAGS = ['br', 'em', 'em class="entity"']
    const SEPARATOR_TAG = '<br/>'
    const SPACE_CHAR = ' '

    if (!hit.content) {
        return hit
    }

    if (!hit.content.highlight) {
        return hit
    }

    if (!hit.content.highlight.text) {
        return hit
    }

    hit.content.highlight.text = hit.content.highlight.text.map(hl => {
        let strippedHl = hl
            .replace(/</gim, '&lt;')
            .replace(/>/gim, '&gt;')

        ALLOWED_TAGS.forEach(tag => {
            strippedHl = strippedHl
                .replace(new RegExp(`(&lt;${tag}&gt;)`, 'gim'), `<${tag}>`)
                .replace(new RegExp(`(&lt;${tag}/&gt;)`, 'gim'), `<${tag}/>`)
                .replace(new RegExp(`(&lt;/${tag}&gt;)`, 'gim'), `</${tag}>`)
        })

        strippedHl = strippedHl.replace(/(?:\r\n|\r|\n)/gi, SEPARATOR_TAG)
            .replace(/(<br\s*\/?>(\s*)){2,}/gi, SEPARATOR_TAG)
            .replace(/((&nbsp;)+)/gi, SPACE_CHAR)
            .replace(/(?:\t)+/gi, SPACE_CHAR)
            .replace(/[\s]+/gi, SPACE_CHAR)

        return strippedHl
    })

    return hit
}

const mergeAnalyzedFieldsHighlight = (highlight) => {
    if (!highlight) {
        return highlight
    }

    Object.keys(highlight).filter(key => /\.analyzed$/.test(key)).forEach(key => {
        const originalKey = key.replace(/\.analyzed$/, '')
        if (!highlight[originalKey]) {
            highlight[originalKey] = []
        }
        highlight[originalKey].concat(highlight[key])
        delete highlight[key]
    })

    return highlight
}

const transformHit = (hit) => {
    const transformedHit = {
        ...hit._source,
        tags: [],
        score: hit._score,
        hidden_mark: undefined
    }

    const highlight = mergeAnalyzedFieldsHighlight(hit.highlight)

    if (highlight) {
        Object.keys(highlight).forEach(key => {
            if (key.startsWith('meta.')) {
                if (!transformedHit.meta.highlight) {
                    transformedHit.meta.highlight = {}
                }
                transformedHit.meta.highlight[key.replace('meta.', '')] = highlight[key]
            }
            if (key.startsWith('content.')) {
                if (!transformedHit.content.highlight) {
                    transformedHit.content.highlight = {}
                }
                transformedHit.content.highlight[key.replace('content.', '')] = highlight[key]
            }
        })
    }

    if (hit.inner_hits && hit.inner_hits.ambar_file_tag) {
        transformedHit.tags = hit.inner_hits.ambar_file_tag.hits.hits.map(hit => {
            return hit.highlight ? { ...hit._source, highlight: hit.highlight } : hit._source
        })
    }

    if (hit.inner_hits && hit.inner_hits.ambar_file_hidden_mark && hit.inner_hits.ambar_file_hidden_mark.hits.hits.length > 0) {
        transformedHit.hidden_mark = hit.inner_hits.ambar_file_hidden_mark.hits.hits[0]._source
    }

    return transformedHit
}

export const getTagsStat = (esClient) => new Promise((resolve, reject) =>
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TAG_TYPE_NAME,
        body: EsQueryBuilder.getTagsStatsQuery()
    })
        .then(result => {
            resolve(transformTagsStat(result))
        })
        .catch(err => reject(err))
)

export const checkIfMetaIdExists = (esClient, metaId) => new Promise((resolve, reject) => {
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        _source: false,
        body: {
            query: {
                term: { 'meta.id': metaId }
            }
        }
    })
        .then(result => resolve(result.hits.total > 0 ? true : false))
        .catch(err => reject(err))
})

export const getFileBySha = (esClient, sha) => new Promise((resolve, reject) => {
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        body: {
            from: 0,
            size: 1,
            query: {
                term: { 'sha256': sha }
            }
        }
    })
        .then(result => resolve(result.hits.total > 0 ? normalizeHitContentHighlights(transformHit(result.hits.hits[0])) : null))
        .catch(err => reject(err))
})

export const indexTag = (esClient, fileId, tag) => new Promise((resolve, reject) => {
    tag.indexed_datetime = DateTimeService.getCurrentDateTime()
    esClient.index({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TAG_TYPE_NAME,
        parent: fileId,
        refresh: true,
        id: tag.id,
        body: tag
    })
        .then(res => resolve(res))
        .catch(err => reject(err))
})

export const indexLogItem = (esClient, logItem) => {
    logItem.indexed_datetime = DateTimeService.getCurrentDateTime()
    esClient.index({
        index: ES_LOG_INDEX_NAME,
        type: ES_LOG_TYPE_NAME,
        body: logItem
    })
}

export const createLogIndexIfNotExists = (esClient) => new Promise((resolve, reject) => {
    esClient.indices.create({
        index: ES_LOG_INDEX_NAME,
        body: AmbarLogMapping
    })
        .then(() => resolve())
        .catch(err => {
            if (err.status === 400) {
                resolve() // Log index already exists
                return
            }

            reject(err)
        })
})

export const createFilesIndex = (esClient) => new Promise((resolve, reject) => {
    let mappings = JSON.parse(JSON.stringify({ ...AmbarFileDataMapping }).replace(MAPPING_ANALYZER_REGEX, config.langAnalyzer))

    esClient.indices.create({
        index: ES_FILE_INDEX_NAME,
        body: mappings
    })
        .then(result => resolve(result))
        .catch(err => reject(err))
})

export const deleteAutoTags = (esClient, fileId) => new Promise((resolve, reject) => {
    removeAutoTags(esClient, fileId)
        .then(result => resolve(result))
        .catch(err => reject(err))
})

const removeAutoTags = (esClient, fileId) => new Promise((resolve, reject) => {
    esClient.deleteByQuery({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TAG_TYPE_NAME,
        body: {
            query: {
                bool: {
                    must: [
                        {
                            parent_id: {
                                type: ES_FILE_TAG_TYPE_NAME,
                                id: fileId
                            }
                        },
                        {
                            bool: {
                                should: [
                                    {
                                        term: {
                                            type: 'auto'
                                        }
                                    },
                                    {
                                        term: {
                                            type: 'source'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        }
    })
        .then(res => resolve(res))
        .catch(err => reject(err))
})