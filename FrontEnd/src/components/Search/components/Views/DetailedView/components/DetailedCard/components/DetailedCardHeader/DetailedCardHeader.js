import React, { Component } from 'react'
import { CardHeader } from 'material-ui/Card'
import { files } from 'utils/'
import moment from 'moment'
import { FileAvatar, ClickableFilePath, AuthorLabel, FileSizeLabel, UpdatedDateTimeLabel } from 'components/BasicComponents'

import classes from './DetailedCardHeader.scss'

const getHumanizedTime = (date) => {
    const start = moment.utc()
    const end = moment.utc(date)

    let diff = moment.duration(end.diff(start))
    if (Math.floor(Math.abs(diff.asDays())) > 6) {
        return end.format('DD.MM.YYYY')
    }

    return diff.humanize(true)
}

const DetailedCardHeader = (props) => {
    const { meta, content, searchQuery, performSearchByPathToFile, performSearchByAuthor, localization } = props

    const headerContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingBottom: '5px',
        fontSize: '12px',
        color: '#9E9E9E'
    }

    return (
        <div style={headerContainerStyle}>
            <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <FileAvatar meta={meta} searchFunction={performSearchByPathToFile}/>
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <span className={classes.metaShortName}>{meta.short_name}</span>
                            <span>&nbsp;&ndash;&nbsp;<FileSizeLabel content={content} searchQuery={searchQuery} /></span>
                            <ClickableFilePath
                                meta={meta}
                                performSearchByPathToFile={performSearchByPathToFile}
                            />
                            <span>
                                {content.author && <span style={{ paddingRight: '3px' }}>{localization.searchPage.byLabel}&nbsp;
                                    <AuthorLabel content={content} performSearchByAuthor={performSearchByAuthor} />
                                </span>}                                
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div>{meta.updated_datetime && <span>{localization.searchPage.lastModifiedLabel}: <UpdatedDateTimeLabel meta={meta} searchQuery={searchQuery} formatFunc={getHumanizedTime} /></span>}</div>
        </div>
    )
}

DetailedCardHeader.propTypes = {
    meta: React.PropTypes.object.isRequired,
    content: React.PropTypes.object.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default DetailedCardHeader




