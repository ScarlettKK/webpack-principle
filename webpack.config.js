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
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html')
        }),
    ],
    mode: 'development'
}