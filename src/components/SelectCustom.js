import React, {useState, useRef, useEffect} from "react";
import styles from '../assets/styles/SelectCustom.module.css'
import {ReactComponent as SelectIcon} from '../assets/images/caret-down-solid.svg';
import PropTypes from 'prop-types';

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
    disabled = ["AL", "AK"] to set these items disabled
*/
const SelectCustom = ({label, id, data, value, text, onChange, disabled}) => {
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
        } else {
            return;
        }
    }, [data])

    // show and hide list
    const handleShowList = () => {
        refButton.current.classList.add(`${styles.uiCornerTop}`)
        setShowList(!showList)
        setIsFocus(!isFocus)
        if(showList) {
            refButton.current.classList.remove(`${styles.uiCornerTop}`) 
        }
    }

    // set focus on selected list item if menu is opened
    useEffect(() => {
        if(showList && selectedIndex) {
                listRef.current[selectedIndex].focus()
        }   
    }, [showList, selectedIndex])

    // when there're no list item selected, set focus on the first item if menu is opened
    useEffect(() => {
        if(list !==null && showList && selectedIndex === null) {
            listRef.current[0].focus()
        }
    }, [showList, selectedIndex, list])

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

    // handle key press on list items
    const handleListKeyDown = (e, index) => {
        if(e.code === "Enter") {
            listRef.current[index].click()
        }
        if(e.code === "ArrowDown") {
            listRef.current[index+1].focus()
        }
        if(e.code === "ArrowUp") {
            listRef.current[index-1].focus()
        }
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
            onKeyDown={(e) => handleListKeyDown(e,index)}
        >
            {data[text]}
        </li>
        )
        setList(lists)
    }

    // set disabled list item
    useEffect(() => {
        if(disabled && list) {
            disabled.map((i) => {
                data.map((data, index) => {
                    if(i === data[value]) {
                        listRef.current[index].classList.add(`${styles.disabled}`)
                    }
                })  
            })
        }
    }, [disabled, list])

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

    // show list items when press Enter key on select Button
    const handleButtonKeyDown = (e) => {
        if(e.code === "Enter") {
            handleShowList()
        }
    }

    // remove focus on focused list item on mouse move
    const handleMouseMove = () => {
        if (selectedIndex) {
            listRef.current[selectedIndex].blur()
        } else {
            listRef.current[0].blur()
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
    disabled: PropTypes.arrayOf(PropTypes.string)
}

export default SelectCustom;