## Vuex
### Vuex 是什么
> Vuex 是为了大型项目开发的，实现不同组件之间的状态管理（数据共享）。适用于多个组件之间的数据交互

### Vuex 怎么使用
__举一个小栗子__
``` js
// 组件的状态（数据）
const state = {
    count: 0
}

// 组件数据的容器，将state状态挂载到容器中
const store = new Vuex.Store({
    state: state
})

// 最后将 store 容器注册到 vue 实例中，那么同一个 vue 实例就具备了 this.$store 的容器
new Vue({
    el:"#app",
    store: store
})
```
> 那么同一个 vue 实例的就可以使用 `this.$store.state.count` 获取组件的状态(数据)。
* 组件之间的数据是共享的，不能随意修改组件的状态 `state` 可以先将数据保存后再修改

### Vuex 使用场景



