import { useEffect } from "react"

/**
 * Close menu if click outside of menu
 * @param {*} refDropDown 
 * @param {*} refButton 
 * @param {boolean} setShowList 
 * @param {*} styles 
 */
export function useClickOutsideOfComponent(refDropDown, refButton, setShowList, styles) {
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
    }, [refDropDown, refButton, setShowList, styles])
}