# 模版
主题中至少需要包含 index、view、editor 三个模版。

| 模板 | 用途 |
| ----------- | ----------- |
| index | 首页 |
| view | 代码片段预览 |
| editor | 代码片段编辑器 |
| layout | 顶级模版 |

## 布局
如果页面结构类似，例如两个模板都有页首（Header）和页脚（Footer），您可考虑通过「布局」让两个模板共享相同的结构。一个布局文件必须要能显示 body 变量的内容，如此一来模板的内容才会被显示，举例来说：

index.ejs
``` 
Hello Word
```

layout.ejs
``` html
<!DOCTYPE html>
<html>
  <body><%- body %></body>
</html>
```
生成
``` html
<!DOCTYPE html>
<html>
  <body>Hello Word</body>
</html>
```

每个模板都默认使用 layout 布局，您可在 front-matter 指定其他布局，或是设为 false 来关闭布局功能，您甚至可在布局中再使用其他布局来建立嵌套布局。

## 局部模版
您也可以使用局部模版来提前一些公共模块，例如你可以将 `head`、`header`、`footer` 提取局部模版。

`EJS`模版引擎示例：

head.ejg
``` html
<meta name="keywords" content="<%= !!page.keywords ? page.keywords : config.site.keywords %>">
<meta name="description" content="<%= !!page.description ? page.description : config.site.description %>">
<title>
    <%= (!!page.title ? page.title : config.site.title) %>
</title>
```

index.ejs
``` html
<head>
    <%- include('head') %>
</head>
```
生成：
``` html
<head>
    <meta name="keywords" content="keywords">
    <meta name="description" content="description">
    <title>title</title>
</head>
```
其他模版引擎可以参看起具体语法。