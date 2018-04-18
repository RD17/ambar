import http from 'http'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import api from './api'
import config from './config'

import 'babel-core/register'
import 'idempotent-babel-polyfill'

import { FileWatchService, ApiProxy } from './services'

ApiProxy.logData(config.name, 'info', 'Crawler initialized')	
FileWatchService.startWatch()

let app = express()
app.server = http.createServer(app)

app.use(cors({
	credentials: true,
	origin: true
}))

app.use(bodyParser.json({
	limit: config.bodyLimit
}))

// api router
app.use('/api', api())
app.server.listen(process.env.PORT || config.port)

console.log(`Started on ${app.server.address().address}:${app.server.address().port}`)

export default app