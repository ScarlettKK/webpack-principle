// 同步loader
// module.exports = function (content) {
//   return content
// }

// 同步loader
// 【注意】其中不能执行异步操作
module.exports = function (content, map, meta) {
  console.log('test1')

  // 在同步loader中执行异步操作，【会报错】The callback was already called.
  // 同步loader中不可调用异步操作，因为他不能等异步操作执行完后再继续往下执行，而是直接往下执行
  // 这里报错是因为 1s 后调用的时候，同步loader已经被执行完了，再次调用会报错
  // setTimeout(() => {
  //   console.log('test1')
  //   this.callback(null, content, map, meta)
  // }, 1000)


  // 第一个参数error：错误消息，代表是否有错误，无错误是null，否则是具体内容
  // 第二个参数content：处理后的内容
  // 第三个参数map：source-map，就相当于把上一个loader给的source-map传递给下一个，让他不中断
  // 第四个参数meta：给其他loader传递的参数，可以接力传递上一个，也可以自己做更改
  this.callback(null, content, map, meta)
}