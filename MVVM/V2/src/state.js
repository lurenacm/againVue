// 初始化 props data computed watch 等属性
import {
    observer
} from './observer/index'
import Watcher from './observer/watcher'

export function initState(vm) {
    let opts = vm.$options
    if (opts.props) {
        initPros(vm)
    }
    if (opts.methods) {
        initMethods(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }

    if (opts.watch) {
        initWatch(vm, opts.watch)
    }
}

export function stateMixin(myVue) {
    myVue.prototype.$watch = function(key, handler,options={}){
        options.user = true
        new Watcher(vm, key, handler, options)
    }
}

function initPros() {}

function initMethods() {}

/** vm._data 是为了保证可以访问到data(data假如是函数)属性的值 */
function initData(vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data
    //响应式原理 数据劫持：劫持data对象的数据，使用 Object.definedProperty() 添加 get/set 方法

    // 改变访问的方式 vm._data. === vm.  做一层代理
    for (const key in data) {
        proxy(vm, key)
    }

    observer(data)
}

function proxy(vm, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm['_data'][key]
        },
        set(newVal) {
            return vm['_data'][key] = newVal
        }
    })
}


function initComputed(vm) {}

function initWatch(watch) {
    for (const key in watch) {
        const handler = watch[key];
        // 如果是数组，需要循环遍历依次执行
        if (Array.isArray(handler)) {
            for (let i = 0; i <= handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

function createWatcher(vm, key, handler) {
    return vm.$watch(key, handler)
}