---
sidebarDepth: 2
---

# 配置文件
`code.config.json` 配置文件说明，配置文件结构与左侧目录保持一致。

## site

站点配置

### title
- 类型: `string`
- 默认值: `undefined`

网站的标题，它将会被用作所有页面标题。

### description
- 类型: `string`
- 默认值: `undefined`

网站的描述，它将会以 `<meta>` 标签渲染到当前页面的 HTML 中。

### keywords
- 类型: `string`
- 默认值: `undefined`

网站的关键词，支持多个关键词。它将会以 `<meta>` 标签渲染到当前页面的 HTML 中。

### author
- 类型: `string`
- 默认值: `undefined`

作者名字。用于生成 Open Graph 标签。

### language
- 类型: `string`
- 默认值: `zh-CN`

提供多语言支持的语言配置。

### url
- 类型: `string`
- 默认值: ` `

站点地址。例如：htts://example.com

### root
- 类型: `string`
- 默认值: `/`

部署站点的基础路径，如果您的网站存放在子目录中，例如 `http://example.com/code`， 那么 `root` 应该设为 `/code/`。


## dir

自定义文件夹目录。

### source_dir
- 类型: `string`
- 默认值: `source`

代码片段存放目录。

### asset_dir
- 类型: `string`
- 默认值: `asset`

全局资源文件目录。

### script_dir
- 类型: `string`
- 默认值: `script`

脚本目录。

### theme_dir
- 类型: `string`
- 默认值: `theme`

主题目录。

### dist_dir
- 类型: `string`
- 默认值: `dist`

构建输出目录。


## code_file

代码片段配置  针对 source_dir 下文件。

### include
- 类型: `array[]`
- 默认值: `['**.vue', '**.html']`

指定需要处理代码片段的目录或文件。

### exclude
- 类型: `array[]`
- 默认值: `[]`

不需要处理目录或文件, 会原样复制过去。

### ignore
- 类型: `array[]`
- 默认值: `[]`

忽略文件或目录。

::: warning 提示
除了会忽略**ignore**配置文件或目录，还会忽略 **.** 开头文件和临时文件 **~**、**%** 结尾的。
:::

## theme

主题配置项。

### layout
- 类型: `string`
- 默认值: `view`

自定预览默认布局模版。

### use
- 类型: `string`
- 默认值: `undefined`

当你使用自定义主题的时候，需要指定它。

::: warning 提示
如果 `theme.use` 为空，默认会加载 `theme` 目录作为主题模板，如果指定了 `theme.use`，则会使用 `./node_moudles/**theme.use**` 目录作为主题模板。
:::

## pagination

首页分页配置项。

### dir
- 类型: `string`
- 默认值: `page`

指定分页生成目录。

### per_page
- 类型: `number`
- 默认值: `6`

设置分页每页条数。

### order_by
- 类型: `array`
- 默认值: `['date', 'desc']`

设置分页生成排序规则。


## server

本地服务配置项。

### port
- 类型: `number`
- 默认值: `3000`

指定 dev server 的端口。

### cache
- 类型: `bool`
- 默认值: `true`

是否开始缓存。

### serve_static
- 类型: `bool`
- 默认值: `false`

是否使用静态文件启动服务。


## deploy

部署服务配置项。

### type
- 类型: `string`
- 默认值: `git`

部署类型。

### repository
- 类型: `string`
- 默认值: ` `

git 仓库远程地址。

### branch
- 类型: `string`
- 默认值: `master`

分支名称。

::: warning 提示
除了 `type` 是必须的，其他字段需更具具体 `deployer` 配置。如果需要编写自定义部署脚本，可通过  deployer.register('git', fun) 添加自己部署脚本。如果需要部署到多个不同服务，可将 deploy 改为数组，部署时会遍历 deploy 匹配符合当前 type 的部署脚本。
:::

## skip_console
- 类型: `array`
- 默认值: `[]`

无需注册插件的命令。