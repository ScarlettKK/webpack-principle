/**
 * loader: 将webpack不能识别的文件转换成webpack可识别模块
 * 执行顺序分类：normal、inline loader用的多，pre、post用的少
 * normal：平时就用了
 * inline：在import语句中用，详见style-loader
 *         详情见https://yk2012.github.io/sgg_webpack5/origin/loader.html#loader-%E6%A6%82%E5%BF%B5
 * loader分类：同步、异步（更好的方案，但没有异步操作不要强行用）、raw、pitch（熔断机制）
 * 提升：看github源码
 */
const path = require("path")
const HTMLWebpackPlugin = require('html-webpack-plugin')


module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name].js',
        clean: true
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
            {
                test: /\.js$/,
                loader: './loaders/banner-loader',
                // 增加options选项，使得作者名可配置
                options: {
                    author: 'Scarlett'
                }
            },
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
    ],
    mode: 'development'
}