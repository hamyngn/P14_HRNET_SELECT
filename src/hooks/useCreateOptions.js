import React, { useEffect } from "react";

/**
 * create select options
 * @param {Array} data 
 * @param {*} setOptions 
 * @param {string} text 
 * @param {string} value 
 */
export function useCreateOptions(data, setOptions, text, value) {
    useEffect(() => {
        if(data && data.length) {
            const options = data.map((data, index) =>
            <option value={data[value]} key={index}>{data[text]}</option>
            )
            setOptions(options)
        } else {
            return;
        }
    }, [data, text, value, setOptions])
}