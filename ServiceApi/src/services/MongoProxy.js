import config from '../config'
import { CryptoService } from './index'

const THUMBNAIL_DATA = 'thumbnail_data'
const USER_DATA = 'user_data'
const USER_ROLE_DATA = 'user_role_data'
const AUTO_TAGGING_RULE_DATA = 'auto_tagging_rule_data'

//TAGGING RULES
export const initDefaultTaggingRules = (db) => new Promise((resolve, reject) => {
    const promises = config.defaultTaggingRules.map(taggingRule =>
        new Promise((iResolve, iReject) => {
            const ruleId = CryptoService.getSha1(`taggingRule_${taggingRule.name}`)

            db.collection(AUTO_TAGGING_RULE_DATA)
                .updateOne({ id: ruleId }, { ...taggingRule, id: ruleId }, { upsert: true }, (err, result) => {
                    if (err) {
                        iReject(err)
                        return
                    }

                    iResolve(result)
                })
        }))

    Promise.all(promises)
        .then(() => resolve())
        .catch(err => reject(err))
})

export const getTaggingRules = (db) => new Promise((resolve, reject) => {
    db.collection(AUTO_TAGGING_RULE_DATA)
        .find()
        .toArray(
        (err, result) => {
            if (err) {
                reject(err)
                return
            }

            resolve(result)
        })
})
//////////////////////////////////////////////////////////////////////////////////////

// THUMBNAILS
export const createThumbnail = (db, thumbId, thumbData) => new Promise((resolve, reject) => {
    db.collection(THUMBNAIL_DATA)
        .updateOne({ id: thumbId }, { id: thumbId, data: thumbData }, { upsert: true }, (err, result) => {
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
//////////////////////////////////////////////////////////////////////////////////////

/// ROLES
export const createUpdateUserRole = (db, role) => new Promise((resolve, reject) => {
    db.collection(USER_ROLE_DATA)
        .updateOne({ name: role.name }, role, { upsert: true }, (err, result) => {
            if (err) {
                reject(err)
                return
            }

            resolve(result)
        })
})

