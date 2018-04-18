import React from 'react'
import ReactDOM from 'react-dom'
import deepEqual from 'deep-equal'
import { bindMethods } from './bindMethods.js'

export default class InfiniteScroll extends React.Component {
  constructor(props) {
    super(props)
    bindMethods(this, ['scrollListener', 'attachScrollListener', 'detachScrollListener'])
  }

  componentDidMount() {
    this.attachScrollListener()
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props.children, nextProps.children)
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  render() {    
    return null
  }

  safeCallOnScrollDown(isFirstPage) {
    if (this.props.onScrollDown) {
        this.props.onScrollDown(isFirstPage)
      }
  }

  scrollListener() {
    const { hasMore, currentPage, anchorEl, threshold, loadMore } = this.props
    let el = anchorEl

    this.safeCallOnScrollDown(el.scrollTop < el.offsetHeight * 0.75)

    if (el.scrollHeight > 0 && (el.scrollHeight - el.scrollTop - el.offsetHeight < threshold)) {
      { hasMore && loadMore(currentPage + 1) }
    }
  }

  attachScrollListener() {
    const el = this.props.anchorEl

    el.addEventListener('scroll', this.scrollListener)
    el.addEventListener('resize', this.scrollListener)
    this.scrollListener()
  }

  detachScrollListener() {
    const el = this.props.anchorEl

    el.removeEventListener('scroll', this.scrollListener)
    el.removeEventListener('resize', this.scrollListener)
  }
}

InfiniteScroll.defaultProps = {
  currentPage: 0,
  hasMore: true,
  threshold: 250
}

InfiniteScroll.PropTypes = {
  currentPage: React.PropTypes.number.isRequired,
  hasMore: React.PropTypes.bool,
  loadMore: React.PropTypes.func.isRequired,
  threshold: React.PropTypes.number,
  onScrollDown: React.PropTypes.func,
  anchorEl: React.PropTypes.object.isRequired
}