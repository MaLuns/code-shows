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
    
    renderer.register('pug', 'html', require('./pug'));
    renderer.register('less', 'css', require('./less'));
    renderer.register('scss', 'css', require('./scss'));
    renderer.register('sass', 'css', require('./scss'));
    renderer.register('stylus', 'css', require('./stylus'));
    renderer.register('coffeescript', 'js', require('./coffeescript'));
    renderer.register('ts', 'js', require('./ts'));
};