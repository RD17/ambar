import React from 'react'
import classes from './AppBarTitle.scss'

export const AppBarTitle = ({data, fetching, currentApplicationState  }) => {
    return (
    <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ display: 'flex', flexGrow: '1', cursor: 'default', select: 'none' }}>
            {data.left ? data.left(currentApplicationState) : <div />}                        
        </div>
        {data.center ? data.center(currentApplicationState) : <div />}        
        <div style={{ display: 'flex', flexGrow: '1', alignItems: 'center', justifyContent: 'space-between', lineHeight: '36px' }}>
            {data.right ? data.right(currentApplicationState) : <div />}                        
        </div>
    </div>
)}

AppBarTitle.propTypes = {
    fetching: React.PropTypes.bool.isRequired,
    data: React.PropTypes.object.isRequired,
    currentApplicationState: React.PropTypes.object.isRequired
}

export default AppBarTitle
