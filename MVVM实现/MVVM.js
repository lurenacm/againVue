function myVue(options = {}) {
    // 将属性都挂载到 this.$options 中
    this.$options = options
    // 将 this.$options 中的 data 保存到私有属性 _data 中方便使用
    var data = this._data = this.$options.data
    // 获取到 data 数据后将数据劫持，通过 definedProperty() 写入
    observer(data)
    // 上面响应式处理后，这里将优化实例的访问data的方式，很简单只需要将属性定义到this(实例)上就行
    for (const key in data) {
        Object.defineProperty(this, key, {
            enumerable: true,
            get() {
                return this._data[key]
            },
            set(newVal) {
                this._data[key] = newVal
            }
        })
    }
    compile(options.el, this)
}

// 模板编译实现，template，将el 节点转化成文档碎片 保存在内存中
function compile(el, mv) {
    mv.$el = document.querySelector(el)
    let fragment = document.createDocumentFragment()
    while (child = mv.$el.firstChild) {
        fragment.appendChild(child)
    }
    console.log(fragment.childNodes)
    replace(fragment)

    function replace(fragment) {
        Array.from(fragment.childNodes).forEach(node => {
            let text = node.textContent
            // 匹配页面内的 {{}} 后取值插入
            let reg = /\{\{(.*)\}\}/
            if (reg.test(text)) {
                // 在这里深度遍历对象，分割成数组通过实例 mv 插入值
                let arr = RegExp.$1.split('.')  // [person, name] [person.age]
                let val = mv
                arr.forEach(key => {
                    val = val[key]
                })

                // 在数据显示前订阅数据
                new Watcher(mv, RegExp.$1, function(newVal){
                    node.textContent = text.replace(reg, newVal)
                })
                // 替换匹配到的值
                node.textContent = text.replace(reg, val)
            }
            if (node.childNodes) {
                replace(node)
            }
        });
    }

    mv.$el.appendChild(fragment)
}

// 使用递归深度遍历，通过 Observer 遍历 data 对象内的每一个属性，通过 definedProperty() 写入
function Observer(data) {
    for (const key in data) {
        const val = data[key];
        if (!(val instanceof Object)) {
            return
        }
        observer(val)
        Object.defineProperty(data, key, {
            enumerable: true,
            get() {
                return val
            },
            set(newVal) {
                if (val !== newVal) {
                    val = newVal
                    observer(val)
                }
                return
            }
        })
    }
}

function observer(data) {
    return new Observer(data)
}

// 发布订阅
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
function Watcher(mv, exp, fn) {
    this.mv = mv
    this.exp = exp
    this.fn = fn
    // 将数据添加到订阅中
    Dep.target = this
    
}

/** 通过执行 update 方法执行订阅事件 */
Watcher.prototype.update = function () {
    this.fn()

}







// let mv = new myVue({
//     data: {
//         obj: {
//             p: {
//                 a: 1
//             }
//         }
//     }
// })
// console.log(mv.obj.p.a)
// console.log(mv.obj.p.a=100)
// console.log(mv.obj.p.a)