'use strict';

module.exports = ctx => {
    const { renderer } = ctx.extend;
    const plain = require('./plain.js');

    renderer.register('html', 'html', plain);
    renderer.register('vue', 'html', plain);
    renderer.register('css', 'css', plain);
    renderer.register('js', 'js', plain);

    renderer.register('json', 'json', require('./json'));
    renderer.register('ejs', 'html', require('./ejs'));
    renderer.register('less', 'css', require('./less'));
};