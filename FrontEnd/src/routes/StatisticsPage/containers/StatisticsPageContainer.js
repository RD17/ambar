import { connect } from 'react-redux'
import { loadStatistics } from '../modules/StatisticsPage'
import { stateValueExtractor } from 'utils/'
import Statistics from 'components/Statistics'

const mapDispatchToProps = {    
    loadStatistics    
}

const mapStateToProps = (state) => {
  return ({   
    fetching: state['statisticsPage'].fetching,
    data: state['statisticsPage'].data,
    localization: stateValueExtractor.getLocalization(state)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics)