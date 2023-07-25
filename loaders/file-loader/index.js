const loaderUtils = require("loader-utils");

// 注意：下面没有进行路径以及文件名一类的其他配置，仅仅是简单的输入输出
module.exports = function (content) {
  // 1. 根据文件内容生成一个带hash值的文件名（借助loader-utils的interpolateName方法）
  // this：loader的上下文
  // "[hash].[ext]"：hash + 文件扩展名
  // content：文件内容
  // 返回值为文件名
  let filename = loaderUtils.interpolateName(this, "[hash].[ext]", {
    content,
  });
  filename = `images/${filename}`

  // 2. 将文件输出出去
  this.emitFile(filename, content);

  // 3. 返回：module.exports = "文件路径/文件名"
  // 记得加上''
  return `export default '${filename}'`;
}
// 此处处理图片、字体等文件，他们都是buffer数据
// 所以这里需要用上raw loader
module.exports.raw = true