import { DateTimeService } from '../services'

const FILE_NAME_QUERY = /((^|\s)filename:)([^\s]*)/im

const SOURCE_QUERY = /((^|\s)source:)([a-zA-Z0-9\-,*]*)/im

const SIZE_GTE_QUERY = /((^|\s)size>[=]{0,1})([0-9]*)([k|m]{0,1})/im
const SIZE_LTE_QUERY = /((^|\s)size<[=]{0,1})([0-9]*)([k|m]{0,1})/im

const AUTHOR_QUERY = /((^|\s)author:)([^\s]*)/im

const WHEN_QUERY = /((^|\s)when:)((today)|(yesterday)|(thisweek)|(thismonth)|(thisyear))/im

const TAGS_QUERY = /((^|\s)tags:)([^\s]*)/im

const SHOW_QUERY = /((^|\s)show:)((removed)|(all))/im

const normalizeString = (string) => string.replace(/[\s]+/gi, ' ').trim()

const multiplySize = (size, multiplier) => {
    if (multiplier.toLowerCase() === 'k') {
        return size * 1024
    }
    if (multiplier.toLowerCase() === 'm') {
        return size * 1024 * 1024
    }
    return size
}

export const parseEsStringQuery = (query) => {
    var content = ''
    var name = ''
    var source = []
    var author = ''
    var size = { gte: null, lte: null }
    var when = { gte: null, lte: null }
    var tags = []
    
    content = normalizeString(query.replace(FILE_NAME_QUERY, '').replace(SOURCE_QUERY, '').replace(SIZE_GTE_QUERY, '').replace(SIZE_LTE_QUERY, '').replace(AUTHOR_QUERY, '').replace(WHEN_QUERY, '').replace(TAGS_QUERY, '').replace(SHOW_QUERY, ''))    

    var authorMatch = query.match(AUTHOR_QUERY)
    if (authorMatch && authorMatch[3]) {
        author = authorMatch[3]
    }

    var nameMatch = query.match(FILE_NAME_QUERY)
    if (nameMatch && nameMatch[3]) {
        name = nameMatch[3]
    }

    var sourceMatch = query.match(SOURCE_QUERY)
    if (sourceMatch && sourceMatch[3]) {
        source = sourceMatch[3].split(',')
    }

    var tagsMatch = query.match(TAGS_QUERY)
    if (tagsMatch && tagsMatch[3]) {
        tags = tagsMatch[3].split(',')
    }

    var whenMatch = query.match(WHEN_QUERY)
    if (whenMatch && whenMatch[3]) {
        switch (whenMatch[3].toLowerCase()) {
            case 'today': {
                when.gte = DateTimeService.getStartOfToday()
            } break
            case 'yesterday': {
                when.gte = DateTimeService.getStartOfYesterday()
                when.lte = DateTimeService.getStartOfToday()
            } break
            case 'thisweek': {
                when.gte = DateTimeService.getStartOfThisWeek()
            } break
            case 'thismonth': {
                when.gte = DateTimeService.getStartOfThisMonth()
            } break
            case 'thisyear': {
                when.gte = DateTimeService.getStartOfThisYear()
            } break
        }
    }

    var sizeGteMatch = query.match(SIZE_GTE_QUERY)
    if (sizeGteMatch && sizeGteMatch[3]) {
        size.gte = parseInt(sizeGteMatch[3])
        if (sizeGteMatch[4] && sizeGteMatch[4] !== '') {
            size.gte = multiplySize(size.gte, sizeGteMatch[4])
        }
    }

    var sizeLteMatch = query.match(SIZE_LTE_QUERY)
    if (sizeLteMatch && sizeLteMatch[3]) {
        size.lte = parseInt(sizeLteMatch[3])
        if (sizeLteMatch[4] && sizeLteMatch[4] !== '') {
            size.lte = multiplySize(size.lte, sizeLteMatch[4])
        }
    }

    let withoutHiddenMarkOnly = false
    let withHiddenMarkOnly = true

    var showMatch = query.match(SHOW_QUERY)
    if (showMatch && showMatch[3]) {
        switch (showMatch[3].toLowerCase()) {
            case 'all': {
                withHiddenMarkOnly = false
            } break
            case 'removed': {
                withoutHiddenMarkOnly = true
                withHiddenMarkOnly = false
            } break
        }
    }
    return {
        content: content,
        name: name,
        source: source,
        size: size,
        author: author,
        when: when,
        tags: tags,
        withoutHiddenMarkOnly: withoutHiddenMarkOnly,
        withHiddenMarkOnly: withHiddenMarkOnly
    }
}