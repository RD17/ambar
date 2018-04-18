import React, { Component } from 'react'
import classes from './HighlightedSpan.scss'

const HighlightedSpan = ({children, isHighlighted, isClickable = false, ...otherProps}) => {
    const classNames = `${isHighlighted ? classes.highlighted : '' } ${isClickable ? classes.clickable : ''}`
    return <span className={classNames} {...otherProps}>{children}</span>    
}

HighlightedSpan.propTypes = {
    children: React.PropTypes.any,
    isHighlighted: React.PropTypes.bool.isRequired,
    isClickable: React.PropTypes.bool
}

export default HighlightedSpan