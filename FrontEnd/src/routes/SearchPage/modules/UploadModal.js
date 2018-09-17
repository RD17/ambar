import { stateValueExtractor } from 'utils/'
import {  FormDataPolyfill } from 'utils'
import { handleError, showInfo } from 'routes/CoreLayout/modules/CoreLayout'
import 'whatwg-fetch'

export const TOGGLE_UPLOAD_MODAL = 'SEARCH_UPLOAD_MODAL.TOGGLE_UPLOAD_MODAL'
export const ADD_FILES_TO_UPLOAD = 'SEARCH_UPLOAD_MODAL.ADD_FILES_TO_UPLOAD'
export const REMOVE_FILE_TO_UPLOAD = 'SEARCH_UPLOAD_MODAL.REMOVE_FILE_TO_UPLOAD'
export const FILES_UPLOADING = 'SEARCH_UPLOAD_MODAL.FILES_UPLOADING'
export const CLEAN_FILES_TO_UPLOAD = 'SEARCH_UPLOAD_MODAL.CLEAN_FILES_TO_UPLOAD'

export const uploadFiles = () => {
    return (dispatch, getState) => {
        dispatch(filesUploading(true))

        const urls = stateValueExtractor.getUrls(getState())

        const { filesToUpload } = getState()['searchPage']       

        const uploadPromises = filesToUpload.map(file => new Promise((resolve, reject) => {
            const form = new FormDataPolyfill()
            form.set(file.name, file, file.name)

            fetch(urls.ambarWebApiPostFile(file.name), {
                method: 'POST',
                body: form._asNative(),
                mode: 'cors',
                credentials: 'include'
            }).then((resp) => {
                if (resp.status >= 400) {
                    throw resp
                }
                else { resolve() }
            })
                .catch((errorPayload) => reject(errorPayload))
        }))

        Promise.all(uploadPromises)
            .then((values) => {
                dispatch(filesUploading(false))
                dispatch(toggleUploadModal())
                dispatch(cleanFilesToUpload())
                dispatch(showInfo('Files succesfully uploaded'))
            })
            .catch((errorPayload) => {
                dispatch(filesUploading(false))

                if (errorPayload.status === 507) {
                    dispatch(handleError('No free space left in your account', true))
                } else {
                    dispatch(handleError(errorPayload))
                }

                console.error('uploadFile', errorPayload)
            })
    }
}

export const toggleUploadModal = () => {
    return {
        type: TOGGLE_UPLOAD_MODAL
    }
}

export const addFilesToUpload = (files) => {
    return {
        type: ADD_FILES_TO_UPLOAD,
        files: files
    }
}

export const removeFileToUpload = (file) => {
    return {
        type: REMOVE_FILE_TO_UPLOAD,
        file: file
    }
}

export const filesUploading = (isUploading) => {
    return {
        type: FILES_UPLOADING,
        isUploading: isUploading
    }
}

export const cleanFilesToUpload = () => {
    return {
        type: CLEAN_FILES_TO_UPLOAD
    }
}

export const ACTION_HANDLERS = {
    [TOGGLE_UPLOAD_MODAL]: (state, action) => {
        const newState = { ...state, isUploadModalOpen: !state.isUploadModalOpen }
        return newState
    },
    [ADD_FILES_TO_UPLOAD]: (state, action) => {
        const newState = { ...state, filesToUpload: [...state.filesToUpload, ...action.files] }
        return newState
    },
    [REMOVE_FILE_TO_UPLOAD]: (state, action) => {
        const newState = { ...state, filesToUpload: state.filesToUpload.filter(f => f !== action.file) }
        return newState
    },
    [FILES_UPLOADING]: (state, action) => {
        const newState = { ...state, isFilesUploading: action.isUploading }
        return newState
    },
    [CLEAN_FILES_TO_UPLOAD]: (state, action) => {
        const newState = { ...state, filesToUpload: [] }
        return newState
    }
}