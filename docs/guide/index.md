---
title: 介绍
lang: zh-CN
---

## 什么是 Code-Shows
Code-Shows 是一个将零碎代码片段生成可在线编辑展示的工具。Code-Shows 解析文件中的 `html`、`script`、`css` 三个语言块，配合主题生成静态网页。例如 `.vue` 文件会将 `template`、`script`、`style` 就会被提取成`html`、`script`、`css` 三块。

## 它是如何工作的？
Code-Shows 的实现以及插件机制是借鉴了 [Hexo](https://hexo.io/zh-cn/)，。

构建流程示例：

- 初始化：注册路由、加载插件 、加载db、加载配置等。
- 加载代码片段: 处理静态文件、代码片段 => 文件变量信息 => 将生成信息插入到 db。
- 加载主题文件: 处理静态文件、模版文件 => 文件变量信息 => 将生成信息插入到 db。
- 生成器 generate:  将 db 里 loader 生成文件信息 转换为 可读流 => 存入 router 缓存。
- 创建静态文件: 读取 router 缓存 => 如果静态文件直接读取文件流生成文件，如果是代码片段文件则 将 代码片段文件信息 注入到主题模版进行渲染，将渲染数据生成文件。

![流程图](/process.png)
