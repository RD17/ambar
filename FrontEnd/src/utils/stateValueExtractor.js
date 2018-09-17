import urls from './urls.js'

export const getUrls = (state) => state['core'].urls 
export const getLocalization = (state) => {
    const lang = state['core'].lang
    const defaultLang = 'en'

    return state['core'].localizations[lang]
        ? state['core'].localizations[lang] 
        : state['core'].localizations[defaultLang]
}

export const getDefaultSettings = () => {
    return {
        mode: 'cors',
        credentials: 'include',        
        cache: 'no-cache',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }
}