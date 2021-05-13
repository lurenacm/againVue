// 重写数组的 push pop shift unshift reverse sort splice 因为这几个常用方法可以改变原数组

import { observer } from "."

/**继承数组的原型，没有重写的方法通过使用原型链上的原方法 */
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
        let res = oldArrayMethods[method].apply(this, args)
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
        if(instead) ob.observerArray(instead)
        return res
    }
})


export {arrayMethods}    