# 生成器 (Generator)
生成器根据 `loader` 处理后的原始文件建立路由。

### 概述
在函数中会传入一个 db 参数，其数据结构可以参考 [DataBase](/plugin/database) 。

``` js
code.extend.generator.register(name, function(db){

});
```

生成器返回数据格式如下，可以为单个对象也可以是数组。

``` js
{
    route_url: '路由地址',
    data: '数据'，
    layout: '指定用于渲染的模板。如果为空着直接输出 data 数据。',
}
```