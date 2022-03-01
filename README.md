# Code-Shows
Code-shows 是一个将代码片段生成为可在线编辑的静态网页的工具。

## 项目结构
- code-shows        
- compiler      文件编译
- source        片段文件编译 => 继承自compiler
    - loader   使用 plugins 里的 loader
- theme         主题编译 =>  继承自compiler
    - loader   主题构建器 => 加载主题原始文件
- database      数据缓存
- extend        扩展管理
    - loader   
    - console   
    - generator 
    - renderer  
- plugins       
    - loader   构建器 => 加载代码原始文件
    - console   命令   => 处理 cli 命令 
    - generator 生成器 => 对构建产物进行处理
    - renderer  渲染器 => 结合主题渲染成静态文件

构建流程
``` 
// code-shows g 示例：
                        || ===> 加载代码片段 => 代码片段builder ====>||
                        ||                                        |
                        ||                                        |
codeShows => 初始化 => load                                      loaded => 生成器（generate）=> 生成路由（router）=> 生成静态文件
                        ||                                        |
                        ||                                        |
                        || ===>   加载主题  =>   主题builder   ====>||

# 初始化：注册路由、加载插件 、加载db、加载配置等。
# 代码片段builder: 处理静态文件、代码片段 => 文件变量信息 => 将生成信息插入到 db。
# 主题目录builder: 处理静态文件、模版文件 => 文件变量信息 => 将生成信息插入到 db。
# 生成器generate:  将 db 里 loader 生成文件信息 转换为 可读流 => 存入router缓存。
# 创建静态文件: 读取 router 缓存 => 如果静态文件直接读取文件流生成文件，如果是代码片段文件则 将 代码片段文件信息 注入到主题模版进行渲染，将渲染数据生成文件。
```

## 快速开始

**安装 Code-Shows**
```
npm install code-shows -g
```
or
```
yarn global add code-shows
```

**初始化项目**
```
ml-code init [name]
cd [name]
```

**启动本地服务**
```
ml-code serve
```

**创建代码片段**
```
ml-code new <name>
```

**生成静态文件**
```
ml-code generate
```