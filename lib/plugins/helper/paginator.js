'use strict';

const { assignIn } = require('lodash');
const { urlFormat, createTag } = require('../../uitls');

const createLink = (options, ctx) => {
    const { format } = options;
    let { url, root } = ctx.config.site;
    return i => urlFormat(i === 1 ? '' : format.replace('%d', i), root, url);
};

module.exports = function (options) {
    const { page, config } = this;
    if (!page) return '';
    options = assignIn({
        simple: false,
        format: config.pagination.dir + '/%d/' || 'page/%d/',
        prev: page.prev,
        next: page.next,
        total: page.total,
        current: page.current,
        nextText: '→',
        prevText: '←',
    }, options);

    const { simple, prev, next, total, current, nextText, prevText } = options;
    const link = createLink(options, this);

    let tagStr = '';
    if (prev && current > 1) {
        tagStr += createTag('a', { href: link(prev), rel: 'prev', class: 'btn-prev' }, prevText);
    } else {
        tagStr += createTag('span', { class: 'btn-prev disabled' }, prevText);
    }
    if (!simple) {
        if (total < 6) {
            for (let i = 1; i <= total; i++) {
                if (i === current) {
                    tagStr += createTag('span', { class: 'number current' }, i);
                } else {
                    tagStr += createTag('a', { href: link(i), class: 'number' }, i);
                }
            }
        } else {
            let lastIndex = Math.max(1, current - 1);
            let nextIndex = Math.min(total, current + 1);
            for (let i = lastIndex; i <= nextIndex.length; i++) {
                if (i === current) {
                    tagStr += createTag('span', { class: 'number current' }, i);
                } else {
                    tagStr += createTag('a', { href: link(i), class: 'number' }, i);
                }
            }
        }
    }
    if (next && current < total) {
        tagStr += createTag('a', { href: link(next), rel: 'next', class: 'btn-next' }, nextText);
    } else {
        tagStr += createTag('span', { class: 'btn-next disabled' }, nextText);
    }
    return createTag('div', { class: 'paginator' }, tagStr);
};