import { injectReducer } from '../../store/reducers'

export default (store) => ({    
  path: 'statistics',
  getComponent (nextState, cb) {   
    require.ensure([], (require) => {    
      const statisticsPage = require('./containers/StatisticsPageContainer').default
      const reducer = require('./modules/StatisticsPage').default
      injectReducer(store, { key: 'statisticsPage', reducer })
      cb(null, statisticsPage)
    }, 'statisticsPage')
  }
})