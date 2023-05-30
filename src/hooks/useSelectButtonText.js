import {useEffect, useState} from "react";

export function useSelectButtonText(data, hidden, disabled, text, value) {
    const [selectText, setSelectText] = useState("")
    useEffect(() => {
    //when there is no disabled or hidden item
    if(!hidden && !disabled) {
        setSelectText(data[0][text])
        console.log("no hide no dis")
    }

    //when there is hidden item and no disabled item
    if((hidden && hidden.length && !disabled) || (hidden && hidden.length && disabled && !disabled.length)){
        console.log("hide")
        for(let i=0; i < hidden.length; i+=1) {
            for (let j=0; j < data.length; j+=1) {
                if(hidden[i] !== data[j][value]) {
                    console.log("hidden")
                    setSelectText(data[j][text])
                    break;
                }
            }
        }
    }

    //when there is disabled item and no hidden item
    if((disabled && disabled.length && !hidden) || (disabled && disabled.length && hidden && !hidden.length)){  
        loop1: for(let i=0; i < disabled.length; i+=1) {
            loop2: for (let j=0; j < data.length; j+=1) {
                if(disabled[i] !== data[j][value]) {
                    setSelectText(data[j][text])
                    break loop1;
                }
            }
        }
    }

    //When there're both disabled and hidden items
    if (disabled && disabled.length && hidden && hidden.length) {
        loop1: for(let j=0; j < data.length; j+=1){
            loop2: for(let i=0; i < disabled.length; i+=1) {
                if(disabled[i] !== data[j][value]) {
                    loop3: for(let k=0; k < hidden.length; k+=1){
                        if(data[j][value] !== hidden[k]) {
                            setSelectText(data[j][text])
                            break loop1;
                        }
                    }
                } 
            }
        }
    }
    }, [data, hidden, disabled, text, value])
    return selectText;
}