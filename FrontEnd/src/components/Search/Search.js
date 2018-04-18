import React, { Component } from 'react'
import { titles } from 'utils/'

import { SearchResults, ImagePreview,  SearchInput, SideMenu } from './components'
import { InfiniteScroll } from 'components/BasicComponents'
import UploadContainer from 'routes/SearchPage/containers/UploadModalContainer'
import ImagePreviewContainer from 'routes/SearchPage/containers/ImagePreviewContainer'

import { cyan100, cyan300, cyan400 } from 'material-ui/styles/colors'
import MoreHoriz from 'material-ui/svg-icons/navigation/more-horiz'
import MediaQuery from 'react-responsive'
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'

import Dialog from 'material-ui/Dialog'

import classes from './Search.scss'

const Desktop = ({ children }) => <MediaQuery query='(min-width: 1024px)' children={children} />

class Search extends Component {

    timeoutId = null

    componentDidMount() {
        const { setPageTitle, setAppHeader, loadTags, search, searchQuery, setQueryFromGetParam, setQuery, localization } = this.props

        setPageTitle(localization.searchPage.pageTitle)
        setAppHeader({
            left: () => <Desktop>{localization.searchPage.pageTitle}</Desktop>,
            center: (state) => {
                return (
                    <SearchInput
                        setQuery={setQuery}
                        query={state['searchPage'].searchQuery}
                        search={search}
                        localization={localization}
                    />)
            }
        })
        loadTags()
        setQueryFromGetParam()
    }

    componentWillUnmount() {
        const { cleanUpSearchResult } = this.props
        cleanUpSearchResult()
    }

    render() {
        const {
            search,
            searchView,
            fetching,
            searchQuery,
            hasMore,
            scrolledDown,
            setScrolledDown,
            setPageTitle,
            currentPage,
            mode,
            toggleUploadModal,
            setAppHeader,
            performSearchByQuery,
            performSearchBySize,
            performSearchByWhen,
            performSearchByShow,
            performSearchByTag,
            setSearchResultView,
            allTags,
            localization
         } = this.props

        return (
            <div style={{ height: '100%' }}>
                <Desktop>
                    <div style={{
                        position: 'fixed',
                        width: '200px',
                        height: '100%',
                        left: 0,
                        right: 0,
                        boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)',
                        padding: '0'
                    }}>
                        <SideMenu
                            performSearchByQuery={performSearchByQuery}
                            performSearchBySize={performSearchBySize}
                            performSearchByWhen={performSearchByWhen}
                            performSearchByShow={performSearchByShow}
                            performSearchByTag={performSearchByTag}
                            toggleUploadModal={toggleUploadModal}
                            setSearchResultView={setSearchResultView}
                            searchView={searchView}
                            allTags={allTags}
                            localization={localization}
                        />
                    </div>
                </Desktop>
                <MediaQuery query='(min-width: 1024px)'>
                    {
                        (matches) => {
                            return (<div style={{ marginLeft: matches ? '200px' : '0', height: '100%', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.05)' }}
                                ref={(container) => { this.containerNode = container }}>
                                <SearchResults searchView={searchView} />
                                {this.containerNode && <InfiniteScroll
                                    anchorEl={this.containerNode}
                                    currentPage={currentPage}
                                    threshold={100}
                                    loadMore={(newPage) => {
                                        search(newPage, searchQuery)
                                    }}
                                    hasMore={hasMore}
                                    onScrollDown={(isFirstPage) => setScrolledDown(!isFirstPage)}
                                />}
                            </div>)
                        }
                    }
                </MediaQuery>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', position: 'fixed', bottom: '10%', right: '30px', zIndex: '990' }}>
                        <FloatingActionButton
                            zDepth={4}
                            onTouchTap={() => { this.containerNode.scrollTop = 0 }}
                            className={scrolledDown ? '' : 'hiddenWithAnimation'}>
                            <ArrowUpward />
                        </FloatingActionButton>
                    </div>
                </div>
                <UploadContainer />
                <ImagePreviewContainer />
            </div>
        )
    }
}

Search.propTypes = {
    searchView: React.PropTypes.string.isRequired,
    setPageTitle: React.PropTypes.func.isRequired,

    setScrolledDown: React.PropTypes.func.isRequired,
    scrolledDown: React.PropTypes.bool.isRequired,

    fetching: React.PropTypes.bool.isRequired,

    currentPage: React.PropTypes.number.isRequired,
    hasMore: React.PropTypes.bool.isRequired,

    searchQuery: React.PropTypes.string.isRequired,

    loadTags: React.PropTypes.func.isRequired,
    allTags: React.PropTypes.array.isRequired,

    toggleUploadModal: React.PropTypes.func.isRequired,

    setQuery: React.PropTypes.func.isRequired,
    search: React.PropTypes.func.isRequired,
    performSearchByQuery: React.PropTypes.func.isRequired,
    performSearchBySize: React.PropTypes.func.isRequired,
    performSearchByWhen: React.PropTypes.func.isRequired,
    performSearchByShow: React.PropTypes.func.isRequired,
    performSearchByTag: React.PropTypes.func.isRequired,

    setSearchResultView: React.PropTypes.func.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default Search