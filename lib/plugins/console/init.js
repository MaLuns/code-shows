const spawn = require('../../uitls/spawn');
const { warn, info } = require('../../uitls/log');
const { resolve, join } = require('path');
const { existsSync, readdirSync, rmdir, readdir, unlink, stat } = require('../../uitls/fs');

const GIT_REPO_URL = 'https://gitee.com/ml13/home-nav.git';

async function init (name, path) {
    const target = resolve(path, name);
    if (existsSync(target) && readdirSync(target).length !== 0) {
        warn((`${target} not empty, please run \`ml-code init\` on an empty folder and then copy your files into it`));
        await Promise.reject(new Error('target not empty'));
    }

    info('Cloning code-template', GIT_REPO_URL);

    try {
        await spawn('git', ['clone', '--recurse-submodules', '--depth=1', '--quiet', GIT_REPO_URL, target], {
            stdio: 'inherit'
        });
    } catch (err) {
        warn('git clone failed. Copying data instead');
    }

    if (existsSync(target) && readdirSync(target).length !== 0) {
        await Promise.all([
            removeGitDir(target),
            removeGitModules(target)
        ]);
        info(`\nPlease run 'npm install' or 'yarn' in "${target}" folder.\n`);
    }
}

// 删除 .git 目录
function removeGitDir (target) {
    const gitDir = join(target, '.git');

    return stat(gitDir).catch(err => {
        if (err && err.code === 'ENOENT') return;
        throw err;
    }).then(stats => {
        if (stats) {
            return stats.isDirectory() ? rmdir(gitDir) : unlink(gitDir);
        }
    }).then(() => readdir(target))
        .map(path => join(target, path))
        .filter(path => stat(path).then(stats => stats.isDirectory()))
        .each(removeGitDir);
}

// 删除子模块
async function removeGitModules (target) {
    try {
        await unlink(join(target, '.gitmodules'));
    } catch (err) {
        if (err && err.code === 'ENOENT') return;
        throw err;
    }
}

module.exports = init;