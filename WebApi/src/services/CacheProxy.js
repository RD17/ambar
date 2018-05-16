import { EsProxy, DateTimeService } from './index'

const TAGS_HASH_NAME = 'tags'

export const addMetaId = (redis, metaId) => { redis.set(`meta:${metaId}`, DateTimeService.getCurrentDateTime()) }
export const removeMetaId = (redis, metaId) => { redis.del(`meta:${metaId}`) }

export const checkIfTokenExists = (redis, token) => redis.getAsync(token)
export const addToken = (redis, token, ttlSeconds) => {
    redis.set(token, DateTimeService.getCurrentDateTime())
    redis.expire(token, ttlSeconds)
}
export const removeToken = (redis, token) => {
    redis.del(token)
}

export const addTag = (redis, elasticSearch, fileId, tag) => new Promise((resolve, reject) => {
    EsProxy.indexTag(elasticSearch, fileId, tag)
        .then((esResult) =>
            hasTagsInRedis(redis)
                .then(hasTags => {
                    if (hasTags && esResult.result == 'created') {
                        return getTagFilesCount(redis, tag.name, tag.type)
                            .then(filesCount => {
                                setTagFilesCount(redis, tag.name, tag.type, filesCount + 1)
                            })
                    }
                    return Promise.resolve()
                }))
        .then(() => getTags(redis, elasticSearch))
        .then(tags => resolve(tags))
        .catch(err => reject(err))
})

export const removeTag = (redis, elasticSearch, fileId, tag) => new Promise((resolve, reject) => {
    EsProxy.deleteTag(elasticSearch, fileId, tag.id)
        .then(() => hasTagsInRedis(redis))
        .then(hasTags => {
            if (hasTags) {
                return getTagFilesCount(redis, tag.name, tag.type)
                    .then(filesCount => {
                        setTagFilesCount(redis, tag.name, tag.type, filesCount - 1)
                    })
            }
            return Promise.resolve()
        })
        .then(() => getTags(redis, elasticSearch))
        .then(tags => resolve(tags))
        .catch(err => reject(err))
})

const transformTagsStat = (redisResp) => !redisResp ? [] : Object.keys(redisResp).map(tagName => ({
    name: tagName.split(' ')[1],
    type: tagName.split(' ')[0],
    filesCount: parseInt(redisResp[tagName])
})).sort((tagA, tagB) => tagB.filesCount - tagA.filesCount)

const hasTagsInRedis = (redis) => new Promise((resolve, reject) => {
    redis.existsAsync(TAGS_HASH_NAME)
        .then(res => resolve(res == 1 ? true : false))
        .catch(err => reject(err))
})

const getTagFilesCount = (redis, tagName, tagType) => redis.hgetAsync(TAGS_HASH_NAME, `${tagType} ${tagName}`).then(filesCount => {
    return !filesCount ? 0 : parseInt(filesCount)
})

const setTagFilesCount = (redis, tagName, tagType, filesCount) => {
    if (filesCount == 0) {
        redis.hdel(TAGS_HASH_NAME, `${tagType} ${tagName}`)
        return
    }

    redis.hset(TAGS_HASH_NAME, `${tagType} ${tagName}`, filesCount)
}

export const getTags = (redis, elasticSearch) => new Promise((resolve, reject) => {
    hasTagsInRedis(redis)
        .then(hasTags => {
            if (!hasTags) {
                return setTagsFromEs(redis, elasticSearch)
            }
            return Promise.resolve()
        })
        .then(() => redis.hgetallAsync(TAGS_HASH_NAME))
        .then((redisResult) => {
            resolve(transformTagsStat(redisResult))
        })
        .catch(err => reject(err))
})

const setTagsFromEs = (redis, elasticSearch) => new Promise((resolve, reject) => {
    EsProxy.getTagsStat(elasticSearch)
        .then(tags => {
            if (tags.length == 0) {
                resolve()
                return
            }

            const tagsArray = []
            let idx = 0

            tags.forEach(tag => {
                tagsArray[idx] = `${tag.type} ${tag.name}`
                idx++
                tagsArray[idx] = tag.filesCount
                idx++
            });

            redis.hmset(TAGS_HASH_NAME, tagsArray, (err, res) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(res)
            })
        })
        .catch(err => reject(err))
})