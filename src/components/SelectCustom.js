import React, {useState, useRef, useEffect, createRef} from "react";
import styles from '../assets/styles/SelectCustom.module.css'
import {ReactComponent as SelectIcon} from '../assets/images/caret-down-solid.svg';
import PropTypes from 'prop-types';
import {useSelectButtonText} from "../hooks/useSelectButtonText"

/**
 * @param label - label of select button
 * @param id - id of select element
 * @param data - array of select list items texts and values
 * @param hidden - array of hidden list items values
 * @param disabled - array of disabled list items values
 * @param text - string - data key of select text
 * @param value - string - data key of select value
 */

const SelectCustom = ({label, id, data, value, text, onChange, disabled, hidden}) => {
    // State to track if the list is showed or not
    const [showList, setShowList] = useState(false)
    // State to track the selected option text
    const [selectText, setSelectText] = useState("")
    // State to track the list
    const [list, setList] = useState(null)
    // State to track the button is focused or not
    const [isFocus, setIsFocus] = useState(false)
    // State to track options
    const [options, setOptions] = useState(null)
    // State to track selected list index
    const [selectedIndex, setSelectedIndex] = useState(null)
    // State to track listRefs
    const [listRef, setListRef] = useState([]);
    // State to track if hidden and disabled items handled
    const [listHandled, setListHandled] = useState(false)
    // State to track list item hover index
    const [index, setIndex] = useState(null)
    // text of select button
    const buttonText = useSelectButtonText(data, hidden, disabled, text, value).selectText
    // index of focused list item
    const focusedItemIndex = useSelectButtonText(data, hidden, disabled, text, value).index
    const refButton = useRef()
    const refDropDown = useRef()

    useEffect(() => {
        if(data && data.length) {
            const options = data.map((data, index) =>
            <option value={data[value]} key={index}>{data[text]}</option>
            )
            setOptions(options)
        } else {
            return;
        }
    }, [data, text, value])

    // create list items refs
    useEffect(() => {
        const elRefs = []
        if(data && data.length){
            for(let i = 0; i < data.length; i += 1) {
                elRefs.push(elRefs[i] = createRef())
            }
            setListRef(elRefs)
        }
    }, [data])
    
    /**
     * open and close list items
     */
    const handleShowList = () => {
        refButton.current.classList.add(`${styles.uiCornerTop}`)
        setShowList(current => !current)
        setIsFocus(current => !current)
        if(showList) {
            refButton.current.classList.remove(`${styles.uiCornerTop}`) 
        }
    }

    useEffect(() => {  
        // set focus to first list item if there is no selected item
        if(list && listHandled && showList && selectedIndex === null && (focusedItemIndex || focusedItemIndex === 0)) {
            refButton.current.blur()
            listRef[focusedItemIndex].current.focus()
        }

        // if there is selected item and menu is opened, set focus on selected list item
        if(showList && selectedIndex) {
            refButton.current.blur()
            listRef[selectedIndex].current.focus()
        } 
    }, [list, showList, selectedIndex, listRef, focusedItemIndex, listHandled])

    useEffect(() => {
        const handleDisabledAndHidden = () => {
            // set disabled list item
            if(disabled && disabled.length && list && listHandled) {
                disabled.forEach((i) => {
                    data.forEach((data, index) => {
                        if(i === data[value]) {
                            listRef[index].current.classList.add(`${styles.disabled}`)
                        }
                    })  
                })
            }
            // set hidden list item
            if(hidden && hidden.length && list && listHandled) {
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
    }, [disabled, hidden, data, listHandled, list, listRef, value])
   
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
            setListHandled(true)
        }
    }, [isFocus, data, id, value, text, selectedIndex, onChange, showList, focusedItemIndex, listRef])
    
    /**
     * Associate existing label with the new button
     */
    const buttonFocus = () => {
        refButton.current.focus();
        setIsFocus(true)
    }
    
    // Close menu if click outside of menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if(refDropDown.current && !refDropDown.current.contains(event.target)) {
                setShowList(false)
                refButton.current.classList.remove(`${styles.uiCornerTop}`) 
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
          };
    }, [])

    useEffect(() => {
        if(selectedIndex) {
            setIndex(selectedIndex)
        } else {
            setIndex(focusedItemIndex)
        }
    }, [selectedIndex, focusedItemIndex])

    /**
     * remove focus on focused list item on mouse move and get item index
    */
    const handleMouseMove = (e) => {
        document.activeElement.blur()
        e.target.focus()
        if(e.target.tagName === 'LI') {
            setIndex(Array.from(e.target.parentElement.children).indexOf(e.target))
        }
    }
    /**
     * open, close list by key press
     * go to next or previous list item, select list item by key press
     * show first and last list item by key press
     * @param {*} e 
     */
    const handleKeyDown = (e) => {
        e.preventDefault()
        let buttonFocused = refButton.current && refButton.current.contains(e.target)
        if(e.code === "Space") {
            handleShowList()
        }
        if(e.code === "Escape"){
            setShowList(false)
            refButton.current.classList.remove(`${styles.uiCornerTop}`)
        }
        if(e.target.tagName === 'LI' && e.code === "Enter") {
            listRef[index].current.click()
        }
        // show next item when press ArrowDown or ArrowRight
        if((e.code === "ArrowDown"||e.code === "ArrowRight") && list && listHandled){
            document.activeElement.blur()
            if(index <= list.length - 1) {
                let available
                for(let i = index + 1; i < list.length; i +=1) {
                    const item = listRef[i].current
                    if(!item.classList.contains(`${styles.disabled}`) && !item.hidden) {
                        available = true
                        setIndex(i)
                        if(buttonFocused) {
                            item.click()
                        } else {
                            item.focus()
                        }
                            break
                        }   
                    }
                if(!available) {
                    e.target.focus()
                }
            }
        }
        // show previous item when press ArrowUp or ArrowLeft
        if((e.code === "ArrowUp"||e.code === "ArrowLeft") && list && listHandled) {
            document.activeElement.blur()
            if(index > focusedItemIndex) {
                for(let i = index -1; i >= 0; i -= 1) {
                    const item = listRef[i].current
                    if(!item.classList.contains(`${styles.disabled}`) && !item.hidden) {
                        setIndex(i)
                        if(buttonFocused) {
                            item.click()
                        } else {
                            item.focus()
                        }
                        break
                    }
                }
            } else {
                e.target.focus()
            }
        }  
        // show first list item text when press PageUp
        if((e.code === "PageUp") && list && listHandled) {
            document.activeElement.blur()
            setIndex(focusedItemIndex)
            if(buttonFocused) {
                listRef[focusedItemIndex].current.click()
            } else {
                listRef[focusedItemIndex].current.focus()
            }
        }
        // show last list item text when press PageDown
        if(e.code === "PageDown" && list && listHandled) {
            document.activeElement.blur()
            for(let i = list.length-1; i >= 0; i -= 1) {
                const item = listRef[i].current
                setIndex(i)
                if(!item.classList.contains(`${styles.disabled}`) && !item.hidden) {
                    if(buttonFocused) {
                        item.click()
                    } else {
                        item.focus()
                    }  
                    break
                }
            } 
        }
    }

    return (
        <>
        <div className={styles.container}>
        { label && (
        <label htmlFor={`${id}-button`} onClick={() => buttonFocus()}>{label}</label> 
        )}
        <select name={id} id={id} style={{display:"none"}}>
            {options}
        </select>
        <span 
        id={`${id}-button`} 
        className={styles.selectMenuButton} 
        onClick={() => handleShowList()}
        ref={refButton}
        tabIndex={0}
        role={"combobox"}
        aria-label={`${id}-button`}
        aria-expanded = {showList ? true : false}
        aria-controls={`${id}-menu`}
        aria-haspopup = "true"
        onKeyDown={(e) => handleKeyDown(e)}
        >
        <span className={styles.selectMenuText}>{selectText ? selectText : buttonText}</span>
        <span className={styles.selectMenuIcon}><SelectIcon className={styles.selectIcon}/></span>
        </span>
        <div className={styles.dropDownMenu} ref={refDropDown} onKeyDown={(e) => handleKeyDown(e)}>
        <ul 
        id={`${id}-menu`} 
        style={showList? {height: "auto"}: {height: "0px", overflow: "hidden"}}
        className={`${styles.selectMenuMenu} ${showList? styles.menuActive: ""}`}
        role={"listbox"}
        aria-hidden={showList ? false : true}
        aria-labelledby={`${id}-button`}
        onMouseMove={handleMouseMove}
        tabIndex={showList? 0 : -1}
        >
            {list}
        </ul>
        </div>      
        </div>
        </>
    )
}

SelectCustom.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    data: PropTypes.array,
    value: PropTypes.string,
    text: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.arrayOf(PropTypes.string),
    hidden:  PropTypes.arrayOf(PropTypes.string)
}

export default SelectCustom;