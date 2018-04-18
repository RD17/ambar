import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Dropzone from 'react-dropzone'
import AutoComplete from 'material-ui/AutoComplete'
import UploadIcon from 'material-ui/svg-icons/file/cloud-upload'
import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import FileIcon from 'material-ui/svg-icons/file/attachment'
import CircularProgress from 'material-ui/CircularProgress'

const UploadFileModal = (props) => {
    const { 
        open,
        fetching,
        toggleModal,
        addFilesToUpload,
        removeFileToUpload,
        filesToUpload,
        uploadFiles,
        localization 
    } = props

    const onDrop = (acceptedFiles, rejectedFiles) => addFilesToUpload(acceptedFiles)
    const isUploadButtonDisabled = fetching || filesToUpload.length === 0

    const uploadFileModalActions = [
        <FlatButton
            label={localization.uploadModal.cancelLabel}
            disabled={fetching}
            onTouchTap={toggleModal}
        />,
        <FlatButton
            label={localization.uploadModal.uploadLabel}
            secondary={true}
            keyboardFocused={!isUploadButtonDisabled}
            disabled={isUploadButtonDisabled}
            onTouchTap={() => uploadFiles()}
        />
    ]

    const uploadFrameStyle = {
        width: '100%',
        height: '150px',
        borderWidth: '2px',
        borderColor: '#BDBDBD',
        borderStyle: 'dashed',
        borderRadius: '5px',
        backgroundColor: '#E0E0E0'
    }

    const uploadFrameActiveStyle = {
        borderColor: '#00BCD4'
    }

    return (
        <Dialog
            title={localization.uploadModal.titleLabel}
            actions={uploadFileModalActions}
            modal={true}
            open={open}
            contentStyle={{
                maxWidth: '600px',
            }}
        >
            <div>
                <Dropzone
                    onDrop={onDrop}
                    style={uploadFrameStyle}
                    activeStyle={uploadFrameActiveStyle}
                    maxSize={100 * 1024 * 1024}
                    multiple={true}>
                    {!fetching && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                        <UploadIcon style={{ display: 'flex', flexGrow: 2, color: '#00BCD4', width: '100%', opacity: 0.25 }} />
                        <div style={{ marginBottom: '5px' }}>{localization.uploadModal.hintLabel}</div>
                    </div>}
                    {fetching && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress size={80} thickness={5} />
                    </div>}
                </Dropzone>
                {filesToUpload.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {filesToUpload.map((file, idx) =>
                        <Chip
                            key={idx}
                            labelStyle={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                            style={{ margin: '2px' }}
                            onRequestDelete={() => {
                                if (fetching) return
                                removeFileToUpload(file)
                            }}>
                            <Avatar color="#444" icon={<FileIcon />} />
                            {file.name}
                        </Chip>)
                    }
                </div>
                }
            </div>
        </Dialog>)
}

UploadFileModal.propTypes = {
    open: React.PropTypes.bool.isRequired,
    fetching: React.PropTypes.bool.isRequired,
    uploadFiles: React.PropTypes.func.isRequired,
    toggleModal: React.PropTypes.func.isRequired,
    addFilesToUpload: React.PropTypes.func.isRequired,
    removeFileToUpload: React.PropTypes.func.isRequired,
    filesToUpload: React.PropTypes.array.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default UploadFileModal