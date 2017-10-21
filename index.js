const path = require('path');
const express = require('express');
const app = express();

const fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'todolist.html'));
});

let items = '[]';
let itemsFile = path.join(__dirname, 'items.txt');
if (fs.existsSync(itemsFile)) {
    items = fs.readFileSync(itemsFile);
}

app.get('/items/set/:items', (req, res) => {
    items = req.params.items;
    fs.writeFile(itemsFile, items, () => {});
    res.sendStatus(200);
});
app.get('/items', (req, res) => {
    res.send(items);
});

app.listen(3000);