
## builder
compiler => builder

``` js
// 如果是代码片段文件缓存到 PostCache
{
    layout: String, // 布局类型
    source: String, // 文件绝对路径
    path: String, // 文件输出路径
    raw: String, // 文件原数据
    published: Boolean, // 是否发布
    date: Date, // 发布时间
    code: Object, // 代码信息
    ... // front-matter 变量
}
// 如果是其他文件缓存到 PostAssetCache
{
    path: String, // 文件输出相对路径
    source: String, // 文件绝对路径
    modified: Boolean, // 是否修改
    renderable: Boolean // 是否有渲染
}
```
