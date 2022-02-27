### 配置文件
code.config.json 配置文件说明。

#### 站点
| 参数 | 描述 |
| ----------- | ----------- |
| title | 网站标题 |
| subtitle | 网站副标题 |
| description | 网站描述 |
| keywords | 网站的关键词。支持多个关键词。 |
| author | 您的名字 |
| language | 网站使用的语言 |

#### 网址
| 参数 | 描述 | 默认值 |
| ----------- | ----------- | ----------- |
| url | 网址 |  | 
| root | 网站根目录 | / |


::: warning 网站存放在子目录
如果您的网站存放在子目录中，例如 http://example.com/code url 设为 http://example.com/code 并把 root 设为 /code/。
:::

#### 目录
| 参数 | 描述 | 默认值 |
| ----------- | ----------- | ----------- |
| source_dir | 代码片段目录 | source |
| asset_dir | 资源目录 | asset |
| script_dir | 脚本插件 | script |
| theme_dir | 主题 | script |
| dist_dir | 构建输出目录 | dist |

#### 其他
| 参数 | 描述 | 默认值 |
| ----------- | ----------- | ----------- |
| new_code_file | 代码片段类型 | ['.vue', '.html'] |
| default_layout | 默认布局 | view |
| pagination | 分页 |  |
| pagination.dir | 分页生成目录 | page |
| pagination.path | 路径 |  |
| pagination.per_page | 页码 | 10 |
| pagination.order_by | 排序 | ['date', 'desc'] |

