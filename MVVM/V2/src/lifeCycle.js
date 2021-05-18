import { patch } from "./vdom/patch"
import Watcher from "./observer/watcher"


export function lifeCycleMixin() {
    /** 将虚拟 dom 创建成真实的 dom */
    myVue.prototype._update = function(vNode) {
        let vm = this 
        /** 核心的 diff 算法 */
       vm.$el =  patch(vm.$el, vNode)
    }
}

export function mountComponent(vm, el) {
    
    // 组件的更新方法，组件首次挂载个更新时执行
    let updateComponent = () => { 
        // 调用 render 函数生成虚拟dom
        vm._update(vm._render())
        // 用虚拟 dom 生成真实的 dom    
    }
    

    new Watcher(vm, updateComponent, ()=> {

    }, true)
}