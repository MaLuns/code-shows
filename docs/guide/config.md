# 配置文件
code.config.json 配置文件说明。

## 站点
| 参数 | 描述 | 默认值 |
| ----------- | ----------- | ----------- |
| title | 网站标题 | code-shows | 
| subtitle | 网站副标题 |  | 
| description | 网站描述 |  | 
| keywords | 网站的关键词。支持多个关键词。 |  | 
| author | 您的名字 | author | 
| language | 网站使用的语言 | zh-CN | 
| url | 网址 |  | 
| root | 网站根目录 | / |


::: warning 网站存放在子目录
如果您的网站存放在子目录中，例如 http://example.com/code， url 设为 http://example.com 并把 root 设为 /code/。
:::

## 目录
| 参数 | 描述 | 默认值 |
| ----------- | ----------- | ----------- |
| source_dir | 代码片段目录 | source |
| asset_dir | 资源目录 | asset |
| script_dir | 脚本插件 | script |
| theme_dir | 主题 | theme |
| dist_dir | 构建输出目录 | dist |

## 代码片段
| 参数 | 描述 | 默认值 |
| ----------- | ----------- | ----------- |
| code_file.include | 匹配需要处理文件或文件 | ['\*\*.vue', '\*\*.html'] |
| code_file.exclude | 无需处理目录或文件 | [] |
| code_file.ignore | 忽略文件或目录 | view |

::: tip 提示
除了会忽略**ignore**配置文件或目录，还会忽略 **.** 开头文件和临时文件 **~**、**%** 结尾的。
:::

## 模板配置
| 参数 | 描述 | 默认值 |
| ----------- | ----------- | ----------- |
| theme.layout | 默认布局 | view |
| theme.use | 指定主题 |  |
| pagination.dir | 分页生成目录 | page |
| pagination.per_page | 每页条数 | 6 |
| pagination.order_by | 排序 | ['date', 'desc'] |

::: tip 提示
如果 theme.use 为空，默认会加载 theme 目录作为主题模板，如果指定了 theme.use，则会使用 ./node_moudles/**theme.use** 目录作为主题模板。
:::

## 本地服务
| 参数 | 描述 | 默认值 |
| ----------- | ----------- | ----------- |
| server.port | 端口 | 3000 |
| server.cache | 缓存构建 | true |
| server.serve_static | 使用静态文件 | false |

## 部署
| 参数 | 描述 | 默认值 |
| ----------- | ----------- | ----------- |
| deploy.type | 类型 | git |
| deploy.repository | 仓库地址 |  |
| deploy.branch | 仓库地址 | master |

::: tip 自定义脚本
如果需要编写自定义部署脚本，可通过  deployer.register('git', fun) 添加自己部署脚本。如果需要部署到多个不同服务，可将 deploy 改为数组，部署时会遍历 deploy 匹配符合当前 type 的部署脚本。
:::

## 其他
| 参数 | 描述 | 默认值 |
| ----------- | ----------- | ----------- |
| skip_console | 无需注册插件的命令 | [] |