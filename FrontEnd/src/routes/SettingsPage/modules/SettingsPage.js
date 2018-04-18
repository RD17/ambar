import { stateValueExtractor } from 'utils/'
import { crawlersModel } from 'models/'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'
import 'whatwg-fetch'

const UPDATE_CRAWLER = 'SETTINGS.UPDATE_CRAWLER'
const FILL_CRAWLERS = 'SETTINGS.FILL_CRAWLERS'
const UPDATE_NEW_CRAWLER = 'SETTINGS.UPDATE_NEW_CRAWLER'
const UPDATE_PIPELINE = 'SETTINGS.UPDATE_PIPELINE'

const REQUEST_SIZE = 10
const PIPELINE_LOG_SIZE = 30


export const loadPipelineLog = (pipeline) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())
        
        dispatch(stopLoadingIndicator())

        fetch(urls.ambarWebApiGetLogs(PIPELINE_LOG_SIZE), {
            method: 'GET',
            ...defaultSettings
        })
            .then((resp) => {
                if (resp.status == 200) { return resp.json() }
                else { throw resp }
            })
            .then((data) => {
                dispatch(updatePipeline({ ...pipeline, log: { records: data } }))                
            })
            .catch((errorPayload) => {
                dispatch(updatePipeline({ ...pipeline, log: { ...pipeline.log } }))
                console.error('loadPipelineLog', errorPayload)
            })
    }
}


const fillCrawlers = (crawlers) => {
    return {
        type: FILL_CRAWLERS,
        crawlers
    }
}

const updateCrawler = (crawler) => {
    return {
        type: UPDATE_CRAWLER,
        crawler
    }
}

const updatePipeline = (pipeline) => {
    return {
        type: UPDATE_PIPELINE,
        pipeline
    }
}


const ACTION_HANDLERS = {
    [FILL_CRAWLERS]: (state, action) => {
        let newState = { ...state }
        newState.crawlers = action.crawlers
        return newState
    },
    [UPDATE_CRAWLER]: (state, action) => {
        let newState = { ...state }
        newState.crawlers = new Map(state.crawlers)
        newState.crawlers.set(action.crawler.settings.id, action.crawler)
        return newState
    },
    [UPDATE_PIPELINE]: (state, action) => {
        return { ...state, pipeline: action.pipeline }
    }
}

const initialState = {
    crawlers: new Map(),
    pipeline: { log: { records: [] } }
}

export default function settingsPageReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}