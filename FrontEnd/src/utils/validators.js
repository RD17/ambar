const MIN_PASSWORD_LENGTH = 8

export const isValidEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return re.test(email)
}

export const isStrongPassword = (password) => {
    const re = /^(?=(.*[A-Z])+)(?=(.*[0-9])+)(?=(.*[a-z])+).{8,}$/

    return re.test(password)
}

export const doesPasswordHaveMinLength = (password) => {
     return  password.length >= MIN_PASSWORD_LENGTH
}

export const doesPasswordHaveOneUpperChar = (password) => {
    const upperCaseChar = /[A-Z]/
    return upperCaseChar.test(password)
}

export const doesPasswordHaveOneLowerChar = (password) => {
    const lowCaseChar = /[a-z]/
    return lowCaseChar.test(password)
}

export const doesPasswordHaveOneDigit = (password) => {
    const digitRe = /\d/
    return digitRe.test(password)
} 