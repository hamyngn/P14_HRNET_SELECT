import React, { useEffect } from "react"

/**
 * 
 * @param {boolean} isFocus 
 * @param {Array} data 
 * @param {string} id 
 * @param {string} value 
 * @param {string} text 
 * @param {number} selectedIndex 
 * @param {*} onChange 
 * @param {boolean} showList 
 * @param {number} focusedItemIndex 
 * @param {*} listRef 
 * @param {*} refButton 
 * @param {*} buttonFocus 
 * @param {*} styles 
 * @param {boolean} setShowList 
 * @param {string} setSelectText 
 * @param {number} setSelectedIndex 
 * @param {Array} setList 
 */
export function useCreateList(isFocus, data, id, value, text, selectedIndex, onChange, showList, focusedItemIndex, listRef, refButton, buttonFocus, styles, setShowList, setSelectText, setSelectedIndex, setList) {
        // Delay rendering the menu items until the button receives focus.
	// The menu may have already been rendered via a programmatic open.
    useEffect(() => {
        // handle onChange value when no item selected
        if(onChange && !selectedIndex && (focusedItemIndex || focusedItemIndex === 0)) {
            onChange(data[focusedItemIndex][value])
        }
        // handle list selected
        const handleClick = (value, text, index) => {
            if(onChange) {
                onChange(value)
            }
            setSelectText(text)
            setShowList(false)
            setSelectedIndex(index)
            buttonFocus()
            refButton.current.classList.remove(`${styles.uiCornerTop}`)
        }
        // create list of options
        const createList = () => {
            const lists = data.map((data, index) =>
            <li 
                key={`${id}-menu-item-${index}`}
                tabIndex={-1}
                role={"option"}
                aria-selected = {index === selectedIndex ? true : false}
                ref={listRef[index]}
                onClick={() => handleClick(data[value], data[text], index)}
            >
                {data[text]}
            </li>
            )
            setList(lists)
        }
        if(isFocus === true) {
            createList();
        }
    }, [isFocus, data, id, value, text, selectedIndex, onChange, showList, focusedItemIndex, listRef, refButton, styles, setShowList, setSelectText, setSelectedIndex, setList])
}