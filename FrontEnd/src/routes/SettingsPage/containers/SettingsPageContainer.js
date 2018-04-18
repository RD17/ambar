import { connect } from 'react-redux'
import { stateValueExtractor } from 'utils/'
import {
  loadPipelineLog,
  setSettingsModalOpen,
} from '../modules/SettingsPage'

import Settings from 'components/Settings'

const mapDispatchToProps = {
  loadPipelineLog,
  setSettingsModalOpen,
}

const mapStateToProps = (state) => {
  return ({
    fetching: state['global'].fetching,    
    pipeline: state['settingsPage'].pipeline,
    localization: stateValueExtractor.getLocalization(state)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)