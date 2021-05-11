// ### 发布订阅模式
// > 一句话概括：订阅就是往数组中放入函数，发布就是执行数组中的每一项
// * 发布订阅模式需要先有订阅才能发布。
// * 订阅：需要有一个事件将需要发布的事件放入到一个数组中`[fn1, fn2, fn3]`。
// * 发布：再有一个事件去依次触发数组中的事件。

function Dep() {
    this.subs = []
}

/** 订阅事件：一个将需要发布的事件放入到数组中 */
Dep.prototype.addSub = function (sub) {
    this.subs.push(sub)
}

/** 发布：一个将在数组中订阅的事件依次执行的事件。
 * update：为了方便执行方法，规定每一个订阅的事件都有一个 update 方法执行函数
 */
Dep.prototype.notify = function () {
    this.subs.forEach(sub => sub.update())
}

// Watcher 是 实现订阅队列中 [fn1, fn2, fn3] 某一个事件具体行为的容器
function Watcher(fn) {
    this.fn = fn
}

/** 通过执行 update 方法执行订阅事件 */
Watcher.prototype.update = function () {
    this.fn()
}

// 那么 Watcher 类上的实例都会有一个 update 函数
let watcher = new Watcher(function(){console.log(1)})

// 通过调用 update() 的方法就可以执行订阅的事件
let dep = new Dep()
// 上面的 sub 就是每一个 watcher 实例
dep.addSub(watcher)

console.log(dep.subs)
console.log(dep.notify())