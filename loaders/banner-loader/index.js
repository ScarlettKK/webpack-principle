const schema = require("./schema.json")

module.exports = function (content) {
    // schema: 对options的验证规则
    // schema： 定义为符合JSON schema的规则
    const options = this.getOptions(schema)

    // 给js文件加上作者信息
    // 但这里希望名字是可以配置的
    const prefix = `
    /**
     * Author: ${options.author}
     */
    `
    return prefix + content
}