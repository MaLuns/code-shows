# 中间件（Middlewarer）
Dev Server 允许通过中间件的使用来调用各种第三方类库，以提供扩展 Dev Server。

### 概述
在函数中会传入一个 `app` 参数，是一个 [connect](https://www.npmjs.com/package/connect) 实例，函数中的 `this` 默认会指向 `Code-Shows` 实例，您可以通过 `connect api` + `Code-Shows` 来配置您的中间件。
``` js
code.extend.middlewarer.register(function(app){

})
```
示例：

添加 Gzip 压缩
``` js
const compress = require('compression');

code.extend.middlewarer.register(function(app){
  app.use(compress());
})
```