'use strict';

const less = require('less');

const lessRenderer = async (data) => {
    return await less.render(data.text).then(res => res.css);
};

module.exports = lessRenderer;