import React, { Component } from 'react'
import moment from 'moment'
import classes from './FolderView.scss'
import EmptySearchResultsContainer from 'routes/SearchPage/containers/EmptySearchResultsContainer'

import { Intent, Icon, Button, Tree } from "@blueprintjs/core"

class FolderView extends Component {
    componentDidMount() {
        const {
            search,
            searchQuery
        } = this.props

        search(0, searchQuery)
    }

    render() {
        const {
            performSearchByPathToFile,
            searchQuery,
            localization,
            folderHits,
            toggleTreeNode,
            toggleAll,
            toggleImagePreview,
            urls
        } = this.props

        const totalHitsCount = folderHits.reduce((totalCount, hit) => totalCount + hit.hitsCount, 0)

        if (!searchQuery || !folderHits || totalHitsCount === 0) {
            return <EmptySearchResultsContainer />
        }

        const createTreeContents = (hits) => {
            return hits.map(folderHit => {
                const onSearchClick = () => folderHit.type != 'mixed' ?
                    performSearchByPathToFile(`${folderHit.path}*`) :
                    performSearchByPathToFile(`${folderHit.parentPath}*`)

                return {
                    key: folderHit.path,
                    hasCaret: folderHit.childNodes.length > 0,
                    isExpanded: folderHit.isExpanded,
                    iconName: folderHit.type == 'folder'
                        ? folderHit.isExpanded
                            ? 'pt-icon-folder-open'
                            : 'pt-icon-folder-close'
                        : folderHit.type == 'source'
                            ? 'pt-icon-database'
                            : folderHit.type == 'mixed'
                                ? 'pt-icon-more'
                                : folderHit.contentType.includes('image/')
                                    ? 'pt-icon-media'
                                    : 'document',
                    label: <div className={classes.treeNodeNameAndHitsCountContainer}>
                        {folderHit.type != 'mixed' && <span className={classes.treeNodeName}>{folderHit.name}</span>}
                        <span className={classes.treeNodeHitsCount} style={{ backgroundColor: `rgba(195, 255, 174, ${folderHit.hitsCount / totalHitsCount * 0.5 + 0.2})` }}>{folderHit.hitsCount}</span>
                        {folderHit.type !== 'file' && 
                            <Button 
                                className='pt-minimal' 
                                iconName='pt-icon-search'
                                title={localization.searchPage.performSearchByFolderLabel} 
                                onClick={onSearchClick} 
                        />}                      
                        {folderHit.type === 'file' && folderHit.thumbAvailable && 
                            <Button 
                                className='pt-minimal' 
                                iconName='pt-icon-media' 
                                title={localization.searchPage.imagePreviewLabel} 
                                onClick={() => toggleImagePreview(urls.ambarWebApiGetThumbnail(folderHit.sha256))} 
                        />}
                    </div>,
                    className: 'treeNode',
                    childNodes: createTreeContents(folderHit.childNodes)
                }
            })
        }

        const treeContents = createTreeContents(folderHits)

        return (
            <div >
                <div className={classes.folderViewButtonsContainer}>
                    <Button className='pt-minimal' iconName='pt-icon-expand-all' onClick={() => toggleAll(true)}>{localization.searchPage.expandAllLabel}</Button>
                    <Button className='pt-minimal' iconName='pt-icon-collapse-all' onClick={() => toggleAll(false)}>{localization.searchPage.collapseAllLabel}</Button>
                </div>
                <div className={classes.folderViewTreeContainer}>
                    <Tree
                        contents={treeContents}
                        onNodeCollapse={(node) => toggleTreeNode(node.key)}
                        onNodeExpand={(node) => toggleTreeNode(node.key)}
                    />
                </div>
            </div>
        )
    }
}

FolderView.propTypes = {
    folderHits: React.PropTypes.array.isRequired,
    localization: React.PropTypes.object.isRequired,
    search: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    toggleTreeNode: React.PropTypes.func.isRequired,
    toggleAll: React.PropTypes.func.isRequired,
    toggleImagePreview: React.PropTypes.func.isRequired,
    urls: React.PropTypes.object.isRequired
}

export default FolderView
