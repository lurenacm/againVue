// let vm = new Vue({
//     el:'#app',
//     data:{
//         obj:{
//             personA:{
//                 name: '林一一',
//                 age : 18
//             }
//         }
//     },
//     methods:{}
// })

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
            let reg = /\{\{(.*)\}\}/
            if (reg.test(text)) {
                console.log(RegExp.$1)  // person.name, age
                // 在这里深度遍历对象，
                let arr = RegExp.$1.split('.')  // [person, name]
                let obj = mv
                arr.forEach(key => {    // 让 obj 和 mv 公用同一个引用地址，这样obj就可以得到深层的属性值
                    obj = mv[key]
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