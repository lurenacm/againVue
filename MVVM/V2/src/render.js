import { createElement, createText } from "./vdom"

export function renderMixin(myVue) {

    myVue.prototype._c = function(tag, data) {
        // 此处 this 就是 vm 实例 render函数指定
        createElement(this, ...arguments)
    }

    myVue.prototype._v = function(text) {
        createText(this, text)
    }

    myVue.prototype._s = function(val) {
        return JSON.stringify(val)
    }

    myVue.prototype._render = function () {
        let vm = this
        let render = vm.$options.render
        render.call(vm)

    }
}