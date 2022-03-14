
# 缓存（DataBase）

Code-Shows 使用 `Map` 来缓存构建时的信息，下面所有的 `_id` 都是 `Map` 对应的 `key`，其他字段都是其 `value`。下面字段都是程序必须的，但是您也可以对下面字段进行扩展。

| db | 描述 | 
| ----------- | ----------- |
| FileCache | 所有文件信息 | 
| CodeCache | 代码片段信息 | 
| CodeAssetCache | 代码片段中静态文件信息 |
| AssetCache | 全局静态文件信息 |

### FileCache
FileCache 存储所有文件 `Hash` 和 `modified`，用来判断文件是否修改更新。

| 字段 | 描述 | 类型 | 
| ----------- | ----------- |:-----------:|
| _id | 文件相对路径 | String |
| hash | 文件Hash | String |
| modified | 文件最后修改时间 | Number |

### CodeCache
CodeCache 存储所有 `代码片段` 文件信息。
| 字段 | 描述 | 类型 | 
| ----------- | ----------- |:-----------:|
| _id | 文件相对路径 | String |
| path | 文件输出路径 | String |
| layout | 布局类型| String |
| source | 文件绝对路径| String |
| ruoute_url | 路由地址| String |
| raw | 文件原数据| String |
| published | 是否发布 | Boolean |
| date | 发布时间| Date |
| code | 代码信息| Object |
|    ...front-matter | front-matter中字段 | |


### CodeAssetCache
CodeAssetCache 主要存储时 `source/` 下所有非 `代码片段` 文件信息。

| 字段 | 描述 | 类型 | 
| ----------- | ----------- |:-----------:|
| _id | 文件相对路径 | String |
| path | 文件输出路径 | String |
| source | 文件绝对路 | String |
| modified | 是否修改 | Boolean |

### AssetCache
AssetCache 存储的文件是 `theme/source` 、`asset` 下文件信息。

| 字段 | 描述 | 类型 | 
| ----------- | ----------- |:-----------:|
| _id | 文件相对路径 | String |
| path | 文件输出路径 | String |
| source | 文件绝对路 | String |
| modified | 是否修改 | Boolean |

::: warning  说明
CodeAssetCache、AssetCache 存储内容结构是一样的，但是用途是不一样的。CodeAssetCache 主要是存储 `代码片段` 文件里使用的静态资源文件，AssetCache 主要是存储全局静态资源文件和主题下的静态资源文件。 
:::