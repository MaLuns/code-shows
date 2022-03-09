# 介绍
CodeShows 所有模块都可通过注册自定义插件，以便更方便的扩展功能。通过自定义插件也可以覆盖现有功能，而不需要去修改源代码。

## 使用
### 脚本
所有的脚本只需要放入 **script** 和 **theme.script** 目录下，在程序运行时会默认加载到程序里。
加载脚本时会被注入一个为 **code** 全局变量，这个 **code** 也就是程序实例，通过  **code** 来注册不同功能类型脚本。

### npm 包
待支持。

## DataBase
CodeShows 使用 **Map** 来缓存构建时的信息，下面所有的 **_id** 都是 **Map** 对应的 **key**，其他字段都是其 **value**。下面字段都是程序必须的，但是你也可以对下面字段进行扩展。

| db | 描述 | 
| ----------- | ----------- |
| FileCache | 文件信息缓存 | 
| PostCache | 代码片段信息 | 
| PostAssetCache | 代码片段中静态文件 |
| AssetCache | 全局静态文件 |

#### FileCache

| 字段 | 描述 | 类型 | 
| ----------- | ----------- | ----------- |
| _id | 文件相对路径 | String |
| hash | 文件Hash | String |
| modified | 文件最后修改时间 | Number |

#### PostCache

| 字段 | 描述 | 类型 | 
| ----------- | ----------- |----------- |
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


#### PostAssetCache
PostAssetCache 主要存储时 **source/** 下所有非 **代码片段** 文件信息，最终会生成到对应代码片段目录下

| 字段 | 描述 | 类型 | 
| ----------- | ----------- | ----------- |
| _id | 文件相对路径 | String |
| path | 文件输出路径 | String |
| source | 文件绝对路 | String |
| modified | 是否修改 | Boolean |

#### AssetCache
AssetCache 与 PostAssetCache 不同的是，AssetCache 处理存储的文件是 **theme/source** 、asset 下文件信息，最终会被生成到 *dist/asset* 下。

| 字段 | 描述 | 类型 | 
| ----------- | ----------- | ----------- |
| _id | 文件相对路径 | String |
| path | 文件输出路径 | String |
| source | 文件绝对路 | String |
| modified | 是否修改 | Boolean |
