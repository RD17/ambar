import MainLayout from './MainLayout'
import CoreLayout from './CoreLayout'

import SearchPage from './SearchPage'
import SettingsPage from './SettingsPage'
import StatisticsPage from './StatisticsPage'

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout(store),
  childRoutes: [
    {
      component: MainLayout(store),
      indexRoute: SearchPage(store),
      childRoutes: [
        SettingsPage(store),
        StatisticsPage(store)
      ]
    }
  ]
})

export default createRoutes
