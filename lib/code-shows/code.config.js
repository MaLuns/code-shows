'use strict';

// 默认配置文件
module.exports = {
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
    dir: {
        source_dir: 'source',
        asset_dir: 'asset',
        script_dir: 'script',
        theme_dir: 'theme',
        dist_dir: 'dist',
    },
    new_code_file: ['.vue', '.html'],
    default_layout: 'view',
    pagination: {
        dir: 'page',
        per_page: 12,
        order_by: ['date', 'desc']
    },
    deploy: {
        type: 'git',
        repository: '',
        branch: 'master'
    },
    server: {
        port: 3000,
        cache: true,
        serve_static: false,
    }
};