import { stateValueExtractor, analytics } from 'utils'
import { hitsModel } from 'models/'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'

export const TOGGLE_IS_HIDDEN_FILE = 'FILE_VISIBILITY.TOGGLE_IS_HIDDEN_FILE'

export const hideFile = (fileId) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(toggleIsHiddenFile(fileId, true))

        fetch(urls.ambarWebApiHideFile(fileId), {
            method: 'PUT',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200) {
                    analytics().event('FILE.HIDE')
                    return
                }
                else { throw resp }
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('hideFile', errorPayload)
            })
    }
}

export const showFile = (fileId) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(toggleIsHiddenFile(fileId, false))

        fetch(urls.ambarWebApiUnhideFile(fileId), {
            method: 'PUT',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200) {
                    analytics().event('FILE.SHOW')
                    return
                }
                else { throw resp }
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('showFile', errorPayload)
            })
    }
}

const toggleIsHiddenFile = (fileId, value) => {
    return {
        type: TOGGLE_IS_HIDDEN_FILE,
        fileId: fileId,
        value: value
    }
}

export const ACTION_HANDLERS = {    
    [TOGGLE_IS_HIDDEN_FILE]: (state, action) => {
        const oldHit = hitsModel.getHit(state, action.fileId)
        const hit = { ...oldHit, isHidden: action.value, hidden_mark: action.value ? {} : null }
        return hitsModel.updateHits(state, action.fileId, hit)
    }
}