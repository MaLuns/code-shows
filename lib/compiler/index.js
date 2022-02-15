'use strict';

const fm = require('front-matter');
const renderer = require('./renders')
const { join } = require('path')
const { existsSync, readdirSync, readFileTextSync } = require('../uitls/fs')
const { warn, info } = require('../uitls/log');
const { getExtname, splitCode } = require('../uitls');

renderer.register('json', 'json', require('./renders/json'));
renderer.register('ejs', 'html', require('./renders/ejs'))
renderer.register('less', 'css', require('./renders/less'))

// 
class Compiler {
    constructor(path) {
        this.path = path
        this.cache = {}
        const configPath = join(path, 'code.config.json')
        if (!existsSync(configPath)) {
            warn(`The file ${configPath} was not found, please create the configuration file code.config.json`);
            throw new Error('configPath not empty')
        } else {
            this.config = renderer.getOutputSync(configPath)
        }
        this.compileSource(join(this.path, 'source'))
    }

    compileSource (sourcePath) {
        const sourceDirs = readdirSync(sourcePath, { withFileTypes: true })
        if (existsSync(sourcePath) && sourceDirs.length !== 0) {
            sourceDirs.forEach(dir => {
                const filePath = join(sourcePath, dir.name);
                if (dir.isFile() && ['html'].includes(getExtname(dir.name))) {
                    const fileText = readFileTextSync(filePath)
                    const fmData = fm(fileText)
                    console.log(splitCode(fmData.body), fmData.attributes);
                } else if (dir.isDirectory()) {
                    this.compileSource(filePath)
                }
            })
        }
    }

    compileStyle (path) {

    }
}

module.exports = Compiler;