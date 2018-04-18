import { injectReducer } from '../../store/reducers'

export default (store) => ({    
  path: 'settings',
  getComponent (nextState, cb) {   
    require.ensure([], (require) => {    
      const settingsPage = require('./containers/SettingsPageContainer').default
      const reducer = require('./modules/SettingsPage').default
      injectReducer(store, { key: 'settingsPage', reducer })
      cb(null, settingsPage)
    }, 'settingsPage')
  }
})