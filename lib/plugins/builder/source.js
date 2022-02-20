'use strict';

const Promise = require('bluebird');
const Pattern = require('../../uitls/pattern');
const fm = require('../../uitls/front-matter');
const { splitCode } = require('../../uitls');

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
        build (file) {
            if (file.params.renderable) {
                // 存在渲染器 
                return buildCode(ctx, file);
            } else {
                // 不存在渲染器文件, 当静态文件处理
                return buildAsset(ctx, file);
            }
        }
    };
};

// 处理代码片段信息
function buildCode (ctx, file) {
    const PostCache = ctx.db.PostCache;
    const id = file.source.substring(ctx.base_dir.length).replace(/\\/g, '/');

    if (file.type === 'skip' && PostCache.get(id)) {
        return;
    }

    if (file.type === 'delete') {
        return PostCache.delete(id);
    }

    return Promise.all([
        file.stat(),
        file.read()
    ]).spread((stats, content) => {
        const data = fm.parse(content);

        data.source = file.path;
        data.raw = content;

        if (!data.date) {
            data.data = stats.birthtimeMs;
        }

        // 解析拆分代码
        data.code = splitCode(data._content);

        PostCache.set(id, data);
    });
}



// 处理静态资源
function buildAsset (ctx, file) {
    const AssetCache = ctx.db.AssetCache; // 
    // const PostCache = ctx.db.PostCache; // 
    const id = file.source.substring(ctx.base_dir.length).replace(/\\/g, '/');
    const asset = AssetCache.get(id);

    if (file.type === 'delete') {
        return AssetCache.delete(id);
    }

    // 如果代码片段里 使用了这个静态文件
    // 将静态文件信息 加入到缓存里
    let postId = true;

    /* PostCache.forEach(element => {

    }); */
    if (postId) {
        return AssetCache.set(id, {
            post: postId,
            modified: file.type !== 'skip',
            renderable: file.params.renderable
        });
    }
    // 否则删除当前静态文件缓存信息
    if (asset) {
        return AssetCache.delete(id);
    }
}