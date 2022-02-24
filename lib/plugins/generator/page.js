'use strict';

const _ = require('lodash');

// 生成代码展示页
function pageGenerator () {
    const { db, config } = this;
    const pagesCache = Array.from(db.PostCache.cache, (val) => ({ ...val[1], _id: val[0] }));


    return _.orderBy(pagesCache, config.pagination.order_by).map(function (page) {
        let { layout, _content, path } = page;

        if (!layout || layout === 'false') {
            return {
                path,
                data: _content
            };
        } else {
            const layouts = ['view', 'index'];
            if (layout && layout !== 'view') layouts.unshift(layout);

            page.__page = true;

            return {
                path,
                layout: layouts,
                data: page
            };
        }
    });
}

module.exports = pageGenerator;
