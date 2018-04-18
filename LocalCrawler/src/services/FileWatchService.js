import moment from 'moment'
import chokidar from 'chokidar'
import path from 'path'
import config from '../config'
import bytes from 'bytes'

import * as ApiProxy from './ApiProxy'
import * as FileService from './FileService'

const WAIT_MS = 500

let tasks = []

const allowedFilesRegex = new RegExp(config.allowedFilesRegex, 'gi')

export const startWatch = () => {
    processTasks()

    chokidar.watch(config.crawlPath, { usePolling: true })
        .on('all', (event, pathToFile, stat) => {
            if (event === 'add' || event === 'change') {
                tasks.push({ event, pathToFile, stat })
            }
        })
}

const processTasks = async () => {
    //eslint-disable-next-line no-constant-condition
    while (true) {
        if (tasks.length === 0) {
            await sleep()
            continue
        }

        const { pathToFile, stat } = tasks[0]
        tasks = tasks.slice(1)
        
        try {
            await tryAddFile(pathToFile, stat)
        } catch (err) {
            await ApiProxy.logData(config.name, 'error', `failed to submit ${pathToFile}`)
        }
    }
}

const sleep = () => new Promise((resolve) => {
    setTimeout(() => {
        resolve()
    }, WAIT_MS)
})

const shouldIgnore = (pathToFile, stat) => {
    if (!stat) {
        return false
    }

    const maxFileSizeBytes = bytes.parse(config.maxFileSize)

    if (stat.size === 0) {
        return true
    }

    if (stat.size > maxFileSizeBytes) {
        return true
    }

    if (!allowedFilesRegex.test(pathToFile)) {
        return true
    }

    if (!path.extname(pathToFile)) {
        return true
    }

    return false
}

const tryAddFile = async (pathToFile, stat) => {
    let normalizedPath = path.normalize(pathToFile)

    normalizedPath = `//${normalizedPath.replace(config.crawlPath, config.name)}`.replace(/\\/g, '/')

    if (shouldIgnore(normalizedPath, stat)) {
        await ApiProxy.logData(config.name, 'info', `${normalizedPath} ignoring`)
        return
    }

    const meta = {
        full_name: normalizedPath,
        updated_datetime: moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss.SSS'),
        created_datetime: moment(stat.atime).format('YYYY-MM-DD HH:mm:ss.SSS'),
        source_id: config.name,
        short_name: path.basename(normalizedPath),
        extension: path.extname(normalizedPath),
        extra: []
    }

    const metaExists = await ApiProxy.doesFileMetaExist(meta)
    if (metaExists) {
        await ApiProxy.logData(config.name, 'info', `${normalizedPath} meta exists`)
        return
    }

    const sha = await FileService.getFileSha(pathToFile)
    const contentExist = await ApiProxy.doesParsedContentExist(sha)

    if (contentExist) {
        await ApiProxy.logData(config.name, 'info', `${normalizedPath} - content found`)
    } else {
        await ApiProxy.addFileContent(pathToFile, sha)
        await ApiProxy.logData(config.name, 'info', `${normalizedPath} - content added`)
    }

    await ApiProxy.addFileMeta(meta, sha, config.name)
    await ApiProxy.logData(config.name, 'info', `${normalizedPath} - meta updated`)
}