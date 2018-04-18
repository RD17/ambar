import moment from 'moment'

export const DateFormat = 'DD.MM.YYYY'
export const DateTimeFormat = 'DD.MM.YYYY HH:mm'

export const pad = (num, size) => {
    const s = "00" + num
    return s.substr(s.length - size)
}  

export const toDate = (day, month, year) => {
    let res = '';

    if (day)
        res += pad(day, 2) + '.'
    
    if (month)
        res += pad(month, 2) + '.'

    if (year)
        res += year
    
    return res
}

export const dateToInts = (date) => {
    const momentDate = moment(date, DateFormat)

    return {
        d: momentDate.date(),
        m: momentDate.month() + 1, //because motnhs are ZERO indexed
        y: momentDate.year()
    }
}