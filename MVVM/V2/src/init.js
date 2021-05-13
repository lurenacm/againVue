import {initState} from './state'

export function initMixin(myVue) {
    // 初始化流程
    myVue.prototype._init = function (options) {
        // 数据劫持，其他地方也需要使用
        const vm = this
        this.$options = options

        // 初始化数据
        initState(vm)
    }


}