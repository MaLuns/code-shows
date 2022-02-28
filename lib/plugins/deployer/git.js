'use strict';

const spawn = require('../../uitls/spawn');
const { join } = require('path');
const { exists, mkdir, copyDir, rmdirSync } = require('../../uitls/fs');

// 执行git命令
const getGit = (cwd) => (...args) => {
    return spawn('git', args, {
        cwd,
        stdio: 'inherit'
    });
};

module.exports = ctx => ({ url, branch }) => {
    const { base_dir, log, dist_dir } = ctx;
    const tempDir = join(base_dir, '.temp_git');

    const runGit = getGit(tempDir);

    return exists(tempDir)
        .then(exist => {
            if (exist) rmdirSync(tempDir);
            return mkdir(tempDir);
        })
        .then(() => {
            log.info('Copying files from dist folder...');
            return copyDir(dist_dir, tempDir);
        })
        .then(() => runGit('init'))
        .then(() => runGit('add', '-A'))
        .then(() => runGit('commit', '-m', 'deployer'))
        .then(() => runGit('push', '-u', url, 'HEAD:' + branch, '--force'))
        .then(() => log.info('Deployed success.'));
};