'use strict';

const _ = require('lodash');

// 生成代码展示页
function pageGenerator () {
    const { db, config } = this;
    const codeCache = db.CodeCache.toArray();

    const codes = _.orderBy(codeCache, ...config.pagination.order_by);
    const result = [];

    codes.map((page) => {
        let { layout, _content, route_url } = page;

        if (!layout || layout === 'false') {
            result.push({ path: route_url, data: _content });
        } else {
            const layouts = ['view'];
            if (layout && layout !== 'view') layouts.unshift(layout);

            result.push({
                route_url,
                layout: layouts,
                data: {
                    ...page,
                    __view: true,
                }
            });

            result.push({
                route_url: route_url.replace(/index\.html$/, 'editor.html'),
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
