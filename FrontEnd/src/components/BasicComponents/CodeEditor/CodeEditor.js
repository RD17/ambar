import React, { Component } from 'react'
import classes from './CodeEditor.scss'

import brace from 'brace'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/monokai'

const CodeEditor = (props) => {
    const { uId, value, onChange, readOnly, systemMessage } = props
    return (
        <div>
            <AceEditor
                mode="javascript"
                theme="monokai"
                onChange={onChange}
                name={uId}
                readOnly={readOnly}
                value={value}
                width='100%'
                heigth= '100%'
                fontSize={14}
                wrapEnabled={true}
                showPrintMargin={false}
                />
            <p className={classes.codeEditorSystemMessage}>{systemMessage}</p>
        </div>
    )
}

CodeEditor.propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool.isRequired,
    systemMessage: React.PropTypes.string
}

export default CodeEditor