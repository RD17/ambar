import React, { Component } from 'react'
import classes from './TagWithCount.scss'

const DEFAULT_ON_CLICK = () => { }

const TagWithCount = ({ label, count, labelColor = '#c6e6be' , containerClasses = '', labelClasses = '', countClasses = '', onClick = DEFAULT_ON_CLICK, ...otherProps }) => {
    return (
        <span onClick={onClick} className={`${classes.tagContainer} ${containerClasses}`} title={label} {...otherProps}  >
            <span style={{backgroundColor: labelColor}} className={`${classes.tagLabel} ${labelClasses}`}>{label}</span>
            <span className={`${classes.tagCount} ${countClasses}`}>{count}</span>
        </span>
    )
}

TagWithCount.propTypes = {
    label: React.PropTypes.string.isRequired,
    count: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
    labelColor: React.PropTypes.string,
    containerClasses: React.PropTypes.string,
    labelClasses: React.PropTypes.string,
    countClasses: React.PropTypes.string
}

export default TagWithCount

