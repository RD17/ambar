import { analytics } from 'utils'

export const TOGGLE_IMAGE_PREVIEW_MODAL = 'IMAGE_PREVIEW.TOGGLE_IMAGE_PREVIEW_MODAL'

export const toggleImagePreview = (imageUrl) => {
    analytics().event('IMAGE_PREVIEW.TOGGLE_IMAGE_PREIVEW')

    return {
        type: TOGGLE_IMAGE_PREVIEW_MODAL,
        imageUrl
    }
}

export const ACTION_HANDLERS = {  
    [TOGGLE_IMAGE_PREVIEW_MODAL]: (state, action) => {
        const newState = { 
            ...state,
            isImagePreviewOpen: !state.isImagePreviewOpen,
            imagePreviewUrl: action.imageUrl ? action.imageUrl : state.imagePreviewUrl
        }

        return newState
    }
}