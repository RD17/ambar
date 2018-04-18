import React from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import classes from './LoadingIndicator.scss'

const LoadingIndicator = (props) => {
    const { small, medium, large, freezed = false, blurred = false, color = '#00bcd4' } = props
    const indicatorSize = (small ? 23 : (medium ? 40 : (large ? 50 : 40))) 
    const mode = freezed ? 'determinate' : 'indeterminate'
    const className = blurred ? classes.circularProgressBlurred : classes.circularProgress
    return <div className={className}>
        <CircularProgress size={indicatorSize} mode={mode} value={100} color={color} />
    </div>
}

LoadingIndicator.propTypes = {
    small: React.PropTypes.bool,
    medium: React.PropTypes.bool,
    large: React.PropTypes.bool,
    freezed: React.PropTypes.bool
}

export default LoadingIndicator
