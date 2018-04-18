import React from 'react'
import classes from './FullScreenPattern.scss'

export const FullScreenPattern = ({children}) =>
    <div className={classes.solidBackground}>
        {children}
    </div>

export default FullScreenPattern
