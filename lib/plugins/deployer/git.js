'use strict';


module.exports = ctx => () => {
    let config = ctx.config.deploy;

    console.log(config);
};