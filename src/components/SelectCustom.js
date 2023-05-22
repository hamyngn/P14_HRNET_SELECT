import React, {useState, useRef, useEffect} from "react";
import styles from '../assets/styles/SelectCustom.module.css'
import {ReactComponent as SelectIcon} from '../assets/images/caret-down-solid.svg';

const SelectCustom = ({label, id, data, value, text}) => {
    // State to track if the list is showed or not
    const [showList, setShowList] = useState(false)
    // State to track the selected option text
    const [selectText, setSelectText] = useState(data[0][text])
    // State to track the list
    const [list, setList] = useState(null)
    // State to track the button is focused or not
    const [isFocus, setIsFocus] = useState(false)

    const refButton = useRef();
    const refSelect = useRef();
    
    // handle list selected
    const handleClick = (value, text) => {
        refSelect.current.value = value;
        setSelectText(text)
        setShowList(false);
        refButton.current.classList.remove(`${styles.uiCornerTop}`) 
    }

    const options = data.map((data, index) =>
        <option value={data[value]} key={index}>{data[text]}</option>
    )

    console.log(options[0].label)

    // show and hide list
    const handleShowList = () => {
        refButton.current.classList.add(`${styles.uiCornerTop}`)
        setShowList(!showList)
        setIsFocus(!isFocus)
        if(showList) {
            refButton.current.classList.remove(`${styles.uiCornerTop}`) 
        }
    }
    // create list of options
    const createList = () => {
        const lists = data.map((data, index) =>
        <li 
            onClick={() => handleClick(data[value], data[text])} 
            key={index}
        >
            {data[text]}
        </li>
    )
        setList(lists)
    }
    
    // Associate existing label with the new button
    const buttonFocus = () => {
        refButton.current.focus();
        setIsFocus(true)
    }

    // Delay rendering the menu items until the button receives focus.
	// The menu may have already been rendered via a programmatic open.
    useEffect(() => {
        if(isFocus === true) {
            createList();
        }
    }, [isFocus])
    

    return (
        <>
        <div className={styles.container}>
        <label htmlFor={`${id}-button`} onClick={() => buttonFocus()}>{label}</label>
        <select name={id} id={id} style={{display:"none"}} ref={refSelect}>
            {options}
        </select>
        <div className={styles.list}>
            <span 
            id={`${id}-button`} 
            className={styles.selectMenuButton} 
            onClick={() => handleShowList()} 
            ref={refButton}
            tabIndex={0}
            aria-expanded = {showList ? true : false}
			aria-autocomplete = "list"
			aria-owns = {`${id}-menu`}
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
            >
                {list}
            </ul>
            </div>
            }
            
        </div>
        </div>
        </>
    )
}

export default SelectCustom;