import { connect } from 'react-redux'
import { performSearchByQuery } from '../modules/SearchReducer'
import { stateValueExtractor } from 'utils/'
import EmptySearchResultsCardView from 'components/Search/components/EmptySearchResultsCard'

const mapDispatchToProps = {
    performSearchByQuery
}

const mapStateToProps = (state, ownProps) => {
  return ({
    searchQuery: state['searchPage'].searchQuery,
    localization: stateValueExtractor.getLocalization(state)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(EmptySearchResultsCardView)