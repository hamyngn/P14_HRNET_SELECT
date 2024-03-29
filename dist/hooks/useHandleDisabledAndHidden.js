"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHandleDisabledAndHidden = useHandleDisabledAndHidden;
var _react = require("react");
/**
 * hide hidden options and disable disabled options
 * @param {Array} disabled 
 * @param {Array} hidden 
 * @param {Array} data 
 * @param {Array} list 
 * @param {Array} listRef 
 * @param {String} value 
 * @param {*} styles 
 */
function useHandleDisabledAndHidden(disabled, hidden, data, list, listRef, value, styles) {
  (0, _react.useEffect)(() => {
    const handleDisabledAndHidden = () => {
      // set disabled list item
      if (disabled && disabled.length && list && listRef) {
        disabled.forEach(i => {
          data.forEach((data, index) => {
            if (i === data[value] && listRef[index].current) {
              listRef[index].current.classList.add("".concat(styles.disabled));
            }
          });
        });
      }
      // set hidden list item
      if (hidden && hidden.length && list && listRef) {
        hidden.forEach(i => {
          data.forEach((data, index) => {
            if (i === data[value] && listRef[index].current) {
              listRef[index].current.hidden = true;
            }
          });
        });
      }
    };
    handleDisabledAndHidden();
  }, [disabled, hidden, data, list, listRef, value, styles.disabled]);
}