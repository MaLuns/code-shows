'use strict';

const { assignIn } = require('lodash');
const { urlFormat } = require('../../uitls');


const createLink = (options, ctx) => {
    const { base, format } = options;
    let { url, root } = ctx.config.site;
    return i => urlFormat(i === 1 ? base : base + format.replace('%d', i), root, url);
};

module.exports = function (options) {
    const { page, config } = this;
    if (!page) return '';
    options = assignIn({
        simple: false,
        format: config.pagination.dir + '/%d/' || 'page/%d/',
        base: page.base,
        prev: page.prev,
        next: page.next,
        total: page.total,
        current: page.current,
        nextText: '→',
        prevText: '←',
    }, options);

    const { simple, prev, next, total, current, nextText, prevText } = options;
    const link = createLink(options, this);

    const tags = ['<div class="paginator">'];
    if (prev && current > 1) {
        tags.push(`<a href="${link(prev)}" rel="prev" class="btn-prev">${prevText}</a>`);
    } else {
        tags.push(`<span class="btn-prev disabled">${prevText}</span>`);
    }
    if (!simple) {
        if (total < 6) {
            for (let i = 1; i <= total; i++) {
                tags.push(`<a href="${link(i)}" class="number">${i}</a>`);
            }
        } else {
            let lastIndex = Math.max(1, current - 1);
            let nextIndex = Math.min(total, current + 1);
            for (let i = lastIndex; i <= nextIndex.length; i++) {
                tags.push(`<a href="${link(i)}" class="number">${i}</a>`);
            }
        }
    }
    if (next && current < total) {
        tags.push(`<a href="${link(next)}" rel="next" class="btn-next">${nextText}</a>`);
    } else {
        tags.push(`<span class="btn-next disabled">${nextText}</span>`);
    }
    tags.push('</div>');
    return tags.join('');
};