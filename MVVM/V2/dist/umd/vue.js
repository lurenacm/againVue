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

  // 重写数组的 push pop shift unshift reverse sort splice 因为这几个常用方法可以改变原数组
  /**继承数组的原型，没有重写的方法使用原型链上的原方法 */

  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayMethods$meth;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // this 指向的是 (vm.arrs.push ) arrs 这个数组，
      // 需要添加 this 指向调用的对象不然，原型上的 push 没有调用的主体
      var res = (_oldArrayMethods$meth = oldArrayMethods[method]).call.apply(_oldArrayMethods$meth, [this].concat(args)); // 为了监控数组添加的数据类型也是一个 object push({}, {}) 
      // 需要再次进行数组劫持添加 definedPrototype


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

  /** Observer 就是来添加 get/set 的 class */

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue 不监控数组的每一项，因为性能消耗很大
      // 通过操作数组的索引转变成操作数组的方法。
      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        configurable: false,
        value: this
      });

      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods;
        this.observerArray(value);
      } else {
        this.walk(value); // 对对象的属性进行添加get/set
      }
    } // 数组劫持


    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(arr) {
        // arr: [{},{}]
        // 监控数组中的对象和数组类型，再次递归，性能消耗大
        arr.forEach(function (item) {
          observer(item);
        });
      } // 对象劫持

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
        if (newValue === value) return; // 这里再次使用递归考虑到属性的赋值可能是一个对象。

        observer(newValue);
        value = newValue;
      }
    });
  }
  /** 递归实现 给对象的属性添加`get/set` */


  function observer(data) {
    if (_typeof(data) === 'object' && data !== null) {
      return new Observer(data);
    }
  }

  // 初始化 props data computed watch 等属性
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
  /** vm._data 是为了保证可以访问到data(data假如是函数)属性的值 */


  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; //响应式原理 数据劫持：劫持data对象的数据，使用 Object.definedProperty() 添加 get/set 方法
    // 改变访问的方式 vm._data. === vm.  做一层代理

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
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  // 使用栈来构建 ast 语法树（dom树）

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
  } // example：<div id = "#app">{{msg}}</div>
  // vue2.x 中的模板编译使用正则表达式逐步匹配解析标签内属性和值。
  // 模板编译就是处理 {{msg}} 实现的内容。

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
    // 生成儿子节点
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
    // 生成属性
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
    generate(root); // 创建虚拟 dom
    // render()
  }

  function initMixin(myVue) {
    // 初始化流程
    myVue.prototype._init = function (options) {
      // 数据劫持，其他地方也需要使用
      var vm = this;
      this.$options = options; // 初始化数据

      initState(vm); // 挂载模板

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
          // 将模板 template 编译成虚拟 dom 

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
