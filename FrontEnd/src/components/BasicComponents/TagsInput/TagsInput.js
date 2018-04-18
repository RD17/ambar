import React, { Component } from 'react'

import AutosizeInput from 'react-input-autosize'
import Autosuggest from 'react-autosuggest'
import FontIcon from 'material-ui/FontIcon'

import { Tag } from './components'
import classes from './TagsInput.scss'

class TagsInput extends Component {
    constructor() {
        super()
        this.state = {
            inputValue: '',
            suggestions: []
        }
    }

    addTag(tagName) {
        if (!tagName) {
            return
        }

        const tagType = 'manual'

        if (!this.props.tags.find(t => (t.name === tagName))) {
            this.props.onAddTag(tagType, tagName)
        }

        this.setState({ ...this.state, inputValue: '' })
    }

    removeTag(tagType, tagName) {
        const currentTags = this.props.tags.map(t => t.name)
        if (!currentTags || currentTags.length === 0) {
            return
        }
        this.props.onRemoveTag(tagType, tagName)
    }

    removeLastTag() {
        const currentTags = this.props.tags
        if (!currentTags || currentTags.length === 0) {
            return
        }

        const lastTag = currentTags[currentTags.length - 1]
        if (lastTag.isFetching) {
            return
        }

        this.props.onRemoveTag(lastTag.type, lastTag.name)
    }

    onChange(value) {
        this.setState({ ...this.state, inputValue: value.trim() })
        value = value.replace(/[\s\,\;]/gim, ',')

        const newTags = value.split(',').map(t => t.trim().toLowerCase())

        if (newTags.length > 1 && newTags[0] != '') {
            this.addTag(newTags[0])
        }
    }

    onKeyPress(event) {
        if (event.charCode === 13) { // onEnter
            this.addTag(this.state.inputValue)
            return
        }
    }

    onKeyDown(event) {
        if (event.keyCode === 8) { // onBackspace            
            if (!this.state.inputValue) {
                this.removeLastTag()
                return
            }
        }
    }

    focusOnInput() {
        if (!this.refs.suggestInput) {
            return
        }
        this.refs.suggestInput.input.focus()
    }

    autosizeInput(inputProps) {
        return (
            <AutosizeInput
                minWidth={40}
                inputStyle={{
                    border: 'none',
                    backgroundImage: 'none',
                    backgroundColor: 'transparent',
                    WebkitBoxShadow: 'none',
                    MozBoxShadow: 'none',
                    boxShadow: 'none',
                    outline: 'none',
                    margin: '4px',
                    padding: '0'
                }}
                type='text'
                placeholder=''
                {...inputProps}
            />
        )
    }

    getSuggestions(value) {

        const inputValue = value.trim().toLowerCase()
        const inputLength = inputValue.length
        const suggestions = this.props.suggestions

        return inputLength === 0 ? suggestions.slice(0, 10) : suggestions.filter(suggestion =>
            suggestion.toLowerCase().slice(0, inputLength) === inputValue
        ).slice(0, 10)
    }

    onSuggestionsFetchRequested({ value }) {
        this.setState({
            suggestions: this.getSuggestions(value)
        })
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        })
    }

    render() {
        const props = this.props

        const theme = {
            container: {
                display: 'inline-block',
                position: 'relative',
                margin: '4px',
                overflow: 'visible'
            },
            inputOpen: {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0
            },
            suggestionsContainer: {
                display: 'none'
            },
            suggestionsContainerOpen: {
                display: 'block',
                position: 'absolute',
                top: 25,
                width: 120,
                backgroundColor: '#fff',
                boxShadow: '0 0 7px rgba(0, 0, 0, 0.4)',
                borderRadius: '2px',
                fontSize: 12,
                zIndex: 2
            },
            suggestionsList: {
                margin: 0,
                padding: 0,
                listStyleType: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            },
            suggestion: {
                cursor: 'pointer',
                padding: '2px 4px'
            },
            suggestionHighlighted: {
                backgroundColor: 'rgba(0, 188, 212, 0.15)'
            }
        }

        const { performSearchByTag, showRemoveIcon = true, showAddField = true, style = {} } = this.props

        return (
            <div
                style={{ padding: '5px', cursor: 'text', display: 'flex', flexWrap: 'wrap', ...style }}
                className='TAGS_CONTAINER'
                onClick={(e) => {
                    if (e.target.className == 'TAGS_CONTAINER') {
                        this.focusOnInput()
                    }
                }}>
                {this.props.tags.map((tag, idx) =>
                    <Tag
                        key={idx}
                        onRemove={(tagType, tagName) => this.removeTag(tagType, tagName)}
                        onClick={(tagName) => performSearchByTag(tagName)}
                        tagName={tag.name}
                        tagType={tag.type}
                        isHighlighted={!!tag.highlight && !!tag.highlight.name}
                        isFetching={tag.isFetching}
                        showRemoveIcon={showRemoveIcon}
                    />)
                }
                {showAddField && <Autosuggest
                    ref='suggestInput'
                    suggestions={this.state.suggestions}
                    getSuggestionValue={s => s}
                    renderSuggestion={(suggestion) => <span>{suggestion}</span>}
                    onSuggestionSelected={(e, { suggestion, suggegstionValue, suggestionIndex, sectionIndex, method }) => {
                        this.addTag(suggestion)
                    }}
                    shouldRenderSuggestions={(value) => true}
                    onSuggestionsFetchRequested={e => this.onSuggestionsFetchRequested(e)}
                    onSuggestionsClearRequested={e => this.onSuggestionsClearRequested(e)}
                    inputProps={{
                        value: this.state.inputValue,
                        onChange: (e, { newValue, method }) => this.onChange(newValue),
                        onKeyPress: (event) => this.onKeyPress(event),
                        onKeyDown: (event) => this.onKeyDown(event)
                    }}
                    theme={theme}
                    renderInputComponent={(inputProps) => this.autosizeInput(inputProps)}
                />}
            </div>
        )
    }
}

TagsInput.propTypes = {
    tags: React.PropTypes.array.isRequired,
    suggestion: React.PropTypes.array,
    onAddTag: React.PropTypes.func,
    onRemoveTag: React.PropTypes.func,
    showRemoveIcon: React.PropTypes.bool,
    showAddField: React.PropTypes.bool,
    performSearchByTag: React.PropTypes.func.isRequired,
    style: React.PropTypes.object
}

export default TagsInput




