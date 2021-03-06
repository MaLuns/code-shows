'use strict';

const Promise = require('bluebird');
const { exists, createReadStream } = require('../../uitls/fs');
const { extname } = require('path');

const process = (name, ctx) => {
    const { db, log } = ctx;
    return Promise.filter(db[name].toArray(),
        // 过滤不存在文件
        asset => exists(asset.source).tap(exist => {
            if (!exist) {
                db[name].delete(asset._id);
            }
        })
    ).map(asset => {
        const data = { modified: asset.modified };
        let { path, source } = asset;

        if (asset.renderable && ctx.render.isRenderable(path)) { // 如果静态文件存在对应 渲染器-> 通过渲染器获取内容
            const filename = path.substring(0, path.length - extname(path).length);
            path = `${filename}.${ctx.render.getOutput(source)}`;

            data.data = () => ctx.render.run({
                path: source
            }).catch(err => {
                log.error('Asset render failed: %s', path, err);
            });
        } else {
            data.data = () => createReadStream(source); // 直接读入文件
        }

        return { route_url: path, data };
    });
};

// 处理 静态文件
function assetGenerator () {
    return Promise.all([
        process('AssetCache', this),
        process('CodeAssetCache', this),
    ]).then(data => [].concat(...data));
}

module.exports = assetGenerator;