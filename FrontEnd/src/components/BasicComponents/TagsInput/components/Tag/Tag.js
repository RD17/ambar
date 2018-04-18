import React, { Component } from 'react'

import ClearIcon from 'material-ui/svg-icons/content/clear'
import { LoadingIndicator } from 'components/BasicComponents'
import classes from './Tag.scss'

const Tag = ({ tagName, tagType, onRemove, onClick, isHighlighted, isFetching, showRemoveIcon = true }) => {
    const onRemoveCallback = onRemove
        ? onRemove
        : () => { }

    const onClickCallback = onClick
        ? onClick
        : () => { }

    return (
        <div
            style={{ display: 'flex', alignItems: 'center' }}
            className={`${classes.tag} ${isHighlighted ? classes.highlight : tagType === 'source' ? classes.source : tagType === 'auto' ? classes.auto : ''} ${isFetching ? classes.loading : ''}`}
            onTouchTap={(e) => {
                e.stopPropagation()
                onClickCallback(tagName)
            }}>
            <span>{tagName}</span>
            {!isFetching && showRemoveIcon && <ClearIcon
                className={classes.removeTagButton}
                onTouchTap={(e) => {
                    e.stopPropagation()
                    onRemoveCallback(tagType, tagName)
                }}
                hoverColor='#FF5722'
                style={{ color: 'inherit', width: '1em', height: '1em' }}
            />}
        </div>
    )
}

Tag.propTypes = {
    tagName: React.PropTypes.string.isRequired,
    tagType: React.PropTypes.string.isRequired,
    onRemove: React.PropTypes.func,
    onClick: React.PropTypes.func,
    isHighlighted: React.PropTypes.bool,
    showRemoveIcon: React.PropTypes.bool
}

export default Tag




