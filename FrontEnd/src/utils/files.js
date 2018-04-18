import { postAttachedFilesUrl } from './urls'
import 'whatwg-fetch'

export const bytesToMegaBytes = (bytesCount) => {
    return bytesCount / (1024 * 1024)
}

export const fileSizeIsNotTooLarge = (fileSize) => {
    const maxFileSize = 3 //MB
    return bytesToMegaBytes(fileSize) > maxFileSize
}

export const getFileSize = (file) => {
    if (file && file[0]) {
        return file[0].size
    }

    return null
}

export const fileIsTooLarge = (file) => {
    const size = getFileSize(file)

    if (size == null)
        return false

    return fileSizeIsNotTooLarge(size)
}

export const formatFileSize = (sizeInBytes) => {
    const sizeInKBytes = sizeInBytes / 1024

    if (sizeInKBytes < 1) {
        return `${sizeInBytes} bytes`
    }

    const sizeInMBytes = sizeInKBytes / 1024
    if (sizeInMBytes < 1) {
        return `${sizeInKBytes.toFixed(2)} KB`
    }

    const sizeInGbytes = sizeInMBytes / 1024
    if (sizeInGbytes < 1) {
        return `${sizeInMBytes.toFixed(2)} MB`
    }

    return `${sizeInGbytes.toFixed(2)} GB`
}

export const getExtension = (meta) => {
    let extension = (typeof meta.extension !== 'string') && meta.extension.length && meta.extension.length > 0
        ? meta.extension[0]
        : meta.extension
    return extension ? extension.replace('.', '').toLowerCase() : ''
}

export const doesFileContainText = (meta) => {
    const extension = getExtension(meta)
    const EXCLUDED_EXTENSIONS = ['zip'] // extensions that doesn't contain text
    return EXCLUDED_EXTENSIONS.indexOf(extension) == -1
}
