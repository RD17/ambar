import { stateValueExtractor, constants, titles, analytics } from 'utils/'
import { hitsModel, folderHitsModel } from 'models/'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'
import * as Regexes from 'utils/regexes'

export const FILL_HITS = 'SEARCH.FILL_HITS'
export const FILL_SEARCH_FOLDER_HITS = 'SEARCH.FILL_SEARCH_FOLDER_HITS'
export const FILL_STATS_DATA = 'SEARCH.FILL_STATS_DATA'
export const UPDATE_QUERY = 'SEARCH.UPDATE_QUERY'

const REQUEST_SIZE = 25

export const performSearchByQuery = (query) => {
    return (dispatch, getState) => {
        dispatch(setQuery(query))
        dispatch(search(0, query))
    }
}

export const performSearchByPathToFile = (path) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.FILE_NAME_QUERY_REGEX, '')
        path = path.replace(/\s/gim, '?')
        query = `${query} filename:${path}`
        dispatch(setQuery(query))
        dispatch(search(0, query))
    }
}

export const performSearchByAuthor = (author) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.AUTHOR_QUERY_REGEX, '')
        author = author.replace(/\s/gim, '?')
        query = `${query} author:${author}`
        dispatch(setQuery(query))
        dispatch(search(0, query))
    }
}

export const performSearchByTag = (tag) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.TAGS_QUERY_REGEX, '')
        query = `${query} tags:${tag}`
        dispatch(setQuery(query))
        dispatch(search(0, query))
    }
}

export const performSearchByNamedEntity = (namedEntity) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.NAMED_ENTITIES_QUERY_REGEX, '')
        query = `${query} entities:"${namedEntity}"`
        dispatch(setQuery(query))
        dispatch(search(0, query))
    }
}

export const performSearchBySize = (symbol, size) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.SIZE_QUERY_REGEX, '')
        query = `${query} size${symbol}${size}`
        dispatch(setQuery(query))
        dispatch(search(0, query))
    }
}

export const performSearchByWhen = (when) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.WHEN_QUERY_REGEX, '')
        query = `${query} when:${when}`
        dispatch(setQuery(query))
        dispatch(search(0, query))
    }
}

export const performSearchByShow = (show) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.SHOW_QUERY_REGEX, '')
        query = `${query} show:${show}`
        dispatch(setQuery(query))
        dispatch(search(0, query))
    }
}

export const setQuery = (query) => {
    return (dispatch, getState) => {
        dispatch(updateQuery(query))
    }
}

export const updateQuery = (query) => {
    return {
        type: UPDATE_QUERY,
        query
    }
}

export const search = (page, query) => {
    return (dispatch, getState) => {
        const fetching = getState()['global'].fetching
        if (fetching) {
            return
        }

        changeBrowserAddressStringToQuery(query)
        titles.setPageTitle(query != '' ? query : stateValueExtractor.getLocalization(getState()).searchPage.pageTitle)

        if ((!query) || (query == '')) {
            dispatch(cleanUpSearchResult())
            return
        }

        const searchView = getState()['searchPage'].searchView

        switch (searchView) {
            case constants.FOLDER_VIEW:
                dispatch(performSearchFolder(query))
                break;
            case constants.STATISTICS_VIEW:
                dispatch(performSearchStats(query))
                break;
            default:
                dispatch(performSearch(page, query))    
        }       
    }
}

export const cleanUpSearchResult = () => {
    return (dispatch, getState) => {
        dispatch(fillHits(true, new Map(), 0, '', false, 0))
        dispatch(fillSearchFolderHits([]))
    }
}

const performSearch = (page, query) => {
    return (dispatch, getState) => {

        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        return new Promise((resolve) => {
            dispatch(startLoadingIndicator())
            fetch(urls.ambarWebApiSearchByStringQuery(query, page, REQUEST_SIZE), {
                method: 'GET',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status === 200) { return resp.json() }
                    else { throw resp }
                })
                .then((data) => {
                    const hits = hitsModel.fromApi(data)
                    const hasMore = (hits.size > 0)
                    const clean = (page == 0)
                    dispatch(stopLoadingIndicator())
                    dispatch(fillHits(clean, hits, data.found, query, hasMore, page))

                    if (page === 0) { analytics().event('SEARCH.PERFORM', { query: query }) }
                })
                .catch((errorPayload) => {
                    dispatch(stopLoadingIndicator())
                    dispatch(handleError(errorPayload))
                    console.error('performSearch', errorPayload)
                })
        })
    }
}

