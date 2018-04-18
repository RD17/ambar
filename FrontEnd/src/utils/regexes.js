
export const SIZE_QUERY_REGEX = /((^|\s)size(<|>)[=]{0,1})([0-9]*)([k|m]{0,1})/im
export const WHEN_QUERY_REGEX = /((^|\s)when:)((today)|(yesterday)|(thisweek)|(thismonth)|(thisyear))/im
export const SHOW_QUERY_REGEX = /((^|\s)show:)((removed)|(all))/im
export const FILE_NAME_QUERY_REGEX = /((^|\s)filename:)([^\s]*)/im
export const AUTHOR_QUERY_REGEX = /((^|\s)author:)([^\s]*)/im
export const TAGS_QUERY_REGEX = /((^|\s)tags:)([a-zA-Z0-9\-\_\,\*]*)/im
