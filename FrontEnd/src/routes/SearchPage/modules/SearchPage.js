import { analytics } from 'utils'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { search, updateQuery } from 'routes/SearchPage/modules/SearchReducer'

export const UPDATE_SCROLLED_DOWN = 'SEARCH_PAGE.UPDATE_SCROLLED_DOWN'
export const SET_SEARCH_RESULT_VIEW = 'SEARCH_PAGE.SET_SEARCH_RESULT_VIEW'

const REQUEST_SIZE = 25

export const setScrolledDown = (scrolledDown) => {
    return (dispatch, getState) => {
        dispatch(updateScrolledDown(scrolledDown))
    }
}

export const updateScrolledDown = (scrolledDown) => {
    return {
        type: UPDATE_SCROLLED_DOWN,
        scrolledDown
    }
}

export const setSearchResultView = (view) => {
    return {
        type: SET_SEARCH_RESULT_VIEW,
        view: view
    }
}

export const setQueryFromGetParam = () => {
    return (dispatch, getState) => {
        const query = getState().router.locationBeforeTransitions.query.query
        const doSearch = getState().router.locationBeforeTransitions.query.doSearch

        const safeQuery = !query ? '' : query

        dispatch(updateQuery(safeQuery))
        dispatch(search(0, safeQuery))
    }
}

export const ACTION_HANDLERS = {
    [UPDATE_SCROLLED_DOWN]: (state, action) => {
        const newState = { ...state, scrolledDown: action.scrolledDown }
        return newState
    },   
    [SET_SEARCH_RESULT_VIEW]: (state, action) => {
        const newState = { ...state, searchView: action.view }
        return newState
    }
}