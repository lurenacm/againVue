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

  // 使用 Object.definedProperty 重新给data 属性添加 get/set 实现响应式的变化

  /** Observer 就是来添加 get/set 的 class */
  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue 不监控数组的每一项，因为性能消耗很大
      // 通过操作数组的索引转变成操作数组的方法。
      if (Array.isArray(value)) ; else {
        this.walk(value); // 对对象的属性进行添加get/set
      }
    } // 检测每一步的数据变化


    _createClass(Observer, [{
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
    // 递归实现 对象的数据添加`get/set`
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
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // console.log('opts', data)
    //响应式原理 数据劫持：劫持data对象的数据，使用 Object.definedProperty() 添加 get/set 方法

    observer(data);
  }

  function initMixin(myVue) {
    // 初始化流程
    myVue.prototype._init = function (options) {
      // 数据劫持，其他地方也需要使用
      var vm = this;
      this.$options = options; // 初始化数据

      initState(vm);
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
