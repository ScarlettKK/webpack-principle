// raw loader
// 同步或者异步都无所谓
// 区别是接收到的content是buffer数据（二进制
// 使用场景：处理图片、字体图标等数据（媒体文件类
// module.exports = function (content) {
//   // 打印：<Buffer 63 6f 6e 73 6f 6c 65 2e 6c 6f 67 28 27 68 65 6c 6c 6f 20 6d 61 69 6e 27 29>
//   console.log(content)
//   return content
// }

// 关键是这一步
// module.exports.raw = true

// 另一种写法
function testLoader3(content) {
  console.log(content)
  return content
}

testLoader3.raw = true

module.exports = testLoader3