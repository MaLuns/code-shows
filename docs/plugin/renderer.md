# 渲染器（Renderer）
渲染器要用于主题模版渲染，对于一些需要预处理样式，也需要通过渲染器处理。

### 概述
`name` 输入文件的扩展名，`output` 输出文件扩展名。函数中 `data` 包含两个属性：文件路径 path 和文件内容 text。path 不一定存在。
``` js
code.extend.renderer.register(name, output,function(data,options){

})
```
示例：
``` js
const less = require('less');

code.extend.renderer.register('less', 'css',function(data,options){
    return less.render(data.text, options).then(res => res.css);
})
```