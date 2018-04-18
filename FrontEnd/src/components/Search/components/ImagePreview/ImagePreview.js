import React, { Component } from 'react'
import classes from './ImagePreview.scss'

const ImagePreview = (props) => {
    const { toggle, imageUrl, visible } = props

    const className = visible ? 'imagePreviewOverlayDiv' : 'imagePreviewOverlayDiv invisible'

    if (visible) {
        return (
            <div className={className}
                onTouchTap={() => toggle()}>
                <img className={classes.imagePreview} src={imageUrl} />
            </div>
        )
    }

    return (<div></div>)
}

ImagePreview.propTypes = {
    visible: React.PropTypes.bool.isRequired,
    imageUrl: React.PropTypes.string.isRequired,
    toggle: React.PropTypes.func.isRequired
}

export default ImagePreview