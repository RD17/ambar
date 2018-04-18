import { connect } from 'react-redux'
import { stateValueExtractor } from 'utils/'

import {
  toggleUploadModal,
  addFilesToUpload,
  removeFileToUpload,
  uploadFiles 
} from '../modules/UploadModal'

import UploadModal from 'components/Search/components/UploadFileModal'

const mapDispatchToProps = {
  toggleModal: toggleUploadModal,
  addFilesToUpload,
  removeFileToUpload,
  uploadFiles
}

const mapStateToProps = (state, ownProps) => {
  return ({ 
    fetching: state['searchPage'].isFilesUploading,
    open: state['searchPage'].isUploadModalOpen,
    filesToUpload: state['searchPage'].filesToUpload,
    localization: stateValueExtractor.getLocalization(state)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadModal)