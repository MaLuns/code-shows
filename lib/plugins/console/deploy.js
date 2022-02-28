'use strict';

function deploy () {
    let { config, log, extend } = this;
    const deployers = extend.deployer.list();

    if (!config.deploy) {
        let help = '';
        help += 'Deploy config not found \n\n';
        help += '   You should configure deployment settings in code.config.json first!\n';
        help += '   Available deployer plugins:\n\n';
        help += `     ${Object.keys(deployers).join(', ')}\n\n`;
        help += '   Add the plug-in configuration.\n';
        log.info(help);
        return;
    }
}

module.exports = deploy;