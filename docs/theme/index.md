# 介绍

Code-Shows 默认使用的是一款新拟物风的主题，需要对默认主题进行修改可直接修改 `theme` 下文件，如果要使用 npm 包主题，只需要在 code.config.json 中设置 `theme.use`。一个主题主要目录结构：
```
├── layout
├── script
└── source
```

### layout

布局文件夹。用于存放主题的模板文件，决定了网站内容的呈现方式，默认使用了 `EJS` 模板引擎，当然你看通过注册 `Renderer` 以来支持使用其他模版引擎。Code-Shows 会根据不同后缀名去使用不同 `Renderer`。

可以参看 [模版](/theme/layout) 和  [渲染器](/plugin/renderer) 了解更多。


### script

脚本文件夹。在启动时，Code-Shows 会载入此文件夹内的 JavaScript 文件，更多可以参考 [插件](/plugin/)。

### source
静态资源文件夹，`source` 下的文件最后会合并到 `asset` 下，如果需要处理的文件类型如 `.less` 等，会先调用 `Renderer` 对文件进行处理。 