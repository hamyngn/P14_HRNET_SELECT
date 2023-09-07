"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _SelectCustomModule = _interopRequireDefault(require("../assets/styles/SelectCustom.module.css"));
var _caretDownSolid = require("../assets/images/caret-down-solid.svg");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useSelectButtonText = require("../hooks/useSelectButtonText");
var _useHandleDisabledAndHidden = require("../hooks/useHandleDisabledAndHidden");
var _useFocus = require("../hooks/useFocus");
var _useClickOutsideOfComponent = require("../hooks/useClickOutsideOfComponent");
var _useCreateList = require("../hooks/useCreateList");
var _useCreateRefs = require("../hooks/useCreateRefs");
var _useCreateOptions = require("../hooks/useCreateOptions");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * @param label - string - label of select button
 * @param id - id of select element
 * @param data - array of select list items texts and values
 * @param hidden - array of hidden list items values ex:["AL","CA"]
 * @param disabled - array of disabled list items values ex:["AL","CA"]
 * @param text - string - data key of select text
 * @param value - string - data key of select value
 * @param buttonDisabled - bool - if the select button is disabled
 */

const SelectCustom = _ref => {
  let {
    label,
    id,
    data,
    value,
    text,
    onChange,
    disabled,
    hidden,
    buttonDisabled,
    width
  } = _ref;
  // State to track if the list is showed or not
  const [showList, setShowList] = (0, _react.useState)(false);
  // State to track the selected option text
  const [selectText, setSelectText] = (0, _react.useState)("");
  // State to track the list
  const [list, setList] = (0, _react.useState)(null);
  // State to track the button is focused or not
  const [isFocus, setIsFocus] = (0, _react.useState)(false);
  // State to track options
  const [options, setOptions] = (0, _react.useState)(null);
  // State to track selected list index
  const [selectedIndex, setSelectedIndex] = (0, _react.useState)(null);
  // State to track listRefs
  const [listRef, setListRef] = (0, _react.useState)([]);
  // State to track list item hover index
  const [index, setIndex] = (0, _react.useState)(null);
  // text of select button
  const buttonText = (0, _useSelectButtonText.useSelectButtonText)(data, hidden, disabled, text, value).selectText;
  // index of focused list item
  const focusedItemIndex = (0, _useSelectButtonText.useSelectButtonText)(data, hidden, disabled, text, value).index;
  const refButton = (0, _react.useRef)();
  const refDropDown = (0, _react.useRef)();
  (0, _useCreateOptions.useCreateOptions)(data, setOptions, text, value);
  (0, _useCreateRefs.useCreateRefs)(data, setListRef);

  /**
   * handle showList state and change style of select button when options are shown
   */
  const handleShowList = () => {
    setShowList(!showList);
    if (showList) {
      refButton.current.classList.remove("".concat(_SelectCustomModule.default.uiCornerTop));
      setIsFocus(true);
    } else {
      refButton.current.classList.add("".concat(_SelectCustomModule.default.uiCornerTop));
      setIsFocus(false);
    }
  };

  /**
   * Associate existing label with the new button
   */
  const buttonFocus = () => {
    if (!buttonDisabled) {
      refButton.current.focus();
      setIsFocus(true);
    }
  };
  (0, _useFocus.useFocus)(list, showList, selectedIndex, focusedItemIndex, refButton, listRef);
  (0, _useHandleDisabledAndHidden.useHandleDisabledAndHidden)(disabled, hidden, data, list, listRef, value, _SelectCustomModule.default);
  (0, _useCreateList.useCreateList)(isFocus, data, id, value, text, selectedIndex, onChange, showList, focusedItemIndex, listRef, refButton, buttonFocus, _SelectCustomModule.default, setShowList, setSelectText, setSelectedIndex, setList);
  (0, _useClickOutsideOfComponent.useClickOutsideOfComponent)(refDropDown, refButton, setShowList, _SelectCustomModule.default);
  (0, _react.useEffect)(() => {
    if (showList) {
      if (selectedIndex) {
        setIndex(selectedIndex);
      } else {
        setIndex(focusedItemIndex);
      }
    }
  }, [selectedIndex, focusedItemIndex, showList]);

  /**
   * remove focus on focused list item on mouse move and get item index
  */
  const handleMouseMove = e => {
    document.activeElement.blur();
    e.target.focus();
    if (e.target.tagName === 'LI') {
      setIndex(Array.from(e.target.parentElement.children).indexOf(e.target));
    }
  };

  /**
   * open, close list by key press
   * go to next or previous list item, select list item by key press
   * show first and last list item by key press
   * @param {*} e 
   */
  const handleKeyDown = e => {
    e.preventDefault();
    let buttonFocused = refButton.current && refButton.current.contains(e.target);
    if (e.target.tagName !== 'LI' && e.code === "Space") {
      if (showList) {
        setShowList(false);
        refButton.current.classList.remove("".concat(_SelectCustomModule.default.uiCornerTop));
      } else {
        setShowList(true);
        refButton.current.classList.add("".concat(_SelectCustomModule.default.uiCornerTop));
        listRef[focusedItemIndex].current.focus();
      }
    }
    if (e.code === "Tab") {
      if (refButton.current.parentElement.nextSibling) {
        refButton.current.parentElement.nextSibling.focus();
      }
      if (showList) {
        setShowList(false);
        refButton.current.classList.remove("".concat(_SelectCustomModule.default.uiCornerTop));
      }
    }
    if (e.code === "Escape") {
      if (showList) {
        setShowList(false);
        refButton.current.classList.remove("".concat(_SelectCustomModule.default.uiCornerTop));
      }
    }
    if (e.target.tagName === 'LI' && (e.code === "Enter" || e.code === "Space")) {
      listRef[index].current.click();
    }
    // show next item when press ArrowDown or ArrowRight
    if ((e.code === "ArrowDown" || e.code === "ArrowRight") && list) {
      document.activeElement.blur();
      if (index <= list.length - 1) {
        let available;
        for (let i = index + 1; i < list.length; i += 1) {
          const item = listRef[i].current;
          if (!item.classList.contains("".concat(_SelectCustomModule.default.disabled)) && !item.hidden) {
            available = true;
            setIndex(i);
            if (buttonFocused) {
              item.click();
            } else {
              item.focus();
            }
            break;
          }
        }
        if (!available) {
          e.target.focus();
        }
      }
    }
    // show previous item when press ArrowUp or ArrowLeft
    if ((e.code === "ArrowUp" || e.code === "ArrowLeft") && list) {
      document.activeElement.blur();
      if (index > focusedItemIndex) {
        for (let i = index - 1; i >= 0; i -= 1) {
          const item = listRef[i].current;
          if (!item.classList.contains("".concat(_SelectCustomModule.default.disabled)) && !item.hidden) {
            setIndex(i);
            if (buttonFocused) {
              item.click();
            } else {
              item.focus();
            }
            break;
          }
        }
      } else {
        e.target.focus();
      }
    }
    // show first list item text when press PageUp
    if (e.code === "PageUp" && list) {
      document.activeElement.blur();
      setIndex(focusedItemIndex);
      if (buttonFocused) {
        listRef[focusedItemIndex].current.click();
      } else {
        listRef[focusedItemIndex].current.focus();
      }
    }
    // show last list item text when press PageDown
    if (e.code === "PageDown" && list) {
      document.activeElement.blur();
      for (let i = list.length - 1; i >= 0; i -= 1) {
        const item = listRef[i].current;
        setIndex(i);
        if (!item.classList.contains("".concat(_SelectCustomModule.default.disabled)) && !item.hidden) {
          if (buttonFocused) {
            item.click();
          } else {
            item.focus();
          }
          break;
        }
      }
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: _SelectCustomModule.default.selectContainer,
    style: width && {
      width: "".concat(width)
    }
  }, label && /*#__PURE__*/_react.default.createElement("label", {
    htmlFor: "".concat(id, "-button"),
    onClick: () => buttonFocus()
  }, label), /*#__PURE__*/_react.default.createElement("select", {
    name: id,
    id: id,
    style: {
      display: "none"
    }
  }, options), /*#__PURE__*/_react.default.createElement("div", {
    ref: refDropDown,
    style: {
      marginTop: "10px"
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    id: "".concat(id, "-button"),
    className: "".concat(_SelectCustomModule.default.selectMenuButton, " ").concat(buttonDisabled ? _SelectCustomModule.default.disabled : ""),
    onClick: () => handleShowList(),
    ref: refButton,
    tabIndex: buttonDisabled ? -1 : 0,
    role: "combobox",
    "aria-label": "".concat(id, "-button"),
    "aria-expanded": showList ? true : false,
    "aria-controls": "".concat(id, "-menu"),
    "aria-haspopup": "true",
    onKeyDown: e => handleKeyDown(e),
    onFocus: () => setIsFocus(true)
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: _SelectCustomModule.default.selectMenuText
  }, selectText ? selectText : buttonText), /*#__PURE__*/_react.default.createElement("span", {
    className: _SelectCustomModule.default.selectMenuIcon
  }, /*#__PURE__*/_react.default.createElement(_caretDownSolid.ReactComponent, {
    className: _SelectCustomModule.default.selectIcon
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: _SelectCustomModule.default.dropDownMenu,
    onKeyDown: e => handleKeyDown(e)
  }, /*#__PURE__*/_react.default.createElement("ul", {
    id: "".concat(id, "-menu"),
    style: showList ? {
      height: "auto"
    } : {
      height: "0px",
      overflow: "hidden"
    },
    className: "".concat(_SelectCustomModule.default.selectMenuMenu, " ").concat(showList ? _SelectCustomModule.default.menuActive : ""),
    role: "listbox",
    "aria-hidden": showList ? false : true,
    "aria-labelledby": "".concat(id, "-button"),
    onMouseMove: handleMouseMove,
    tabIndex: showList ? 0 : -1
  }, list))));
};
SelectCustom.propTypes = {
  label: _propTypes.default.string,
  id: _propTypes.default.string,
  data: _propTypes.default.array,
  value: _propTypes.default.string,
  text: _propTypes.default.string,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.arrayOf(_propTypes.default.string),
  hidden: _propTypes.default.arrayOf(_propTypes.default.string),
  buttonDisabled: _propTypes.default.bool,
  width: _propTypes.default.string
};
var _default = SelectCustom;
exports.default = _default;