const defaultConfig = {
	"localPort": 8081,
	"bodyLimit": "1024mb",
	"corsHeaders": ["Link"],
	"mongoDbUrl": "mongodb://ambar:27017/ambar_data",
	"elasticSearchUrl": "http://ambar:9200",
	"redisHost": "ambar",
	"redisPort": "6379",	
	"rabbitHost": "amqp://ambar",
	"defaultAccountName": "Administrator",
	"defaultAccountEmail": "admin",
	"defaultAccountRole": "admin",
	"langAnalyzer": "ambar_en",
	"defaultTaggingRules": []	
}

let config = null

const init = () => {
	const env = process.env

	return {
		...defaultConfig,
		...env
	}
}

export default (() => {
	return config === null
		? init()
		: config
})()


