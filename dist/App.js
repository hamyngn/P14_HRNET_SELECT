"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _SelectCustom = _interopRequireDefault(require("./components/SelectCustom"));
var _data = _interopRequireDefault(require("./data"));
var _react = require("react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function App() {
  const [state, setState] = (0, _react.useState)("");
  (0, _react.useEffect)(() => {}, [state]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_SelectCustom.default, {
    id: "state",
    label: "State",
    disabled: ["AZ"],
    hidden: ["CA"],
    data: _data.default,
    value: "abbreviation",
    text: "name",
    onChange: value => setState(value),
    width: "400px"
  }));
}
var _default = App;
exports.default = _default;