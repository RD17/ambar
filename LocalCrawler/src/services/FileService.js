import crypto from 'crypto'
import fs from 'fs'

export const getFileMeta = (path) => fs.stat(path)

export const getFileSha = (path) => new Promise((resolve) => {
    const shaSum = crypto.createHash('sha256')
    const readStream = fs.ReadStream(path)

    readStream.on('data', (data) => shaSum.update(data))
    readStream.on('end', () => {
        const result = shaSum.digest('hex')        
        resolve(result)
    })  
})