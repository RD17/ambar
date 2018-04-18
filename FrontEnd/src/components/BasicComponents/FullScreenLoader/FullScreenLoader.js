import React from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import FullScreenPattern from '../FullScreenPattern'
import classes from './FullScreenLoader.scss'

export const FullScreenLoader = (props) =>
    <FullScreenPattern>
        <CircularProgress color='white' size={120} thickness={5} />
    </FullScreenPattern>

export default FullScreenLoader
