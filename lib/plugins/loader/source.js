'use strict';

const Promise = require('bluebird');
const dayjs = require('dayjs');
const Pattern = require('../../uitls/pattern');
const fm = require('../../uitls/front-matter');
const { isHiddenFile, isTmpFile } = require('./common');
const { splitCode, escapeBackslash, } = require('../../uitls');

module.exports = ctx => {
    return {
        pattern: new Pattern(path => {
            if (isTmpFile(path) || isHiddenFile(path)) return;
            let result = { path };

            if (ctx.config.new_code_file.some(val => path.endsWith(val))) {
                result.__page = true;
                result.published = true;
            }

            result.renderable = ctx.render.isRenderable(path);
            return result;
        }),
        load (file) {
            if (file.params.__page) {
                return loadCodeFile(ctx, file);
            } else {
                return loadAssetFile(ctx, file);
            }
        }
    };
};

// 处理代码片段信息
function loadCodeFile (ctx, file) {
    const PostCache = ctx.db.PostCache;
    const id = escapeBackslash(file.source.substring(ctx.base_dir.length));

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

        data.layout = data.layout || ctx.config.default_layout;
        data.source = file.source;
        data.path = file.path;
        data.raw = content;

        // 路由地址
        if (!data.path.endsWith('/index.html')) {
            data.route_url = data.path.replace(/\.vue$|\.html$/, '/index.html');
        } else {
            data.route_url = data.path;
        }

        // 是否发布
        if (file.params.published) {
            if (!Object.prototype.hasOwnProperty.call(data, 'published')) data.published = true;
        } else {
            data.published = false;
        }

        if (data.date) {
            data.date = dayjs(data.date).toDate();
        } else {
            data.date = stats.birthtime;
        }

        // 解析拆分代码
        data.code = splitCode(data._content);

        PostCache.set(id, data);
        return data;
    });
}

// 处理静态资源
function loadAssetFile (ctx, file) {
    const PostAssetCache = ctx.db.PostAssetCache;
    const id = escapeBackslash(file.source.substring(ctx.base_dir.length));

    if (file.type === 'delete') {
        return PostAssetCache.delete(id);
    }

    return PostAssetCache.set(id, {
        source: file.source,
        path: file.path,
        modified: file.type !== 'skip',
        renderable: file.params.renderable
    });

}