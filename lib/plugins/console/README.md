## code-show

### init
初始化 code-show 项目

### new
创建代码片段文件
``` 
- t  // 标题
- a  // 是否包含静态资源
```
### clean
清理缓存 db 文件和 dist 目录

### generate
生成静态文件
``` js
// 流程
console.generate => compiler => loadFile => builder => generator => addRoute => 根据路由信息生成静态文件 => exit 
```

### serve
启动本地服务
``` js
// 流程
console.serve => compiler => loadFile => builder => generator => addRoute => 启动静态服务 => 根据http请求返回路由数据 
                                        watchFile => updateRoute =>
```