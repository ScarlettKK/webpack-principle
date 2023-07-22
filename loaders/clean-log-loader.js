// loaders/clean-log-loader.js
// 同步loader
module.exports = function cleanLogLoader(content) {
    // 将console.log替换为空，清除文件中的console.log语句
    // content为字符串内容
    // 正则/g：全剧匹配
    return content.replace(/console\.log\(.*\);?/g, "");
    /**
     * 注意：这里不能取消类似console.log(
     *  "hello"
     * )
     * 因为没有配置换行的匹配
     * 这里只能处理一行
     */
};
