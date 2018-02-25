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

app.listen(3000, () => console.log('Example app listening on port 3000!'));

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