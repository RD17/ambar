import moment from 'moment'
import { DateTimeService, CryptoService } from '../index'
import * as EsQueryBuilder from '../../utils/EsQueryBuilder'

const MIN_THRESHOLD_EXTENSION = 0.03

const ES_LOG_INDEX_NAME = "ambar_log_record_data"
const ES_LOG_TYPE_NAME = "ambar_log_record"
const ES_FILE_INDEX_NAME = "ambar_file_data"
const ES_FILE_TYPE_NAME = "ambar_file"
const ES_FILE_TAG_TYPE_NAME = "ambar_file_tag"
const ES_FILE_HIDDEN_MARK_TYPE_NAME = "ambar_file_hidden_mark"

const getHiddenMarkId = (fileId) => CryptoService.getSha256(`hiddenmark_${fileId}`)

const normalizeHitsScore = (hits, maxScore) => hits.map(hit => ({
    ...hit,
    _score: hit._score / maxScore
}))

const transformTagsStat = (esResponse) => {
    const resp = []

    esResponse.aggregations.tags.buckets.forEach(tag => {
        tag.type.buckets.forEach(tagType => {
            resp.push({ name: tag.key, type: tagType.key, filesCount: tagType.doc_count })
        })
    })

    return resp
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

const getPathType = (fullPath) => /\/$/g.test(fullPath) ? 'folder' : 'file'
const getPathDepth = (fullPath) => getPathType(fullPath) === 'folder' ?
    fullPath.match(/\//g).length - 3 :
    fullPath.match(/\//g).length - 2
const getParentPath = (fullPath) => getPathType(fullPath) === 'file' ?
    fullPath.slice(0, fullPath.lastIndexOf('/') + 1) :
    fullPath.slice(0, fullPath.slice(0, -1).lastIndexOf('/') + 1)
const getPathName = (fullPath) => getPathType(fullPath) === 'file' ?
    fullPath.slice(fullPath.lastIndexOf('/') + 1) :
    fullPath.slice(fullPath.slice(0, fullPath.length - 1).lastIndexOf('/') + 1, -1)
const calculateTreeNodeChildrenCount = (treeNode) => treeNode.children.length > 0 ?
    treeNode.children.reduce((sum, node) => sum + node.hits_count, 0) :
    0

const normalizeTreeAggregationResult = (esResult) => {
    const result = {
        total: esResult.hits.total,
        tree: []
    }

    const plainTree = esResult.aggregations.full_name_parts.buckets
        //.filter(bucket => getPathType(bucket.key) != 'file')
        .map(bucket => ({
            path: bucket.key,
            name: getPathName(bucket.key),
            parent_path: getParentPath(bucket.key),
            depth: getPathDepth(bucket.key),
            type: getPathDepth(bucket.key) === 0 ? 'source' : getPathType(bucket.key),
            thumb_available: getPathType(bucket.key) === 'file' ?
                bucket.thumb_available.buckets[0].key === 1 ?
                    true :
                    false :
                null,
            file_id: getPathType(bucket.key) === 'file' ?
                bucket.file_id.buckets[0].key :
                null,
            content_type: getPathType(bucket.key) === 'file' ?
                bucket.content_type.buckets[0].key :
                null,
            sha256: getPathType(bucket.key) === 'file' ?
                bucket.sha256.buckets[0].key :
                null,
            hits_count: bucket.doc_count,
            children: []
        }))

    plainTree
        .filter(node => node.depth > 0)
        .forEach(node =>
            plainTree
                .filter(treeNode => treeNode.depth === node.depth - 1)
                .filter(treeNode => treeNode.path === node.parent_path)
                .forEach(treeNode => treeNode.children.push(node)))

    plainTree
        .filter(treeNode => treeNode.type != 'file')
        .filter(treeNode => treeNode.children.length > 0)
        .filter(treeNode => calculateTreeNodeChildrenCount(treeNode) != treeNode.hits_count)
        .forEach(treeNode => treeNode.children.push({
            path: `${treeNode.path}...`,
            name: '...',
            parent_path: treeNode.path,
            depth: treeNode.depth + 1,
            type: 'mixed',
            thumb_available: null,
            file_id: null,
            content_type: null,
            sha256: null,
            hits_count: treeNode.hits_count - calculateTreeNodeChildrenCount(treeNode),
            children: []
        }))

    return { ...result, tree: plainTree.filter(node => node.depth === 0) }
}

const normalizeStatsAggregationResult = (esResult) => {
    const result = {
        total: esResult.hits.total,
        summary: {},
        tags: {}
    }

    result.summary = {
        data: esResult.aggregations.summary
    }

    result.extensions = {
        total: esResult.hits.total,
        data: esResult.aggregations.extensions.buckets
            .filter(bucket => bucket.doc_count > MIN_THRESHOLD_EXTENSION * esResult.hits.total)
            .map(bucket => ({
                extension: bucket.key,
                hits_percent: bucket.doc_count / esResult.hits.total * 100,
                hits_count: bucket.doc_count,
                size: bucket.size.sum
            }))
    }
    const presentExtensionsHitsCount = result.extensions.data.reduce((sum, bucket) => sum + bucket.hits_count, 0)
    if (presentExtensionsHitsCount < esResult.hits.total) {
        result.extensions.data.push({
            extension: 'Others',
            hits_percent: (esResult.hits.total - presentExtensionsHitsCount) / esResult.hits.total * 100,
            hits_count: esResult.hits.total - presentExtensionsHitsCount,
            size: 0
        })
    }

    result.tags = {
        total: esResult.aggregations.tags.doc_count,
        data: esResult.aggregations.tags.names.buckets
            .map(bucket => ({
                name: bucket.key,
                type: bucket.types.buckets[0].key,
                hits_percent: bucket.doc_count / esResult.aggregations.tags.doc_count * 100,
                hits_count: bucket.doc_count
            }))
    }

    return result
}

export const getShortStats = (esClient) => new Promise((resolve, reject) =>
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        body: EsQueryBuilder.getShortStatsQuery()
    })
        .then(result => {
            resolve(result)
        })
        .catch(err => reject(err))
)

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

export const getFilesTreeByQuery = (esClient, request) => new Promise((resolve, reject) => {
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        body: EsQueryBuilder.getFilesTreeQuery(request)
    })
        .then(result => resolve(normalizeTreeAggregationResult(result)))
        .catch(err => reject(err))
})

