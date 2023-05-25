import React, {useEffect, useState} from "react";

export const useSelectButtonText = ({data, hidden, disabled, text, value}) => {
    const [selectText, setSelectText] = useState("")

    useEffect(() => {
        if(data && data.length) {
            //when there is no disabled or hidden item
            if(!hidden && !disabled) {
                setSelectText(data[0][text])
            }
    
            //when there is hidden item and no disabled item
            if(hidden && hidden.length && !disabled || hidden && hidden.length && disabled && !disabled.length){
                for(let i=0; i < hidden.length; i+=1) {
                    for (let j=0; j < data.length; j+=1) {
                        if(hidden[i] !== data[j][value]) {
                            setSelectText(data[j][text])
                            break;
                        }
                    }
                }
            }
    
            //when there is disabled item and no hidden item
            if(disabled && disabled.length && !hidden || disabled && disabled.length && hidden && !hidden.length){
                for(let i=0; i < disabled.length; i+=1) {
                    for (let j=0; j < data.length; j+=1) {
                        if(disabled[i] !== data[j][value]) {
                            setSelectText(data[j][text])
                            break;
                        }
                    }
                }
            }
            return selectText;
        } else {
            return;
        }
    }, [data])   
}