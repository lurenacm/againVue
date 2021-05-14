// 重写数组的 push pop shift unshift reverse sort splice 因为这几个常用方法可以改变原数组

import {
    observerArray
} from "./index"

/**继承数组的原型，没有重写的方法使用原型链上的原方法 */
const oldArrayMethods = Array.prototype
let arrayMethods = Object.create(oldArrayMethods)

const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        // this 指向的是 (vm.arrs.push ) arrs 这个数组，
        // 需要添加 this 指向调用的对象不然，原型上的 push 没有调用的主体
        let res = oldArrayMethods[method].call(this, ...args)

        // 为了监控数组添加的数据类型也是一个 object push({}, {}) 
        // 需要再次进行数组劫持添加 definedPrototype
        let instead;
        let ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                instead = args
                break;
            case 'splice':
                instead = args;
                break;
            default:
                break;
        }
        if (instead) ob.observerArray(instead)
        return res
    }
})

function push() {
    push()
}

export {
    arrayMethods
}