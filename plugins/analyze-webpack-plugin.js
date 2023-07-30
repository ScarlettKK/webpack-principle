// 作用：分析 webpack 打包资源大小，并输出分析文件。

/**
 * 开发思路:
 * 
 * 在哪做? 
 * 要分析的资源必定是要输出的资源，而不是一上来拿源代码进行分析，源代码没有压缩，体积相对大
 * 分析要输出的资源：compiler.hooks.emit, 它是在打包输出前触发，我们需要分析资源大小同时添加上分析后的 md 文件。
 */

class AnalyzeWebpackPlugin {
  // 1. 遍历所有即将输出的文件，得到其大小
  // 2. 最终生成一个md文件
  apply(compiler) {
    // emit是异步串行钩子，tap适用于异步+同步钩子
    compiler.hooks.emit.tap("AnalyzeWebpackPlugin", (compilation) => {
      // Object.entries将对象变成二维数组。二维数组中第一项值是key，第二项值是value
      /**
       * Object.entries做了什么？
       * {
       *   "key1": "value1"
       *   "key2": "value2"
       * }
       * ==>
       * [
       *   ["key1", "value1"],
       *   ["key2", "value2"]
       * ]
       */
      // compilation.assets是一个对象，属性名是dist下资源的路径，如“js/main.js”，内容是一个资源对象
      const assets = Object.entries(compilation.assets);

      /**
       * md中表格语法：
       * | 资源名称 | 资源大小 |
       * | --- | --- |
       * | main.js|  10KB |
       */
      let source = "# 分析打包资源大小 \n| 名称 | 大小 |\n| --- | --- |";

      assets.forEach(([filename, file]) => {
        // 这里记得开头换行
        // file.size()获取到的单位是byte
        source += `\n| ${filename} | ${Math.ceil(file.size()/ 1024)}kb |`;
      });

      // 添加资源
      compilation.assets["analyze.md"] = {
        source() {
          return source;
        },
        size() {
          return source.length;
        },
      };
    });
  }
}

module.exports = AnalyzeWebpackPlugin;
