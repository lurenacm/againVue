// 使用 Object.definedProperty 重新给data 属性添加 get/set 实现响应式的变化

/** Observer 就是来添加 get/set 的 class */
class Observer {
    constructor(value) {
         // vue 不监控数组的每一项，因为性能消耗很大
         // 通过操作数组的索引转变成操作数组的方法。
        if(Array.isArray(value)){   
                
        }else{
            this.walk(value)    // 对对象的属性进行添加get/set
        }
    }

    // 检测每一步的数据变化
    walk(data) {
        let keys = Object.keys(data)    //keys = [name, age, attr]
        keys.forEach(key => {
            definedReactive(data, key, data[key])
        })
    }
}

function definedReactive(data, key, value) {
    // 递归实现 对象的数据添加`get/set`
    observer(value)
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newValue) {
            if(newValue === value )  return
            // 这里再次使用递归考虑到属性的赋值可能是一个对象。
            observer(newValue)
            value =  newValue
        }
    })
}

export function observer(data) {
    if(typeof data === 'object' && data !== null) {
        return new Observer(data)
    }
}