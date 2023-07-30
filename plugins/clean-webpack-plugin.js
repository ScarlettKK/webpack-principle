// 作用：在 webpack 打包输出前将上次打包内容清空。

/**
 * 开发思路：
 * 搞清楚何时、在什么时间节点上做这个事情
 * 
 * 在一开始就执行？万一流程出错退出webpack，之前的打包内容就全没了❌
 * 
 * 在打包输出前执行？这样万一前面有啥错误，之前打包的内容还在。确保之前都成功再清空👍
 * 
 * 如何在打包输出前执行？
 * 需要使用 compiler.hooks.emit 钩子, 它是打包输出前触发。
 * 
 * 如何清空上次打包内容？
 * 获取打包输出目录：通过 compiler 对象。
 * 通过文件操作清空内容：通过 compiler.outputFileSystem 操作文件。
 */

class CleanWebpackPlugin {
  // 要做什么？
  // 1. 注册钩子，在打包输出之前 emit
  // 2. 获取打包输出的目录，不能直接写死
  // 3. 通过fs删除打包输出目录下所有的文件

  apply(compiler) {
    // emit是异步串行钩子，【记得最后调用callback】
    compiler.hooks.emit.tapAsync("CleanWebpackPlugin", (compilation, callback) => {
      // 获取输出文件目录
      // 这点在webpack.config.js中配置
      const outputPath = compiler.options.output.path;
      // 另一种获取路径方式，经过打印验证两个值是一样的
      // 不过下面的方法可能不适用所有配置（有的时候会没有值），可以进行打印验证
      // const outputPath = compiler.outputPath;  

      // 获取操作文件的对象
      const fs = compiler.outputFileSystem;

      // 删除目录所有文件
      // 传入fs+路径，路径为文件夹
      // 只在外层调用这一次，后面的都是递归调用
      const err = this.removeFiles(fs, outputPath);
      // 执行成功err为undefined，执行失败err就是错误原因
      callback(err);
    });
  }

  // 这里单独定义一个函数来执行删除
  // 如何删除？要删除某个目录，需要把这个目录下所有文件给删了，才能删目录
  //         如果有一个文件没删，目录就删不掉
  // 想要删除打包输出目录下所有资源，需要先将目录下的资源删除，才能删除这个目录
  removeFiles(fs, path) {// path：文件夹路径
    try {
      // 1. 读取当前目录下所有文件，Sync为同步方法
      /**
       * files 打印结果有好几次，每次为一个file目录下的所有层级
       * 
       * 如输出目录为：
       * - dist
       *   ---- images
       *          ---- hashxxx.jpg
       *   ---- js
       *          ---- main.js
       *   ---- index.html
       * 
       * 打印结果分别为：
       * 类似树的遍历
       * [ 'images', 'index.html', 'js' ] // 如果没有下面的递归调用，只会打印最上面这一行
       * [ '2e1b040a6c7910eb.jpg' ] // 递归调用下一层打印结果
       * [ 'main.js' ] // 递归调用下一层打印结果
       * 
       * 也就是每一个目录层级下所有的文件（包括子目录或者文件）
       */
      const files = fs.readdirSync(path);

      // 2. 遍历文件，判断是文件夹还是文件：文件直接删除，文件夹需要再次遍历删除其下面所有内容才能删除
      // 思想：树的删除
      files.forEach((file) => {
        // 获取文件完整路径【注意拼完】，file只有文件名没有path
        const filePath = `${path}/${file}`;
        // 分析文件，里面是一些文件信息，日期作者等等
        const fileStat = fs.statSync(filePath);
        // 判断是否是文件夹
        if (fileStat.isDirectory()) {
          // 是文件夹需要递归遍历删除下面所有文件
          this.removeFiles(fs, filePath);
        } else {
          // 不是文件夹就是文件，直接删除
          fs.unlinkSync(filePath);
        }
      });

      // 最后删除当前目录
      fs.rmdirSync(path);
    } catch (e) {
      // 将产生的错误返回出去
      return e;
    }
  }
}

module.exports = CleanWebpackPlugin;
