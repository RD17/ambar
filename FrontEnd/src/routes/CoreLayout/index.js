import { injectReducer } from '../../store/reducers'
import CoreLayout from './containers/CoreLayoutContainer'
import reducer from './modules/CoreLayout'

export default (store) => {
      injectReducer(store, { key: 'core', reducer })
      return CoreLayout
}