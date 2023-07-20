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
            {
                test: /\.js$/,
                // 使用自定义loader
                loader: path.resolve(__dirname, './loaders/test-loader.js')
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