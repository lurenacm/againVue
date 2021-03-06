(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.myVue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // ??????????????? push pop shift unshift reverse sort splice ????????????????????????????????????????????????
  /**??????????????????????????????????????????????????????????????????????????? */

  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayMethods$meth;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // this ???????????? (vm.arrs.push ) arrs ???????????????
      // ???????????? this ?????????????????????????????????????????? push ?????????????????????
      var res = (_oldArrayMethods$meth = oldArrayMethods[method]).call.apply(_oldArrayMethods$meth, [this].concat(args)); // ??????????????????????????????????????????????????? object push({}, {}) 
      // ???????????????????????????????????? definedPrototype


      var instead;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          instead = args;
          break;

        case 'splice':
          instead = args;
          break;
      }

      if (instead) ob.observerArray(instead);
      return res;
    };
  });

  /** Observer ??????????????? get/set ??? class */

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue ??????????????????????????????????????????????????????
      // ????????????????????????????????????????????????????????????
      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        configurable: false,
        value: this
      });

      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods;
        this.observerArray(value);
      } else {
        this.walk(value); // ??????????????????????????????get/set
      }
    } // ????????????


    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(arr) {
        // arr: [{},{}]
        // ????????????????????????????????????????????????????????????????????????
        arr.forEach(function (item) {
          observer(item);
        });
      } // ????????????

    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); //keys = [name, age, attr]

        keys.forEach(function (key) {
          definedReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function definedReactive(data, key, value) {
    observer(value);
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return; // ????????????????????????????????????????????????????????????????????????

        observer(newValue);
        value = newValue;
      }
    });
  }
  /** ???????????? ????????????????????????`get/set` */


  function observer(data) {
    if (_typeof(data) === 'object' && data !== null) {
      return new Observer(data);
    }
  }

  // ????????? props data computed watch ?????????
  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }
  /** vm._data ??????????????????????????????data(data???????????????)???????????? */


  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; //??????????????? ?????????????????????data???????????????????????? Object.definedProperty() ?????? get/set ??????
    // ????????????????????? vm._data. === vm.  ???????????????

    for (var key in data) {
      proxy(vm, key);
    }

    observer(data);
  }

  function proxy(vm, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm['_data'][key];
      },
      set: function set(newVal) {
        return vm['_data'][key] = newVal;
      }
    });
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // ????????????????????? ???????????????????????????

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // ????????????????????? </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // ???????????????

  var startTagClose = /^\s*(\/?)>/; // ????????????????????? >
  // ?????????????????? ast ????????????dom??????

  function creatAstElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      attrs: attrs,
      children: [],
      parent: null
    };
  }

  var root$1 = null;
  var stack = [];

  function start(tagName, attrs) {
    var parent = stack[stack.length - 1];
    var element = creatAstElement(tagName, attrs);

    if (!root$1) {
      root$1 = element;
    }

    element.parent = parent;

    if (element.parent) {
      element.parent.children.push(element);
    }

    stack.push(element);
  }

  function end(tagName) {
    var last = stack.pop();

    if (last.tag !== tagName) {
      throw new Error();
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, "");
    var parent = stack[stack.length - 1];

    if (text) {
      parent.children.push({
        type: 3,
        text: text
      });
    }
  }

  function parseHTML(html) {
    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var attr, _end;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3]
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root$1;
  } // example???<div id = "#app">{{msg}}</div>
  // vue2.x ?????????????????????????????????????????????????????????????????????????????????
  // ???????????????????????? {{msg}} ??????????????????

  /* <div style="color:red">hello {{name}} <span></span></div>
  render(){
     return _c('div',{style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
  } */
  function gen(node) {
    if (node.type == 1) {
      return generate(node);
    } else {
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      }

      var lastIndex = defaultTagRE.lastIndex = 0;
      var tokens = [];
      var match, index;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function getChildren(el) {
    // ??????????????????
    var children = el.children;

    if (children) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function genProps(attrs) {
    // ????????????
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function generate(el) {
    var children = getChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }
  generate(root);

  function compileToFunction(template) {
    var root = parseHTML(template);
    generate(root); // ???????????? dom
    // render()
  }

  function initMixin(myVue) {
    // ???????????????
    myVue.prototype._init = function (options) {
      // ??????????????????????????????????????????
      var vm = this;
      this.$options = options; // ???????????????

      initState(vm); // ????????????

      if (this.$options.el) {
        vm.$mount(this.$options.el);
      }
    };

    myVue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);

      if (!vm.render) {
        if (!vm.template && el) {
          var template = el.outerHTML; // console.log(template)
          // ????????? template ??????????????? dom 

          var render = compileToFunction(template);
          options.render = render;
        }
      }
    };
  }

  function myVue() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this._init(options);
  }

  initMixin(myVue);

  return myVue;

})));
//# sourceMappingURL=vue.js.map
