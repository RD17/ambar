import React, { Component } from 'react'
import { files } from 'utils'
import EmptySearchResultsContainer from 'routes/SearchPage/containers/EmptySearchResultsContainer'
import TagsWithCount from './components/TagWithCount'
import ExtensionsPieChart from './components/ExtensionsPieChart'
import classes from './StatisticsView.scss'

const AUTO_TAG_COLOR = '#e6c2be'
const SOURCE_TAG_COLOR = '#c6e6be'
const OTHER_TAG_COLOR = '#bedbe6'

class StatisticsView extends Component {
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
            performSearchByTag,
            searchQuery,
            localization,
            stats
        } = this.props

        if (!searchQuery || !stats || stats.total === 0 ) {
            return <EmptySearchResultsContainer />
        }

        return (
            <div className='pageContainer'>
                <div className={`${classes.statisticsContainer} pt-card pt-elevation-1`}>
                    <div className={classes.statisticsItem}>
                        <h3>{localization.searchPage.statsSummaryLabel}</h3>
                        <ul className={classes.summary}>
                            <li>{localization.searchPage.statsFilesCountLabel}:&nbsp;<b>{stats.summary.data.count}&nbsp;({files.formatFileSize(stats.summary.data.sum)})</b></li>
                            <li>{localization.searchPage.statsMinimumFileSizeLabel}:&nbsp;<b>{files.formatFileSize(stats.summary.data.min)}</b></li>
                            <li>{localization.searchPage.statsAverageFileSizeLabel}:&nbsp;<b>{files.formatFileSize(stats.summary.data.avg)}</b></li>
                            <li>{localization.searchPage.statsMaximumFileSizeLabel}:&nbsp;<b>{files.formatFileSize(stats.summary.data.max)}</b></li>
                        </ul>
                    </div>
                    <div className={classes.statisticsItem}>
                        <h3>{localization.searchPage.statsExtensionsTypesLabel}&nbsp;({stats.extensions.data.length})</h3>
                        <div className={classes.extensionsChart}>
                            <ExtensionsPieChart data={stats.extensions.data} onClick={(extensionName) => performSearchByPathToFile(`*${extensionName}`)} />
                        </div>
                    </div>
                    {stats.tags.total > 0 && <div className={classes.statisticsItem}>
                        <h3>{localization.searchPage.tagsLabel}&nbsp;({stats.tags.data.length})</h3>
                        {stats.tags.data.map((tag, id) => (
                            <TagsWithCount 
                                key={id} 
                                label={tag.name}
                                labelColor={tag.type === 'auto' ? AUTO_TAG_COLOR : tag.type === 'source' ? SOURCE_TAG_COLOR : OTHER_TAG_COLOR}
                                onClick={(() => performSearchByTag(tag.name))}
                                count={`${tag.hits_percent.toFixed(2)}%`} 
                            />
                        ))}
                    </div>}                
                </div>
            </div>
        )
    }
}

StatisticsView.propTypes = {
    stats: React.PropTypes.object,
    localization: React.PropTypes.object.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    search: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    performSearchByTag: React.PropTypes.func.isRequired
}

export default StatisticsView
