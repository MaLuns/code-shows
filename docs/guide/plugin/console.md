# 命令
通过注册自定义命令，可以用来简化我们的一些手动操作，来提高我们效率。

## 概要
code-shows 使用的 [commander](https://www.npmjs.com/package/commander) 来解析命令，只需要按照 **commander api** 编写即可，通过 **code.extend.console.program** 来获取 commander 实例。

## 示例
``` js
code.extend.console.program
    .command('demo')
    .action(function () {
        
    });
```
``` bash
$ code-shows demo
```