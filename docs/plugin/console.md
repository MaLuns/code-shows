# 命令（Console）
通过注册自定义命令，可以用来简化我们的一些手动操作，来提高我们效率。

### 概述
code-shows 使用的 [commander](https://www.npmjs.com/package/commander) 来解析命令，只需要按照 `commander api` 编写即可，通过 `code.extend.console.program` 来获取 `commander` 实例。

#### 示例
``` js
code.extend.console.program
    .command('demo')
    .action(function () {
        
    });
```
使用
``` bash
$ code-shows demo
```