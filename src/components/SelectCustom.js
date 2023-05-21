import React, {useState, useRef} from "react";
import styles from '../assets/styles/SelectCustom.module.css'
import {ReactComponent as SelectIcon} from '../assets/images/caret-down-solid.svg';

const SelectCustom = ({labelFor, data, value, text}) => {

    const [showList, setShowList] = useState(false)
    const [selectText, setSelectText] = useState(data[0][text])
    const refButton = useRef();
    const refSelect = useRef();
    
    const handleClick = (value, text) => {
        refSelect.current.value = value;
        setSelectText(text)
        setShowList(false);
        refButton.current.classList.remove(`${styles.uiCornerTop}`) 
    }

    const options = data.map((data, index) =>
        <option value={data[value]} key={index}>{data[text]}</option>
    )

    const list = data.map((data, index) =>
        <li 
            onClick={() => handleClick(data[value], data[text])} 
            key={index}
        >
            {data[text]}
        </li>
    )

    const handleShowList = () => {
        refButton.current.classList.add(`${styles.uiCornerTop}`)
        setShowList(!showList)
        if(showList) {
            refButton.current.classList.remove(`${styles.uiCornerTop}`) 
        }
    }

    const buttonFocus = () => {
        refButton.current.focus();
    }

    return (
        <>
        <div className={styles.container}>
        <label htmlFor={`${labelFor}-button`} onClick={() => buttonFocus()}>State</label>
        <select name={labelFor} id={labelFor} style={{display:"none"}} ref={refSelect}>
            {options}
        </select>
        <div className={styles.list}>
            <span 
            id={`${labelFor}-button`} 
            className={styles.selectMenuButton} 
            onClick={() => handleShowList()} 
            ref={refButton}
            tabIndex={0}
            aria-expanded = "false"
			aria-autocomplete = "list"
			aria-owns = "selectMenuMenu"
			aria-haspopup = "true"
            >
                <span className={styles.selectMenuText}>{selectText}</span>
                <span className={styles.selectMenuIcon}><SelectIcon className={styles.selectIcon}/></span>
            </span>
            { showList &&
            <div className={styles.dropDownMenu}>
            <ul style={showList? {display: "block"}: {display: "none"}} className={styles.selectMenuMenu}>
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