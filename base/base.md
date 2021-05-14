## Vue
> 概念：Vue 是视图层的渐进式框架，分为两个不同的编译版本`Runtime Only/ RunTime compiler`，`Runtime Only` 版本会需要借助 `webpack/vue-loader` 将`.vue`文件编译成js，使用的是 `render` 渲染 DOM，只包含编译时的vue js文件，代码体积会更小。`Runtime compiler`没有对代码做预编译，且使用`template` 编译模板。
* Vue 中的两个核心：响应的数据变化，组合的UI视图。
* Vue 在IE8一下的版本中不支持，因为Vue中使用了一个 es5 `Object.definedProperty()`，这个方法没有代替的方案，IE8一下的不支持。

### MVC
[MVC](./MVC.jpg)
> 单向的数据，用户的每一步操作都需要重新请求数据库来修改视图层的渲染，形成一个单向的闭环。
* M：model 数据
* view：视图
* controller：控制器

### M V VM 模式
[MVVM](./MVVM.jpg)
> 双向的数据绑定：`model` 数据模型层通过数据绑定 `Data Bindings` 直接影响视图层 `View`，同时视图层 `view`通过监听 `Dom Listener` 也可以改变数据模型层 `model`。数据绑定和DOM事件监听就是 `viewModel` 层就是 `Vue` 主要做的事。也就是说：只要将 `数据模型层Model`的数据挂载到`ViewModel`层 `Vue` 就可以实现双向的数据绑定
* M：model 数据模型
* V: view 视图模板
* VM：view-model 视图模板
``` js
var vm = new Vue({
    el: '#app',
    data: {
        message: 'hello world'
    }
})
```
> vm 就是 `view-model` 数据模型层，data：就是vm `view-model` 层所代理的数据。

### Vue 的基本属性
* `el` 用于获取页面的节点，是 vue 挂载的节点。等价于 `new Vue().$mount('#app')` 写法。
* 


### Vue 的指令
> `Vue` 的指令是 `Dom` 上的一个行间属性，类似 `id, style`等
* `vue` 会忽略掉某些行间属性，例如 `input` 标签的 `value` 属性。
* `v-text` 和 `{{}}` 的用法一致，都可以绑定表达式加载到页面。可以解决 `{{}}` 页面渲染闪烁的问题。
* `v-cloak` 用来解决 `{{}}` 块级元素闪烁的问题，需要在块级元素上面样式`[v-cloak]{display:none}`。
* `v-once` 只绑定一次，数据发生变化时页面渲染也不会再变化。
* `v-for` 循环绑定数据有两种写法 `v-for="(value, key, index) of list"/ v-for="(value, key, index) in list"`，`value`就是属性值不是属性名，每一个循环出来的节点都应该配有一个 `key` 指令，否者可能导致复用，因为 `vue` 的渲染遇到相同的节点不会重新渲染而是直接复用。
* `v-on:用在普通元素上时，只能监听原生 DOM 事件。用在自定义元素组件上时，也可以监听子组件触发的自定义事件`。 简写 `@`，事件绑定的方法，例如 `v-on:click="fn"`，如果 `fn` 中不传递参数可以不写`()` `Vue` 会自动传入事件源 `event` 的属性，如果 `fn` 需要传参就加上`($event, parm)`才可以拿到事件源。`v-on:` 也可以监听自定义的事件，常用于父子组件的传递。
* `v-model` 能实现双向数据绑定，常作用在表单元素 `input`，`Vue` 会默认忽略掉`value` 属性，但是如果使用复选框 `checkbox` 时需要添加`value`属性，且`v-model`绑定的数据类型还要是数组类型。
> `Vue` 中的页面取值有两种，`{{}}` 使用在闭合的标签元素内，另一种 `v-bind:attr=''`，用在 `DOM` 行间内。`Vue` 中还提供了多种修饰符`.prevent阻止默认行为, .self执行本身才执行不受冒泡影响，.stop 阻止事件冒泡。`，详情看官网

