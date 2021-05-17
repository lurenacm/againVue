export function lifeCycleMixin() {
    myVue.prototype._update = function() {
        
    }
}

export function mountComponent(vm, el) {
    
    // 组件的更新方法，组件首次挂载个更新时执行
    let updateComponent = () => {
        // 调用 render 函数生成虚拟dom
        vm._update(vm._render())
        // 用虚拟 dom 生成真实的 dom    

    }
    updateComponent()
}