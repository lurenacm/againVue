/** 创建元素 */
export function createElement(vm, tag, data = {}, ...children) {
   return vNode(vm, tag, data, data.key, children, undefined)
}

/** 创建文本 */
export function createText(vm, text) {
    return vNode(vm, undefined, undefined, undefined, undefined, text)
}


function vNode(vm, tag, data, key, children, text) {
    return {
        vm,
        tag,
        data,
        key,
        children,
        text
    }
}