#### `v-bind` 指令
> `v-bind`: `动态绑定DOM行间属性`，简写 `:`。
* 绑定样式的写法常用有两种
  - 对象和数组
``` html
.classA {
    color: red
}
.classB {
    width: 10px
}
<div v-bind:class="{classA: false, classB: true}">对象绑定样式，true显示，false不显示</div>
```
  - 数组，数组的声明方式需要在 data 中也绑定。
``` js
<style>
.classA {
    color: red
}
.classB {
    width: 10px
}
</style>
<div v-bind:class="[classA, classB]">数组绑定class样式</div>
<div v-bind:style="[classA, classB]">数组绑定样式</div>

data: {
    classA: 'classA',
    classB: 'classB'
}
```

#### 自定义指令 directive
* 有全局的配置和局部的自定义配置，接收两个参数`el, bindings`，如果不在`data` 属性中绑定属性值，`bindings` 可以不传
 - 局部自定义一个 颜色变换 `v-color` 指令
 ``` js
 <button v-color="color">显示</button>

 var vm = new Vue({
    el: '#app',
    data: {
        color: 'blue'
    },
    directives: {
        // el 就是上面的操作DOM元素，bindings.value 就是页面绑定值，VNode：Vue 编译生成的虚拟节点。
        color(el, bindings, VNode) {    
            el.style.color = bindings.value
            
        }
    }
 })
 ```
 - 全局自定义
 ``` js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
// 当被绑定的元素插入到 DOM 中时……
inserted: function (el) {
    // 聚焦元素
    el.focus()
}
})
 ```

 ##### 实例，实现一个自定义的拖拽指令 v-drag
``` js
// css
.classC {
    position: absolute;
    background-color: bisque;
    width: 100px;
    height: 100px;
}
// html
<div class="classC" v-drag>drag1</div>
// js
directives: {
    drag(el) {
        el.onmousedown = function (event) {
            let startX = (event.pageX - el.offsetLeft);
            let startY = (event.pageY - el.offsetTop);
            document.onmousemove = function (event) {
                el.style.left = event.pageX - startX + 'px'
                el.style.top = event.pageY - startY + 'px'
            }
            document.onmouseup = function(){
                document.onmousemove = document.onmouseup = null
            }
            event.preventDefault()
        }
    }
}
```

#### 思考：v-if, v-show 区别和使用场景
* 区别：`v-if，v-show` 都可以控制显示和隐藏。但是 `v-if` 是通过操作 `DOM` 结构的移除和重建，`v-show` 操作的是 `CSS 的 display:none;`。
* 使用场景：（1）如果需要频繁的控制显示和隐藏使用 `v-show` 会更高，`v-if` 频繁操作 `DOM` 会让页面的 `DOM renderTree` 可能多次改变引发回流(DOM 重排)；（2）如果一开始就确认数据不会发生改变或基本不会更改使用 `v-if` 会更好一些，因为 `v-if` 不通过，内部的 DOM 结果就不会进行渲染，而 `v-show` 无论是否通过都会进行渲染。
* `v-show` 指令无论条件是否成立都会渲染，但是 `v-if` 在条件不成立的条件下不进行渲染。
* `template`的标签对 `v-show` 属性失效，使用 `v-if`


#### 思考：v-model 实现双向数据绑定的原理
> vue 的数据绑定原理中使用了一个属性，`Object.definedProperty(obj, pro, des)` 中两个`set get属性`，给一个对象定义属性和属性值
``` js
// html
<input type="text" id="input" />

// js
var obj = {}
var temp = {} // 使用一个临时存放的对象
var input = document.getElementById('input')
Object.defineProperty(obj, 'name', {
    get() { // 访问name(属性) 时会被调用 
        return temp['name']
    },
    set(val) { // 给 name (属性) 赋值时会被调用， set属性触发时传入一个参数，val 参数就是赋的值
        temp['name'] = val
        input.value = val // 同时给 input 传值
    }
    //   value: '林一一',       // 默认是 undefined
    //   configurable: false,  // 是否可以被删除
    //   enumerable: false,    // 是否可枚举
    //   writable: false,      // 属性的值是否可以被修改
})

input.addEventListener('input', function () {
    console.log(this)
    obj.name = input.value
})
```

