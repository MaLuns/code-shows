'use strict';

const stylus = require('stylus');

function stylusRenderer (data, options = {}) {
    return new Promise((resolve) => {
        stylus.render(data.text, options, function (err, css) {
            if (err) throw err;
            resolve(css);
        });
    });

}

module.exports = stylusRenderer;