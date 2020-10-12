const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const {json} = require('body-parser');

const pjson = require('./package.json');

const clipboard = require('./clipboard');
app.use(json());

app.post(`/${pjson.version}/copy`, (req, resp) => {
    clipboard.copy(req.body.content);
    resp.json({
        code: 0,
        message: 'success'
    })
});

app.ws(`/${pjson.version}/events`, (ws, req) => {
    const handler = (content) => {
        ws.send(JSON.stringify({
            event: 'copy',
            content: content
        }));

    };

    clipboard.on('copy', handler);

    ws.on('close', (code, reason) => {
        clipboard.off('copy', handler);
    });
    ws.on('error', () => {
        clipboard.off('copy', handler);
    });
});

app.get(`/${pjson.version}/clipboard`, (req, resp) => {
    resp.json({
        code: 0,
        message: 'success',
        clipboard: clipboard.all()
    })
});
app.listen(8100, "localhost");