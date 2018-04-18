import { MongoClient } from 'mongodb'
import elasticsearch from 'elasticsearch'
import redis from 'redis'
import bluebird from 'bluebird'
import { MongoProxy, EsProxy, QueueProxy, DateTimeService } from './index'
import config from '../config'

const generateDefaultUser = () => new Promise((resolve) => {
	resolve({
		name: config.defaultAccountName,
		email: config.defaultAccountEmail,
		lang_analyzer: config.langAnalyzer,
		role: config.defaultAccountRole,
		password_hash: null,
		password_salt: null,
		state: 'active',
		set_password_key: null,
		set_password_key_expiration: null,
		created: DateTimeService.getCurrentDateTime()
	})
})

const generateDefaultUserRole = () => ({
	name: 'admin',
	acc_type: 'allow_all',
	acc_rules: []
})

const initDefaultUserAndRole = (storage) => new Promise((resolve, reject) => {
	MongoProxy.getUserByEmail(storage.mongoDb, config.defaultAccountEmail)
		.then((user) => {
			if (user) {
				resolve()
				return
			}

			return generateDefaultUser()
				.then((generatedUser) => MongoProxy.createUpdateUser(storage.mongoDb, generatedUser))
				.then(() => MongoProxy.createUpdateUserRole(storage.mongoDb, generateDefaultUserRole()))
				.then(() => EsProxy.createFilesIndex(storage.elasticSearch))
				.then(() => resolve())
		})
		.catch((err) => { reject(err) })
})

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
				//eslint-disable-next-line no-console
				console.error(err)
				reject(err)
			}
			resolve(db)
		})
	})

	Promise.all([mongoPromise, QueueProxy.initRabbit, EsProxy.createLogIndexIfNotExists(esClient)])
		.then(([mongoConnection, rabbitConnection]) => ({
			elasticSearch: esClient,
			mongoDb: mongoConnection,
			redis: redisClient,
			rabbit: rabbitConnection
		}))
		.then(storage => initDefaultUserAndRole(storage)
			.then(() => resolve(storage))
		)
		.catch(err => reject(err))
})
