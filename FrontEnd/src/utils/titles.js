import analytics from './analytics'

export const setPageTitle = (title) => { 
    document.title = title
    analytics().register({ title: title })
    analytics().event('LOCATION_CHANGED')
 }