import moment from 'moment'
import { dates, urls } from 'utils/'

const getCawlerJson = (crawler) => JSON.stringify({
    ...crawler,
}, null, 2)

const parseCrawlerFromApi = (apiResp) => ({
    settings: {
        ...apiResp,
    },
    meta: {
        fetching: false,
        state: apiResp.state,
        json: getCawlerJson(apiResp)
    },
    log: {
        fetching: false,
        records: []
    },
    displayArgs: {
        isSettingsModalOpen: false
    }
})

export const fromApi = (resp) => {
    let crawlers = new Map()
    resp.map((crawlerFromApi) => {
        const crawler = parseCrawlerFromApi(crawlerFromApi)
        crawlers.set(crawler.settings.id, crawler)
    })
    return crawlers
}

export const fromApiSingle = (resp) => parseCrawlerFromApi(resp)