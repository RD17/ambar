import { constants } from 'utils'
import { ACTION_HANDLERS as DetailedViewActions } from './DetailedView'
import { ACTION_HANDLERS as SearchPageActions } from './SearchPage'
import { ACTION_HANDLERS as UploadModalActions } from './UploadModal'
import { ACTION_HANDLERS as FolderViewActions } from './FolderView'
import { ACTION_HANDLERS as ImagePreviewActions } from './ImagePreview'
import { ACTION_HANDLERS as TagsReducerActions } from './TagsReducer'
import { ACTION_HANDLERS as FileVisibilityActions } from './FileVisibilityReducer'
import { ACTION_HANDLERS as SearchActions } from './SearchReducer'

const initialState = {
    searchQuery: '',
    currentPage: 0,
    hits: new Map(),
    hasMore: false,
    scrolledDown: false,
    isUploadModalOpen: false,
    filesToUpload: [],
    isFilesUploading: false,
    isImagePreviewOpen: false,
    imagePreviewUrl: '',
    searchView: constants.DETAILED_VIEW,
    tags: [],
    folderHits: [],
    stats: null
}

export default function reducer(state = initialState, action) {
    const ACTION_HANDLERS = {
        ...DetailedViewActions,
        ...SearchPageActions,
        ...UploadModalActions,
        ...FolderViewActions,
        ...ImagePreviewActions,
        ...TagsReducerActions,
        ...FileVisibilityActions,
        ...SearchActions
    }

    let handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}