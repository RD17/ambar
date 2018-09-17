import moment from 'moment'
import chokidar from 'chokidar'
import path from 'path'
import config from '../config'
import bytes from 'bytes'
import minimatch from 'minimatch'

import * as ApiProxy from './ApiProxy'
import * as QueueProxy from './QueueProxy'

export const startWatch = () => {
    chokidar.watch(config.crawlPath, { usePolling: true, awaitWriteFinish: true })
        .on('error', error => {
            ApiProxy.logData(config.name, 'error', `Chokidar error: ${error}`)
        })
        .on('all', (event, pathToFile, stat) => {
            if (event === 'add' || event === 'change' || event === 'unlink') {
                addTask(event, pathToFile, stat)
            }
        })       
}

const shouldIgnore = (pathToFile, stat) => {
    if (!stat) {
        return false
    }

    const maxFileSizeBytes = bytes.parse(config.maxFileSize)

    if (stat.size === 0) {
        ApiProxy.logData(config.name, 'verbose', `${pathToFile} ignoring. Rule: file.size != 0`)
        return true
    }

    if (stat.size > maxFileSizeBytes) {
        ApiProxy.logData(config.name, 'verbose', `${pathToFile} ignoring. Rule: file.size [${bytes(stat.size)}] > maxFileSize [${bytes(maxFileSizeBytes)}]`)
        return true
    }

    const extName = path.extname(pathToFile)
    if (!extName) {
        ApiProxy.logData(config.name, 'verbose', `${pathToFile} ignoring. Rule: File should have extension`)
        return true
    }

    if (config.ignoreExtensions && minimatch(extName, config.ignoreExtensions)) {
        ApiProxy.logData(config.name, 'verbose', `${pathToFile} ignoring. Rule: ignore extensions [${config.ignoreExtensions}]`)
        return true
    }

    const fileName = path.basename(pathToFile, extName)
    if (config.ignoreFileNames && minimatch(fileName, config.ignoreFileNames)) {
        ApiProxy.logData(config.name, 'verbose', `${pathToFile} ignoring. Rule: ignore fileNames [${config.ignoreFileNames}]`)
        return true
    }

    const dirName = path.dirname(pathToFile)
    if (config.ignoreFolders && minimatch(dirName, config.ignoreFolders)) {
        ApiProxy.logData(config.name, 'verbose', `${pathToFile} ignoring. Rule: ignore folders [${config.ignoreFolders}]`)
        return true
    }

    return false
}

const addTask = (event, pathToFile, stat) => {
    let normalizedPath = path.normalize(pathToFile)

    normalizedPath = `//${normalizedPath.replace(config.crawlPath, config.name)}`.replace(/\\/g, '/')

    if (shouldIgnore(normalizedPath, stat)) {
        return
    }

    const meta = {
        full_name: normalizedPath,
        updated_datetime: !stat ? '' : moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss.SSS'),
        created_datetime: !stat ? '' : moment(stat.atime).format('YYYY-MM-DD HH:mm:ss.SSS'),
        source_id: config.name,
        short_name: path.basename(normalizedPath),
        extension: path.extname(normalizedPath),
        extra: []
    }

    QueueProxy.enqueueMessage({ event: event, meta: meta })
}