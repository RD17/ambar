import { stateValueExtractor } from 'utils/'
import { hitsModel } from 'models/'
import { analytics } from 'utils'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'

export const START_STOP_HIGHLIGHT_LOADING = 'DETAILED_VIEW.START_STOP_HIGHLIGHT_LOADING'
export const SET_CONTENT_HIGHLIGHT = 'DETAILED_VIEW.SET_CONTENT_HIGHLIGHT'

export const loadHighlight = (fileId, query) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        return new Promise((resolve) => {
            dispatch(startStopHighlightLoadingIndicator(fileId, true))
            fetch(urls.ambarWebApiLoadContentHightlight(fileId, query), {
                method: 'GET',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status == 200) { return resp.json() }
                    else { throw resp }
                })
                .then((resp) => {
                    dispatch(setContentHighlight(fileId, hitsModel.contentHighlightFromApi(resp)))
                    dispatch(startStopHighlightLoadingIndicator(fileId, false))
                    analytics().event('SEARCH.LOAD_HIGHLIGHT')
                })
                .catch((errorPayload) => {
                    dispatch(startStopHighlightLoadingIndicator(fileId, false))
                    dispatch(handleError(errorPayload))
                    console.error('loadHighlight', errorPayload)
                })
        })
    }
}

const setContentHighlight = (fileId, highlight) => {
    return {
        type: SET_CONTENT_HIGHLIGHT,
        fileId,
        highlight
    }
}

const startStopHighlightLoadingIndicator = (fileId, fetching) => {
    return {
        type: START_STOP_HIGHLIGHT_LOADING,
        fileId,
        fetching
    }
}

export const ACTION_HANDLERS = {
    [START_STOP_HIGHLIGHT_LOADING]: (state, action) => {
        const oldHit = hitsModel.getHit(state, action.fileId)
        const hit = { ...oldHit, fetching: action.fetching }
        return hitsModel.updateHits(state, action.fileId, hit)
    },
    [SET_CONTENT_HIGHLIGHT]: (state, action) => {
        const oldHit = hitsModel.getHit(state, action.fileId)
        const hit = { ...oldHit, content: { ...oldHit.content, highlight: action.highlight } }
        return hitsModel.updateHits(state, action.fileId, hit)
    }   
}