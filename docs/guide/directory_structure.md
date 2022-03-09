# 目录结构

Code-Shows 所有目录都可配置，推荐的目录结构如下：

```
.
├── asset // 全局资源目录
├── source // 代码片段目录
├── script // 脚本插件
│   ├── ...
│   └── console // 注册命令脚步
├── theme // 主题目录
│   ├── layout // 模版
│   ├── script // 主题脚本插件
│   └── source // 主题资源目录
│       ├── ...
│       └── styles // 主题样式
├── code.config.json // 配置文件
└── package.json

```

::: warning 注意
注册命令扩展需要在 console 目录下，如果注册命令不需要加载扩展等，可以在 skip_console 中添加跳过加载插件提高性能。theme.source 下的文件最后会合并到 asset 下，如果需要处理的文件类型如 .less 等，会先调用 render 对文件进行处理。
:::