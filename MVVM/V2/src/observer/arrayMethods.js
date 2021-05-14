// 重写数组的 push pop shift unshift reverse sort splice 因为这几个常用方法可以改变原数组

import { observerArray } from "./index"

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
        // 需要改变 this 指向调用的对象不然 push 没有调用的主体
        let res = oldArrayMethods[method].call(this, ...args)
        // console.log('res',res, oldArrayMethods[method](...args))
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

function push() {
    push()
}

export {arrayMethods}    