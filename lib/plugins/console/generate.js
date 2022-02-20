const prettyHrtime = require('pretty-hrtime');
const { stat, mkdirs } = require('../../uitls/fs');

function generate () {
    const { assets_dir } = this;
    let start = process.hrtime();

    const firstGenerate = async () => {
        let interval = prettyHrtime(process.hrtime(start));
        this.log.info(`Files loaded in ${interval}`);

        try {
            const stats = await stat(assets_dir);
            if (!stats.isDirectory()) {
                throw new Error(`${assets_dir} is not a directory`);
            }
        } catch (err) {
            // 如果不存在，请创建 assets 文件夹
            if (err.cause && err.cause.code === 'ENOENT') {
                return mkdirs(assets_dir);
            }
            throw err;
        }
        // 处理静态文件
        
        // 输出构建信息
        interval = prettyHrtime(process.hrtime(start));
        this.log.info(`20 files generated in ${interval}`);
    };

    return this.load().then(firstGenerate).then(() => {

    });
}

module.exports = generate;