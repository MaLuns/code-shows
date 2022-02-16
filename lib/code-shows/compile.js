'use strict';

const fm = require('front-matter');
const renderer = require('./renders')
const _ = require('lodash');
const { join } = require('path')
const { existsSync, readdirSync, readFileTextSync } = require('../uitls/fs')
const { warn, info } = require('../uitls/log');
const { getExtname, getFileName, splitCode } = require('../uitls');

class Compiler {
    constructor(basepath) {
        this.basepath = basepath
        this.cache = {}

        const configPath = join(basepath, 'code.config.json')
        if (existsSync(configPath)) {
            this.config = renderer.getOutputSync(configPath)
            this.compileSource(join(this.basepath, this.config.source_dir || 'source'))
        } else {
            warn(`The file ${configPath} was not found, please create the configuration file code.config.json`);
            throw new Error('configPath not empty')
        }
    }

    compileSource (sourcePath) {
        // 读取文件夹
        const sourceDirs = readdirSync(sourcePath, {
            withFileTypes: true
        })

        if (existsSync(sourcePath) && sourceDirs.length !== 0) {
            sourceDirs.forEach(dir => {
                if ((dir.isFile() && ['html'].includes(getExtname(dir.name))) || dir.isDirectory()) {
                    const optios = this._loadPageInfo(join(sourcePath, dir.name), dir.isFile() ? 'file' : 'dir')
                    if (optios) {
                        this.cache[dir.name + (dir.isFile() ? '' : '/index.html')] = {
                            ...optios,
                            html: this.compileLayout(optios)
                        }
                    }
                }
            })
        }
    }

    compileLayout (optios) {
        return renderer.getOutputSync(
            join(this.basepath, 'layout', optios.layout + '.ejs'),
            _.cloneDeep({
                ...optios,
                config: this.config
            })
        );
    }

    // 加载文件信息
    _loadPageInfo (basePath, type) {
        let filePath = basePath
        if (type === 'dir') {
            filePath = join(basePath, 'index.html')
        }

        if (existsSync(filePath)) {
            const fileText = readFileTextSync(filePath)
            const fmData = fm(fileText)
            const codeTemplate = splitCode(fmData.body)
            return {
                type,
                layout: fmData.attributes.layout || 'view',
                filePath: basePath,
                page: {
                    ...fmData.attributes,
                    ...codeTemplate
                }
            }
        }
    }
}

module.exports = Compiler;