'use strict';

// 生成代码展示页
function pageGenerator () {
    const { db } = this;
    const pagesCache = Array.from(db.PostCache.cache, (val) => ({ ...val[1], _id: val[0] }));
    const result = [];

    pagesCache.map((page) => {
        let { layout, _content, path } = page;
        if (!path.endsWith('index.html')) {
            path = path.replace(/\.html$/, '/index.html');
        }

        if (!layout || layout === 'false') {
            result.push({ path, data: _content });
        } else {
            const layouts = ['view', 'index'];
            if (layout && layout !== 'view') layouts.unshift(layout);

            result.push({
                path,
                layout: layouts,
                data: {
                    ...page,
                    __view: true,
                }
            });

            result.push({
                path: path.replace(/index\.html$/, 'editor.html'),
                layout: ['editor'],
                data: {
                    ...page,
                    __editor: true,
                }
            });
        }
    });

    return result;
}

module.exports = pageGenerator;
