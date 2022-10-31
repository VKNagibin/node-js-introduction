const http = require('http');
const envRoute = 'http://localhost:5000/env';

http.createServer((req, res) => {
    switch(req.url) {
        case '/get':
            if (req.method === 'GET') {
                res.end('get data');
            }
            res.end()
            break;
        case '/env':
            res.end(JSON.stringify(
                {
                    node_env: process.env.NODE_ENV,
                }))
            break;
        case '/404':
            res.writeHead(301, {Location: envRoute});
            res.end()
            break;
        case '/setHeaders':
            res.writeHead(200,
                {
                    "X-kuma-revision": "1085259",
                    "x-frame-options": "DENY"
                }
        )
            res.end();
            break;
        case '/cookie':
            if (req.method === 'GET') {
                res.end(req.headers.cookie);
            }
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString()
                })
                req.on('end', () => {
                    const cookies = body.split('&');
                    res.writeHead(200, {"set-Cookie" : cookies, 'Content-Type': 'text/plain'});
                    res.end(JSON.stringify(cookies));
                });
            }
            break;
        case '/':
            if (req.method === 'GET') {
                return handleGet(req, res);
            }
            if (req.method === 'POST') {
                return handlePost(req, res)
            }
        default:
            res.statusCode = 500;
            res.end(`${res.statusCode} Enternal server error`)
    }
}).listen(5000)

function handleGet(req, res) {
    res.end('get main page');
}

function handlePost(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        res.end(JSON.stringify(body))
    })
}