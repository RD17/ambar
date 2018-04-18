import { Router } from 'express'
import ErrorResponse from '../utils/ErrorResponse'
import { EsProxy } from '../services'

const DEFAULT_RECORDS_COUNT = 10
const MAX_RECORDS_COUNT = 100


export default ({ storage }) => {
    let api = Router()

    /**
     * Submit log record
     */
    api.post('/', (req, res) => {
        const { body: logItem } = req

        if (!logItem) {
            res.status(400).json(new ErrorResponse('Bad request'))
            return
        }

        res.sendStatus(200) //Immediately send response
        EsProxy.indexLogItem(storage.elasticSearch, logItem)
    })

    /**
     * Get log records
     */
    api.get('/', (req, res, next) => {
        const { query: { recordsCount = DEFAULT_RECORDS_COUNT } } = req

        if (recordsCount > MAX_RECORDS_COUNT && recordsCount <= 0) {
            res.status(400).json(new ErrorResponse(`RecordsCount should be greater than 0 and lower than ${MAX_RECORDS_COUNT}`))
            return
        }

        EsProxy.getLastLogRecords(storage.elasticSearch, recordsCount)
            .then(response => res.status(200).json(response))
            .catch(next)
    })

    return api
}
