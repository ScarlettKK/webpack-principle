// 异步loader
module.exports = function (content, map, meta) {
  // 【调用async】得到一个callback，callback什么时候调用loader什么时候执行完
  const callback = this.async() 

  // 等异步操作做完后再干其他活
  setTimeout(() => {
    console.log('test2')
    callback(null, content, map, meta)
  }, 2000)
}