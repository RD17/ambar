const defaultConfig = {
	"port": 8082,
	"bodyLimit": "10mb",	
	"crawlPath": "/usr/data",
	"apiUrl": "http://serviceapi:8080",
	"ignoreFolders": "**/test/**",
	"ignoreExtensions": ".{exe,dll}",
	"ignoreFileNames": "~*",	
	"name": "localhost",
	"maxFileSize": "300mb",	
	"rabbitHost": "amqp://rabbit"
}

let config = null

const init = () => {	
	config = { ...defaultConfig, ...process.env }

	return config
}

export default (() => {
	return config === null
		? init()
		: config
})()