export const performSearchFolder = (query) => {
    return (dispatch, getState) => {        
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        return new Promise((resolve) => {
            dispatch(startLoadingIndicator())
            fetch(urls.ambarWebApiSearchTree(query), {
                method: 'GET',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status === 200) { return resp.json() }
                    else { throw resp }
                })
                .then((data) => {
                    dispatch(stopLoadingIndicator())
                    dispatch(fillSearchFolderHits(folderHitsModel.fromApi(data)))
                })
                .catch((errorPayload) => {
                    dispatch(stopLoadingIndicator())
                    dispatch(handleError(errorPayload))
                    console.error('performSearchFolder', errorPayload)
                })
        })
    }
}

export const performSearchStats = (query) => {
    return (dispatch, getState) => {        
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        return new Promise((resolve) => {
            dispatch(startLoadingIndicator())
            fetch(urls.ambarWebApiSearchStats(query), {
                method: 'GET',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status === 200) { return resp.json() }
                    else { throw resp }
                })
                .then((data) => {
                    dispatch(stopLoadingIndicator())
                    dispatch(fillStatsData(data))
                })
                .catch((errorPayload) => {
                    dispatch(stopLoadingIndicator())
                    dispatch(handleError(errorPayload))
                    console.error('performSearchStats', errorPayload)
                })
        })
    }
}

const fillStatsData = (data) => {
    return {
        type: FILL_STATS_DATA,
        data
    }
}

const fillSearchFolderHits = (hits) => {
    return {
        type: FILL_SEARCH_FOLDER_HITS,
        hits
    }
}

const fillHits = (clean, hits, found, searchQuery, hasMore, currentPage) => {
    return {
        type: FILL_HITS,
        clean,
        hits,
        found,
        searchQuery,
        hasMore,
        currentPage
    }
}

const changeBrowserAddressStringToQuery = (query) => {
    if (history.pushState) {
        var newUri = `${window.location.protocol}//${window.location.host}${window.location.pathname}?query=${encodeURIComponent(query)}`;
        window.history.pushState({ path: newUri }, '', newUri);
    }
}


const foldersTreeToMap = (node, map) => {
    if (!node) {
        return
    }

    map.set(node.path, node.isExpanded)
    node.childNodes.forEach(childNode => foldersTreeToMap(childNode, map))
}

const setNewExpandedValues = (node, map) => {
    if (!node) {
        return
    }

    node.isExpanded = map.has(node.path) ? map.get(node.path) : false
    node.childNodes.forEach(childNode => setNewExpandedValues(childNode, map))
}

export const ACTION_HANDLERS = {
    [FILL_HITS]: (state, action) => {
        let newState = { ...state }
        if (action.clean) {
            newState.hits = action.hits
        }
        else {
            newState.hits = new Map([...state.hits, ...action.hits])
        }
        newState.fetching = false
        newState.hasMore = action.hasMore
        newState.currentPage = action.currentPage
        return newState
    },
    [FILL_SEARCH_FOLDER_HITS]: (state, action) => {
        if (!state.folderHits) {
            return { ...state, folderHits: action.hits }
        }

        const map = new Map()
        state.folderHits.forEach(hit => foldersTreeToMap(hit, map))
        
        const newHits = action.hits
        newHits.forEach(hit => setNewExpandedValues(hit, map))

        return { ...state, folderHits: newHits }
    },
    [UPDATE_QUERY]: (state, action) => {
        return ({ ...state, searchQuery: action.query })
    },
    [FILL_STATS_DATA]: (state, action) => {
        return ({ ...state, stats: action.data })
    }
}