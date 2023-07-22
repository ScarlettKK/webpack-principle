// pitch loader
module.exports = function (content) {
  console.log("normal loader3")
  return content
}

// pitch方法在loader开始执行之前执行
module.exports.pitch = function () {
  console.log("pitch loader3")
}

/**
 * 执行顺序：
 * 假设有3个loader：use: [1, 2, 3]
 * 按照正常顺序，我们知道执行顺序是 3 -> 2 -> 1
 * 假设这3个loader都各自有一个pitch方法，那么执行顺序如下：
 * 1.pitch -> 2.pitch -> 3.pitch -> 3 -> 2 -> 1
 * 也就是pitch优先顺序执行，normal loader倒序执行
 * 
 * 【垄断机制】
 * 如果在pitch方法中return了结果（结果是啥不重要）下一个就会中断
 * 中断效果为：（同上文，但 pitch2 return了）
 * 1.pitch -> 2.pitch -> 1
 * pitch2 return了，后面的都不执行，只执行前面pitch过的loader的normal函数
 * 如果没有前面的loader执行（如pitch1就return了，那就直接停下，1 normal也不执行
 * 
 * 垄断机制应用：直接拒绝后面loader的执行，提前终止处理
 * 例如style-loader跟css-loader（后面会讲，再补充
 */