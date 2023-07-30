// 作用：webpack 打包生成的 runtime 文件太小了，额外发送请求性能不好
//      所以需要将其内联到 js 中，从而减少请求数量。【把它变为行内js】
//      同理如果有其他比较小的js文件，也可以考虑这么做
// runtime文件：保存文件之间关系、依赖以及其content hash的值的文件

/**
 * 开发思路:
 * 我们需要借助 html-webpack-plugin 来实现
 * 1. 在 html-webpack-plugin 输出 index.html 前将内联 runtime 注入进去
 * 2. 并且删除多余的 runtime 文件
 * 
 * 如何操作 html-webpack-plugin？看他的官方文档
 */