'use strict';

const Promise = require('bluebird');
const { exists, createReadStream } = require('../../uitls/fs');
const { extname } = require('path');

const process = (name, ctx) => {
    const { db } = ctx;

    return Promise.filter(
        db[name].toArray(),
        asset => exists(asset.source).tap(exist => {
            if (!exist) db[name].remove(asset._id);
        })
    ).map(asset => {
        const data = { modified: asset.modified };
        let { path, source } = asset;

        if (asset.renderable && ctx.render.isRenderable(path)) {
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
            data.data = () => createReadStream(source);
        }

        return {
            path,
            data
        };
    });
};

function assetGenerator () {
    return Promise.all([
        process('PostAssetCache', this),
    ]).then(data => [].concat(...data));
}

module.exports = assetGenerator;