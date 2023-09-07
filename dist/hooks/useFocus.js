"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFocus = useFocus;
var _react = require("react");
/**
 * set focus to first list item or selected item
 * @param {Array} list 
 * @param {boolean} showList 
 * @param {number} selectedIndex 
 * @param {number} focusedItemIndex 
 * @param {*} refButton 
 * @param {*} listRef 
 */
function useFocus(list, showList, selectedIndex, focusedItemIndex, refButton, listRef) {
  (0, _react.useEffect)(() => {
    // set focus to first list item if there is no selected item
    if (list && showList && selectedIndex === null && (focusedItemIndex || focusedItemIndex === 0)) {
      refButton.current.blur();
      listRef[focusedItemIndex].current.focus();
    }

    // if there is selected item and menu is opened, set focus on selected list item
    if (showList && selectedIndex) {
      refButton.current.blur();
      listRef[selectedIndex].current.focus();
    }
  }, [list, showList, selectedIndex, listRef, focusedItemIndex, refButton]);
}