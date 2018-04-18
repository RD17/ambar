import { injectReducer } from '../../store/reducers'
import MainLayout from './containers/MainLayoutContainer'
import reducer from './modules/MainLayout'

export default (store) => {
      injectReducer(store, { key: 'global', reducer })
      return MainLayout
}