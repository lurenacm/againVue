// 使用 Object.definedProperty 重新给data 属性添加 get/set 实现响应式的变化

import {
    arrayMethods
} from './arrayMethods';

import Dep from './dep';

/** Observer 就是来添加 get/set 的 class */
class Observer {
    constructor(value) {
        this.dep = new Dep()
        // vue 不监控数组的每一项，因为性能消耗很大
        // 通过操作数组的索引转变成操作数组的方法。
        Object.defineProperty(value, '__ob__', {
            enumerable: false,
            configurable: false,
            value: this
        })

        if (Array.isArray(value)) {
            value.__proto__ = arrayMethods
            this.observerArray(value)
        } else {
            this.walk(value) // 对对象的属性进行添加get/set
        }
    }

    // 数组劫持
    observerArray(arr) { // arr: [{},{}]
        // 监控数组中的对象和数组类型，再次递归，性能消耗大
        arr.forEach(item => {
            observer(item)
        })
    }

    // 对象劫持
    walk(data) {
        let keys = Object.keys(data) //keys = [name, age, attr]
        keys.forEach(key => {
            definedReactive(data, key, data[key])
        })
    }
}

function dependArr(arr) {
    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        current.__ob__ && current.__ob__.dep.depend()
        if(Array.isArray(current)) {
            dependArr(current)
        }
    }
}

function definedReactive(data, key, value) {
    let childObj = observer(value)
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            if (Dep.target) {
                /** 用来记住 Watcher */
                dep.depend()
                if (childObj) {
                    childObj.dep.depend()
                    //对嵌套的数组也添加dep和watcher 
                    if(Array.isArray(value)){
                        dependArr(value)
                    }
                }
            }
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                // 这里再次使用递归考虑到属性的赋值可能是一个对象。
                observer(newValue)
                value = newValue
            }
            dep.notify()

        }
    })
}

/** 递归实现 给对象的属性添加`get/set` */
export function observer(data) {
    if (typeof data === 'object' && data !== null) {
        return new Observer(data)
    }

    if (data.__ob__) {
        return data.__ob__
    }

    return new Observer()
}