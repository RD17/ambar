import React, { Component } from 'react'
import { files } from 'utils/'
import HighlightedSpan from '../HighlightedSpan'

import classes from './FileSizeLabel.scss'

const FileSizeLabel = ({ content, searchQuery, ...otherProps }) => {
    const SIZE_QUERY = /((^|\s)size(>|<)[=]{0,1})([0-9]*)([k|m]{0,1})/im

    const sizeHighlighted = content.size ? SIZE_QUERY.test(searchQuery) : false
    const size = content.size

    return (
        <HighlightedSpan isHighlighted={sizeHighlighted} {...otherProps}>{files.formatFileSize(size)}</HighlightedSpan>
    )
}

FileSizeLabel.propTypes = {
    content: React.PropTypes.object.isRequired,
    searchQuery: React.PropTypes.string.isRequired
}

export default FileSizeLabel