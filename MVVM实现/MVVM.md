## MVVM
> `MVVM` 也就是双向数据绑定，`vue` 实现 `MVVM` 靠的是数据劫持和发布订阅模式

### 数据劫持 Observer
* vue 中的数据劫持需要使用到一个重要属性 `Object.definedProperty(obj, pro, des)`，将`data/methods/props` 等属性遍历到对象内，实现响应式的数据变化。
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

```



