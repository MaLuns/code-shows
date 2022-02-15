const figlet = require("figlet");
const program = require("commander");
const { version } = require('../package.json');
const { info } = require('./uitls/log')

const entry = () => {
    const cmd = process.cwd()
    program
        .command('init')
        .arguments('<name>', 'Please enter a project name')
        .description("Setup your code-shows")
        .action(function (arg) {
            require('./commands/init')(arg, cmd)
        })

    program
        .command('serve [port]')
        .description("Start the server")
        .action(function (arg = 3000) {
            require('./commands/server')(arg, cmd)
        })

    program
        .command('generate')
        .description("Generate static files")
        .action(function (arg = 300) {
            console.log(arg)
        })

    program
        .version(version, '-v, --version', 'Display version number')
        .helpOption('-h, --help ', 'Display help')
        .action(() =>
            info('\n\n', figlet.textSync("SRP CLI", { font: 'isometric1', horizontalLayout: "full", }), '\n\n')
            & program.help())
        .parse(process.argv)
}


module.exports = entry;