'use strict';

module.exports = ctx => {
    const { renderer } = ctx.extend;
    const plain = require('./plain.js');

    renderer.register('html', 'html', plain);
    renderer.register('vue', 'html', plain);
    renderer.register('css', 'css', plain, true);
    renderer.register('js', 'js', plain, true);

    renderer.register('json', 'json', require('./json'));
    renderer.register('ejs', 'html', require('./ejs'));
    renderer.register('less', 'css', require('./less'));
};