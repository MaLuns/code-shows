# 解析器 (converter) 
解析器用来对代码片段文件进行拆分，以及对不同语言进行编译。

### 概述
在函数中会传入一个 `code` 参数，其值为去除了 `front-matter` 的原始代码片段文本。
``` js
code.extend.converter.register(name, function(code) {

});
``` 
### 示例
