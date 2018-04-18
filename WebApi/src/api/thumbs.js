import { Router } from 'express'
import { MongoProxy } from '../services'

export default ({ storage}) => {
    let api = Router()
   
    /**     
     * @api {get} api/thumbs/:id Get Thumbnail by Id   
     * @apiGroup Thumbnails                
     *  
     * @apiSuccessExample HTTP/1.1 200 OK     
     * Octet-Stream
     * 
     * @apiErrorExample {json} HTTP/1.1 404 NotFound
     * HTTP/1.1 404 NotFound
     */
    
    api.get('/:id', (req, res, next) => {
        const {params: {id: thumbId}} = req

        MongoProxy.getThumbnailById(storage.mongoDb, thumbId)
            .then((thumb) => {
                if (!thumb) {
                    res.sendStatus(404)
                    return
                }

                res.status(200)
                    .header({
                        'Content-Type': 'image/jpeg',
                        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(thumbId)}.jpeg`
                    })
                    .send(thumb.data.buffer)
            })
            .catch(next)
    })

    return api
}