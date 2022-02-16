const figlet = require("figlet");
const program = require("commander");
//const CodeShows = require("./code-shows")
const { version, name } = require('../package.json');
const { info } = require('./uitls/log')


const entry = (args) => new (require("./code-shows"))(process.cwd(), args).init();


module.exports = entry;