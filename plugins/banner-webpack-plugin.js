// 功能：给打包输出的文件添加注释
// 与之前loader不同，loader只能在开发模式下执行，生产模式下一旦文件被压缩就不能用了
// plugin：无论什么模式都有注释

/**
 * 开发思路:
 * 需要打包输出前添加注释：需要使用 compiler.hooks.emit 钩子, 它是打包输出前触发。
 *                     否则在其他过程中添加注释，可能会被压缩删掉
 * 如何获取打包输出的资源？compilation.assets 可以获取所有即将输出的资源文件。
 */

class BannerWebpackPlugin {
    constructor(options = {}) {// 记得初始化空对象
        // 这里配置传入的options参数
        this.options = options;
    }

    apply(compiler) {
        // 需要处理文件
        const extensions = ["js", "css"];

        // emit是异步串行钩子
        // 这里也可以用tap方法，就不用调用callback
        // 这里官方会建议在 compiler的emit（输出之前） 的 compilation的seal（冻结之前）中做这个处理，这里不赘写
        // 压缩之后冻结之前处理最佳，不过如果在compilation中处理，下面的方法会被触发多次，只在compiler中就只处理一次了
        compiler.hooks.emit.tapAsync("BannerWebpackPlugin", (compilation, callback) => {
            // 1. compilation.assets包含所有即将输出的资源
            // 2. 通过过滤只保留需要处理的文件（js、css资源）
            // 3. 遍历剩下资源，添加注释

            // 步骤【2】
            // compilation.assets是一个对象，属性名是dist下资源的路径，如“js/main.js”
            const assetPaths = Object.keys(compilation.assets).filter((path) => {// filter过滤
                // path以“.“分开，最后一个就是文件扩展名
                const splitted = path.split(".");
                // 看看扩展名是否符合要求
                return extensions.includes(splitted[splitted.length - 1]);
            });

            // 步骤【3】
            // assetPaths：要处理的资源路径们
            assetPaths.forEach((assetPath) => {
                // compilation.assets + 资源路径 得到资源内容
                const content = compilation.assets[assetPath];

                // 拼上注释
                // options带有用户传入参数
                // newSource也可以写成newSource = prefix + content，其中prefix是注释部分
                const newSource = `/*
* Author: ${this.options.author}
*/\n${content.source()}`;

                // 覆盖原来的资源内容，重新定义其source跟size方法即可
                compilation.assets[assetPath] = {
                    // 覆盖原来资源内容
                    source() {
                        return newSource;
                    },
                    // 覆盖原来资源大小
                    size() {
                        return newSource.length;
                    },
                };
            });

            // 【注意】异步钩子后面一定记得调用回调函数，否则不会继续往下执行
            callback();
        });
    }
}

module.exports = BannerWebpackPlugin;
