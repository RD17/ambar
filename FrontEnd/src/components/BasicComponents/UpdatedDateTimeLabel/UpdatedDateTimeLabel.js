import React, { Component } from 'react'
import HighlightedSpan from '../HighlightedSpan'

import classes from './UpdatedDateTimeLabel.scss'

const UpdatedDateTimeLabel = ({ meta, searchQuery, formatFunc, ...otherProps }) => {
    const WHEN_QUERY = /((^|\s)when:)((today)|(yesterday)|(thisweek)|(thismonth)|(thisyear))/im

    const updatedDatetimeHighlighted = searchQuery ? WHEN_QUERY.test(searchQuery) : false
    const updatedDatetime = meta.updated_datetime
    const displayedUpdatedDateTime = updatedDatetime && formatFunc ? formatFunc(updatedDatetime) : updatedDatetime

    return (
        <HighlightedSpan isHighlighted={updatedDatetimeHighlighted} {...otherProps}>{displayedUpdatedDateTime}</HighlightedSpan>
    )
}

UpdatedDateTimeLabel.propTypes = {
    meta: React.PropTypes.object.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    formatFunc: React.PropTypes.func
}

export default UpdatedDateTimeLabel