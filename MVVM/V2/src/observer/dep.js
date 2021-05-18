/** 依赖收集器，用来收集一个属性多个 Watcher 类 */

let id = 0
class Dep {
    constructor() {
        this.id = id++
        this.subs = [] // 用来存放 Watcher 
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    addSubs(watcher) {

    }
}

// 为了将 Watcher 和 Dep 做关联，需要做一些处理
Dep.target = null

export function pushTarget(watcher) {
    Dep.target = watcher
}

export function popTarget(watcher) {
    Dep.target = null
}

export default Dep