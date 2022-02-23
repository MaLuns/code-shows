'use strict';

const Promise = require('bluebird');
const { exists, createReadStream } = require('../../uitls/fs');
const { extname } = require('path');

const process = (name, ctx) => {
    const { db } = ctx;
    return Promise.filter(db[name].toArray(),
        // 过滤不存在文件
        asset => exists(asset.source).tap(exist => {
            if (!exist) {
                db[name].remove(asset._id);
            }
        })
    ).map(asset => {
        const data = { modified: asset.modified };
        let { path, source } = asset;

        if (asset.renderable && ctx.render.isRenderable(path)) { // 如果静态文件存在对应 渲染器-> 通过渲染器获取内容
            const filename = path.substring(0, path.length - extname(path).length);
            path = `${filename}.${ctx.render.getOutput(source)}`;

            data.data = () => ctx.render.run({
                path: source,
                toString: true
            }).catch(err => {
                ctx.log.error(`Asset render failed: ${path}`);
                ctx.log.info(err);
            });
        } else {
            data.data = () => createReadStream(source); // 直接读入文件
        }

        return { path, data };
    });
};

// 处理 静态文件
function assetGenerator () {
    return Promise.all([
        process('AssetCache', this),
        process('PostAssetCache', this),
    ]).then(data => [].concat(...data));
}

module.exports = assetGenerator;