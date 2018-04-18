import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import SearchIcon from 'material-ui/svg-icons/action/search'
import MediaQuery from 'react-responsive'
import classes from './SearchInput.scss'

class SearchInput extends Component {
    static timeoutId = null

    componentDidMount() {
        this.refs.search_input.focus()
    }

    shouldComponentUpdate(nextProp) {
        return this.props.query !== nextProp.query
    }

    render() {
        const { search, setQuery, query, localization } = this.props

        const hintText = <span>
            <MediaQuery query='(min-width: 1024px)'>{localization.searchPage.searchInputHintLabel}</MediaQuery>
            <MediaQuery query='(max-width: 1023px)'>{localization.searchPage.pageTitle}</MediaQuery>
        </span>

        return (
            <div
                style={{ display: 'flex', justifyContent: 'flex-start', flexGrow: '2', margin: '15px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '3px' }}
                ref={(container) => this.search_container = container}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '15px', marginRight: '3px' }}>
                    <SearchIcon style={{ color: 'white', height: '100%' }} onTouchTap={() => search(0, query)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }} >
                    <TextField                        
                        ref='search_input'
                        name='search_input'
                        fullWidth={true}
                        style={{ width: '100%' }}
                        inputStyle={{ color: 'white', width: '100%' }}
                        hintStyle={{ color: '#EEEEEE' }}
                        hintText={hintText}
                        spellCheck={false}
                        value={query}                        
                        onKeyPress={(event) => {
                            if (event.charCode === 13) {
                                search(0, query)
                                return
                            }
                        }}
                        onKeyDown={(event) => {
                            clearTimeout(this.timeoutId)
                        }}
                        onChange={(event, newValue) => {
                            clearTimeout(this.timeoutId)
                            setQuery(newValue)

                            this.timeoutId = setTimeout(() => {
                                search(0, newValue)
                            }, 500)
                        }}                        
                        underlineShow={false}                                                      
                    />
                </div>
            </div>
        )
    }
}

SearchInput.propTypes = {
    query: React.PropTypes.string.isRequired,
    search: React.PropTypes.func.isRequired,
    setQuery: React.PropTypes.func.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default SearchInput