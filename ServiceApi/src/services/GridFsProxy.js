import GridFs from 'gridfs-stream'
import mongo from 'mongodb'
import { createReadStream } from 'streamifier'

const createGridFsInstance = (mongoDbInstance) => {
    return GridFs(mongoDbInstance, mongo)
}

export const uploadFile = (mongo, fileName, buffer) => new Promise((resolve, reject) => {
    const gfs = createGridFsInstance(mongo)

    const writeStream = gfs.createWriteStream({ filename: fileName, mode: 'w' })

    writeStream.on('close', (result) => resolve(result))
    writeStream.on('error', (error) => reject(error))

    createReadStream(buffer).pipe(writeStream)
})

export const uploadPlainTextFile = (mongo, fileName, buffer) => new Promise((resolve, reject) => {
    const gfs = createGridFsInstance(mongo)

    const writeStream = gfs.createWriteStream({ filename: fileName, mode: 'w', content_type: 'text/plain' })

    writeStream.on('close', (result) => resolve(result))
    writeStream.on('error', (error) => reject(error))

    createReadStream(buffer).pipe(writeStream)
})

export const checkIfFileExist = (mongo, fileName) => new Promise((resolve, reject) => {
    const gfs = createGridFsInstance(mongo)

    gfs.exist({ filename: fileName }, (err, found) => {
        if (err) {
            reject(err)
            return
        }

        resolve(found)
    })
})

export const removeFile = (mongo, fileName) => new Promise((resolve, reject) => {
    const gfs = createGridFsInstance(mongo)

    gfs.remove({ filename: fileName }, (err) => {
        if (err) {
            reject(err)
            return
        }

        resolve()
    });
})

export const downloadFile = (mongo, fileName) => {
    const gfs = createGridFsInstance(mongo)
    const readStream = gfs.createReadStream({ filename: fileName })
    return readStream
}