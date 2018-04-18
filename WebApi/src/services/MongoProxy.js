const BUCKET_DATA = 'bucket_data'
const THUMBNAIL_DATA = 'thumbnail_data'
const USER_DATA = 'user_data'

// BUCKETS
export const getBucketById = (db, bucketId) => new Promise((resolve, reject) => {
    db.collection(BUCKET_DATA)
        .findOne(
        { id: bucketId },
        (err, result) => {
            if (err) {
                reject(err)
                return
            }

            resolve(result)
        })
})

export const createBucket = (db, bucket) => new Promise((resolve, reject) => {
    db.collection(BUCKET_DATA)
        .insertOne(bucket, (err, result) => {
            if (err) {
                reject(err)
                return
            }

            resolve(result)
        })
})
//////////////////////////////////////////////////////////////////////////////////////

// THUMBNAILS
export const getThumbnailById = (db, thumbId) => new Promise((resolve, reject) => {
    db.collection(THUMBNAIL_DATA)
        .findOne(
        { id: thumbId },
        (err, result) => {
            if (err) {
                reject(err)
                return
            }

            resolve(result)
        })
})
//////////////////////////////////////////////////////////////////////////////////////

// USERS
export const getUserByEmail = (db, email) => new Promise((resolve, reject) => {
    db.collection(USER_DATA)
        .findOne(
        { email: email },
        (err, result) => {
            if (err) {
                reject(err)
                return
            }

            resolve(result)
        })
})

export const createUpdateUser = (db, user) => new Promise((resolve, reject) => {
    db.collection(USER_DATA)
        .updateOne({ email: user.email }, user, { upsert: true }, (err, result) => {
            if (err) {
                reject(err)
                return
            }

            resolve(result)
        })
})

export const deleteUser = (db, user) => new Promise((resolve, reject) => {
    db.collection(USER_DATA)
        .deleteOne({ email: user.email },
        null,
        (err, result) => {
            if (err) {
                reject(err)
                return
            }

            resolve(result)
        })
})

export const getUsersCount = (db, defaultEmail) => new Promise((resolve, reject) => {
    db.collection(USER_DATA)
        .count({
            email: { $ne: defaultEmail }
        },
        (err, result) => {
            if (err) {
                reject(err)
                return
            }

            resolve(result)
        })
})
//////////////////////////////////////////////////////////////////////////////////////
