# 辅助函数（Helper）
辅助函数帮助您在模板中快速插入内容，用来简化模版操作。

### 概述

``` js
code.extend.helper.register(name, function(){

});
```

示例：

``` js
code.extend.helper.register('js', function(path){
  return '<script src="' + path + '"></script>';
});
```
```
<%- js('script.js') %>
// <script src="script.js"></script>
```