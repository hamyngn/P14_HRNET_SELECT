import React, {useState, useRef, useEffect} from "react";
import styles from '../assets/styles/SelectCustom.module.css'
import {ReactComponent as SelectIcon} from '../assets/images/caret-down-solid.svg';

const SelectCustom = ({label, id, data, value, text, onChange}) => {
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

    const refButton = useRef()
    const refDropDown = useRef()
    const listRef = useRef([])
    
    useEffect (()=> {
        if(data.length) {
            const options = data.map((data, index) =>
            <option value={data[value]} key={index}>{data[text]}</option>
            )
            setOptions(options)
            setSelectText(data[0][text])
        }
    }, [data])

    // show and hide list
    const handleShowList = () => {
        refButton.current.classList.add(`${styles.uiCornerTop}`)
        setShowList(!showList)
        setIsFocus(true)
        if(showList) {
            refButton.current.classList.remove(`${styles.uiCornerTop}`) 
        }
    }

    useEffect(() => {
        if(showList && selectedIndex) {
            if(document.activeElement !== null && document.activeElement !== listRef.current[selectedIndex]){
                listRef.current[selectedIndex].focus()
            }
        }
    }, [showList, selectedIndex])

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
            onClick={() => handleClick(data[value], data[text], index)} 
            key={index}
            tabIndex={-1}
            role={"option"}
            aria-selected = {index === selectedIndex ? true : false}
            ref={el => listRef.current[index] = el}
        >
            {data[text]}
        </li>
    )
        setList(lists)
    }

    // Delay rendering the menu items until the button receives focus.
	// The menu may have already been rendered via a programmatic open.
    useEffect(() => {
        if(isFocus === true) {
            createList();
        }
    }, [isFocus])
    
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
    }, [refDropDown])

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
            ref={refButton}
            tabIndex={0}
            role={"combobox"}
            aria-expanded = {showList ? true : false}
            aria-controls={`${id}-menu`}
			aria-haspopup = "true"
            >
                <span className={styles.selectMenuText}>{selectText}</span>
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

export default SelectCustom;