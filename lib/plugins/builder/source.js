'use strict';

const Pattern = require('../../uitls/pattern');
const { statSync } = require('../../uitls/fs');
const { join } = require('path');

// 代码片段目录
const codeDir = 'source/';

const isHiddenFile = (path) => {
    return /(^|\/)[_.]/.test(path);
};

module.exports = ctx => {
    return {
        pattern: new Pattern(path => {
            let result;
            if (path.startsWith(codeDir)) {
                result = {
                    published: true,
                    path: path.substring(codeDir.length)
                };
            }
            if (!result || isHiddenFile(result.path)) return;

            // 判断是否有渲染器
            let fileDirectory = join(ctx.base_dir, path);
            let stat = statSync(fileDirectory);
            if (stat.isDirectory()) {
                result.renderable = ctx.render.isRenderable(path, '/index.html');
            } else if (stat.isFile()) {
                result.renderable = ctx.render.isRenderable(path);
            }
            return result;
        }),
        process () {
            // 单个文件

            // 文件夹
        }
    };
};