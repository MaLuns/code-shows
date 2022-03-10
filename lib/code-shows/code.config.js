'use strict';

// 默认配置文件
module.exports = {
    // 站点配置
    site: {
        title: 'code-shows',
        subtitle: '',
        description: '',
        keywords: ' ',
        author: 'author',
        language: 'zh-CN',
        url: '',
        root: '/'
    },
    // 目录
    dir: {
        source_dir: 'source',
        asset_dir: 'asset',
        script_dir: 'script',
        theme_dir: 'theme',
        dist_dir: 'dist',
    },
    // 代码片段配置  针对 source_dir 下生效
    code_file: {
        include: ['**.vue', '**.html'], // 指定需要处理目录或文件
        exclude: [], // 不需要处理目录或文件, 会原样复制过去
        ignore: [] // 忽略文件或目录 
    },
    skip_console: [],
    // new_code_file: ,
    // 主题配置
    theme: {
        layout: 'view',
    },
    // 分页
    pagination: {
        dir: 'page',
        per_page: 6,
        order_by: ['date', 'desc']
    },
    // 部署
    deploy: {
        type: 'git',
        repository: '',
        branch: 'master'
    },
    // 本地服务
    server: {
        port: 3000,
        cache: true,
        serve_static: false,
    }
};