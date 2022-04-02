# 辅助函数
辅助函数帮助您在模版中快速插入内容。辅助函数不能在源文件中使用。

## css
载入 CSS 文件。paths 可以是数组、字符串、对象，如果是 字符串数组 和 字符串 如果 path 开头不是 // 或 http(s)，则会自动加上根路径；如果后面没有加上 .css 扩展名的话，也会自动加上。如果是对象着属性都会被当作 HTML 属性。
``` html
<%- css(paths) %>
```
示例：
``` html
<%- css('style.css') %>
// <link rel="stylesheet" href="/style.css">

<%- css(['style.css', 'screen.css']) %>
// <link rel="stylesheet" href="/style.css">
// <link rel="stylesheet" href="/screen.css">

<%- css({ href: 'style.css', integrity: 'foo' }) %>
// <link rel="stylesheet" href="style.css" integrity="foo">
```

## js
载入 JavaScript 文件。与上面 css() 使用方法一直。
``` html
<%- js(paths) %>
```
示例：
``` html
<%- js('script.js') %>
// <script src="/script.js"></script>

<%- js(['script.js', 'gallery.js']) %>
// <script src="/script.js"></script>
// <script src="/gallery.js"></script>

<%- js({ src: 'script.js', integrity: 'foo', async: true }) %>
// <script src="/script.js" integrity="foo" async></script>
```

## tag
生成HTML元素。tag 为标签名，props 为元素属性，innerHTML 为元素子元素文本。props 可为字符串或对象，如果是字符串将忽略 innerHTML。innerHTML 则可为字符串和字符串数组。
``` ejs
<%- js(tag, props, innerHTML) %>
```
示例：
``` html
<%- js('div', {id:'id'}, 'hello') %>
// <div id="id">
//     hello
// </div>

<%- js('div', {id:'id'}, 【'hello','word']) %>
// <div id="id">
//     hello word
// </div>

<%- js('div', 'hello') %>
// <div>
//     hello
// </div>
```

## paginator
插入分页链接，给首页列表生成分页。
``` html
<%- paginator(options) %>
```

## variable
注入全局变量，以便我们将变量快速注入到模版中。name 变量名称，val 需要注入值。
``` html
<%- variable(name,val) %>
```
示例：
``` html
// 假设有个变量 page.loc = {id:'a',date:'2022-1-1'}
<%- variable('_loc', page.log) %>

// 结果
<script>
window._loc = {
    id:'a',
    date:'2022-1-1'
}
</script>
```

## url_format
在路径前加上根路径。
``` html
<%- url_format(path) %>
```
示例：

假设配置了 root：/code/
``` html
<%- url_format('path') %>

// /code/path
```

## full_url_for
在路径前加上根路径和域名。
``` html
<%- full_url_for(path) %>
```
示例：

假设配置了 root：/code/、url：https://demo.com
``` html
<%- full_url_for('path') %>

// https://demo.com/code/path
```