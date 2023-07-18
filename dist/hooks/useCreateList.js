"use strict";

require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCreateList = useCreateList;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * 
 * @param {boolean} isFocus 
 * @param {Array} data 
 * @param {string} id 
 * @param {string} value 
 * @param {string} text 
 * @param {number} selectedIndex 
 * @param {*} onChange 
 * @param {boolean} showList 
 * @param {number} focusedItemIndex 
 * @param {*} listRef 
 * @param {*} refButton 
 * @param {*} buttonFocus 
 * @param {*} styles 
 * @param {boolean} setShowList 
 * @param {string} setSelectText 
 * @param {number} setSelectedIndex 
 * @param {Array} setList 
 */
function useCreateList(isFocus, data, id, value, text, selectedIndex, onChange, showList, focusedItemIndex, listRef, refButton, buttonFocus, styles, setShowList, setSelectText, setSelectedIndex, setList) {
  // Delay rendering the menu items until the button receives focus.
  // The menu may have already been rendered via a programmatic open.
  (0, _react.useEffect)(() => {
    // handle onChange value when no item selected
    if (onChange && !selectedIndex && (focusedItemIndex || focusedItemIndex === 0)) {
      onChange(data[focusedItemIndex][value]);
    }
    // handle list selected
    const handleClick = (value, text, index) => {
      if (onChange) {
        onChange(value);
      }
      setSelectText(text);
      setShowList(false);
      setSelectedIndex(index);
      buttonFocus();
      refButton.current.classList.remove("".concat(styles.uiCornerTop));
    };
    // create list of options
    const createList = () => {
      const lists = data.map((data, index) => /*#__PURE__*/_react.default.createElement("li", {
        key: "".concat(id, "-menu-item-").concat(index),
        tabIndex: -1,
        role: "option",
        "aria-selected": index === selectedIndex ? true : false,
        ref: listRef[index],
        onClick: () => handleClick(data[value], data[text], index)
      }, data[text]));
      setList(lists);
    };
    if (isFocus === true) {
      createList();
    }
  }, [isFocus, data, id, value, text, selectedIndex, onChange, showList, focusedItemIndex, listRef, refButton, styles, setShowList, setSelectText, setSelectedIndex, setList]);
}