webpackHotUpdate(4,{

/***/ "./pages/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return IndexPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator__ = __webpack_require__("./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__("./node_modules/react/cjs/react.development.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_page__ = __webpack_require__("./pages/base/page.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utilities_api__ = __webpack_require__("./pages/utilities/api.js");

var _jsxFileName = "/Users/harrisonbeckerich/proj/vanimals/pages/index.js";


(function () {
  var enterModule = __webpack_require__("./node_modules/react-hot-loader/index.js").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }





var IndexPage =
/*#__PURE__*/
function (_BasePage) {
  _inherits(IndexPage, _BasePage);

  function IndexPage() {
    var _ref;

    var _temp, _this;

    _classCallCheck(this, IndexPage);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = IndexPage.__proto__ || Object.getPrototypeOf(IndexPage)).call.apply(_ref, [this].concat(args))), Object.defineProperty(_assertThisInitialized(_this), "state", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        kittyCore: {},
        saleAuction: {},
        siringAuction: {}
      }
    }), _temp));
  }

  _createClass(IndexPage, [{
    key: "render",
    value: function render() {
      if (!this.props.kittyCore || !this.props.saleAuction) {
        return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 23
          }
        }, "Loading");
      }

      return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 27
        }
      }, "Kitty Core: ", this.props.kittyCore.address, this.props.kittyCore.abi.filter(function (e) {
        return e.constant;
      }).map(this.renderCall.bind(this, 'kittyCore')));
    }
  }, {
    key: "renderCall",
    value: function renderCall(contract, method, index) {
      return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement("div", {
        style: {
          margin: '12px 0'
        },
        key: "call-".concat(contract).concat(index),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        }
      }, __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement("button", {
        onClick: this.handleOnClick.bind(this, contract, method),
        style: {
          fontWeight: 'bold',
          display: 'inline-block'
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        }
      }, method.name), method.inputs.map(this.renderInput.bind(this, contract, method)), this.renderValue(contract, method));
    }
  }, {
    key: "renderValue",
    value: function renderValue(contract, method) {
      var value = this.state[contract]["".concat(method.name, "-value")];

      if (!value) {
        return;
      }

      return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement("div", {
        style: {
          marginTop: '12px'
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 59
        }
      }, JSON.stringify(value, null, 2));
    }
  }, {
    key: "renderInput",
    value: function renderInput(contract, method, input, index) {
      return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement("input", {
        key: "input-".concat(contract).concat(index),
        onChange: this.handleOnChange.bind(this, contract, method, input),
        value: this.state[contract]["".concat(method.name, "-").concat(input.name)],
        placeholder: input.name,
        style: {
          display: 'inline-block',
          marginLeft: '12px'
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 67
        }
      });
    }
  }, {
    key: "handleOnChange",
    value: function handleOnChange(contract, method, input, evt) {
      var c = this.state[contract];
      return this.setState(_defineProperty({}, contract, Object.assign({}, c, _defineProperty({}, "".concat(method.name, "-").concat(input.name), evt.target.value))));
    }
  }, {
    key: "handleOnClick",
    value: function () {
      var _handleOnClick = _asyncToGenerator(
      /*#__PURE__*/
      __WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator___default.a.mark(function _callee(contract, method) {
        var _this2 = this;

        var payload, inputs, response, c;
        return __WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                payload = {};
                inputs = method.inputs.forEach(function (each) {
                  payload[each.name] = _this2.state[contract]["".concat(method.name, "-").concat(each.name)];
                });
                _context.next = 4;
                return __WEBPACK_IMPORTED_MODULE_3__utilities_api__["a" /* default */].fetchKittyCoreCall(method, payload);

              case 4:
                response = _context.sent;
                c = this.state[contract];
                return _context.abrupt("return", this.setState(_defineProperty({}, contract, Object.assign({}, c, _defineProperty({}, "".concat(method.name, "-value"), response.data)))));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function handleOnClick(_x, _x2) {
        return _handleOnClick.apply(this, arguments);
      };
    }()
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }], [{
    key: "getInitialProps",
    value: function () {
      var _getInitialProps = _asyncToGenerator(
      /*#__PURE__*/
      __WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator___default.a.mark(function _callee2() {
        var kittyCoreResponse;
        return __WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return __WEBPACK_IMPORTED_MODULE_3__utilities_api__["a" /* default */].fetchKittyCoreContract();

              case 2:
                kittyCoreResponse = _context2.sent;
                return _context2.abrupt("return", {
                  kittyCore: kittyCoreResponse.data
                });

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function getInitialProps() {
        return _getInitialProps.apply(this, arguments);
      };
    }()
  }]);

  return IndexPage;
}(__WEBPACK_IMPORTED_MODULE_2__base_page__["a" /* default */]);


;

(function () {
  var reactHotLoader = __webpack_require__("./node_modules/react-hot-loader/index.js").default;

  var leaveModule = __webpack_require__("./node_modules/react-hot-loader/index.js").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(IndexPage, "IndexPage", "/Users/harrisonbeckerich/proj/vanimals/pages/index.js");
  leaveModule(module);
})();

;
    (function (Component, route) {
      if(!Component) return
      if (false) return
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/")
  
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=4.14ee35023c0c40d89752.hot-update.js.map