
## loader
loader 用于对源文件进行提取转换。

``` js
// 如果是代码片段文件缓存到 CodeCache
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
// 如果是其他文件缓存到 CodeAssetCache
{
    path: String, // 文件输出相对路径
    source: String, // 文件绝对路径
    modified: Boolean, // 是否修改
    renderable: Boolean // 是否有渲染
}
```
