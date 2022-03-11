# 加载器 (loader)
加载器用来对不同类型文件进行预处理。

### 概述
加载器需要提供 `pattern`、`load` 两个方法。`pattern` 用来判断文件是否使用当前加载器处理，`load` 用来预处理当前文件并缓存到 db 里。

``` js
code.extend.loader.register({
    pattern: {
        match(path) {}
    },
    load(file) {}
})
``` 
#### pattern 
须包含一个 `match` 函数，`path` 为当前加载文件路径，`match` 需要返回一个 `Bool` 值。

#### load
预处理文件信息，并将信息根据需求将 `codeFiles` 存入 `CodeCache`，静态资源文件存入 `CodeAssetCache` 中。缓存信息结果可以参看 `DataBase`。