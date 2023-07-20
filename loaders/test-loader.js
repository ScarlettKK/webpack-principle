/**
 * loader就是一个函数
 * 当webpack解析资源的时候，就会调用相应的loader去处理
 * loader会接收到文件内容为参数，然后将这个内容返回出去
 * 我们可以在loader中对原始内容作处理并返回
 * 
 * content：文件内容
 * map： source-map
 * meta：其他loader传递过来的参数（如less-loader等
 * 
 */

module.exports = function (content, map, meta) {
    console.log(content)
    return content;
};