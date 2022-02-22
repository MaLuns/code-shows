'use strict';

const _ = require('lodash');

function pageGenerator (db) {
    const pagesCache = Array.from(db.PostCache.cache, (val) => ({ ...val[1], _id: val[0] }));
    const pages = [];

    _.orderBy(pagesCache, 'date', 'desc').forEach(function (page) {
        let { layout, _content, path } = page;

        if (['false', 'off'].includes(layout)) {
            pages.push({
                path,
                data: _content
            });
        } else {
            const layouts = ['page', 'index'];
            //   if (layout !== 'page') layouts.unshift(layout);

            page.__page = true;
            pages.push({
                path,
                layout: layouts,
                data: page
            });
        }
    });


    return pages;
}

module.exports = pageGenerator;
