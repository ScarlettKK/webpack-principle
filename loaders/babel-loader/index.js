const babel = require("@babel/core");
const schema = require("./schema.json");

// 异步loader
module.exports = function (content) {
    // 使用异步loader
    const callback = this.async();
    const options = this.getOptions(schema);

    // 使用babel对js代码进行编译
    // 具体见https://babeljs.io/docs/babel-core#transform
    babel.transform(content, options, function (err, result) {
        if (err) {
            callback(err);
        } else {
            // 最终编译结果在result.code中
            callback(null, result.code);
        }
    });
}