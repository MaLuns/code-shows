'use strict';

// 生成代码展示页
function pageGenerator () {
    const { db } = this;
    const pagesCache = db.PostCache.toArray();
    const result = [];

    pagesCache.map((page) => {
        let { layout, _content, route_url } = page;

        if (!layout || layout === 'false') {
            result.push({ path: route_url, data: _content });
        } else {
            const layouts = ['view', 'index'];
            if (layout && layout !== 'view') layouts.unshift(layout);

            result.push({
                path: route_url,
                layout: layouts,
                data: {
                    ...page,
                    __view: true,
                }
            });

            result.push({
                path: route_url.replace(/index\.html$/, 'editor.html'),
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
