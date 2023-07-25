const styleLoader = () => {};

/**
 * 问题：
 * 1. 我们写的style-loader只能处理样式，不能处理样式中引入其他资源
 * 2. 所以我们需要借助css-loader进行预处理
 * 3. 但是css-loader中暴露的是js代码，style-loader需要执行这段代码，得到返回值，再动态创建style标签，插入页面
 * 4. style-loader使用pitch loader的方式解决（pitch最先执行
 */
styleLoader.pitch = function (remainingRequest) {
  // 这里需要在style-loader后定义css-loader，remainingRequest才可以拿到css-loader
  /*
    remainingRequest: 剩下还需要处理的loader
      打印结果：/Users/sijiahao/webpack-principle/node_modules/css-loader/dist/cjs.js!/Users/sijiahao/webpack-principle/src/index.css
              内容：css-loader!剩余要处理的资源
              这里是inline loader用法，代表后面还有一个css-loader等待处理

    【1】最终我们需要将remainingRequest中的路径转化成相对路径，webpack才能处理【只有相对路径才可以被处理】
      希望得到：../../node_modules/css-loader/dist/cjs.js!../../src/index.css（对应上面的相对路径）

    所以：需要将绝对路径转化成相对路径
    要求：
      1. 必须是相对路径
      2. 相对路径必须以 ./ 或 ../ 开头
      3. 相对路径的路径分隔符必须是 / ，不能是 \
  */
  // 绝对路径转相对路径：得到下一个要处理的loader+资源
  const relativeRequest = remainingRequest
    .split("!")
    .map((absolutePath) => {
      // 将路径转化为相对路径
      // this.context：当前loader所在的目录
      const relativePath = this.utils.contextify(this.context, absolutePath);
      return relativePath;
    })
    .join("!");

  /*
  【2】引入css-loader处理后的资源
  【3】创建style标签，将内容插入页面中生效
    !!${relativeRequest} 
      relativeRequest：../../node_modules/css-loader/dist/cjs.js!./index.css
      relativeRequest是inline loader用法，代表要处理的index.css资源, 使用css-loader处理
      !!代表禁用所有配置的loader，只使用inline loader。（也就是外面我们style-loader和css-loader）,
        它们被禁用了，只是用我们指定的inline loader，也就是css-loader
        因为此时已经拿到css-loader处理好的资源了

    import style from "!!${relativeRequest}"
      引入css-loader处理后的css文件
      为什么需要css-loader处理css文件，不是我们直接读取css文件使用呢？
      因为可能存在@import导入css语法，这些语法就要通过css-loader解析才能变成一个css文件，否则我们引入的css资源会缺少
    const styleEl = document.createElement('style')
      动态创建style标签
    styleEl.innerHTML = style
      将style标签内容设置为处理后的css代码
    document.head.appendChild(styleEl)
      添加到head中生效
  */
  // 使用inline-loader引入上面的loader+资源（相对路径），此时这个资源会被上面的css-loader处理
  // !!是用于中止后面的css-loader行为，因为此处已经处理过了
  const script = `
    import style from "!!${relativeRequest}" // css loader在此处被执行(inline-loader)
    const styleEl = document.createElement('style')
    styleEl.innerHTML = style
    document.head.appendChild(styleEl)
  `;

  // style-loader是第一个loader, 由于return导致熔断，所以其他loader不执行了（不管是normal还是pitch）
  return script;
};

module.exports = styleLoader;
