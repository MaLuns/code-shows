---
sidebarDepth: 2
---

# 快速上手
首先您的本地环境需要安装 ndoe 和 git。

## 安装
从头搭建一个 Code-Shows 项目仅仅只需要几行命令就可以完成。

**安装 Code-Shows**
``` bash
$ npm install code-shows -g

or

$ yarn global add code-shows
```

## 使用

**初始化项目**
``` bash
$ code-shows init <name>
cd [name]
```

**添加一个代码片段文件**
``` bash
$ code-shows new <name>
```
Code-Shows 以内置对 HTML、EJS、Pug、CSS、Less、Scss、JavaScript、TypeScrpit、coffeescript、Vue、Jsx多种语言支持。

### html
使用 `.html` 文件，为了能支持 Pug、EJS 等语法，需要将 HTML 标签部分包裹在 `template` 下 。

``` html
---
title: Hello Word
date: 2022-02-08 19:49:55
description: Hello Word
tags:
cdn: 
    js: ['可添加外部脚本']
    css: []
---
<template lang="pug">
div(class="demo") Hello Word
<template>
<style lang='less'>
    .demo {
        padding: 50px;
        text-align: center;
    }
</style>
```

### vue
使用 `.vue` 单文件，默认使用 `2.x` vue 版本，如果想使用 `3.x` 版本，可以在 `front-matter` 指定变量 `language: vue3`。

``` vue
---
title: Hello Word
date: 2022-02-08 19:49:55
description: Hello Word
tags:
---
<template>
    <button @click="add">Hello Word {{ count }}</button>
</template>
<script>
export default {
    data () {
        return {
            count: 0
        }
    },
    methods: {
        add () {
            this.count++;
        }
    }
}
</script>
<style lang="less">
body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #ddd;

    button {
        color: #090909;
        padding: 0.7em 1.7em;
        font-size: 18px;
        border-radius: 0.5em;
        background: #e8e8e8;
        border: 1px solid #e8e8e8;
        transition: all 0.3s;
        box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;

        &:active {
            color: #666;
            box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
        }
    }
}
</style>
```

使用 vue@3.x 版本。 
``` vue
---
title: Vue3
date: 2022-03-03 19:49:55
description: Vue3 单文件
tags:
language: vue3
---
<template lang="pug">
h1 {{msg}}
input(v-model="msg")
</template>

<script setup>
import { ref } from 'vue'

const msg = ref('Hello Pug!')
</script>

<style lang="less">
h1 {
    color: red;
}
</style>  
            
```
## 其他命令

**开启本地服务**
``` bash
$ code-shows serve
```

**生成静态文件**
``` bash
$ code-shows generate
```

**清理缓存文件**
``` bash
$ code-shows clean
```

**部署静态文件**
``` bash
$ code-shows deploy
```