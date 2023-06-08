import {useEffect, useState} from "react";

/**
 * @param data - array of select list texts and values
 * @param hidden - array of hidden list items values
 * @param disabled - array of disabled list items values
 * @param text - string - data key of select text
 * @param value - string - data key of select value
 * @returns an object
*/
export function useSelectButtonText(data, hidden, disabled, text, value) {
    const [selectText, setSelectText] = useState("")
    const [index, setIndex] = useState(null)
    const obj = {selectText: selectText, index: index}
    useEffect(() => {
    //when there is no disabled or hidden item
    if(!hidden && !disabled) {
        setSelectText(data[0][text])
        setIndex(0)
    }

    //when there is hidden item and no disabled item
    if((hidden && hidden.length && !disabled) || (hidden && hidden.length && disabled && !disabled.length)){
        console.log("hide")
        for(let i=0; i < data.length; i+=1) {
            let ifNotHidden;
            for (let j=0; j < hidden.length; j+=1) {
                if(data[i][value] !== hidden[j]) {
                    ifNotHidden = true
                } else {
                    ifNotHidden = false
                    break
                }
            }
            if(ifNotHidden) {
                setSelectText(data[i][text])
                setIndex(i)
                break
            }
        }
    }

    //when there is disabled item and no hidden item
    if((disabled && disabled.length && !hidden) || (disabled && disabled.length && hidden && !hidden.length)){  
        for(let i=0; i < data.length; i+=1) {
            let ifNotDisabled;
            for (let j=0; j < disabled.length; j+=1) {
                if(data[i][value] !== disabled[j]) {
                    ifNotDisabled = true
                } else {
                    ifNotDisabled = false
                    break
                }
            }
            if(ifNotDisabled) {
                setSelectText(data[i][text])
                setIndex(i)
                break
            }
        }
    }

    //When there're both disabled and hidden items
    if (disabled && disabled.length && hidden && hidden.length) {
        for(let j=0; j < data.length; j+=1){
            let ifNotDisabled;
            let ifNotHidden;
            for(let i=0; i < disabled.length; i+=1) {
                if(disabled[i] !== data[j][value]) {
                    ifNotDisabled = true
                }
                else {
                    ifNotDisabled = false
                    break
                }
            }
            if(ifNotDisabled) {
                for(let k=0; k < hidden.length; k+=1){
                    if(data[j][value] !== hidden[k]) {
                        ifNotHidden = true
                }
                else {
                    ifNotHidden = false
                    break
                }
                }
            }
            
            if(ifNotDisabled && ifNotHidden) {
                setSelectText(data[j][text])
                setIndex(j)
                break
            }
        }
    }
    }, [data, hidden, disabled, text, value])
    return obj;
}