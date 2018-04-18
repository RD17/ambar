import { stateValueExtractor, errors } from 'utils'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'
import 'whatwg-fetch'

export const START_STOP_LOADING = 'STAT.START_STOP_LOADING'
export const SET_STATISTICS = 'STAT.SET_STATISTICS'

export const loadStatistics = (page, query) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        return new Promise((resolve) => {
            dispatch(startLoadingIndicator())
            dispatch(startStopLoadingIndicator(true))

            fetch(urls.ambarWebApiGetStats(), {
                method: 'GET',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status == 200) { return resp.json() }
                    else { throw resp }
                })
                .then((data) => {
                    dispatch(setStatistics(data))
                    dispatch(stopLoadingIndicator())
                    dispatch(startStopLoadingIndicator(false))
                })
                .catch((errorPayload) => {
                    dispatch(stopLoadingIndicator())
                    dispatch(startStopLoadingIndicator(false))
                    dispatch(handleError(errorPayload))
                    console.error('loadStatistics', errorPayload)
                })
        })

    }
}

const setStatistics = (data) => {
    return {
        type: SET_STATISTICS,
        data
    }
}

const startStopLoadingIndicator = (fetching) => {
    return {
        type: START_STOP_LOADING,
        fetching
    }
}

const ACTION_HANDLERS = {
    [START_STOP_LOADING]: (state, action) => {
        return { ...state, fetching: action.fetching }
    },
    [SET_STATISTICS]: (state, action) => {
        return { ...state, data: action.data }
    }
}

const initialState = {
    data: {},
    fetching: true
}

export default function statisticsPageReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}