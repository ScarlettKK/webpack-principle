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
        debugger;
        // console.log('compiler', compiler)
        console.log("TestPlugin apply()");

        // ————————————————————————————————————————————————
        // 注册钩子，具体是同步或者异步注册方法，要看官方文档定义
        // 由文档可知，environment是同步钩子，必须要使用tap注册
        // 传入插件名称+回调函数（这个也是看文档，不同的钩子有不同的参数
        compiler.hooks.environment.tap('TestPlugin', () => {
            console.log('TestPlugin compiler environment hook' )
        })

        // ————————————————————————————————————————————————
        // emit: AsyncSeriesHook，异步串行hook
        // 异步串行的意思是，按顺序注册，按顺序执行，前一个执行完才执行次啊一个
        // 比如下面tapAsync延迟2s，tapPromise延迟1s，tapPromise也还是在tapAsync后执行
        // 并且 tapPromise 是等 tapAsync 完全执行完才执行（足足等2s

        // 可以往emit中定义多个钩子函数，这些函数永远都是1、2、3顺序执行
        // 输出 asset 到 output 目录之前执行（追加资源，最晚可以在emit中加，再晚就来不及了，已经输出
        compiler.hooks.emit.tap('TestPlugin', (compilation) => {
            // console.log('compilation', compilation)
            // 这里面不能做异步操作
            console.log('TestPlugin compiler emit tap hook')

            // seal: compilation上的同步钩子，无参数
            // compilation的钩子需要在compilation hooks触发之前注册才有用
            // 因为在生命周期中（参考教程的图），emit的时候compilation的工作已经做完了，所以下面并不会被打印
            compilation.hooks.seal.tap('TestPlugin', () => {
                console.log('TestPlugin emit compilation seal tap hook')
            })
        })

        // tapAsync 多一个参数 callback， 当 callback 被调用，代表执行完毕，才会继续往下执行
        compiler.hooks.emit.tapAsync('TestPlugin', (compilation, callback) => {
            setTimeout(() => {
                console.log('TestPlugin compiler emit tapAsync hook')
                callback()
            }, 2000);
        })

         // tapPromise 要求返回一个 promise 对象
         compiler.hooks.emit.tapPromise('TestPlugin', (compilation) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('TestPlugin compiler emit tapPromise hook')
                    resolve()
                }, 1000);
            });
        })

         // ————————————————————————————————————————————————
         // make: AsyncParallelHook，异步并行hook
         // 可以看到异步并行受延迟时间的影响，不一定按照定义顺序执行
         // 并行是全部同时开始计时，下面每个hook执行相隔1s
         compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {
            // console.log('compilation', compilation)
            // seal: compilation上的同步钩子，无参数
            // compilation的钩子需要在compilation hooks触发之前注册才有用，最晚最晚要在make中注册
            compilation.hooks.seal.tap('TestPlugin', () => {
                console.log('TestPlugin make compilation seal tap hook')
            })

            setTimeout(() => {
                console.log('TestPlugin compiler make tapAsync hook 1')
                callback()
            }, 3000);
        })

        compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {
            setTimeout(() => {
                console.log('TestPlugin compiler make tapAsync hook 2')
                callback()
            }, 1000);
        })

        compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {
            setTimeout(() => {
                console.log('TestPlugin compiler make tapAsync hook 3')
                callback()
            }, 2000);
        })
    }
}

module.exports = TestPlugin;