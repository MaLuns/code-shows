# Code-Shows
Code-shows 是一个将代码片段生成为可在线编辑的静态网页的工具。

## 项目结构
- code-shows        
- compiler      文件编译
- source        片段文件编译 => 继承自compiler
    - builder   使用 plugins 里的 builder
- theme         主题编译 =>  继承自compiler
    - builder   主题构建器 => 加载主题原始文件
- database      数据缓存
- extend        扩展管理
    - builder   
    - console   
    - generator 
    - renderer  
- plugins       
    - builder   构建器 => 加载代码原始文件
    - console   命令   => 处理 cli 命令 
    - generator 生成器 => 对构建产物进行处理
    - renderer  渲染器 => 结合主题渲染成静态文件

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