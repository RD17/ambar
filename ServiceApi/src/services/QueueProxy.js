import amqp from 'amqplib'
import config from '../config'

export const AMBAR_PIPELINE_QUEUE = "AMBAR_PIPELINE_QUEUE"
export const AMBAR_PIPELINE_QUEUE_MAX_PRIORITY = 2
export const AMBAR_PIPELINE_EXCHANGE = "AMBAR_PIPELINE_EXCHANGE"
export const AMBAR_PIPELINE_WAITING_QUEUE = "AMBAR_PIPELINE_WAITING_QUEUE"
export const AMBAR_PIPELINE_WAITING_EXCHANGE = "AMBAR_PIPELINE_WAITING_EXCHANGE"

export const AMBAR_PIPELINE_WAITING_QUEUE_TTL = 60 * 60 * 1000

const getPipelineMessagePriority = (storage, fileName) => new Promise((resolve) => {
	const regex = /(\.jp[e]*g$)|(\.png$)|(\.bmp$)|(\.tif[f]*$)|(\.pdf$)/i
	const priority = regex.test(fileName) ? 1 : 2
	resolve(priority)
})

export const enqueuePipelineMessage = (storage, message) => new Promise((resolve, reject) => {
	const fileName = message.meta.short_name

	storage.rabbit.createConfirmChannel()
		.then(channel => {
			return getPipelineMessagePriority(storage, fileName)
				.then(priority => {
					channel.publish(AMBAR_PIPELINE_EXCHANGE, '', Buffer.from(JSON.stringify(message)), { priority: priority })
					return channel.waitForConfirms()
						.then(() => channel.close())
				})
		})
		.then(() => resolve())
		.catch(err => reject(err))
})

export const initRabbit = new Promise((resolve, reject) => {
	amqp.connect(`${config.rabbitHost}?heartbeat=0`)
		.then((conn) => {
			conn.on('error', (err) => {
				//eslint-disable-next-line no-console
				console.error('Rabbit error!')
				throw err
			})

			return conn.createChannel()
				.then((channel) => channel.assertExchange(AMBAR_PIPELINE_EXCHANGE, 'fanout', { durable: false })
					.then(() => channel.assertExchange(AMBAR_PIPELINE_WAITING_EXCHANGE,
						'fanout', { durable: false }))
					.then(() => channel.assertQueue(AMBAR_PIPELINE_QUEUE,
						{ durable: false, arguments: { 'x-queue-mode': 'lazy', 'x-dead-letter-exchange': AMBAR_PIPELINE_WAITING_EXCHANGE, 'x-max-priority': AMBAR_PIPELINE_QUEUE_MAX_PRIORITY } }))
					.then(() => channel.assertQueue(AMBAR_PIPELINE_WAITING_QUEUE,
						{ durable: false, arguments: { 'x-queue-mode': 'lazy', 'x-dead-letter-exchange': AMBAR_PIPELINE_EXCHANGE, 'x-message-ttl': AMBAR_PIPELINE_WAITING_QUEUE_TTL } }))
					.then(() => channel.bindQueue(AMBAR_PIPELINE_QUEUE,
						AMBAR_PIPELINE_EXCHANGE))
					.then(() => channel.bindQueue(AMBAR_PIPELINE_WAITING_QUEUE,
						AMBAR_PIPELINE_WAITING_EXCHANGE))					
					.then(() => channel.close())
				)
				.then(() => resolve(conn))
		})
		.catch(err => reject(err))
})
