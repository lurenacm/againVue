
// 观察者模式，根 vm 属性的变化，调用 vm._update() 方法将虚拟 dom 更新。
// 每一个属性都可以有多个 Watcher，因为属性可能在不同的组件中被使用。
// 同时一个 Watcher 也可以对应多个属性。需要可以收集存放一个属性多个 Watcher 的容器，这就是 dep
// 那么一个 Watcher 对应多个属性也就是要存放这个 Dep。

import Dep, { pushTarget, popTarget } from "./dep"
import { queueWatcher } from "./scheduler"


/** Watcher 可以有很多个，通过 id 来区分，*/
let id = 0
class Watcher {
    constructor(vm, expOrFun, cb, options) {
        this.vm = vm
        this.expOrFun = expOrFun
        this.cb = cb
        this.options = options

        this.getter = expOrFun

        this.id = id++
        this.deps = []  // 用来存放 deps 和 Dep 存放Watcher 一样

        /** 去重，不需要多次的因为同个属性取值多个调用 */
        this.depsId  = new Set()
        this.get()
        
    }

    // expOrFun (getter) 最重要的是调用了 render() 方法后 从实例 vm 上取值，
    // 取值就会调用到 definedProperty 中的 get 方法
    // 数据更新时只需要调用 get 方法，
    get() {
        pushTarget(this)
        this.getter()
        popTarget()
    }

    /** 多个修改同一个数据，只更新最后一次修改 */
    update() {
        this.get()
        /** 多次调用update 先将 watcher 缓存下来，最后一起更新 */
        queueWatcher(this)
    }

    run() {
        this.get()
    }

    addDep() {
        let id =dep.id
        if(!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSubs(this)
        }
    }
}


export default Watcher