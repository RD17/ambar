import React, { Component } from 'react'
import { FullScreenLoader, NotificationIndicator } from 'components/BasicComponents'
import classes from './CoreLayout.scss'
import '../../../node_modules/@blueprintjs/core/dist/blueprint.css'
import '../../styles/core.scss'

class CoreLayout extends Component {
  componentDidMount() {
    const { loadConfig } = this.props
    loadConfig()
  }

  render() {
    const {
      children,
      fetching,
      isError,
      errorMessage,
      setPageTitle,
      isNotificationOpen,
      notificationMessage,
      notificationReason,
      closeNotification } = this.props

    return (
      <div style={{height: '100%'}}>
        {fetching && <FullScreenLoader />}
        {!fetching && React.cloneElement(this.props.children, { setPageTitle: setPageTitle })}
        <NotificationIndicator
          isOpen={isNotificationOpen}
          message={!notificationMessage ? '' : notificationMessage}
          reason={notificationReason}
          close={() => closeNotification()}
        />
      </div>)
  }
}

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
  loadConfig: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool.isRequired,
  isNotificationOpen: React.PropTypes.bool.isRequired,
  notificationMessage: React.PropTypes.string,
  notificationReason: React.PropTypes.string,
  closeNotification: React.PropTypes.func.isRequired
}

export default CoreLayout
