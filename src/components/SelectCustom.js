import React, {useState, useRef, useEffect} from "react";
import styles from '../assets/styles/SelectCustom.module.css'
import {ReactComponent as SelectIcon} from '../assets/images/caret-down-solid.svg';
import PropTypes from 'prop-types';
import {useSelectButtonText} from "../hooks/useSelectButtonText"
import { useHandleDisabledAndHidden } from "../hooks/useHandleDisabledAndHidden";
import { useFocus } from "../hooks/useFocus";
import { useClickOutsideOfComponent } from "../hooks/useClickOutsideOfComponent";
import { useCreateList } from "../hooks/useCreateList";
import { useCreateRefs } from "../hooks/useCreateRefs";
import { useCreateOptions } from "../hooks/useCreateOptions";

/**
 * @param label - string - label of select button
 * @param id - id of select element
 * @param data - array of select list items texts and values
 * @param hidden - array of hidden list items values ex:["AL","CA"]
 * @param disabled - array of disabled list items values ex:["AL","CA"]
 * @param text - string - data key of select text
 * @param value - string - data key of select value
 * @param buttonDisabled - bool - if the select button is disabled
 */

const SelectCustom = ({label, id, data, value, text, onChange, disabled, hidden, buttonDisabled, width}) => {
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
    // State to track list item hover index
    const [index, setIndex] = useState(null)
    // text of select button
    const buttonText = useSelectButtonText(data, hidden, disabled, text, value).selectText
    // index of focused list item
    const focusedItemIndex = useSelectButtonText(data, hidden, disabled, text, value).index
    const refButton = useRef()
    const refDropDown = useRef()

    useCreateOptions(data, setOptions, text, value)

    useCreateRefs(data, setListRef)
    
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
        
    /**
     * Associate existing label with the new button
     */
    const buttonFocus = () => {
        if(!buttonDisabled) {
            refButton.current.focus();
            setIsFocus(true)
        }
    }

    useFocus(list, showList, selectedIndex, focusedItemIndex, refButton, listRef)

    useHandleDisabledAndHidden(disabled, hidden, data, list, listRef, value, styles)
   
    useCreateList(isFocus, data, id, value, text, selectedIndex, onChange, showList, focusedItemIndex, listRef, refButton, buttonFocus, styles, setShowList, setSelectText, setSelectedIndex, setList)
    
    useClickOutsideOfComponent(refDropDown, refButton, setShowList, styles)

    useEffect(() => {
        if(showList) {
            if(selectedIndex) {
                setIndex(selectedIndex)
            } else {
                setIndex(focusedItemIndex)
            }
        }
    }, [selectedIndex, focusedItemIndex, showList])

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
        if(e.code === "Tab") {
            refButton.current.parentElement.nextSibling.focus()
            if(showList){
                setShowList(false)
                refButton.current.classList.remove(`${styles.uiCornerTop}`)
            }
        }
        if(e.code === "Escape"){
            if(showList){
                setShowList(false)
                refButton.current.classList.remove(`${styles.uiCornerTop}`)
            }
        }
        if(e.target.tagName === 'LI' && e.code === "Enter") {
            listRef[index].current.click()
        }
        // show next item when press ArrowDown or ArrowRight
        if((e.code === "ArrowDown"||e.code === "ArrowRight") && list){
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
        if((e.code === "ArrowUp"||e.code === "ArrowLeft") && list) {
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
        if((e.code === "PageUp") && list) {
            document.activeElement.blur()
            setIndex(focusedItemIndex)
            if(buttonFocused) {
                listRef[focusedItemIndex].current.click()
            } else {
                listRef[focusedItemIndex].current.focus()
            }
        }
        // show last list item text when press PageDown
        if(e.code === "PageDown" && list) {
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
    <div className={styles.selectContainer} style={width && {width: `${width}`}}>
    { label && (
    <label htmlFor={`${id}-button`} onClick={() => buttonFocus()}>{label}</label> 
    )}
    <select name={id} id={id} style={{display:"none"}}>
        {options}
    </select>
    <span 
    id={`${id}-button`} 
    className={`${styles.selectMenuButton} ${buttonDisabled? styles.disabled: ""}`} 
    onClick={() => handleShowList()}
    ref={refButton}
    tabIndex={buttonDisabled ? -1 : 0}
    role={"combobox"}
    aria-label={`${id}-button`}
    aria-expanded = {showList ? true : false}
    aria-controls={`${id}-menu`}
    aria-haspopup = "true"
    onKeyDown={(e) => handleKeyDown(e)}
    onFocus={()=> setIsFocus(true)}
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
    hidden:  PropTypes.arrayOf(PropTypes.string),
    buttonDisabled: PropTypes.bool,
    width: PropTypes.string
}

export default SelectCustom;