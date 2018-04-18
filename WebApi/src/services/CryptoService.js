import crypto from 'crypto'
import bluebird from 'bluebird'

const pbkdf2 = bluebird.promisify(crypto.pbkdf2);

const DOWNLOAD_URI_CIPHER_KEY = 'BfeZp2UV'

export const getSha256 = (data) => crypto.createHash('sha256').update(data).digest('hex')
export const getSha1 = (data) => crypto.createHash('sha1').update(data).digest('hex')

export const getPasswordHash = (password, salt) => pbkdf2(password, salt, 8192, 512, 'sha512').then((hash) => hash.toString('hex'))

export const generateRandom = (length = 256) => crypto.randomBytes(length).toString('hex')

export const encryptDownloadUri = (fileId) => {
    const cipher = crypto.createCipher('aes192', DOWNLOAD_URI_CIPHER_KEY)
    const uri = { fileId: fileId }

    return cipher.update(JSON.stringify(uri), 'utf8', 'hex') + cipher.final('hex')
}

export const decryptDownloadUri = (uri) => {
    const decipher = crypto.createDecipher('aes192', DOWNLOAD_URI_CIPHER_KEY)
    const decryptedUri = decipher.update(uri, 'hex', 'utf8') + decipher.final('utf8')

    return JSON.parse(decryptedUri)
}

