import { useEffect } from "react"

/**
 * hide hidden options and disable disabled options
 * @param {Array} disabled 
 * @param {Array} hidden 
 * @param {Array} data 
 * @param {boolean} listHandled 
 * @param {Array} list 
 * @param {Array} listRef 
 * @param {String} value 
 * @param {*} styles 
 */
export function useHandleDisabledAndHidden(disabled, hidden, data, listHandled, list, listRef, value, styles) {
    useEffect(() => {
        const handleDisabledAndHidden = () => {
            // set disabled list item
            if(disabled && disabled.length && list && listRef) {
                disabled.forEach((i) => {
                    data.forEach((data, index) => {
                        if(i === data[value]) {
                            listRef[index].current.classList.add(`${styles.disabled}`)
                        }
                    })  
                })
            }
            // set hidden list item
            if(hidden && hidden.length && list && listRef) {
                hidden.forEach((i) => {
                    data.forEach((data, index) => {
                        if(i === data[value]) {
                            listRef[index].current.hidden = true
                        }
                    })  
                })
            }
        }
        handleDisabledAndHidden()
    }, [disabled, hidden, data, listHandled, list, listRef, value, styles.disabled])
}