### Vue 中的数据响应 get/set
* data 初始化页面数据的对象，`vue` 会循环遍历 `data` 给 `data` 中的每一个属性都会赋予 `get, set`属性，来支持页面数据的响应式变化，`data` 中声明的变量都需要先初始化，否则不能响应。
* data 中初始化数组时，使用实例 `vm` 在外部通过改变数组的下标是不能做到响应是变化的，`因为数组的下标不具备 get set方法也就做不到数据响应的变化`，例如 `vm.arr[0] = 100` 或改变数组长度 `vm.arr.length-2` 都不会起作用。
* vue 通过监控数组的常用方法来实现响应式的变化。
``` js
var vm = new Vue({
    el: '#app',
    data: {
        person: {
            name: '林一一'
        },
        arr:[12, 34, 45, 12]
    }
})
```
[data的响应原理](./img/data响应原理.jpg)
> 数组的下标0改变成100，但是页面没有发生变化。
* 使用`vue`实例 vm 给属性`data`添加属性不会有响应式的变化，因为`vue`只处理原本就在`data`上有的属性，通过实例后加的属性不会具备响应式的变化。
* `vm.$set(target, propertyName/index, value )`：这个方法可以给 `data` 的对象添加响应式的属性和值，例如 `vm.$set(vm.person, 'age', 18)`，给上面的 `data` 属性的 `person` 添加一个响应式的数据 `age=18`。


#### 思考：data 中初始化一个方法可以吗？
> 可以的。`data 和 methods` 可以说是等价的。所以在 `data 和 methods` 中声明同一个变量名会直接报错。`data 和 methods` 声明的的数据都会放入到 `Vue` 实例上，`this` 也都指向 Vue 实例。


### Vue 中的声明周期钩子
* `created:` 在数据初始化后会被调用，专门用来发送`ajax`



### Vue 中的 filters 过滤器属性
> 在原数据不变的情况下，只是改变展示的效果，就可以使用过滤器，过滤器`filter` 是一个对象。
* 使用场景，双花括号 `{{}}`，`v-bind`中，需要配合 `管道符 |` 一起使用，过滤器的值会覆盖原有的值，过滤器中的函数需要有返回值
  - 局部使用  
``` js
// <!-- 在双花括号中 -->
{{ message | fn('a', 12) }}  // fn 是一个函数

// <!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>    // formatId 是一个函数


// js
filters: {
// value 是 message 表达式计算的值传入到过滤器函数capitalize中。
  formatId: function (value) {    
      return 'some code'
  },
  fn(){
      console.log(...arguments)
  }
}
```
  - 全局使用，挂载到构造函数上
``` js
Vue.filter('fn', () => {
    console.log(...arguments)
})
```

* 过滤器是一个函数，可以接收到参数，上面 `fn('a', 12)` 就是过滤器函数，闯入的第一个参数是`message` 表达式计算的结果，`a` 是第二个参数

### Vue 中的计算属性 computed
> `{{}}` 虽然也可以写 JS 表达式，但是如果表达式长，代码维护复用都会变得困难。所以 Vue 引入 `computed` 计算属性。`computed` 创建的属性一般受多个数据(依赖)的影响
* `computed` 计算属性，是在监听到数据发生改变后才会重新计算。
* 放在 `computed` 计算属性中的都会挂载到 `Vue` 的实例上，所以不能和 `data, methods` 中的属性重名。
* `computed` 和 `Object.definedProperty()` 一样，每一个属性都有两个属性 `get/set`。
* `computed` 对象中的属性值会被 `缓存`，如果属性值没有发生改变就不会重新计算。
* 如果计算属性不需要 `set`，可以直接将计算属性写成函数的形式。
* `computed` 属性中 `get/set` 中需要有返回值 `return`，所以不支持 `Ajax` 异步请求，没等异步执行完成，`return` 已经执行完，所以不支持异步的写法。
``` js
<div>{{msg}}</div>
<input v-model="sum" />

computed:{
    msg: {
        get() {

        },
        set(val){
        
        }
    },
    sum() { // sum 属性不需要使用`set`，可直接使用函数形式。
        return 
    }
}
```

