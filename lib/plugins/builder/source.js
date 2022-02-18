'use strict';

const Promise = require('bluebird');
const Pattern = require('../../uitls/pattern');

/* const { statSync } = require('../../uitls/fs');
const { join } = require('path');

// 代码片段目录
const codeDir = 'source/'; */

const isHiddenFile = (path) => {
    return /(^|\/)[_.]/.test(path);
};

module.exports = ctx => {
    return {
        pattern: new Pattern(path => {
            if (isHiddenFile(path)) return;
            let result = {
                published: true,
                path
            };

            // 判断是否有渲染器
            /* let fileDirectory = join(ctx.base_dir, path);
            let stat = statSync(fileDirectory);
            if (stat.isDirectory()) {
                result.renderable = ctx.render.isRenderable(path, '/index.html');
            } else if (stat.isFile()) { */
            result.renderable = ctx.render.isRenderable(path);

            /* } */
            return result;
        }),
        process (file) {
            console.log(file);
            if (file.params.renderable) {
                // 存在渲染器 
                return processCode(ctx, file);
            } else {
                // 不存在渲染器文件, 当静态文件处理
                return processAsset(ctx, file);
            }
        }
    };
};

// 处理代码片段信息
function processCode (ctx, file) {
    const Code = {};
    const id = file.source.substring(ctx.base_dir.length).replace(/\\/g, '/');

    if (file.type === 'skip' && Code.get(id)) {
        return;
    }

    if (file.type === 'delete') {
        return Code.remove(id);
    }

    return Promise.all([
        file.stat(),
        file.read()
    ]).spread((stats, content) => {
        console.log(stats, content);
    });
}

// 处理静态资源
function processAsset (ctx, file) {
    const CodeAsset = {}; // 
    const id = file.source.substring(ctx.base_dir.length).replace(/\\/g, '/');

    if (file.type === 'delete') {
        return CodeAsset.remove(id);
    }

    // 如果代码片段里 使用了这个静态文件
    // 将静态文件信息 加入到缓存里

    // 否则删除当前静态文件缓存信息
}