const path = require('path');
const express = require('express');
const app = express();
require('express-ws')(app);

const fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'todolist.html'));
});

let items = '[]';
let itemsFile = path.join(__dirname, 'items.txt');
if (fs.existsSync(itemsFile)) {
    items = fs.readFileSync(itemsFile);
}

let clients = new Set();

app.get('/items/set/:items', (req, res) => {
    items = req.params.items;
    fs.writeFile(itemsFile, items, () => { });
    for (let client of clients) {
        try {
            client.send(items);
        } catch (ignored) {
        }
    }
    res.sendStatus(200);
});
app.get('/items', (req, res) => {
    res.send(items);
});

app.ws('/sock', (ws, req) => {
    ws.on('message', msg => {
        if (msg === 'join') {
            console.log('joined');
            clients.add(ws);
        }
    });
    ws.on('close', () => {
        console.log('closed');
        clients.delete(ws);
    });
});

app.listen(3000);