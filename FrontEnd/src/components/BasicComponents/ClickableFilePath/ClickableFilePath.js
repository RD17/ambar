import React, { Component } from 'react'
import classes from './ClickableFilePath.scss'

const ClickableFilePath = (props) => {
    const { meta, performSearchByPathToFile } = props

    const fullPath = meta.full_name

    const fullPathParts = fullPath.split('/')
        .filter(part => part != '')
    const fullPathPartsExtended = fullPathParts
        .map((part, idx) => {
            const isLast = idx === fullPathParts.length - 1
            const trailingSymbol = isLast ? '' : '/'
            const trailingAsterisk = '*'
            
            return {
                part: `${part}${trailingSymbol}`,
                pathToPart: `//${fullPathParts.filter((part, innerIdx) => innerIdx <= idx).join('/')}${trailingAsterisk}`
            }
        })

    const isHighlighted = meta.highlight && meta.highlight.full_name

    return (
        <div>
            <div className={isHighlighted ? classes.metaFullNameLineContainerHighlighted : classes.metaFullNameLineContainer}>
                <span>//</span>
                {fullPathPartsExtended.map((part, idx) => <span
                    className={classes.metaFullNamePart}
                    key={idx}
                    onTouchTap={() => performSearchByPathToFile(part.pathToPart)}>
                    {part.part}
                </span>)}            
            </div>            
        </div>
    )
}

ClickableFilePath.propTypes = {
    meta: React.PropTypes.object.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired
}

export default ClickableFilePath




