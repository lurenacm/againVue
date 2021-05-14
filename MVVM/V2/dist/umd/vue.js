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

  function initMixin(myVue) {
    // 初始化流程
    myVue.prototype._init = function (options) {
      // 数据劫持，其他地方也需要使用
      var vm = this;
      this.$options = options; // 初始化数据

      initState(vm); // 挂载模板

      if (this.$options.el) {
        vm.$mount(el);
      }
    };

    myVue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);

      if (!vm.render) {
        if (!vm.template && el) {
          var template = el.outerHTML; // 将模板 template 编译成虚拟 dom 

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
