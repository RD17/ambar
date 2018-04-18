import moment from 'moment'
import parser from 'cron-parser'

const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS'

export const getCurrentDateTime = () => moment().format(DATETIME_FORMAT)
export const getCurrentDateTimeAddDays = (days) => moment().add(days, 'days').format(DATETIME_FORMAT)
export const getCurrentDateTimeMinusMinutes = (minutes) => moment().subtract({ minutes: minutes }).format(DATETIME_FORMAT)
export const getStartOfToday = () => moment().startOf('day').format(DATETIME_FORMAT)
export const getStartOfYesterday = () => moment().subtract({ days: 1 }).startOf('day').format(DATETIME_FORMAT)
export const getStartOfThisWeek = () => moment().startOf('isoWeek').format(DATETIME_FORMAT)
export const getStartOfThisMonth = () => moment().startOf('month').format(DATETIME_FORMAT)
export const getStartOfThisYear = () => moment().startOf('year').format(DATETIME_FORMAT)
export const parseDateTime = (dateStr) => moment(dateStr, DATETIME_FORMAT, true)
export const getDateTimeDifferenceFromNowInHumanForm = (dateStr) => moment.duration(moment().diff(moment(dateStr, DATETIME_FORMAT, true))).humanize()
export const getDateTimeDifferenceFromNow = (dateStr) => moment().diff(moment(dateStr, DATETIME_FORMAT, true))
export const isSame = (dateA, dateB) => parseDateTime(dateA).isSame(parseDateTime(dateB))
export const getCronIntervalInMs = (cronSchedule) => {
    const interval = parser.parseExpression(cronSchedule)
    const nextRun = interval.next()._date
    const nextNextRun = interval.next()._date
    return moment(nextNextRun).diff(nextRun)
}
