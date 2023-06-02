import React, {useState, useRef, useEffect} from "react";
import styles from '../assets/styles/SelectCustom.module.css'
import {ReactComponent as SelectIcon} from '../assets/images/caret-down-solid.svg';
import PropTypes from 'prop-types';
import {useSelectButtonText} from "../hooks/useSelectButtonText"

/* if data = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    }];
    value = "abbreviation";
    text = "name";
    disabled = ["AL", "AK"] to set these items disabled;
    hidden = ["AS"] to set this item hidden
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

    // text of select button
    const buttonText = useSelectButtonText(data, hidden, disabled, text, value).selectText

    // index of focused list item
    const focusedItemIndex = useSelectButtonText(data, hidden, disabled, text, value).index

    const refButton = useRef()
    const refDropDown = useRef()
    const listRef = useRef([])
    
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
    
    // show and hide list
    const handleShowList = () => {
        refButton.current.classList.add(`${styles.uiCornerTop}`)
        setShowList(current => !current)
        setIsFocus(current => !current)
        if(showList) {
            refButton.current.classList.remove(`${styles.uiCornerTop}`) 
        }
    }

    useEffect(() => {
        // set disabled list item
        if(disabled && disabled.length && list && showList) {
            disabled.forEach((i) => {
                data.forEach((data, index) => {
                    if(i === data[value]) {
                        listRef.current[index].classList.add(`${styles.disabled}`)
                    }
                })  
            })
        }

        // set hidden list item
        if(hidden && hidden.length && list && showList) {
            hidden.forEach((i) => {
                data.forEach((data, index) => {
                    if(i === data[value]) {
                        listRef.current[index].hidden = true
                    }
                })  
            })
        }

        // set focus to first list item if there is no selected item
        if(list && showList && selectedIndex === null) {
            listRef.current[focusedItemIndex].focus()
        }

        // if there is selected item and menu is opened, set focus on selected list item
        if(showList && selectedIndex) {
            listRef.current[selectedIndex].focus()
        } 
    }, [data, value, disabled, hidden, list, showList, selectedIndex])

    const handleListKeyDown = (event, index) => {
        event.preventDefault()
        if(listRef.current[index] && listRef.current[index].contains(event.target)) {
            if(event.code === "Enter") {
                listRef.current[index].click()
            }
            if(event.code === "ArrowDown" && list) {
                if(index < list.length - 1) {
                    for(let i = index + 1; i < list.length; i +=1) {
                        const item = listRef.current[i]
                        if(!item.classList.contains(`${styles.disabled}`) && !item.hidden) {
                            item.focus()
                            listRef.current[index].blur()
                            console.log(i)
                            break
                        }
                    }
                } else {
                    listRef.current[focusedItemIndex].focus()
                    listRef.current[index].blur()
                    console.log(focusedItemIndex + 'focused')
                }
            }

            //todo: handle first item disabled
            if(event.code === "ArrowUp" && list) {
                if(index >= 1) {
                    for(let i = index -1; i >= 0; i -= 1) {
                        const item = listRef.current[i]
                        if(!item.classList.contains(`${styles.disabled}`) && !item.hidden) {
                            item.focus()
                            listRef.current[index].blur()
                            break
                        }
                    }
                } else {
                    for(let i = list.length-1; i >= 0; i -= 1) {
                        const item = listRef.current[i]
                        if(!item.contains(`${styles.disabled}`) && !item.hidden) {
                            item.focus()
                            listRef.current[index].blur()
                            console.log(index + "foc")
                            break
                        }
                    } 
                }
            } 
        }
    }
   

    // Delay rendering the menu items until the button receives focus.
	// The menu may have already been rendered via a programmatic open.
    useEffect(() => {
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
                ref={el => listRef.current[index] = el}
                onClick={() => handleClick(data[value], data[text], index)}
                onKeyDown={(e) => handleListKeyDown(e, index)}
            >
                {data[text]}
            </li>
            )
            setList(lists)
        }

        if(isFocus === true) {
            createList();
        }
    }, [isFocus, data, id, value, text, selectedIndex, onChange, showList])
    
    // Associate existing label with the new button
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
        const handleButtonKeyDown = (e) => {
            e.preventDefault()
            if(refButton.current && refButton.current.contains(e.target)) {
                // show list items when press Enter key on select Button
                if(e.code === "Enter"){
                    handleShowList()
                }
                //todo: finish this
                if(e.code === "ArrowDown"){
                    if(selectedIndex) {
                        setSelectText(listRef.current[selectedIndex].textContent)
                    } else {
                        setSelectText(listRef.current[focusedItemIndex].textContent)
                    }
                    
                }     
            }
        }
        document.addEventListener("mousedown", handleButtonKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleButtonKeyDown);
          };
    }, [selectedIndex, focusedItemIndex])

    // remove focus on focused list item on mouse move
    const handleMouseMove = () => {
        if (selectedIndex) {
            listRef.current[selectedIndex].blur()
        } else {
            listRef.current[focusedItemIndex].blur()
        }
    }

    return (
        <>
        {!data.length ? (
        <div>No data</div>
        ) : (
        <div className={styles.container}>
        { label && (
        <label htmlFor={`${id}-button`} onClick={() => buttonFocus()}>{label}</label> 
        )}
        <select name={id} id={id} style={{display:"none"}}>
            {options}
        </select>
        <div className={styles.list} ref={refDropDown}>
            <span 
            id={`${id}-button`} 
            className={styles.selectMenuButton} 
            onClick={() => handleShowList()}
            onKeyDown={handleShowList} 
            ref={refButton}
            tabIndex={0}
            role={"combobox"}
            aria-expanded = {showList ? true : false}
            aria-controls={`${id}-menu`}
			aria-haspopup = "true"
            >
                <span className={styles.selectMenuText}>{selectText? selectText : buttonText}</span>
                <span className={styles.selectMenuIcon}><SelectIcon className={styles.selectIcon}/></span>
            </span>
            { showList &&
            <div className={styles.dropDownMenu}>
            <ul 
            id={`${id}-menu`} 
            style={showList? {display: "block"}: {display: "none"}} 
            className={styles.selectMenuMenu}
            role={"listbox"}
            aria-hidden={showList ? false : true}
            aria-labelledby={`${id}-button`}
            onMouseMove={handleMouseMove}
            >
                {list}
            </ul>
            </div>
            }        
        </div>
        </div>
        )}
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