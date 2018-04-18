import crypto from 'crypto'
import bluebird from 'bluebird'

const pbkdf2 = bluebird.promisify(crypto.pbkdf2);

export const getSha256 = (data) => crypto.createHash('sha256').update(data).digest('hex')
export const getSha1 = (data) => crypto.createHash('sha1').update(data).digest('hex')

export const getPasswordHash = (password, salt) => pbkdf2(password, salt, 8192, 512, 'sha512').then((hash) => hash.toString('hex'))

export const generateRandom = (length = 256) => crypto.randomBytes(length).toString('hex')

