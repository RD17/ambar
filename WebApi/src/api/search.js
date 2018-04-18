import { Router } from 'express'
import ErrorResponse from '../utils/ErrorResponse'
import * as QueryParser from '../utils/QueryParser'
import { EsProxy, CryptoService } from '../services'

const DEFAULT_PAGE = 0
const DEFAULT_SIZE = 10
const MAX_SIZE = 200

const hrTimeToMilliSeconds = (hrTime) => (hrTime[0] * 1e9 + hrTime[1]) / 1e6

export default ({ storage }) => {
    let api = Router()

    /**
     * @api {get} api/search Search For Documents By Query     
     * @apiGroup Search
     *      
     * @apiParam {String} query URI_ENCODED query string. Check details of query syntax [here](https://blog.ambar.cloud/mastering-ambar-search-queries/).
     * @apiParam {Number} [page=0] page to return 
     * @apiParam {Number} [size=10] number of results to return per page. Maximum is 100.
     *
     * @apiHeader {String} ambar-email User email.
     * @apiHeader {String} ambar-email-token User token.
     * 
     * @apiExample {curl} Search For `John`
     *     curl -i http://ambar_api_address/api/search?query=John
     * 
     * @apiSuccessExample {json} HTTP/1.1 200 OK
     *
     * @apiErrorExample {json} HTTP/1.1 400 BadRequest
     * HTTP/1.1 400 BadRequest
     */
    api.get('/', (req, res, next) => {
        const { query: { query: queryStr, page: pageStr = DEFAULT_PAGE, size: sizeStr = DEFAULT_SIZE } } = req
        const page = parseInt(pageStr)
        const size = parseInt(sizeStr)
        const query = decodeURI(queryStr)

        if (!Number.isInteger(page) || page < 0) {
            res.status(400).json(new ErrorResponse('Page is invalid'))
            return
        }

        if (!Number.isInteger(size) || size < 1 || size > MAX_SIZE) {
            res.status(400).json(new ErrorResponse('Size is invalid'))
            return
        }

        let parsedQuery = QueryParser.parseEsStringQuery(query)

        const startTime = process.hrtime()

        EsProxy.searchFiles(storage.elasticSearch, parsedQuery, page, size)
            .then((results) => res.status(200).json({
                ...results,
                hits: results.hits
                    .map((hit) => {
                        hit.meta['download_uri'] = CryptoService.encryptDownloadUri(hit.file_id)
                        return hit
                    }),
                took: hrTimeToMilliSeconds(process.hrtime(startTime))
            }))
            .catch(next)
    })

    /**
     * @api {get} api/search/tree Get documents tree by query  
     * @apiGroup Search
     *      
     * @apiParam {String} query URI_ENCODED query string. Check details of query syntax [here](https://blog.ambar.cloud/mastering-ambar-search-queries/).
     *
     * @apiHeader {String} ambar-email User email.
     * @apiHeader {String} ambar-email-token User token.
     * 
     *     curl -i http://ambar_api_address/api/search/tree?query=John
     * 
     * @apiSuccessExample {json} HTTP/1.1 200 OK
     *
     * @apiErrorExample {json} HTTP/1.1 400 BadRequest
     * HTTP/1.1 400 BadRequest
     */
    api.get('/tree', (req, res, next) => {
        const { query: { query: queryStr } } = req
        const query = decodeURI(queryStr)

        let parsedQuery = QueryParser.parseEsStringQuery(query)

        const startTime = process.hrtime()

        EsProxy.getFilesTreeByQuery(storage.elasticSearch, parsedQuery)
            .then((results) => res.status(200).json({
                ...results,
                took: hrTimeToMilliSeconds(process.hrtime(startTime))
            }))
            .catch(next)
    })

    /**
     * @api {get} api/search/stats Get documents stats by query  
     * @apiGroup Search
     *      
     * @apiParam {String} query URI_ENCODED query string. Check details of query syntax [here](https://blog.ambar.cloud/mastering-ambar-search-queries/).
     *
     * @apiHeader {String} ambar-email User email.
     * @apiHeader {String} ambar-email-token User token.
     * 
     *     curl -i http://ambar_api_address/api/search/stats?query=John
     * 
     * @apiSuccessExample {json} HTTP/1.1 200 OK
     *
     * @apiErrorExample {json} HTTP/1.1 400 BadRequest
     * HTTP/1.1 400 BadRequest
     */
    api.get('/stats', (req, res, next) => {
        const { query: { query: queryStr } } = req
        const query = decodeURI(queryStr)

        let parsedQuery = QueryParser.parseEsStringQuery(query)

        const startTime = process.hrtime()

        EsProxy.getFilesStatsByQuery(storage.elasticSearch, parsedQuery)
            .then((results) => res.status(200).json({
                ...results,
                took: hrTimeToMilliSeconds(process.hrtime(startTime))
            }))
            .catch(next)
    })

    /**     
     * @api {get} api/search/:fileId Retrieve File Highlight by Query and fileId     
     * @apiGroup Search
     * 
     * @apiDescription This method is useful for getting higlights of large files > 30 MB
     * 
     * @apiParam {String} fileId file fileId
     * @apiParam {String} query query string
     * 
     * @apiHeader {String} ambar-email User email.
     * @apiHeader {String} ambar-email-token User token.
     * 
     * @apiExample {curl} Retrieve Higlights for File with fileId `318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3`
     *     curl -i http://ambar:8004/api/search/318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3?query=John
     *  
     * @apiSuccessExample {json} HTTP/1.1 200 OK
     *
     * @apiErrorExample {json} HTTP/1.1 400 BadRequest
     * HTTP/1.1 400 BadRequest
     */
    api.get('/:fileId', (req, res, next) => {
        const { params: { fileId: fileId }, query: { query: query } } = req

        if (!query || query === '') {
            res.status(400).json(new ErrorResponse('Query is empty'))
            return
        }

        let parsedQuery = QueryParser.parseEsStringQuery(query)

        EsProxy.getFileHighlightByFileId(storage.elasticSearch, parsedQuery, fileId)
            .then((hit) => {
                let highlight = hit.content && hit.content.highlight ? hit.content.highlight : null
                if (!highlight) {
                    highlight = { 'text': [''] }
                }

                res.status(200).json({ highlight: highlight })

                return
            })
            .catch(next)
    })

    /**     
     * @api {get} api/search/:fileId/full Retrieve Full File Highlight by Query and fileId     
     * @apiGroup Search
     * 
     * @apiDescription This method is useful for getting higlights of large files > 30 MB
     * 
     * @apiParam {String} fileId file fileId
     * @apiParam {String} query query string
     * 
     * @apiHeader {String} ambar-email User email.
     * @apiHeader {String} ambar-email-token User token.
     * 
     * @apiExample {curl} Retrieve Full Higlight for File with fileId `318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3`
     *     curl -i http://ambar:8004/api/search/318be2290125e0a6cfb7229133ba3c4632068ae04942ed5c7c660718d9d41eb3/full?query=John
     *  
     * @apiSuccessExample {json} HTTP/1.1 200 OK
     *       Aesop, by some strange accident it seems to have entirely<br/>disappeared, and to have been lost sight of. His name is<br/>mentioned by Avienus; by Suidas, a celebrated critic, at the<br/>close of the eleventh century, who gives in his lexicon several<br/>isolated verses of his version of the fables; and by <em>John</em><br/>Tzetzes, a grammarian and poet of Constantinople, who lived<br/>during the latter half of the twelfth century. Nevelet, in the<br/>preface to the volume which we have described, points out that<br/>the Fables of Planudes could not be the work of Aesop, as they<br/>contain a reference in two places to Holy
     * 
     * @apiErrorExample {json} HTTP/1.1 400 BadRequest
     * HTTP/1.1 400 BadRequest
     */
    api.get('/:fileId/full', (req, res, next) => {
        const { params: { fileId: fileId }, query: { query: query } } = req

        if (!query || query === '') {
            res.status(400).json(new ErrorResponse('Query is empty'))
            return
        }

        let parsedQuery = QueryParser.parseEsStringQuery(query)

        EsProxy.getFullFileHighlightByFileId(storage.elasticSearch, parsedQuery, fileId)
            .then((hit) => {
                res.status(200).json(hit)

                return
            })
            .catch(next)
    })

    return api
}
