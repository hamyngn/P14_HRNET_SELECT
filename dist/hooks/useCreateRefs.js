"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCreateRefs = useCreateRefs;
var _react = require("react");
/**
 * create list items refs
 * @param {Array} data 
 * @param {Array} setListRef 
 */
function useCreateRefs(data, setListRef) {
  (0, _react.useEffect)(() => {
    const elRefs = [];
    if (data && data.length) {
      for (let i = 0; i < data.length; i += 1) {
        elRefs.push(elRefs[i] = /*#__PURE__*/(0, _react.createRef)());
      }
      setListRef(elRefs);
    }
  }, [data, setListRef]);
}