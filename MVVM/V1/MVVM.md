## MVVM
> `MVVM` 也就是双向数据绑定，`vue` 实现 `MVVM` 靠的是数据劫持和发布订阅模式

### 数据劫持 Observer
* vue 中的数据劫持需要使用到一个重要属性 `Object.definedProperty(obj, pro, des)`，将`data/methods/props` 等属性遍历到对象内，实现监控数据变化。
``` js
var obj = {}
var temp = {}   // 使用一个临时存放的对象
Object.defineProperty(obj, 'name', {
    //访问name(属性) 时会被调用
    get() {
        return temp['name']
    },
    //给 name (属性) 赋值时会被调用，set属性触发时传入一个参数，val 参数就是赋的值
    set(val) {
        temp['name'] = val
        input.value = val // 同时给 input 传值
    }
    //   value: '林一一',       // 默认是 undefined
    //   configurable: false,  // 是否可以被删除 默认false
    //   enumerable: false,    // 是否可枚举（遍历） 
    //   writable: false,      // 属性的值是否可以被修改
})
```
> 使用`get/set`属性时不可以有 `value/writable` 属性。
* 模式实现 `new Vue()` 初始化的`data`属性的过程
``` js
function myVue(options = {}) {
    // 将属性都挂载到 this.$options 中
    this.$options = options
    // 将 this.$options 中的 data 保存到私有属性 _data 中方便使用
    var data = this._data = this.$options.data
    // 获取到 data 数据后将数据劫持，通过 definedProperty() 写入
    observer(data)
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
let mv = new myVue
```
> 上面的代码中能初始化`data` 的属性，通过 `mv._data.` 就可以实现响应式访问和赋值的操作，接下来简化一下实例访问 `data` 的方式，通过 `mv.` 就能访问到，只需要将响应式后的数据定义到实例上即可
``` js
function myVue(options = {}) {
    this.$options = options
    var data = this._data = this.$options.data
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
}
```
> 上面的`set()`属性中为什么是`this._data[key] = newVal`而不是直接 `val=newVal` ？因为通过`this._data[key]`获取到的值都是已经经过响应式处理的。

### 模板编译实现
> 模板编译实现就是使用 `{{}}` 可以将数据绑定到页面的效果。`vue template` 标签中的节点都会转化成文档碎片。文档碎片会转变载内存中不会出现在 `DOM` 这样插入的文档碎片不会引起DOM回流 
* 转化成文档碎片后根据有无 `{{}}` 来插入数据，再将插入后的数据重新显示到页面上。
``` js
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
            if (reg.test(text)) {
                // 在这里深度遍历对象，分割成数组通过实例 mv 插入值
                let arr = RegExp.$1.split('.')  // [person, name] [person.age]
                let obj = mv
                arr.forEach(key => {
                // 这里每一次的调用和赋值都会访问一次 Observer 中的get和set
                    obj = obj[key]      
                })

                // 替换匹配到的值
                node.textContent = text.replace(reg, obj)
            }
            if (node.childNodes) {
                replace(node)
            }
        });
    }
    // 匹配后的数据显示到页面上
    mv.$el.appendChild(fragment)
}
```
__效果图[编译前](./img/afterCompile.jpg)[编译后](./img/beforeCompile.jpg)__
> 上面效果的虽然已经可以匹配编译到 `{{}}`，但是如何做到修改数据让页面的数据也一起变化呢

### 数据和视图关联
> 思路也很简单，在监控到修改的数据变化后，触发一个事件让页面的数据也跟着变化就好了，这和发布订阅的设计模式就很接近了
* 简单点说：订阅就是往数组中放入函数，发布就是执行数组中的每一项函数
[参考文献：]()
``` js
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
```
* 在数据显示到页面之前，我们就需要订阅这些数据，也就是在 `node.textContent = text.replace(reg, obj)` 之前订阅数据。在数据变化后再显示到页面上
* 同时在数据变化后是一个新的值，
``` js
node.textContent = text.replace(reg, obj)
```

### 双向数据绑定 v-model
> 思路：获取节点后判断行间属性的开头 `v-`，再将节点的 `value` 双向绑定
``` js

```







