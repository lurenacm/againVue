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
    replace(fragment)

    function replace(fragment) {
        Array.from(fragment.childNodes).forEach(node => {
            let text = node.textContent
            // 匹配页面内的 {{}} 后取值插入
            let reg = /\{\{(.*)\}\}/
            if (node.nodeType === 3 && reg.test(text)) {
                // 在这里深度遍历对象，分割成数组通过实例 mv 插入值
                let arr = RegExp.$1.split('.') // [person, name] [person.age]
                let val = mv
                arr.forEach(key => {
                    val = val[key] // 这里取值的方式就会调用 get方法
                })

                // 在数据显示前先订阅数据，用来监听数据是否发生变化，用新值替换旧值
                new Watcher(mv, RegExp.$1, function (newVal) {
                    console.log('newVal:', newVal)
                    node.textContent = text.replace(reg, newVal)
                })
                // 替换匹配到的值
                node.textContent = text.replace(reg, val)
            }
            if (node.nodeType === 1) {
                let nodeAttrs = node.attributes
                
                Array.from(nodeAttrs).forEach(item => {
                    console.log(item.value)
                    let name = item.name
                    let val = item.value
                    if (name.indexOf('v-') === 0) {
                        node.value = mv[val]    // 将实例属性值赋予到节点的值
                    }
                })

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
    let dep = new Dep()
    console.log('Observer', dep)
    for (const key in data) {
        const val = data[key];
        if (!(val instanceof Object)) {
            return
        }
        observer(val)
        Object.defineProperty(data, key, {
            enumerable: true,
            get() {
                Dep.target && dep.addSub(Dep.target) // [Watcher]
                return val
            },
            set(newVal) {
                if (val !== newVal) {
                    val = newVal
                    observer(val)
                    dep.notify() // 执行订阅队列中的事件
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
    // 将 watcher 添加到 target 中
    Dep.target = this
    let val = mv
    let arr = exp.split('.')
    arr.forEach(key => {
        val = val[key] // 调用get和set方法
    })
    // 上面的取值每次调用 get 方法后将 Dep.target 清空 
    Dep.target = null
}

/** 通过执行 update 方法执行订阅事件 */
Watcher.prototype.update = function () {
    let val = this.mv
    let arr = this.exp.split('.')
    arr.forEach(key => {
        val = val[key] // 调用get方法
    })
    console.log(val)
    this.fn(val)
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