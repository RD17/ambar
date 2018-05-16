import React, { Component } from 'react'
import { LoadingIndicator, TagsInput } from 'components/BasicComponents'

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import MediaQuery from 'react-responsive'
import Paper from 'material-ui/Paper'
import { Divider, FlatButton } from 'material-ui'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import UndoIcon from 'material-ui/svg-icons/content/undo'
import DetailedCardHeader from './components/DetailedCardHeader'
import { files } from 'utils/'

import classes from './DetailedCard.scss'

class DetailedCard extends Component {
    startLoadingHighlight() {
        const { searchQuery, hit: { file_id: fileId }, loadHighlight } = this.props
        loadHighlight(fileId, searchQuery)
    }

    render() {
        const {
            hit: {
                fetching: fetching,
            meta: meta,
            content: content,
            sha256: sha256,
            tags: tags,
            file_id: fileId,
            isHidden: isHidden,
            hidden_mark: hidden_mark
            },
            allTags,
            thumbnailUri,
            downloadUri,
            searchQuery,
            loadHighlight,
            performSearchByAuthor,
            performSearchByPathToFile,
            toggleImagePreview,
            addTagToFile,
            removeTagFromFile,
            performSearchByTag,
            hideFile,
            showFile,
            localization,
            preserveOriginals
        } = this.props

        const contentHighlight = content && content.highlight && content.highlight.text ? content.highlight.text : undefined

        return (
            <Paper zDepth={1} className={classes.searchResultRowCard}>
                <Card>
                    <DetailedCardHeader
                        searchQuery={searchQuery}
                        meta={meta}
                        content={content}
                        performSearchByPathToFile={performSearchByPathToFile}
                        performSearchByAuthor={performSearchByAuthor}
                        localization={localization}
                    />
                    {!isHidden && <div>
                        <TagsInput
                            tags={tags}
                            onAddTag={(tagType, tagName) => addTagToFile(fileId, tagType, tagName)}
                            onRemoveTag={(tagType, tagName) => removeTagFromFile(fileId, tagType, tagName)}
                            performSearchByTag={performSearchByTag}
                            suggestions={allTags.map(t => t.name)}
                        />
                        <div className={classes.searchResultRowCardTextContainer}>
                            <div className={classes.searchResultRowCardTextDiv}>
                                {fetching && <CardText>
                                    <LoadingIndicator />
                                </CardText>
                                }
                                {!fetching && !contentHighlight &&
                                    <CardText onMouseEnter={() => this.startLoadingHighlight()}>
                                        <span className={classes.blurred}>Если у общества нет цветовой дифференциации штанов - то у общества</span><br />
                                        <span className={classes.blurred}>нет цели, а если нет цели - то...</span>
                                    </CardText>
                                }
                                {!fetching && contentHighlight && contentHighlight.map((hl, idx) =>
                                    <CardText key={idx}
                                        className={idx != contentHighlight.length - 1 ? classes.searchResultRowCardTextWithBorder : undefined}
                                        dangerouslySetInnerHTML={{ __html: hl }}
                                    />)
                                }
                            </div>
                            {!fetching && contentHighlight && content.thumb_available &&
                                <MediaQuery query='(min-width: 1024px)'>
                                    <div className={classes.searchResultRowCardTextThumbnailContainer} >
                                        <img onTouchTap={() => { toggleImagePreview(thumbnailUri) }}
                                            className={classes.searchResultRowCardTextThumbnailImage}
                                            src={thumbnailUri} />
                                    </div>
                                </MediaQuery>
                            }
                        </div>
                    </div>}
                    <CardActions className={classes.searchResultRowCardFooter}>
                        <div style={{ display: 'flex', justifyContent: !isHidden ? 'space-between' : 'flex-end', width: '100%' }}>
                            {!isHidden && !hidden_mark && meta.source_id != 'ui-upload' && !meta.extra.some(item => item.key === 'from_container') && <div>
                                <FlatButton
                                    icon={<FileDownloadIcon />}
                                    label={localization.searchPage.downloadLabel}
                                    title={localization.searchPage.downloadDescriptionLabel}
                                    primary={true}
                                    onTouchTap={() => { window.open(downloadUri) }}
                                />                                                  
                            </div>}
                            <div>
                                {!hidden_mark && <FlatButton
                                    icon={<DeleteIcon />}
                                    secondary={true}
                                    label={localization.searchPage.removeLabel}
                                    title={localization.searchPage.removeDescriptionLabel}
                                    style={{ color: 'grey' }}
                                    onTouchTap={() => hideFile(fileId)}
                                />}                                
                            </div>
                        </div>}
                    </CardActions>
                </Card>
            </Paper>
        )
    }
}


DetailedCard.propTypes = {
    hit: React.PropTypes.object.isRequired,
    allTags: React.PropTypes.array.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    thumbnailUri: React.PropTypes.string.isRequired,
    downloadUri: React.PropTypes.string.isRequired,
    loadHighlight: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    toggleImagePreview: React.PropTypes.func.isRequired,
    addTagToFile: React.PropTypes.func.isRequired,
    removeTagFromFile: React.PropTypes.func.isRequired,
    performSearchByTag: React.PropTypes.func.isRequired,
    hideFile: React.PropTypes.func.isRequired,
    showFile: React.PropTypes.func.isRequired,
    localization: React.PropTypes.object.isRequired,
    preserveOriginals: React.PropTypes.bool.isRequired
}

export default DetailedCard




