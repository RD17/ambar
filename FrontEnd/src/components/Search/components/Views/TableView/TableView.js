import React, { Component } from 'react'
import moment from 'moment'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'

import EmptySearchResultsContainer from 'routes/SearchPage/containers/EmptySearchResultsContainer'
import TableViewRow from './components/TableRow'
import classes from './TableView.scss'

class TableView extends Component {
    componentDidMount() {
        const {
            search,
            searchQuery
        } = this.props

        search(0, searchQuery)
    }

    render() {
        const {
            hits,
            urls,
            localization,
            searchQuery                        
        } = this.props

        if (!searchQuery || !hits || hits.size === 0) {
            return <EmptySearchResultsContainer />
        }

        return (
            <Table selectable={false} bodyStyle={{ overflow: 'visible', marginBottom: '200px' }}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ width: '60px', paddingLeft: '15px', paddingRight: '5px' }}></TableHeaderColumn>
                        <TableHeaderColumn style={{ width: '35%' }}>{localization.searchPage.fileNameLabel}</TableHeaderColumn>
                        <TableHeaderColumn>{localization.searchPage.fileSizeLabel}</TableHeaderColumn>
                        <TableHeaderColumn>{localization.searchPage.tagsLabel}</TableHeaderColumn>
                        <TableHeaderColumn>{localization.searchPage.authorLabel}</TableHeaderColumn>
                        <TableHeaderColumn>{localization.searchPage.lastModifiedLabel}</TableHeaderColumn>
                        <TableHeaderColumn style={{ width: '220px' }}>{localization.searchPage.actionsLabel}</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} preScanRows={false} style={{ marginBottom: '100px' }}>
                    {Array.from(hits.values()).map((hit, idx) =>
                        <TableViewRow
                            key={hit.file_id}
                            hit={hit}
                            thumbnailUri={urls.ambarWebApiGetThumbnail(hit.sha256)}
                            downloadUri={urls.ambarWebApiGetFile(hit.meta.full_name)}
                            {...this.props}
                        />
                    )}
                </TableBody>
            </Table>
        )
    }
}

TableView.propTypes = {
    hits: React.PropTypes.object.isRequired,
    localization: React.PropTypes.object.isRequired,
    allTags: React.PropTypes.array.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    toggleImagePreview: React.PropTypes.func.isRequired,
    addTagToFile: React.PropTypes.func.isRequired,
    removeTagFromFile: React.PropTypes.func.isRequired,
    performSearchByTag: React.PropTypes.func.isRequired,
    hideFile: React.PropTypes.func.isRequired,
    showFile: React.PropTypes.func.isRequired,
    preserveOriginals: React.PropTypes.bool.isRequired,
    search: React.PropTypes.func.isRequired
}

export default TableView
