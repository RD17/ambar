import { EsProxy, DateTimeService } from './index'
import ErrorResponse from '../utils/ErrorResponse'

export default (esClient) => (err, req, res, next) => {

    //eslint-disable-next-line no-console
    console.error(err)

    const message = (err instanceof Error) 
        ? `${err.message}\n ${err.stack}`
        : (typeof err === 'string' || err instanceof String) ? err : JSON.stringify(err)    

    EsProxy.indexLogItem(esClient, {
        created_datetime: DateTimeService.getCurrentDateTime(),
        source_id: 'serviceapi',
        type: 'error',
        message: message
    })
    
    if (res.headersSent) {
        return next(err)
    }

    res.status(500).json(new ErrorResponse(message))
} 