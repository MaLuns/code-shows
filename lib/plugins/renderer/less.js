'use strict';

const less = require('less');

const lessRenderer = function (data, options = {}) {
  return less.render(data.text, options).then(res => res.css);
};

module.exports = lessRenderer;