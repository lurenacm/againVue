import {
    initState
} from './state'
import {
    compileToFunction
} from './compile/index'
import {
    mountComponent
} from './lifeCycle'


export function initMixin(myVue) {
    // 初始化流程
    myVue.prototype._init = function (options) {
        // 数据劫持，其他地方也需要使用
        const vm = this
        this.$options = options

        // 初始化数据，包括 data，watch，prop，computed，。。。
        initState(vm)

        // 挂载模板
        if (this.$options.el) {
            vm.$mount(this.$options.el)
        }
    }

    myVue.prototype.$mount = function (el) {
        let vm = this
        vm.$el = el
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

        // 组件挂载，new Vue() 就是一个组件，将实例 vm，挂载到 el 上
        mountComponent(vm, el)
    }

}