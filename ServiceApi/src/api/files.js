import { Router } from 'express'
import ErrorResponse from '../utils/ErrorResponse'
import {
    CryptoService,
    EsLowLevelProxy,
    EsProxy,
    CacheProxy,
    GridFsProxy,
    FileUploader,
    QueueProxy
} from '../services'
import * as MetaBuilder from '../utils/MetaBuilder'

const generateMetaId = (source_id, full_name, created_datetime, updated_datetime) => {
    return CryptoService.getSha256(`${source_id}${full_name}${created_datetime}${updated_datetime}`)
}

const generateFileId = (source_id, full_name) => {
    return CryptoService.getSha256(`${source_id}${full_name}`)
}

const generateExtractedTextFileName = (sha) => `text_${sha}`

export default ({ storage }) => {
    let api = Router()

    //////////////// CALLED FROM CRAWLERS ////////////////////////////////////
    /**
    * Check if partial meta exists in ES (TURBO)  
    */
    api.post('/meta/exists', (req, res, next) => {
        const { body: { full_name, updated_datetime, created_datetime, source_id } } = req

        if (!full_name || !updated_datetime || !created_datetime || !source_id) {
            res.status(400).json(new ErrorResponse('Required field is missing'))
            return
        }

        const metaId = generateMetaId(source_id, full_name, created_datetime, updated_datetime)

        CacheProxy.checkIfMetaIdExists(storage.redis, metaId)
            .then((redisResult) => {
                if (redisResult) {
                    return 200
                }

                return EsProxy.checkIfMetaIdExists(storage.elasticSearch, metaId)
                    .then(exists => {
                        if (exists) {
                            CacheProxy.addMetaId(storage.redis, metaId)
                            return 200
                        }
                        return 404
                    })
            })
            .then((statusToSend) => {
                res.sendStatus(statusToSend)
            })
            .catch(next)
    })

    /**
     * Cache processed meta id
    */
    api.post('/meta/:metaId/processed', (req, res) => {
        const { params: { metaId } } = req

        CacheProxy.addMetaId(storage.redis, metaId)

        res.sendStatus(200)
    })

    /**
     * Enqueue meta for specified sha (enqueuing message to pipeline)
     */
    api.post('/meta/:sha/:sourceId', (req, res, next) => {
        const { body: requestBody, params: { sha, sourceId: sourceId } } = req

        if (!requestBody) {
            res.status(400).json(new ErrorResponse('Empty request'))
            return
        }

        const meta = MetaBuilder.buildMeta(requestBody)

        if (!meta || !sha) {
            res.status(400).json(new ErrorResponse('Invalid request'))
            return
        }

        QueueProxy.enqueuePipelineMessage(storage, { event: 'add', sha: sha, fileId: generateFileId(meta.source_id, meta.full_name), sourceId: sourceId, meta: meta })
            .then(() => {
                //CacheProxy.addMetaId(storage.redis, meta.id)
                res.sendStatus(200)
            })
            .catch(next)
    })

    /*
    * Check if parsed content exists
    */
    api.head('/content/:sha/parsed', (req, res, next) => {
        const sha = req.params.sha

        const fileName = generateExtractedTextFileName(sha)

        GridFsProxy.checkIfFileExist(storage.mongoDb, fileName)
            .then(found => found ? sha : null)
            .then(sha => {
                if (!sha) {
                    res.sendStatus(404)
                    return
                }

                res.sendStatus(302)
            })
            .catch(next)
    })

    /**
     * Create content
     */
    api.post('/content/:sha', FileUploader, (req, res, next) => {
        let { params: { sha: clientHash }, files } = req
        const fileContent = (Buffer.isBuffer(files[0].buffer) && Buffer.byteLength(files[0].buffer) > 0) ? files[0].buffer : new Buffer(0)
        const serverHash = CryptoService.getSha256(fileContent)

        if (serverHash.toLowerCase() !== clientHash.toLowerCase()) {
            res.status(400).json(new ErrorResponse(`Server hash isn't equal client hash. Server hash: '${serverHash}'`))
            return
        }

        GridFsProxy.checkIfFileExist(storage.mongoDb, serverHash)
            .then(found => {
                if (found) {
                    res.sendStatus(302)
                    return
                }

                return GridFsProxy.uploadFile(storage.mongoDb, serverHash, fileContent)
                    .then(() => res.sendStatus(201))
            })
            .catch(next)
    })

    //////////////// CALLED FROM PIPELINE ////////////////////////////////////
    /**
     * Get file content by sha
     */
    api.get('/content/:sha', (req, res, next) => {
        const sha = req.params.sha

        GridFsProxy.checkIfFileExist(storage.mongoDb, sha)
            .then(found => found ? sha : null)
            .then(sha => {
                if (!sha) {
                    res.sendStatus(404)
                    return
                }

                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(sha)}`
                })

                GridFsProxy.downloadFile(storage.mongoDb, sha).pipe(res)

                return
            })
            .catch(next)
    })

    /**
     * Delete file content by sha
     */
    api.delete('/content/:sha', (req, res, next) => {
        const sha = req.params.sha

        GridFsProxy.checkIfFileExist(storage.mongoDb, sha)
            .then(found => found ? sha : null)
            .then(sha => {
                if (!sha) {
                    res.sendStatus(404)
                    return
                }

                return GridFsProxy.removeFile(storage.mongoDb, sha)
                    .then(() => res.sendStatus(200))
            })
            .catch(next)
    })

    /**
     * Get parsed file content by sha
     */
    api.get('/content/:sha/parsed', (req, res, next) => {
        const sha = req.params.sha

        const fileName = generateExtractedTextFileName(sha)

        GridFsProxy.checkIfFileExist(storage.mongoDb, fileName)
            .then(found => found ? fileName : null)
            .then(fileName => {
                if (!fileName) {
                    res.sendStatus(404)
                    return
                }

                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`
                })

                GridFsProxy.downloadFile(storage.mongoDb, fileName).pipe(res)

                return
            })
            .catch(next)
    })

    /**
     * Get file content fields from ES
     */
    api.get('/content/:sha/fields', (req, res, next) => {
        const { params: { sha } } = req

        EsProxy.getFileBySha(storage.elasticSearch, sha)
            .then(ambarFile => {
                if (!ambarFile) {
                    res.sendStatus(404)
                    return
                }

                res.status(200).json(ambarFile.content)
            })
            .catch(next)
    })

    /**
     * Update or create ambar file
    */
    api.post('/file/:fileId/processed', FileUploader, (req, res, next) => {
        const { params: { fileId }, files } = req

        const file = (Buffer.isBuffer(files[0].buffer) && Buffer.byteLength(files[0].buffer) > 0) ? files[0].buffer : new Buffer(0)

        EsLowLevelProxy.updateFile(fileId, file)
            .then((result) => {
                if (result === 'created') {
                    res.sendStatus(201)
                    return
                }

                if (result === 'updated') {
                    res.sendStatus(200)
                    return
                }

                throw new Error(result)
            })
            .catch(next)
    })

    /**
     * Upload parsed text to GridFS
    */
    api.post('/content/:sha/extracted', FileUploader, (req, res, next) => {
        const { params: { sha }, files } = req

        const extractedTextFileName = generateExtractedTextFileName(sha)

        const file = (Buffer.isBuffer(files[0].buffer) && Buffer.byteLength(files[0].buffer) > 0) ? files[0].buffer : new Buffer(0)

        GridFsProxy.uploadPlainTextFile(storage.mongoDb, extractedTextFileName, file)
            .then(() => {
                res.sendStatus(200)
            })
            .catch(next)
    })

    /**
     * Delete aututags and NEs
    */
    api.delete('/autotags/:fileId', (req, res, next) => {
        const { params: { fileId } } = req

        EsProxy.deleteAutoTags(storage.elasticSearch, fileId)
            .then(() => {
                res.sendStatus(200)
            })
            .catch(next)
    })

    return api
}