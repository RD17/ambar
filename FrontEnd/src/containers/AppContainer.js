import React, { Component, PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'

class AppContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  static childContextTypes =
  {
    muiTheme: React.PropTypes.object
  }

  constructor(args) {
    try{
      injectTapEventPlugin()
    }
    catch(exc) { console.error(exc) }
    super(args)
  }

  getChildContext() {
    return {
      muiTheme: getMuiTheme()
    }
  }

  render() {
    const { history, routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={history} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer
