import React, { Component } from 'react'
import Avatar from 'material-ui/Avatar'
import { files } from 'utils/'

import classes from './FileAvatar.scss'

const getHashCode = (str) => {
    let hash = 0;

    if (str.length == 0) {
        return hash
    }

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }

    return hash
}

const FileAvatar = ({ meta, searchFunction }) => {
    const colors = [
        '#EF5350', '#E53935', '#D81B60', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#2196F3', '#43A047', '#EF6C00', '#A1887F', '#78909C', '#FF4081', '#3949AB']

    let extension = files.getExtension(meta)

    const avatarStyle = {
        fontSize: '12px',
        textTransform: 'uppercase',
        cursor: 'pointer'
    }

    return (
        <Avatar
            className={classes.resultAvatar}
            onTouchTap={() => searchFunction(`*.${extension}`)}
            size={38}
            style={avatarStyle}
            backgroundColor={colors[getHashCode(extension) % colors.length]}>{extension}</Avatar>
    )
}

FileAvatar.propTypes = {
    meta:  React.PropTypes.object.isRequired,    
    searchFunction: React.PropTypes.func.isRequired
}

export default FileAvatar