export const getFilesStatsByQuery = (esClient, request, maxItemsToRetrieve) => new Promise((resolve, reject) => {
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        body: EsQueryBuilder.getFilesStatsQuery(request, maxItemsToRetrieve)
    })
        .then(result => resolve(normalizeStatsAggregationResult(result)))
        .catch(err => reject(err))
})

export const searchFiles = (esClient, request, from, size) => {
    const requests = [
        { index: ES_FILE_INDEX_NAME, type: ES_FILE_TYPE_NAME },
        EsQueryBuilder.getFilesWithHighlightsQuery(request, from * size, size),
        { index: ES_FILE_INDEX_NAME, type: ES_FILE_TYPE_NAME },
        EsQueryBuilder.getFilesWithoutHighlightsQuery(request, from * size, size)
    ]

    return new Promise((resolve, reject) =>
        esClient.msearch({
            body: requests
        })
            .then(results => {
                const result = results.responses
                const maxScore = Math.max(result[0].hits.max_score, result[1].hits.max_score)

                const resultHits = normalizeHitsScore(result[0].hits.hits, maxScore)
                    .concat(normalizeHitsScore(result[1].hits.hits, maxScore))
                    .sort((a, b) => b._score - a._score)
                    .map((hit) => normalizeHitContentHighlights(transformHit(hit)))
                    .filter((hit) => (hit.content.highlight &&
                        hit.content.highlight.text &&
                        hit.content.highlight.text.length > 0 &&
                        !hit.content.highlight.text.some(text => /<em>/.test(text)) &&
                        !hit.meta.highlight &&
                        !hit.content.highlight.author &&
                        request.content != '*' &&
                        request.content != '')
                        ? false
                        : true)

                resolve({
                    total: result[0].hits.total + result[1].hits.total,
                    hits: resultHits
                })
            })
            .catch(err => reject(err))
    )
}

export const getFileHighlightByFileId = (esClient, request, fileId) => new Promise((resolve, reject) => {
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        body: EsQueryBuilder.getFileHighlightQuery(request, fileId)
    })
        .then(result => {
            if (result.hits.hits && result.hits.hits.length === 1) {
                resolve(
                    normalizeHitContentHighlights(
                        transformHit(result.hits.hits[0])
                    )
                )
            }
            else {
                resolve({})
            }
        })
        .catch(err => reject(err))
})

export const getFullFileHighlightByFileId = (esClient, request, fileId) => new Promise((resolve, reject) => {
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        body: EsQueryBuilder.getFullFileHighlightQuery(request, fileId)
    })
        .then(result => {
            if (result.hits.hits && result.hits.hits.length === 1) {
                resolve(
                    normalizeHitContentHighlights(transformHit(result.hits.hits[0]))
                )
            }
            else {
                resolve({})
            }
        })
        .catch(err => reject(err))
})

export const checkIfFileExists = (esClient, fileId) => new Promise((resolve, reject) => {
    esClient.get({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        _source: false,
        id: fileId
    })
        .then(result => {
            resolve(result.found)
        })
        .catch(err => {
            if (err.statusCode == 404) {
                resolve(false)
                return
            }
            reject(err)
        })
})

