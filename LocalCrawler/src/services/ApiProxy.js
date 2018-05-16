import moment from 'moment'
import requestLib from 'request-promise-native'
import fs from 'fs'
import config from '../config'

const request = requestLib.defaults()

export const doesParsedContentExist = (sha) => new Promise((resolve, reject) => {
    const options = {
        uri: `${config.apiUrl}/api/files/content/${encodeURIComponent(sha)}/parsed`,
        method: 'HEAD',
        simple: false,
        resolveWithFullResponse: true
    }

    return request(options)
        .then(response => {
            resolve(response.statusCode === 302)
        })
        .catch(err => {
            console.log(err)
            reject(err)
        })
})

export const doesFileMetaExist = (meta) => new Promise((resolve, reject) => {
    const options = {
        uri: `${config.apiUrl}/api/files/meta/exists`,
        method: 'POST',
        body: JSON.stringify(meta),
        headers: {
            'Content-Type': 'application/json'
        },
        simple: false,
        resolveWithFullResponse: true
    }

    return request(options)
        .then(response => {
            resolve(response.statusCode === 200)
        })
        .catch(err => {
            console.log(err)
            reject(err)
        })
})

export const addFileMeta = (meta, sha, crawlerId) => new Promise((resolve, reject) => {
    const options = {
        uri: `${config.apiUrl}/api/files/meta/${encodeURIComponent(sha)}/${encodeURIComponent(crawlerId)}`,
        method: 'POST',
        body: JSON.stringify(meta),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return request(options)
        .then(() => { resolve() })
        .catch(err => {
            console.log(err)
            reject(err)
        })
})

export const addFileContent = (filePath, sha) => new Promise((resolve, reject) => {
    const options = {
        uri: `${config.apiUrl}/api/files/content/${encodeURIComponent(sha)}`,
        method: 'POST',
        formData: [
            fs.createReadStream(filePath)
        ],
        simple: false,
        resolveWithFullResponse: true
    }

    return request(options)
        .then(response => {
            resolve(response.statusCode === 304 || response.statusCode === 201)
        })
        .catch(err => {
            console.log(err)
            reject(err)
        })
})

export const logData = (sourceId, type, message) => new Promise((resolve, reject) => {

    console.log(`[${type}] ${message}`)

    const record = {
        source_id: sourceId,
        type: type,
        message: message,
        created_datetime: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    }

    const options = {
        uri: `${config.apiUrl}/api/logs`,
        method: 'POST',
        body: JSON.stringify(record),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    request(options)
        .then(() => resolve())
        .catch(err => {
            console.error(err)
            reject(err)
        })
})