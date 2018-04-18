import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { List, ListItem } from 'material-ui/List'
import UploadFileIcon from 'material-ui/svg-icons/file/file-upload'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import { TagsInput } from 'components/BasicComponents'
import classes from './SideMenu.scss'
import { constants } from 'utils'

const listItemStyle = { fontSize: '15px', padding: '7px 7px 7px 23px' }
const StyledListItem = (props) => <ListItem innerDivStyle={listItemStyle} {...props} />

const SecondaryText = (props) => <div {...props} style={{ fontSize: '11px', color: '#aaaaaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />

const subHeaderStyle = { fontSize: '15px', color: '#777777', lineHeight: '20px', cursor: 'default', fontFamily: 'Roboto, sans-serif' }
const MenuLabel = ({ children, ...props }) => <Subheader {...props} style={subHeaderStyle}>{children}</Subheader>

class SideMenu extends Component {
    render() {
        const {
            performSearchByQuery,
            performSearchBySize,
            performSearchByWhen,
            performSearchByShow,
            performSearchByTag,
            toggleUploadModal,
            setSearchResultView,
            searchView,
            allTags,
            localization
        } = this.props

        return (
            <div className={classes.sideMenuContainer}>
                <RaisedButton
                    label={localization.searchPage.uploadLabel}
                    style={{ margin: '-2px 16px 16px 16px' }}
                    labelColor={'#00bcd4'}
                    backgroundColor={'#ffffff'}
                    icon={<UploadFileIcon />}
                    onTouchTap={toggleUploadModal}
                />
                <Divider style={{ marginBottom: '10px' }} />
                <MenuLabel>{localization.searchPage.viewLabel}</MenuLabel>
                <List>
                    <StyledListItem
                        primaryText={localization.searchPage.detailedViewLabel}
                        style={{ fontWeight: searchView === constants.DETAILED_VIEW ? 'bold' : 'normal' }}
                        onTouchTap={() => setSearchResultView(constants.DETAILED_VIEW)}
                    />
                    <StyledListItem
                        primaryText={localization.searchPage.tableViewLabel}
                        style={{ fontWeight: searchView === constants.TABLE_VIEW ? 'bold' : 'normal' }}
                        onTouchTap={() => setSearchResultView(constants.TABLE_VIEW)}
                    />
                    <StyledListItem
                        primaryText={localization.searchPage.folderViewLabel}
                        style={{ fontWeight: searchView === constants.FOLDER_VIEW ? 'bold' : 'normal' }}
                        onTouchTap={() => setSearchResultView(constants.FOLDER_VIEW)}
                    />
                    <StyledListItem
                        primaryText={localization.searchPage.statisticsViewLabel}
                        style={{ fontWeight: searchView === constants.STATISTICS_VIEW ? 'bold' : 'normal' }}
                        onTouchTap={() => setSearchResultView(constants.STATISTICS_VIEW)}
                    />
                </List>
                {allTags.length > 0 &&
                    <div>
                        <Divider />
                        <List>
                            <MenuLabel>{localization.searchPage.tagsLabel}</MenuLabel>
                            <TagsInput
                                tags={allTags}
                                showRemoveIcon={false}
                                showAddField={false}
                                performSearchByTag={performSearchByTag}
                                style={{ cursor: 'pointer', paddingLeft: '23px' }}
                            />
                        </List>
                    </div>}
                <Divider style={{ marginBottom: '10px' }} />
                <MenuLabel>{localization.searchPage.timeRangeLabel}</MenuLabel>
                <List>
                    <StyledListItem primaryText={localization.searchPage.todayLabel} onTouchTap={() => performSearchByWhen('today')} />
                    <StyledListItem primaryText={localization.searchPage.yesterdayLabel} onTouchTap={() => performSearchByWhen('yesterday')} />
                    <StyledListItem primaryText={localization.searchPage.thisWeekLabel} onTouchTap={() => performSearchByWhen('thisweek')} />
                    <StyledListItem primaryText={localization.searchPage.thisMonthLabel} onTouchTap={() => performSearchByWhen('thismonth')} />
                    <StyledListItem primaryText={localization.searchPage.thisYearLabel} onTouchTap={() => performSearchByWhen('thisyear')} />
                </List>

                <Divider />
                <List>
                    <MenuLabel>{localization.searchPage.trashLabel}</MenuLabel>
                    <StyledListItem
                        primaryText={localization.searchPage.removedFilesLabel}
                        onTouchTap={() => performSearchByShow('removed')}
                    />
                </List>
                <Divider />
                <List>
                    <StyledListItem
                        primaryText={localization.searchPage.clearQueryLabel}
                        onTouchTap={() => performSearchByQuery('')}
                        style={{ color: '#dd6666' }}
                    />
                </List>
            </div>
        )
    }
}

SideMenu.propTypes = {
    performSearchByQuery: React.PropTypes.func.isRequired,
    performSearchBySize: React.PropTypes.func.isRequired,
    performSearchByWhen: React.PropTypes.func.isRequired,
    performSearchByShow: React.PropTypes.func.isRequired,
    performSearchByTag: React.PropTypes.func.isRequired,
    toggleUploadModal: React.PropTypes.func.isRequired,
    setSearchResultView: React.PropTypes.func.isRequired,
    searchView: React.PropTypes.string.isRequired,
    allTags: React.PropTypes.array.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default SideMenu




