export function patch(oldVNode, vNode) {
    // 用虚拟 dom 生成真实的 z
    if(oldVNode.nodeType === 1) {
    
        const parentElm = vNode.parentNode  // 获取父节点

        let elm = createElm(vNode)   // 根据虚拟节点，创建真实的dom

        parentElm.insertBefore(elm, oldVNode.nextSibling()) // 将创建的真实节点插入到旧节点的前

        parentElm.removeChild(oldVNode) // 同时移除旧的节点

        return elm
    }
}

function createElm(vNode) {
    let {tag, data, children, text} = vNode
    if(typeof tag === 'string') {
        vNode.el = document.createElement(tag)  // 根据虚拟 dom 中的标签tag，创建真实父节点的标签
        children.forEach(child => {
            vNode.el.appendChild(createElm(child))  // 遍历子节点添加到父节点中
        })

    }else {
        vNode.el = document.createTextNode(text)
    }
}