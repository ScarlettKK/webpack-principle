// 使用es6类语法
class TestPlugin {
    /**
     * 1. webpack加载webpack.config.js中所有配置，此时就会new TestPlugin()，先执行constructor
     * 2. webpack创建compiler对象
     * 3. 遍历所有plugins中插件，调用插件的 apply 方法
     * 4. 执行剩下编译流程（触发各个hooks事件）
     */
    constructor() {
        console.log("TestPlugin constructor()");
    }

    apply(compiler) {// 一上来就被遍历调用
        console.log("TestPlugin apply()");
    }
}

module.exports = TestPlugin;