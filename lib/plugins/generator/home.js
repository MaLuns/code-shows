'use strict';

const _ = require('lodash');
const { format } = require('util');

function homeGenerator () {
    const { db, config } = this;
    const result = [];
    const pagesCache = Array.from(db.PostCache.cache, (val) => ({ ...val[1], _id: val[0] }));

    // 分页配置
    const layout = ['index'];
    const perPage = config.pagination.per_page || 10;
    const path_format = config.pagination.dir + '/%d/' || 'page/%d/';
    const data = {
        __index: true
    };
    let base = config.pagination.path;
    if (base && !base.endsWith('/')) base += '/';

    const pages = _.orderBy(pagesCache, config.pagination.order_by);
    const total = perPage ? Math.ceil(pages.length / perPage) : 1;

    const formatURL = (i) => i > 1 ? base + format(path_format, i) : base;
    const makeData = (i) => {
        const data = {
            base,
            total,
            current: i,
            current_url: formatURL(i),
            prev: 0,
            prev_link: '',
            next: 0,
            next_link: '',
            codes: perPage ? pages.slice(perPage * (i - 1), perPage * i) : pages,
        };

        if (i > 1) {
            data.prev = i - 1;
            data.prev_link = formatURL(data.prev);
        }

        if (i < total) {
            data.next = i + 1;
            data.next_link = formatURL(data.next);
        }

        return data;
    };

    if (perPage) {
        for (let i = 1; i <= total; i++) {
            result.push({
                path: formatURL(i),
                layout,
                data: Object.assign(makeData(i), data)
            });
        }
    } else {
        result.push({
            path: base,
            layout,
            data: Object.assign(makeData(1), data)
        });
    }

    return result;
}

module.exports = homeGenerator;