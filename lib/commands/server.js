const connect = require('connect');
const http = require('http')
const { resolve, join } = require('path');
const Compiler = require('../compiler')

function server (port, base) {
    const compiler = new Compiler(base)

    const app = connect()
    app.use((req, res, next) => {
        const { method, url: requestUrl } = req;
        if (method !== 'GET' && method !== 'HEAD') return next();
        console.log(requestUrl);
        res.write(requestUrl)
        res.end()
    })

    // Create server
    var server = http.createServer(app)
    // Listen
    server.listen(port)
}

module.exports = server;