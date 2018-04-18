import { connect } from 'react-redux'

import {
  toggleImagePreview
} from '../modules/ImagePreview'

import ImagePreview from 'components/Search/components/ImagePreview'

const mapDispatchToProps = {
    toggle: toggleImagePreview
}

const mapStateToProps = (state, ownProps) => {
  return ({ 
    visible: state['searchPage'].isImagePreviewOpen,
    imageUrl: state['searchPage'].imagePreviewUrl
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagePreview)