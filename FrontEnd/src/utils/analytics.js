const safeCall = (func) => {
    try {
        func()
    } catch (e) {
        console.warn('Analytics error', e)
    }
}

const mixpanelAnalytics = {
    event: (name, data) => safeCall(() => mixpanel.track(name, data)),
    register: (data) => safeCall(() => mixpanel.register(data)),
    userSet: (data) => safeCall(() => mixpanel.people.set(data)),
    userIncrement: (key) => safeCall(() => mixpanel.people.increment(key, 1)),
    alias: (newId) => safeCall(() => mixpanel.alias(newId)),
    identify: (id) => safeCall(() => mixpanel.identify(id)),
    reset: () => safeCall(() => mixpanel.reset())
}

const dummyAnalytics = {
    event: (name, data) => {},
    register: (data) => { },
    userSet: (data) => { },
    userIncrement: (key) => { },
    alias: (newId) => { },
    identify: (id) => { },
    reset: () => { }
}

let analytics = dummyAnalytics

export default (token = null) => {
    if (token && token != '') {        
        mixpanel.init(token)
        analytics = mixpanelAnalytics
    }

    return analytics
}





