import React, { Component } from 'react'

import EmptySearchResultsContainer from 'routes/SearchPage/containers/EmptySearchResultsContainer'
import DetailedCard from './components/DetailedCard'
import classes from './DetailedView.scss'

class DetailedView extends Component {
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
            searchQuery,
            urls            
        } = this.props

        if (!searchQuery || !hits || hits.size === 0) {
            return <EmptySearchResultsContainer />
        }

        return (
            <div className='pageContainer'>
                {Array.from(hits.values()).map((hit, idx) =>
                    <DetailedCard
                        key={hit.file_id}
                        hit={hit}
                        thumbnailUri={urls.ambarWebApiGetThumbnail(hit.sha256)}
                        downloadUri={urls.ambarWebApiGetFile(hit.meta.download_uri)}                        
                        {...this.props}
                    />
                )}
            </div>
        )
    }
}

DetailedView.propTypes = {
    hits: React.PropTypes.object.isRequired,
    search: React.PropTypes.func.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    urls: React.PropTypes.object.isRequired
}

export default DetailedView
