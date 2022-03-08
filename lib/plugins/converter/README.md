## converter

将代码拆分成多个块，用于在线编辑时候使用，例如 .vue 文件会被拆分成三块 \<template> \<style> \<script>

``` js
{
    title: {
        language: String, // monaco-editor 语言类型
        source: String, // 原始代码片段
        text: String, // 转换后的值 例如 ts转换成js less转换成css
    }
}
```