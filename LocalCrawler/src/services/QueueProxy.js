import amqp from 'amqplib'
import config from '../config'

const AMBAR_PIPELINE_EXCHANGE = "AMBAR_PIPELINE_EXCHANGE"

let channel = null

const getPipelineMessagePriority = (fileName) => {
    const regex = /(\.jp[e]*g$)|(\.png$)|(\.bmp$)|(\.tif[f]*$)|(\.pdf$)/i
    const priority = regex.test(fileName) ? 1 : 2

    return priority
}

export const enqueueMessage = (message) => {
    const fileName = message.fileName || message.meta.short_name
    const priority = getPipelineMessagePriority(fileName)
    channel.publish(AMBAR_PIPELINE_EXCHANGE, '', Buffer.from(JSON.stringify(message)), { priority: priority })
}

export const initRabbit = (onError) => new Promise((resolve, reject) => {
    amqp.connect(`${config.rabbitHost}?heartbeat=0`)
        .then((conn) => {
            conn.on('error', onError)

            return conn.createChannel()
                .then(ch => {
                    channel = ch
                    resolve()
                })
        })
        .catch(err => reject(err))
})

