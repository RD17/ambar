const init = (apiHost) => {

    return {
        apiHost: apiHost,
        ambarWebApiSearchByStringQuery: (query, page, size) => `${apiHost}/api/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`,
        ambarWebApiLoadContentHightlight: (fileId, query) => `${apiHost}/api/search/${fileId}/?query=${encodeURIComponent(query)}`,
        ambarWebApiLoadFullContentHightlight: (fileId, query) => `${apiHost}/api/search/${fileId}/full?query=${encodeURIComponent(query)}`,
        ambarWebApiGetFile: (fullPath) => `${apiHost}/api/files/download?path=${encodeURIComponent(fullPath)}`,
        ambarWebApiGetFileText: (metaId) => `${apiHost}/api/files/${metaId}/text`,

        ambarWebApiGetCrawlers: () => `${apiHost}/api/crawlers`,
        ambarWebApiGetCrawler: (crawlerId) => `${apiHost}/api/crawlers/${crawlerId}`,
        ambarWebApiStartStopCrawler: (crawlerId, startStopCommand) => `${apiHost}/api/crawlers/${crawlerId}/${startStopCommand}`,
        ambarWebApiGetLogs: (recordsCount) => `${apiHost}/api/logs/?recordsCount=${recordsCount}`,

        ambarWebApiGetStats: () => `${apiHost}/api/stats`,
        ambarWebApiGetInfo: () => `${apiHost}/api/`,
        ambarWebApiGetSources: () => `${apiHost}/api/sources`,
        ambarWebApiPostFile: (fileName) => `${apiHost}/api/files/uiupload/${fileName}`,
        ambarWebApiGetThumbnail: (sha) => `${apiHost}/api/thumbs/${sha}`,

        ambarWebApiUserInfo: () => `${apiHost}/api/users`,

        ambarWebApiAddTagToFile: (fileId, tagType, tagName) => `${apiHost}/api/tags/${fileId}/${tagType}/${tagName}`,
        ambarWebApiDeleteTagFromFile: (fileId, tagType, tagName) => `${apiHost}/api/tags/${fileId}/${tagType}/${tagName}`,
        ambarWebApiGetAllTags: () => `${apiHost}/api/tags`,        

        ambarWebApiHideFile: (fileId) => `${apiHost}/api/files/hide/${fileId}`,
        ambarWebApiUnhideFile: (fileId) => `${apiHost}/api/files/unhide/${fileId}`,

        ambarWebApiSearchTree: (query) => `${apiHost}/api/search/tree?query=${query}`,
        ambarWebApiSearchStats: (query) => `${apiHost}/api/search/stats?query=${query}`,

        getParamsFromQuery: (query) => {
            if (!query) {
                return {};
            }

            return (/^[?#]/.test(query) ? query.slice(1) : query)
                .split('&')
                .reduce((params, param) => {
                    let [key, value] = param.split('=');
                    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                    return params;
                }, {})
        }
    }
}

export default (apiHost) => {
    if (!apiHost) {
        throw new Error('Can not initialize config. ApiHost is undefined')
    }

    return init(apiHost)
}
