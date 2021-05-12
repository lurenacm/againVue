/** babel 转化高级语法， serve 启动一个静态的服务 */
import babel from 'rollup-plugin-babel' 
import serve from 'rollup-plugin-serve'

export default {
    input: './V2/src/index.js',  // rollup 要打包的文件
    output: {
        file:'./V2/dist/umd/vue.js', // 打包后的出口文件
        name: 'myVue',      // 打包后全局变量的名字
        format: 'umd',   // 统一打包的模块规范
        sourcemap: true, // 能找到源代码报错的位置
    },
    plugins:[
        babel({     // 插件要编译的 js 文件路径
            exclude: 'node_modules/**'
        }),
        process.env.ENV === 'development'? serve({     // 插件 serve 要打开的页面
            open: true,        
            openPage: '/MVVM/V2/public/index.html',
            port: 3000,  //端口号
            contentBase: ''
        }) : null
    ]
}
 