## Vuex
### Vuex 是什么
[vuex](./images/vuex.png)
> Vuex 是为了大型项目开发的，实现不同组件之间的状态管理（数据共享）。适用于多个组件之间的数据交互
* Vuex 有一个管理数据的容器 `store`，容器内主要包括状态`state`，事件行为`actions`，事件突变(触发) `mutations`。
* Vuex 是单向的数据流，组件不能直接修改容器中 `state` 的状态(数据)
* 子组件可以通过派发 `dispatch` 一个动作 `action` 接着提交 `commit` 让这个行动可以执行（突变）`mutations`，最后修改状态 `state`
* 子组件也可以直接提交 `commit` 动作，来操控 `mutations` 让动作执行，组件状态 `state` 发生变化。 
* 在非严格模式 `strict:false` 允许直接来修改状态`state`，但是一帮都是在严格模式中通过`mutations` 来修改数据。

#### state 和 getter
> state 就是组件的数据状态。类似于`vue` 中的`data`属性
* 子组件获取数据的状态通过 `this.$store.state.`。
* `getter` 对象类似于 `vue` 中的 `computed` 计算属性。`getter` 同样也要挂载到`Vuex.Store({})`容器中。
* `getter` 属性的使用通过`this.$store.getter.`来获取。
``` js
const state = {
    count: 0
}

const getters = {
    val: function(state) {
        return state.count++
    }
}

const store = new Vuex.Store({
    state,
    getters
})

new Vue({
    store
})

// 使用 getter
<div>{{this.$store.getters.val}}</div>
```
### mutations 
* `mutations` 不支持异步操作。




### Vuex 怎么使用
* 组件之间的数据是共享的，不能随意修改组件的状态 `state` 可以先将数据保存后再修改，正确的使用方法是通过管理员 `mutations` 来修改数据状态
__举一个小栗子__
``` js
// main.js
// 组件的状态（数据）
const state = {
    count: 0
}
const mutations = {
    add(state, val) {    // 这里的 容器状态 state 是 vuex 自动放入的。
        console.log(val)
        state.count++ 
    }
}

// 组件数据的容器，将 state状态，mutations挂载到容器中
const store = new Vuex.Store({
    state: state,
    mutations: mutations
})

// 最后将 store 容器注册到 vue 实例中，那么同一个 vue 实例就具备了 this.$store 的容器
new Vue({
    el:"#app",
    store: store
})
```
> 那么同一个 vue 实例的就可以使用 `this.$store.state.count` 获取组件的状态(数据)。
``` js
// 某一个子组件
<div>{{this.$store.state.count}}<button @click="add">增加</button> </div>

export default  {
    data(){
        return {}
    },
    methods: {
        add() {
            this.$store.commit('add', 2)   
        }
    }
}
```
> 上面的子组件挂载到的是同一个 `Vue` 实例，所以可以直接使用 `this` 控制容器 `store` 行为，子组件提交事件 `commit(add, 2)` 后管理员 `mutations` 接收到就可以执行 `add` 这个方法。提交的同时还可以传递参数 `payload`。


### Vuex 使用场景



