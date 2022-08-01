'use strict';
const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`)
    res.writeHead(200, {
        'Content-Type': 'text/html;charset=utf-8'
    });
    switch (req.method) {
        case 'GET':
            const rs = fs.createReadStream('./form.html');
            rs.pipe(res);
            break;
        case 'POST':
            let rawData = ''
            req.on('data', (chunk) => {
                rawData += chunk;
                console.info(chunk)
            })
                .on('end', () => {
                    let decoded=decodeURIComponent(rawData);
                    decoded=new URLSearchParams(decoded);
                    console.info(`[${now}] Data posted: ${decoded.get('name')}は${decoded.get('yaki-shabu')}に投票しました。`);
                    res.end();

                });
            break;
        default:
            break;
    }
})
    .on('error', e => {
        console.error(`[${new Date()}] Server Error`, e);
    })
    .on('clientError', e => {
        console.error(`[${new Date()}] Client Error`, e);
    })
const port = 8000;
server.listen(port, () => {
    console.info(`[${new Date()}]Listening on ${port}`)
});
