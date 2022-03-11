# 快速上手
首先您的本地环境需要安装 ndoe 和 git。

## 安装
从头搭建一个 Code-Shows 项目仅仅只需要几行命令就可以完成。

**安装 Code-Shows**
``` bash
$ npm install code-shows -g

or

$ yarn global add code-shows
```

## 使用

**初始化项目**
``` bash
$ code-shows init <name>
cd [name]
```

**添加一个代码片段文件**
``` bash
$ code-shows new <name>
```

**开启本地服务**
``` bash
$ code-shows serve
```

## 其他命令

**生成静态文件**
``` bash
$ code-shows generate
```

**清理缓存文件**
``` bash
$ code-shows clean
```

**部署静态文件**
``` bash
$ code-shows deploy
```