const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const msgpack = require('msgpack5')();
const app = express();

app.get('/cats', (req, res) => {
    getCats((err, cats) => {
        if (err) throw err;
        else res.send(msgpack.encode(cats));
    });
});

var port = 3000;

if (process.env.PRODUCTION) {
    port = 80;
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function getCats(callback) {
    let db = new sqlite3.Database('db/cat.db', sqlite3.OPEN_READ, (err) => {
        if (err) {
            callback(err, null);
        }
    });


    cats = [];
    db.serialize(() => {
        db.each('SELECT * FROM Cat', (err, row) => {
            if (err) {
                callback(err, null);
            }
            cats.push(row);
        });
    });

    db.close((err) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, cats);
        }
    });
}