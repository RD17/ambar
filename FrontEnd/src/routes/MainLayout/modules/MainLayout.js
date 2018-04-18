import { urls, titles, stateValueExtractor, analytics } from 'utils'
import { push } from 'react-router-redux'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'

import 'whatwg-fetch'

export const START_LOADING_INDICATOR = 'MAIN.START_LOADING_INDICATOR'
export const STOP_LOADING_INDICATOR = 'MAIN.STOP_LOADING_INDICATOR'
export const CHANGE_SIDE_MENU_STATE = 'MAIN.CHANGE_SIDE_MENU_STATE'
export const SET_APP_HEADER = 'MAIN.SET_APP_HEADER'
const CHANGE_FIELD = 'MAIN.CHANGE_FIELD'

export const toggleSideMenu = () => {
    return (dispatch, getState) => {
        const isSideMenuOpen = getState().global.isSideMenuOpen
        dispatch(changeSideMenuState(!isSideMenuOpen))
    }
}

export const changeLocation = (location) => {
    return (dispatch, getState) => {
        const currentLocation = getState()['router'].locationBeforeTransitions.pathname
        if (currentLocation !== location) {
            dispatch(startLoadingIndicator())
            dispatch(push(location))
        }

        dispatch(toggleSideMenu())
    }
}

export function startLoadingIndicator() {
    return {
        type: START_LOADING_INDICATOR
    }
}

export function stopLoadingIndicator() {
    return {
        type: STOP_LOADING_INDICATOR
    }
}

export const toggleRateUsModal = (value) => {
    return (dispatch, getState) => {      
      dispatch(changeField('showRateUsModal', value))
      analytics().event('ACCOUNT.RATE_US_MODAL_OPENED')
    } 
}

export const setAppHeader = (header) => {
    return {
        type: SET_APP_HEADER,
        header
    }
}

function changeSideMenuState(isSideMenuOpen) {
    return {
        type: CHANGE_SIDE_MENU_STATE,
        isSideMenuOpen
    }
}

const changeField = (fieldName, value) => {
    return {
        type: CHANGE_FIELD,
        fieldName,
        value
    }
}

const ACTION_HANDLERS = {
    [START_LOADING_INDICATOR]: (state, action) => {
        return ({ ...state, fetching: true, isError: false })
    },
    [STOP_LOADING_INDICATOR]: (state, action) => {
        return ({ ...state, fetching: false })
    },
    [CHANGE_SIDE_MENU_STATE]: (state, action) => {
        return ({ ...state, isSideMenuOpen: action.isSideMenuOpen })
    },
    [SET_APP_HEADER]: (state, action) => {
        return ({ ...state, header: action.header })
    },    
    [CHANGE_FIELD]: (state, action) => {
        const newState = {...state}
        newState[action.fieldName] = action.value

        return newState
    }
}

const initial_state = {    
    isSideMenuOpen: false,
    fetching: true,
    header: {
        left: () => 'Loading...'
    },    
    showRateUsModal: false
}

export default function mainLayoutReducer(state = initial_state, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}



