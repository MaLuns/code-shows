'use strict';

module.exports = ctx => {
    const { renderer } = ctx.extend;

    renderer.register('json', 'json', require('./json'));
    renderer.register('ejs', 'html', require('./ejs'));
    renderer.register('less', 'css', require('./less'));
};