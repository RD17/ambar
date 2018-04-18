import React, { Component } from 'react'
import { constants } from 'utils'
import FolderViewContainer from 'routes/SearchPage/containers/FolderViewContainer'
import TableViewContainer from 'routes/SearchPage/containers/TableViewContainer'
import DetailedViewContainer from 'routes/SearchPage/containers/DetailedViewContainer'
import StatisticsViewContainer from 'routes/SearchPage/containers/StatisticsViewContainer'

import classes from './SearchResults.scss'

class SearchResults extends Component {

    getView(searchView) {
        switch (searchView) {
            case constants.TABLE_VIEW:
                return <TableViewContainer />
            case constants.FOLDER_VIEW:
                return <FolderViewContainer />
            case constants.DETAILED_VIEW:
                return <DetailedViewContainer />
            case constants.STATISTICS_VIEW:
                return <StatisticsViewContainer />
            default:
                return <DetailedViewContainer />
        }
    }

    render() {
        const {
            searchView,
            hits,
            folderHits,
            searchQuery,
            performSearchByQuery,
            localization
        } = this.props

        return this.getView(searchView)       
    }
}

SearchResults.propTypes = {
    searchView: React.PropTypes.string.isRequired
}

export default SearchResults
