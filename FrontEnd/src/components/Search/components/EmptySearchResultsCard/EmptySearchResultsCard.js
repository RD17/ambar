import React, { Component } from 'react'
import HintCard from '../HintCard'
import classes from './EmptySearchResultsCard.scss'

class EmptySearchResultsCard extends Component {
    render() {
        const { searchQuery, performSearchByQuery, localization } = this.props

        if (searchQuery != '') {
            return (<div className='pageContainer'>
                <HintCard
                    title={localization.searchPage.nothingFoundLabel}
                    description={<span><i>{searchQuery}</i>&nbsp;-&nbsp;{localization.searchPage.nothingFoundDescriptionLabel}</span>}
                    performSearchByQuery={performSearchByQuery}
                    localization={localization}
                />
            </div>)
        }

        return (<div className='pageContainer'>
            <HintCard
                title={localization.searchPage.searchTipsLabel}
                description={<span>{localization.searchPage.searchTipsDescriptionLabel}</span>}
                performSearchByQuery={performSearchByQuery}
                localization={localization}
            />
        </div>)
    }
}

EmptySearchResultsCard.propTypes = {
    searchQuery: React.PropTypes.string.isRequired,
    performSearchByQuery: React.PropTypes.func.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default EmptySearchResultsCard
