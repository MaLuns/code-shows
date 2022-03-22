# 转换器（Converter）
转换器用来对代码片段文件进行拆分，以及对不同语言进行预处理。

### 概述
`language` 默认是 `代码片段文件` 后缀名，例如 `language` 为 `vue` 默认会用来处理 `.vue` 文件。 `code` 为 `代码片段文件` 文本值。
``` js
code.extend.converter.register(language, function(code) {

});
``` 
转换器需要返回如下格式数据，一般来说会存在 `html`、`style`、`script` 三个对象数据，可以根据实际情况选择。

``` js
{
  code: {
    html: {
        language: 'monaco-editor 语言类型',
        source: '原始代码片段',
    },
    style: {
        language: 'monaco-editor 语言类型',
        source: '原始代码片段',
    },
    script: {
        language: 'monaco-editor 语言类型',
        source: '原始代码片段',
    }
  },
  preview: {
    html: "",
    script: "",
    style: "",
  }
}
```
