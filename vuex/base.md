## Vuex
### Vuex 是什么
[vuex](./images/vuex.png)
> Vuex 是为了大型项目开发的，实现不同组件之间的状态管理（数据共享）。适用于多个组件之间的数据交互
* Vuex 有一个管理数据的容器 `store`，容器内主要包括状态`state`，事件行为`actions`，事件突变(触发) `mutations`。
* Vuex 是单向的数据流，组件不能直接修改容器中 `state` 的状态(数据)
* 子组件可以通过派发 `dispatch` 一个动作 `action` 接着提交 `commit 一个 mutation`，最后修改状态 `state`
* 子组件也可以直接提交 `commit mutation` 让动作执行，组件状态 `state` 发生变化。 
* 在非严格模式 `strict:false` 允许直接来修改状态`state`，但是一般都是在严格模式中通过`mutations` 来修改数据。

#### state 和 辅助函数 mapState
> state 就是组件的数据状态。类似于`vue` 中的`data`属性
* 子组件获取数据的状态通过 `this.$store.state.`。
* mapState 只是一个`辅助计算属性computed函数`。
* `mapState 返回值是一个对象`，将写入到 `mapState` 中的赋予给 `computed` 
``` js
// 某一个子组件
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            count: state => state.count,
            countAlias: 'count'
        })
    }
}
```


#### getter 和 mapGetters 辅助函数
* `getter` 对象类似于 `vue` 中的 `computed` 计算属性。`getter` 同样也要挂载到`Vuex.Store({})`容器中。
* 只有 `getter` 依赖的值发生变化，才会重新计算，计算的值同样也会被缓存下来。
* `getter` 属性的使用通过`this.$store.getter.`来获取。
* `getter` 接收组件状态`state` 作为第一个参数
__state 和 getter实例__
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
* mapGetter 辅助函数可以将store中的getter映射到组件的`computed`计算属性中
``` js
import { mapGetters } from 'vuex'
export default {
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
    ])
  }
}
```


### mutations 
> `mutations` 是 `vuex` 唯一一个可以改变状态的方式
* `mutations` 是一个对象，里面注册了控制组件状态的事件
* `mutations` 接收状态 `state` 作为事件的第一个参数。
* `mutations` 的触发的唯一方式通过 `commit(fn, params)` 提交注册的事件，组件可以直接提交`mutation` 事件，也可以通过 `action` 提交事件``
* 每一个 `mutation` 都有一个 `type` 类型，是事件的名称
* `mutations` 不支持异步操作。因为 `mutation` 触发时回调函数的还没有被调用，那么数据的状态就无法准确知道是不是最新的。
* 同样也可以借用 `mapMutations` 辅助函数将事件映射到 `methods` 中
``` js
// 注册组件状态的方法
let store = new Vuex.Store({
    state: {
        count:1
    },
    mutations: {
        add(state) {

        }
    }
})

new Vue({
    store
})

// 提交/触发的事件
this.$store.commit('add')
```

### action
> 为了解决 `mutations` 中不能使用异步的问题引入 action。
* `action` 提交的是一个 `mutation` 事件。
* `action` 支持异步操作
* `action` 中的每一个函数都可以接收一个 `context` 参数，这个参数和 `store` 实例具备相同的属性和方法，但 `context` 不是实例 `store`
* `action` 函数通过控制参数 `context` 提交一个 `mutation` 事件。
``` js
let store = new Vuex.Store({
    state: {
        count:1
    },
    action:{
        add(context, val) {
            setTimeout(() => {
                context.commit('add', val)
            }, 1000)
        }
    },
    mutations: {
        add(state, val) {
            state.count = state.count + 1
        }
    }
})
```
* 那么组件如何触发 `action` 中的事件，vuex 为触发 `action` 提供有一种派发方式`dispatch`
``` js
store.dispatch('increment', 1)

// 以对象形式分发
store.dispatch({
  type: 'increment',
  amount: 10
})
```


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



