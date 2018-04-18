import { stateValueExtractor, constants, analytics } from 'utils/'
import { hitsModel } from 'models/'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'

export const SET_TAGS = 'TAGS.SET_TAGS'
export const ADD_TAG = 'TAGS.ADD_TAG'
export const REMOVE_TAG = 'TAGS.REMOVE_TAG'
export const MARK_TAG_AS_CREATED = 'TAGS.MARK_TAG_AS_CREATED'

export const loadTags = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(startLoadingIndicator())

        fetch(urls.ambarWebApiGetAllTags(), {
            method: 'GET',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200) {
                    return resp.json()
                }
                else { throw resp }
            })
            .then(tags => {
                dispatch(setTags(tags))
                dispatch(stopLoadingIndicator())
            })
            .catch((errorPayload) => {
                dispatch(stopLoadingIndicator())
                dispatch(handleError(errorPayload))
                console.error('loadTags', errorPayload)
            })

        dispatch(stopLoadingIndicator())
    }
}

export const addTagToFile = (fileId, tagType, tagName) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(addTag(fileId, tagType, tagName))

        fetch(urls.ambarWebApiAddTagToFile(fileId, tagType, tagName), {
            method: 'POST',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200 || resp.status == 201) {
                    dispatch(markTagAsCreated(fileId, tagType, tagName))
                    analytics().event('TAGS.ADD', { name: tagName })
                    return resp.json()
                }
                else { throw resp }
            })
            .then((data) => {
                dispatch(setTags(data.tags))
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('addTagToFile', errorPayload)
            })
    }
}

export const removeTagFromFile = (fileId, tagType, tagName) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(removeTag(fileId, tagType, tagName))

        fetch(urls.ambarWebApiDeleteTagFromFile(fileId, tagType, tagName), {
            method: 'DELETE',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200) {
                    analytics().event('TAGS.REMOVED', { name: tagName })
                    return resp.json()
                }
                else { throw resp }
            })
            .then((data) => {
                dispatch(setTags(data.tags))
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('removeTagFromFile', errorPayload)
            })
    }
}

export const setTags = (tags) => {
    return {
        type: SET_TAGS,
        tags
    }
}

const addTag = (fileId, tagType, tagName) => {
    return {
        type: ADD_TAG,
        tagName: tagName,
        tagType: tagType,
        fileId: fileId
    }
}

const removeTag = (fileId, tagType, tagName) => {
    return {
        type: REMOVE_TAG,
        tagName: tagName,
        tagType: tagType,
        fileId: fileId
    }
}

const markTagAsCreated = (fileId, tagType, tagName) => {
    return {
        type: MARK_TAG_AS_CREATED,
        tagName: tagName,
        tagType: tagType,
        fileId: fileId
    }
}

export const ACTION_HANDLERS = {
    [SET_TAGS]: (state, action) => {
        return ({ ...state, tags: action.tags })
    },
    [ADD_TAG]: (state, action) => {
        const oldHit = hitsModel.getHit(state, action.fileId)
        const hit = { ...oldHit, tags: [...oldHit.tags, { name: action.tagName, type: action.tagType, isFetching: true }] }
        return hitsModel.updateHits(state, action.fileId, hit)
    },
    [REMOVE_TAG]: (state, action) => {
        const oldHit = hitsModel.getHit(state, action.fileId)
        const hit = { ...oldHit, tags: [...oldHit.tags.filter(t => !((t.name === action.tagName) && (t.type === action.tagType)))] }
        return hitsModel.updateHits(state, action.fileId, hit)
    },
    [MARK_TAG_AS_CREATED]: (state, action) => {
        const oldHit = hitsModel.getHit(state, action.fileId)
        const hit = { ...oldHit }
        hit.tags = hit.tags.map(tag => {
            if ((tag.name === action.tagName) && (tag.type === action.tagType)) {
                tag.isFetching = false
            }

            return tag
        })

        return hitsModel.updateHits(state, action.fileId, hit)
    }
}