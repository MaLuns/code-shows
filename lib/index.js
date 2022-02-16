'use strict';

module.exports = (args) => new (require("./code-shows"))(process.cwd(), args).init();