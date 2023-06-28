import { createRef, useEffect } from "react"

/**
 * create list items refs
 * @param {Array} data 
 * @param {Array} setListRef 
 */
export function useCreateRefs(data, setListRef) {
    useEffect(() => {
        const elRefs = []
        if(data && data.length){
            for(let i = 0; i < data.length; i += 1) {
                elRefs.push(elRefs[i] = createRef())
            }
            setListRef(elRefs)
        }
    }, [data, setListRef])
}