const connect = require('connect');
const http = require('http')

function server (port, base) {
    const compiler = new Compiler(base)

    const app = connect()
    app.use((req, res, next) => {
        const { method, url: requestUrl } = req;
        if (method !== 'GET' && method !== 'HEAD') return next();

        if (compiler.get(requestUrl + '.html')) {
            res.setHeader('Content-Type', 'text/html');
            res.write(compiler.get(requestUrl + '.html'))
            res.end()
        } else if (compiler.get(requestUrl + '/index.html')) {
            console.log(req);
            res.statusCode = 301;
            res.setHeader('Location', `${root + url}/`);
            res.end('Redirecting');
            return
        }

        res.end()
    })

    // Create server
    var server = http.createServer(app)
    // Listen
    server.listen(port)
}

module.exports = server;