### Vue 中的 Watch 观察者属性
> Watch 是一个对象，用来观察 `data`(现有的) 中某个值的变化执行对应的函数，函数接收两个参数`newValue, oldValue` 代表变化后的值和变化前的值。`watch` 一般一个数据影响多个数据。
* 观察值的变化，如果值没有发生变化，`Watch` 中的方法就不会执行。
* `watch` 默认只能监控 `data` 属性中属性值的一层数据变化，不能深层监控，例如`[ 1 ,{name:'林一一', age:18}]`，可以监控的到数组下标 1 的变化，但是不能监控到`name/age`属性的变化。如果需要深度监控数据变化需要采用对象的表达方式。
* `watch` 属性中的方法支持异步的写法。
* `watch` 支持普通函数和对象的写法，对象写法的 `deep: true` 能够监控到对象内部的变化。
* 可以使用全局的api，`vm.$watch()`
* 都需要观察值变化的情况下，没有涉及到异步代码可以选择 `computed` 计算属性，涉及到异步的使用 `watch`
``` js
let vm = new Vue({
    data: {
        arr: [1],
        arr1: [ 1 ,{name:'林一一', age:18}]
    },
    watch: {
        // 浅度监控：观察到 arr 元素值发生变化后，执行下面的方法。
        arr: function(newValue, oldValue) {
            console.log(newValue, oldValue)
        },

        //该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
        arr1: {
            handler(newValue, oldValue) {

            },
            deep: true
        }
    }
})

// 或者
vm.$watch('arr', (newValue, oldValue) => {
    console.log(newValue, oldValue)
})
```

#### 思考：watch 属性和 computed 属性的区别
> 相同点：两者都可以监听到值发生改变后执行相应的方法，不同：1.`watch` 属性中的方法支持异步的写法，`computed` 属性不支持异步的写法。2.`watch` 监听的时现有的数据变化，`computed` 是创建一个受依赖变化的数据。3.`computed` 的属性具有缓存，只有依赖的值发生改变`computed`才会重新计算，`watch` 是观察作用，类试于回调监听，当监听的数据变化的时候回调执行。


### 组件模板 template 和 render() 函数
* template 属性用来定义子组件的节点
* render(createElement) 函数是一种代替 `template` 的方案，`render` 函数会将虚拟`DOM`渲染成真实的 DOM，`createElement()` 函数会将一个普通的节点对象和 vue 组件渲染后返回虚拟 dom 对象。[render](https://cn.vuejs.org/v2/guide/render-function.html#%E5%9F%BA%E7%A1%80)
``` js
<div id="app"></div>

new Vue({
    el:"#app",
    render: function(createElement) {
        return createElement('h3', 'hello') // 创建一个节点 `h3` 内容是 hello 
    }
    // render: c => c('h3', 'hello')
})
```
> 上面的 `render` 函数可以将虚拟 `DOM` 渲染挂载到 `id = 'app'` 的位置


### Vue.extend(options) 
> 返回一个 vue 的钩爪函数的子类，`options` 就是 `vue` 这个父类的所有属性，相当于 ES6 中的继承，但是 `data` 必须是一个函数，原因也是`data` 返回的引用地址不能相同。
``` js
let V  = Vue.extend({
    data() {
        return {

        }
    },
    methods: {

    },
    template: {

    }
})

let vm = new V
vm.$mount('#app')
```














