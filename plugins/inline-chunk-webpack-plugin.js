// 作用：webpack 打包生成的 runtime 文件太小了，额外发送请求性能不好
//      所以需要将其内联到 js 中，从而减少请求数量。【把它变为行内js】
//      同理如果有其他比较小的js文件，也可以考虑这么做
// runtime文件：保存文件之间关系、依赖以及其content hash的值的文件

// 【原来：<script> 中 src 链接 ==> 变成 <script> 中直接包代码】

/**
 * 开发思路:
 * 我们需要借助 html-webpack-plugin 来实现
 * 1. 在 html-webpack-plugin 输出 index.html 前将内联 runtime 注入进去
 * 2. 并且删除多余的 runtime 文件
 * 
 * 如何操作 html-webpack-plugin？看他的官方文档，见readme.md
 * 
 * 在哪个hooks去做这件事情？alterAssetTagGroups（异步串行钩子，接收参数是一个对象
 * 此时已经分好组了，只要去对应的组里面把文件改一下即可
 * 如果假设里面还有模版，还可以继续编译，再通过plugin的emit输出文件
 * 
 * 如何注入，也是在官网上有写，下面是官网copy的模板：
 */

// If your plugin is direct dependent to the html webpack plugin:
// 1. 直接引入，直接依赖
const HtmlWebpackPlugin = require('html-webpack-plugin');
// If your plugin is using html-webpack-plugin as an optional dependency
// you can use https://github.com/tallesl/node-safe-require instead:
const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin');

class MyPlugin {
  apply (compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      console.log('The compiler is starting a new compilation...')

      // Static Plugin interface |compilation |HOOK NAME | register listener 
      // 获取HtmlWebpackPlugin的hooks
      // 这次的目标是获取headTags、bodyTags
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'MyPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Manipulate the content
          data.html += 'The Magic Footer'
          // Tell webpack to move on
          cb(null, data)
        }
      )
    })
  }
}

module.exports = MyPlugin