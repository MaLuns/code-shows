# 变量
用于模版渲染时使用，不同的模版页面会注入不同变量信息。

## 全局

| 变量 | 描述 | 类型 |
|:-----------| ----------- |:-----------:|
| site | 网站变量 | { codes:[] } |
| page | 针对该页面的内容以及 front-matter 中自定义的变量。	| Object |
| config | 网站配置，code.confing.json 里的变量 | Object |
| path | 当前页面的路径（不含根路径） | String |
| url | 当前页面的完整网址 | String |

### site.codes
| 变量 | 描述 | 类型 |
|:----------- | ----------- |:-----------:|
| site.codes.layout | 布局名称 | String |
| site.codes.source | 文件原始路径 | String |
| site.codes.path | 文件的相对路径 | String |
| site.codes.route_url | 页面网址 | String |
| site.codes.published | 是否发布 | Boolean |
| site.codes.date | 代码片段建立日期 | Date |
| site.codes.raw | 代码片段原始内容 | String |
| site.codes.code | 代码信息 | Object ([page.code](#page-code)) |

## 页面变量

### 首页
| 变量 | 描述 | 类型 |
|:-----------|-----------|:-----------:|
| page.total | 总页数 | Number |
| page.current | 当前分页的网址 | Number |
| page.current_url | 当前分页的网址 | String |
| page.prev | 上一页的页数。如果此页是第一页的话则为 0 | Number |
| page.prev_link | 上一页链接 | String |
| page.next | 下一页的页数。如果此页是最后一页的话则为 0 | Number |
| page.next_link | 下一页链接 | String |
| page.codes | 当前页代码片段页 | Array ([site.codes](#site-codes))|
| page.__index | 首页标识 | Boolean |

### 预览、编辑页
| 变量 | 描述 | 类型 |
|:----------- | ----------- |:-----------:|
| page.layout | 布局名称 | String |
| page.source | 文件原始路径 | String |
| page.path | 文件的相对路径 | String |
| page.route_url | 页面网址 | String |
| page.published | 是否发布 | Boolean |
| page.date | 代码片段创建日期 | Date |
| page.raw | 代码片段原始内容 | String |
| page.code | 代码信息 | Object |
| page.prev | 上一个页面 | String |
| page.next | 下一个页面 | String |
| page.__view | 预览页标识 | Boolean |
| page.__editor | 编辑页表示 | Boolean |

除了上面变量，还包含 front-matter 中自定义的变量。

#### page.code

`type` 根据具体代码片段决定。

| 变量 | 描述 | 类型 |
|:----------- | ----------- |:-----------:|
| [type].language | monaco-editor 语言类型 | String |
| [type].source | 原始代码片段 | String |
| [type].text | 转换后的值 例如 ts转换成js less转换成css | String |


示例：
``` js
{
    html: {
        language: 'html',
        source: '<div class="demo"></div>',
        text: '<div class="demo"></div>'
    },
    style: {
        language: 'css',
        source: '.demo { height: 200px; background-color: red; }',
        text: '.demo { height: 200px; background-color: red; }'
    }
}
```