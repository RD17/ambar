import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import classes from './NotificationIndicator.scss'

export const NotificationIndicator = ({close, isOpen, message, reason}) => {
    const ERROR_COLOR = '#FF3333'
    const INFO_COLOR = '#8BC34A'

    const isError = reason === 'error'
    const textColor = isError ? ERROR_COLOR : INFO_COLOR
    
    return (<Snackbar
        open={isOpen}
        message={message}                
        onRequestClose={ () => close() }
        contentStyle={{ color: textColor, fontWeight: '600', display: 'flex', justifyContent: 'center', userSelect: 'none', cursor: 'default' }}
    />)
}

NotificationIndicator.propTypes = {
    close: React.PropTypes.func.isRequired,
    message: React.PropTypes.string.isRequired,
    isOpen: React.PropTypes.bool.isRequired,    
    reason:  React.PropTypes.string
}
export default NotificationIndicator
