/**
 * loader: 将webpack不能识别的文件转换成webpack可识别模块
 * 执行顺序分类：normal、inline loader用的多，pre、post用的少
 * normal：平时就用了
 * inline：在import语句中用，详见style-loader
 *         详情见https://yk2012.github.io/sgg_webpack5/origin/loader.html#loader-%E6%A6%82%E5%BF%B5
 * loader分类：同步、异步（更好的方案，但没有异步操作不要强行用）、raw、pitch（熔断机制）
 * 提升：看github源码
 */
/**
 * Plugin: 通过插件我们可以扩展 webpack，加入自定义的构建行为，
 *         使 webpack 可以执行更广泛的任务，拥有更强的构建能力。
 * 插件：插入到某一个特定的webpack流水线阶段，去干一些特定的事情
 * 站在代码逻辑的角度就是：webpack 在编译代码过程中，会触发一系列 【Tapable 钩子事件】，
 *                    插件所做的，就是找到相应的钩子，往上面挂上自己的任务，也就是注册事件，
 *                    这样，当 webpack 构建的时候，插件注册的事件就会随着钩子的触发而执行了。
 *                    （类似react生命周期）
 * 钩子的本质就是：事件。为了方便我们直接介入和控制编译过程，
 *              webpack 把编译过程中触发的各类关键事件封装成事件接口暴露了出来。
 *              这些接口被很形象地称做：hooks（钩子）。开发插件，离不开这些钩子。
 * webpack 中目前有十种 hooks，在 Tapable 源码中可以看到
 * Tapable 还统一暴露了三个方法给插件，用于注入不同类型的自定义构建行为：（三种方法，可以注册多种钩子）
 *                                                           tap：可以注册【同步】钩子和【异步】钩子。
 *                                                           tapAsync：回调方式注册【异步】钩子。
 *                                                           tapPromise：Promise 方式注册【异步】钩子
 * Plugin 构建对象：
 * 1. 【环境配置，全程唯一，流程管理】compiler 对象中保存着完整的 Webpack 环境配置，
 *    每次启动 webpack 构建时它都是一个独一无二，仅仅会创建一次的对象。
 *    这个对象会在首次启动 Webpack 时创建，我们可以通过 compiler 对象上访问到 Webapck 的主环境配置，
 *    比如 loader 、 plugin 等等配置信息。
 *    （可以获取到webpack配置文件中的所有信息、可以进行文件操作、可以拿到上面的hooks）
 * 2. 【资源处理，一个资源一个，资源管理】compilation 对象代表一次资源的构建，compilation 实例能够访问所有的模块和它们的依赖。
 *    一个 compilation 对象会对构建依赖图中所有模块，进行编译。 
 *    在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)。
 *    （对具体资源的处理，可以访问打包的每一个文件、代码块、打包结果，也可以注册hook，比compiler的hook更多）
 *    （maybe 一个打包入口就有一个 compilation 对象？多个如何理解？）
 * 
 * Plugin 构建对象 补充信息：
 * 简单来说，Compilation的职责就是对所有 require/import 语句中对象的字面上的编译，
 * 编译构建 module 和 chunk，并调用插件构建过程，同时把本次构建编译的内容全存到内存里。
 * compilation 编译可以多次执行，如在watch模式下启动 webpack，
 * 解答你的疑惑：
 * 【开发模式下会有多个compilation，当开发者修改文件后，会生成新的compilation对象，但此时Compiler不变】
 * 【其他场景也就是一个，多入口文件并不会有多个compilation，因为打包结果只有一个出口】
 * 【当 Webpack 以【开发模式】运行时，每次监测到源文件发生变化，都会重新实例化一个compilation对象，
 * 从而生成一组新的编译资源对象。这个对象可以访问所有的模块和它们的依赖。】
 * 
 * Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译
 * 【传给每个插件的 Compiler 和 Compilation 对象都是同一个引用。】
 * 也就是说在一个插件中修改了 Compiler 或 Compilation 对象上的属性，会影响到后面的插件
 * compiler 对象记录着构建过程中 webpack 环境与配置信息，整个 webpack 从开始到结束的生命周期。针对的是webpack。
 * compilation 对象记录编译模块的信息，只要项目文件有改动，compilation 就会被重新创建。针对的是随时可变的项目文件。
 * 具体文档见webpack官网
 * 
 * 生命周期简图：https://yk2012.github.io/sgg_webpack5/origin/plugin.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E7%AE%80%E5%9B%BE
 */
const path = require("path")
const HTMLWebpackPlugin = require('html-webpack-plugin')
const TestPlugin = require('./plugins/test-plugin')
const BannerWebpackPlugin = require('./plugins/banner-webpack-plugin')
const CleanWebpackPlugin = require('./plugins/clean-webpack-plugin')
const AnalyzeWebpackPlugin = require('./plugins/analyze-webpack-plugin')


module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name].js',
        // clean: true // 此处我们后面用自定义插件CleanWebpackPlugin解决
    },
    module: {
        rules: [
            // 注意优先级，除非指明enforce，否则从下到上调用
            // {
            //     test: /\.js$/,
            //     // 使用自定义loader
            //     loader: path.resolve(__dirname, './loaders/test-loader.js')
            // }
            {
                test: /\.js$/,
                // 使用自定义loader
                // 从下到上执行，所以先执行test2，后test1
                // use: [
                //     './loaders/demo/test1.js',
                //     './loaders/demo/test2.js',
                // ]
                // loader: './loaders/demo/test3.js'
                /**
                 * 打印结果：
                 * pitch loader1
                 * pitch loader2
                 * pitch loader3
                 * normal loader3
                 * normal loader2
                 * normal loader1
                 */
                // use: [
                //     './loaders/demo/test4.js',
                //     './loaders/demo/test5.js',
                //     './loaders/demo/test6.js',
                // ]
                // 打包结果：一堆换行符（因为main.js中只有console.log
                loader: './loaders/clean-log-loader.js'
            },
            // {
            //     test: /\.js$/,
            //     loader: './loaders/banner-loader',
            //     // 增加options选项，使得作者名可配置
            //     options: {
            //         author: 'Scarlett'
            //     }
            // },
            {
                test: /\.js$/,
                loader: './loaders/babel-loader',
                options: {
                    presets: ["@babel/preset-env"]
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: "./loaders/file-loader",
                // 解决图片重复打包问题，不然图片资源会由我们处理一次，webpack又处理一次
                // 这里禁用webpack5默认处理图片资源，仅使用file-loader处理
                type: "javascript/auto",
            },
            {
                test: /\.css$/,
                use: ['./loaders/style-loader', 'css-loader']
            },
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html')
        }),
        // new TestPlugin(),
        new BannerWebpackPlugin({
            author: 'Scarlett'
        }),
        new CleanWebpackPlugin(),
        new AnalyzeWebpackPlugin()
    ],
    mode: 'production'
}