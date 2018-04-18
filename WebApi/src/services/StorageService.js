import { MongoClient } from 'mongodb'
import elasticsearch from 'elasticsearch'
import redis from 'redis'
import bluebird from 'bluebird'
import { QueueProxy } from './index.js'
import config from '../config'

export const initializeStorage = () => new Promise((resolve, reject) => {
	const esClient = new elasticsearch.Client({
		host: config.elasticSearchUrl
	})

	bluebird.promisifyAll(redis.RedisClient.prototype)
	bluebird.promisifyAll(redis.Multi.prototype)

	const redisClient = redis.createClient({ host: config.redisHost, port: config.redisPort })

	const mongoPromise = new Promise((resolve, reject) => {
		MongoClient.connect(config.mongoDbUrl, (err, db) => {
			if (err) {				
				reject(err)
			}
			resolve(db)
		})
	})

	Promise.all([mongoPromise, QueueProxy.initRabbit])
		.then(([mongoConnection, rabbitConnection]) => {
			const result = {
				elasticSearch: esClient,
				mongoDb: mongoConnection,
				redis: redisClient,
				rabbit: rabbitConnection
			}
			resolve(result)
		})
		.catch(err => reject(err))
})
