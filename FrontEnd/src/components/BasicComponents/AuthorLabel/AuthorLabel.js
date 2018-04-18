import React, { Component } from 'react'
import HighlightedSpan from '../HighlightedSpan'

import classes from './AuthorLabel.scss'

const AuthorLabel = ({ content, performSearchByAuthor, ...otherProps }) => {
    const authorHighlighted = content.highlight && content.highlight.author ? true : false

    return (
        <HighlightedSpan
            onTouchTap={() => performSearchByAuthor(`${content.author}*`)}
            isClickable={true}
            isHighlighted={authorHighlighted}
            {...otherProps}>
            {content.author}
        </HighlightedSpan>
    )
}

AuthorLabel.propTypes = {
    content: React.PropTypes.object.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired
}

export default AuthorLabel