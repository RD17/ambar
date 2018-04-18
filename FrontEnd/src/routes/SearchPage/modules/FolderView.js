import { stateValueExtractor } from 'utils/'
import { folderHitsModel } from 'models/'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'
import 'whatwg-fetch'

export const TOGGLE_NODE = 'FOLDER_VIEW.TOGGLE_NODE'
export const TOGGLE_ALL = 'FOLDER_VIEW.TOGGLE_ALL'

export const toggleTreeNode = (nodePath) => {
    return {
        type: TOGGLE_NODE,
        nodePath
    }
}

export const toggleAll = (value) => {
    return {
        type: TOGGLE_ALL,
        value: value        
    }
}

const findNodeByPath = (node, path) => {
    if (node.path === path) {
        return node
    }

    if (!node) {
        return null
    }

    for (const childNode in node.childNodes) {
        const result = findNodeByPath(node.childNodes[childNode], path)
        if (result != null) {            
            return result
        }
    }

    return null
}

const toggleExpanded = (node, value) => {
    if (!node) {
        return
    }

    node.isExpanded = value
    node.childNodes.forEach(childNode => toggleExpanded(childNode, value))
}

export const ACTION_HANDLERS = {
    [TOGGLE_NODE]: (state, action) => {
        let newState = { ...state }
        
        let folderHits = JSON.parse(JSON.stringify(state.folderHits))

        for (const node in folderHits) {
            const result = findNodeByPath(folderHits[node], action.nodePath)
            if (result != null) {
                result.isExpanded = !result.isExpanded
                break
            }
        }
        newState.folderHits = folderHits

        return newState
    },
    [TOGGLE_ALL]: (state, action) => {
        let newState = { ...state }
        let folderHits = JSON.parse(JSON.stringify(state.folderHits))
        folderHits.forEach(node => toggleExpanded(node, action.value))
        newState.folderHits = folderHits

        return newState
    }
}