export const getFileByFileId = (esClient, fileId, includeChildren = false) => new Promise((resolve, reject) => {
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        body: {
            query: {
                bool: {
                    must: [
                        { term: { 'file_id': fileId } }
                    ],
                    should: includeChildren ? [
                        {
                            has_child: {
                                type: 'ambar_file_tag',
                                query: {
                                    match_all: {}
                                },
                                inner_hits: {}
                            }
                        },
                        {
                            has_child: {
                                type: 'ambar_file_hidden_mark',
                                query: {
                                    match_all: {}
                                },
                                inner_hits: {}
                            }
                        }
                    ] : [],
                    minimum_should_match: 0
                }
            }
        }
    })
        .then(result => resolve(result.hits.total > 0 ? normalizeHitContentHighlights(transformHit(result.hits.hits[0])) : null))
        .catch(err => reject(err))
})

export const hideFile = (esClient, fileId) => new Promise((resolve, reject) => {
    const hiddenMark = {
        id: getHiddenMarkId(fileId),
        indexed_datetime: DateTimeService.getCurrentDateTime()
    }

    esClient.index({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_HIDDEN_MARK_TYPE_NAME,
        parent: fileId,
        refresh: true,
        id: hiddenMark.id,
        body: hiddenMark
    })
        .then(res => resolve(res))
        .catch(err => reject(err))
})

export const unHideFile = (esClient, fileId) => new Promise((resolve, reject) => {
    const hiddenMarkId = getHiddenMarkId(fileId)

    esClient.delete({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_HIDDEN_MARK_TYPE_NAME,
        routing: fileId,
        refresh: true,
        id: hiddenMarkId
    })
        .then(res => resolve(res))
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

export const deleteTag = (esClient, fileId, tagId) => new Promise((resolve, reject) => {
    esClient.delete({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TAG_TYPE_NAME,
        routing: fileId,
        refresh: true,
        id: tagId
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

export const getLastLogRecords = (esClient, numberOfRecords) => new Promise((resolve, reject) => {
    let query = {
        from: 0,
        size: numberOfRecords,
        query: { match_all: {} },
        sort: { created_datetime: { order: 'desc' } }
    }

    return esClient.search({
        index: ES_LOG_INDEX_NAME,
        type: ES_LOG_TYPE_NAME,
        body: query
    })
        .then(result => resolve(result.hits.hits.map(hit => hit._source).reverse()))
        .catch(err => reject(err))
})

export const getStats = (esClient) => new Promise((resolve, reject) =>
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        body: EsQueryBuilder.getStatsQuery()
    })
        .then(result => {
            resolve(result)
        })
        .catch(err => reject(err))
)

const normalizeProcessingStats = (esResponse) => {
    const ITEMS_COUNT = 10

    const procRate = {
        hours: [],
        days: [],
        months: []
    }

    const dates = []
    let dateSpan = ITEMS_COUNT - 1
    while (dateSpan >= 0) {
        dates.push(moment().startOf('day').add(-dateSpan, 'days'))
        dateSpan--
    }
    dates.forEach((date) => {
        const dateItem = {
            date: date.format('DD.MM.YYYY'),
            count: 0,
            size: 0
        }

        const esDateBucket = esResponse.aggregations.days.buckets.find((bucket) => (moment(bucket.key).startOf('day').isSame(date)))
        if (esDateBucket) {
            dateItem.count = esDateBucket.doc_count
            dateItem.size = esDateBucket.size.value
        }

        procRate.days.push(dateItem)
    })

    const months = []
    let monthsSpan = ITEMS_COUNT - 1
    while (monthsSpan >= 0) {
        months.push(moment().startOf('month').add(-monthsSpan, 'months'))
        monthsSpan--
    }
    months.forEach((month) => {
        const monthItem = {
            date: month.format('MM.YYYY'),
            count: 0,
            size: 0
        }

        const esDateBucket = esResponse.aggregations.months.buckets.find((bucket) => (moment(bucket.key).startOf('day').isSame(month)))
        if (esDateBucket) {
            monthItem.count = esDateBucket.doc_count
            monthItem.size = esDateBucket.size.value
        }

        procRate.months.push(monthItem)
    })

    return procRate
}

export const getProcessingStats = (esClient) => new Promise((resolve, reject) =>
    esClient.search({
        index: ES_FILE_INDEX_NAME,
        type: ES_FILE_TYPE_NAME,
        body: EsQueryBuilder.getProcessingStatsQuery()
    })
        .then(result => {
            resolve(normalizeProcessingStats(result))
        })
        .catch(err => reject(err))
)