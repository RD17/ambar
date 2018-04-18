import { connect } from 'react-redux'
import { stateValueExtractor } from 'utils/'

import { toggleImagePreview } from '../modules/ImagePreview'
import { addTagToFile, removeTagFromFile} from '../modules/TagsReducer'
import { hideFile, showFile } from '../modules/FileVisibilityReducer'

import {
    search,
    performSearchByPathToFile,
    performSearchByAuthor,
    performSearchByQuery,
    performSearchByTag
} from '../modules/SearchReducer'

import TableView from 'components/Search/components/Views/TableView'

const mapDispatchToProps = {
    search,
    performSearchByPathToFile,
    performSearchByAuthor,
    performSearchByQuery,
    performSearchByTag,
    toggleImagePreview,
    addTagToFile,
    removeTagFromFile,
    hideFile,
    showFile
}

const mapStateToProps = (state, ownProps) => {
    return ({
        hits: state['searchPage'].hits,
        localization: stateValueExtractor.getLocalization(state),
        urls: stateValueExtractor.getUrls(state),        
        allTags: state['searchPage'].tags,
        searchQuery: state['searchPage'].searchQuery,
        preserveOriginals: state['core'].preserveOriginals
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(TableView)