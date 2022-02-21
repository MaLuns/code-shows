'use strict';

function pageGenerator (db) {
    const pagesCache = db.PostCache;
    const pages = [];

    pagesCache.forEach(function (page, path) {
        let { layout, _content } = page;
        if (['false', 'off'].includes(layout)) {
            pages.push({
                path,
                data: _content
            });
        } else {
            const layouts = ['page', 'index'];
            if (layout !== 'page') layouts.unshift(layout);

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
