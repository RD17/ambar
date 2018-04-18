export const scrollToClass = (className) => {
    const elems = document.getElementsByClassName(className)

    if (elems.length > 0) 
        elems[0].scrollIntoView(false)
}

export const tryScrollToClass = (className) => {
    setTimeout(() => scrollToClass(className), 500)
} 

export const focusClass = (className) => {
    const elems = document.getElementsByClassName(className)

    if (elems.length > 0)
        elems[0].focus() //Hacky, but can not find any other solution
}

export const tryFocusClass = (className) => {
    setTimeout(() => focusClass(className), 500)
}