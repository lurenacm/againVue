import { initState } from './state'
import {compileToFunction} from './compile/index'

export function initMixin(myVue) {
    // 初始化流程
    myVue.prototype._init = function (options) {
        // 数据劫持，其他地方也需要使用
        const vm = this
        this.$options = options

        // 初始化数据
        initState(vm)

        // 挂载模板
        if (this.$options.el) {
            vm.$mount(this.$options.el)
        }
    }

    myVue.prototype.$mount = function (el) {
        let vm = this
        let options = vm.$options
        el = document.querySelector(el)
        if (!vm.render) {
            if (!vm.template && el) {
                let template = el.outerHTML
                // console.log(template)
                // 将模板 template 编译成虚拟 dom 
                let render = compileToFunction(template)
                options.render = render
            }
        }
    }

}