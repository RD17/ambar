import amqp from 'amqplib'
import config from '../config'

export const AMBAR_PIPELINE_EXCHANGE = "AMBAR_PIPELINE_EXCHANGE"

const getPipelineMessagePriority = (storage, fileName) => new Promise((resolve) => {
	const regex = /(\.jp[e]*g$)|(\.png$)|(\.bmp$)|(\.tif[f]*$)|(\.pdf$)/i
	const priority = regex.test(fileName) ? 1 : 2
	resolve(priority)
})

export const enqueuePipelineMessage = (storage, message) => new Promise((resolve, reject) => {
	const fileName = message.fileName || message.meta.short_name

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

			resolve(conn)
		})
		.catch(err => reject(err))
})
