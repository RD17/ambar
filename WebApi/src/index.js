import 'idempotent-babel-polyfill'
import http from 'http'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import api from './api'
import config from './config'
import { ErrorHandlerService, EsProxy, StorageService } from './services'

const createLogRecord = (type, message) => ({
	type: type,
	source_id: 'webapi',
	message: message
})

let app = express()

app.server = http.createServer(app)

app.use(cors({
	credentials: true,
	origin: true
}))

app.use(bodyParser.json({
	limit: config.bodyLimit
}))

// connect to storage
StorageService.initializeStorage()
	.then((storage) => {
		app.use('/api', api({ config, storage }))
		app.use(ErrorHandlerService(storage.elasticSearch))
		app.server.listen(process.env.PORT || config.localPort)

		//eslint-disable-next-line no-console
		console.log(`Started on ${app.server.address().address}:${app.server.address().port}`)

		EsProxy.indexLogItem(
			storage.elasticSearch,
			createLogRecord('info', `Started on ${app.server.address().address}:${app.server.address().port}`)
		)
	})
	.catch((err) => {
		//eslint-disable-next-line no-console
		console.log('Catastrophic failure!', err)
		process.exit(1)
	})

export default app