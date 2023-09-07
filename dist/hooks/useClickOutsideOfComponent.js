"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useClickOutsideOfComponent = useClickOutsideOfComponent;
var _react = require("react");
/**
 * Close menu if click outside of menu
 * @param {*} refDropDown 
 * @param {*} refButton 
 * @param {boolean} setShowList 
 * @param {*} styles 
 */
function useClickOutsideOfComponent(refDropDown, refButton, setShowList, styles) {
  (0, _react.useEffect)(() => {
    const handleClickOutside = event => {
      if (refDropDown.current && !refDropDown.current.contains(event.target)) {
        setShowList(false);
        refButton.current.classList.remove("".concat(styles.uiCornerTop));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refDropDown, refButton, setShowList, styles]);
}