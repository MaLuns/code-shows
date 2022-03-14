'use strict';

module.exports = ctx => function render (text, engine, options) {
    return ctx.render.runSync({
        text,
        engine
    }, options);
};
