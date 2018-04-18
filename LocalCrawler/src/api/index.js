import { version, name, description } from '../../package.json'
import { Router } from 'express'
// import config from '../config'

export default () => {
	let api = Router()

	api.get('/', (req, res) => {
		res.json({
			name: name,
			version: version,
			description: description
		})
	})	

	return api
}
