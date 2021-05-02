## SPA （single page application）单页面应用
> 就是只有一个 `html` 页面的 web 应用

## vue-router 基本使用
> vue 中 可以使用 vue-router 配置组件和路由映射，结合 vue.js 可以创建单页面应用
* `vue-router` 中提供了一个全局组件 `<router-view>` 用来存放路由组件
* 注册的路由路径，组件 `path/component` 要挂载到 `vuePouter` 的 `routes` 属性上。另外 `path` 属性要加上路径 `/` 表示根路径。可以使用 `path:'/*'` 处理没有匹配到的路径。
* 再将 `vuePouter` 的实例挂载到 vue 的 `router` 属性上，形成关联。
* 代码上线后使用 `history` 定位，`vueRouter` 提供一个 `mode` 属性可以直接修改 `hash/history/abstract`，浏览器默认值: `"hash"`。

### vue-router 的声明式导航
* `vue-router` 中提供一个全局组件 `<router-link to="" tag="">`，属性 `to` 和路由中 `path` 一致，`tag` 默认是 `<a>` 可以指定写入其他类型的节点，同时 `vueRouter` 给 `<router-link>` 内置了个样式名 `router-link-active` 链接激活时使用的 CSS 类名。可以通过`vueRouter`的属性 `linkActiveClass` 对内置的样式名起一个别名。例如 `linkActiveClass='active'`。


### vue-router 的编程式导航
> 导航写入在 js 代码中
* 通过 `this.$router.push('/')` 跳转页面和 `this.$router.go()/back()` 返回指定的页面。

``` js
let home = {
    template: '<div>首页</div>',
}
let list = {
    template: '<div>列表</div>',
}
// 路由列表
let routes = [{
        path: '/home',
        component: home
    },
    {
        path: '/list',
        component: list
    }
]
// 注册路由
let router = new VueRouter({
    routes: routes,
    linkActiveClass='active'    // 将内置的样式名 router-link-active 修改成`active`
})
// 挂载路由
let vm = new Vue({
    el: '#app',
    router:router
})
```
> 上面路由的每一次切换组件都会被销毁 `beforeDestroy()` 钩子都会被执行。


### 路由嵌套
> 用于不同路由组件之间的嵌套
* 在嵌套的路由上使用 `children` 数组属性，里面同样是路由表。
* `children` 中的 `path` 属性不可以带有 `/`，因为 `/` 表示根路径会覆盖掉一级路径。
* 子路由 `<router-link to="/home/detail">` 中的 `to=""` 需要补全所有的路径。
``` html
<template>
    <div>
        首页
        <router-link to="/home/detail"></router-link>
        <router-view></router-view>
    </div>
</template>
```
``` js
let router = [
    {
        path:'/home',
        component:home,
        children:[
            {path:'detail', component: detail}
        ]
    }
]
```

### 携带路由参数
* 在 path 路径的后面添加 `/:params` 可以携带任意的参数，例如 `path="/home/:id/:name"` 可以匹配到 `path="/home/1/lyy` 或 `path="/home/2/lee`。
* 上面的匹配关系在 `vueRouter` 中形成了有一个对象 `{id:1, name:'lyy'}/{id:2, name:'lee'}`，这个对象存放到 `this.$route.params.` 中
``` js
<router-link to="/home/1/林一一" tag="button">首页</router-link>

<div>首页 {{this.$route.params.id}}{{this.$route.params.name}}</div>

// 路由表
let routes = [{
        path: '/home/:id/:name',
        component: home
    }]

// 注册路由
let router = new VueRouter({
    routes: routes
})

// 挂载路由
let vm = new Vue({
    el: '#app',
    router:router
})
```

#### 思考：怎样能知道路径参数的变化，根据页面的参数发送请求？
* 可以使用对象 `watch` 属性来监控页面路径 `$route` 参数的变化来发送 `ajax`，不能使用 `computed` 的原因是因为，`computed` 不支持异步操作。
``` js
watch: {
    $route(newVal, oldVal) {    // $route 是一个路径参数大的对象
        console.log('...')
        // 一些 ajax 请求。
    }
}
```





