## generator
builder => generator
``` js
{
    path: 'path', // 文件输出相对路径
    layout: 'view',// 布局类型, 给代码片段文件使用
    data: Function || Object // 如果是代码片段文件 data 是 Object (代码片段文件信息), 其他文件 data 是 Function (返回文件流)
}
```