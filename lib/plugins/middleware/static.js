'use strict';

const serveStatic = require('serve-static');

module.exports = function (app) {
    let { config, dist_dir } = this;
    if (app._use_static_file) {
        app.use(config.site.root, serveStatic(dist_dir, config.server.serve_static));
    }
};