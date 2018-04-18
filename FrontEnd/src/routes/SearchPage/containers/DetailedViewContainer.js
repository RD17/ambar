import { connect } from 'react-redux'
import { stateValueExtractor } from 'utils/'

import { toggleImagePreview } from '../modules/ImagePreview'
import { addTagToFile, removeTagFromFile } from '../modules/TagsReducer'
import { hideFile, showFile } from '../modules/FileVisibilityReducer'
import { loadHighlight } from '../modules/DetailedView'

import {
    performSearchByPathToFile,
    performSearchByAuthor,
    performSearchByQuery,
    performSearchByTag,
    search
} from '../modules/SearchReducer'

import DetailedView from 'components/Search/components/Views/DetailedView'

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
    showFile,
    loadHighlight
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailedView)