import React from 'react'
import classes from './LogView.scss'

const red600 = '#E53935'
const lightGreen600 = '#7CB342'
const lime600 = '#C0CA33'

const LogView = ({log, style}) => (
    <div className={classes.logFrame} style={style}>
        {log.records.map((record, idx) => {
            const logRecordColor = record.type === 'info' 
                ? lime600
                : record.type === 'error' 
                    ? red600
                    : lightGreen600

            return (
                <p key={idx} style={{color: logRecordColor, lineHeight: '20px'}}>{record.created_datetime}: [{record.source_id}] [{record.type}] {record.message}</p>    
            )
        })}     
        <p>
            <span className='blink'>.</span>
        </p>
    </div>
)

LogView.propTypes = {
    log: React.PropTypes.object.isRequired
}

export default LogView