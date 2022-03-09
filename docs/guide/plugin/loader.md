# 加载器 
加载器 (loader) 用来对不同类型文件进行预处理。

## 概述
加载器需要提供 **pattern**、**load** 两个方法。**pattern** 用来判断文件是否使用当前加载器处理，**load** 用来预处理当前文件并缓存到 db 里。

## 示例
``` js
code.extend.loader.register({
    pattern: {
        match(path) {}
    },
    load(file) {}
})
``` 
### pattern 
须包含一个 **match** 函数，**path** 为当前加载文件路径，**match** 需要返回一个 **Bool** 值。

### load
预处理文件信息，并将信息根据需求将 **codeFiles** 存入 **PostCache**，静态资源文件存入 **PostAssetCache** 中。
 
代码片段结构
``` js
{
    layout: String, // 布局类型
    source: String, // 文件绝对路径
    path: String, // 文件输出路径
    ruoute_url: String, // 路由地址
    raw: String, // 文件原数据
    published: Boolean, // 是否发布
    date: Date, // 发布时间
    code: Object, // 代码信息
    ... // front-matter 变量
}

```
静态资源文件
``` js
{
    path: String, // 文件输出相对路径
    source: String, // 文件绝对路径
    modified: Boolean, // 是否修改
    renderable: Boolean // 是否有渲染
}
```
