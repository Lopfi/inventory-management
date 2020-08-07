const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();;
const bodyParser = require('body-parser');

let db = new sqlite3.Database("./db/content.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.log("Error: " + err.message);
  } else {
    console.log("db connection successful");
  }
});

db.run(`
CREATE TABLE IF NOT EXISTS items (
	itemid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    locationid INTEGER NOT NULL,
    image TEXT
    );`, function(err) {
    if (err) {
      return console.log(err.message);
    }    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

db.run(`
CREATE TABLE IF NOT EXISTS locations (
  locationid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT
    );`, function(err) {
if (err) {
  return console.log(err.message);
}    // get the last insert id
console.log(`A row has been inserted with rowid ${this.lastID}`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => res.sendFile(path.join(__dirname, '/content', 'index.html')));
app.get("/add", (req, res) => res.sendFile(path.join(__dirname, '/content', 'add.html')));

app.get("/items", (req, res) => {
  let limit = req.query.limit;
  let offset = req.query.offset;
  let sql = `SELECT *
           FROM items
           LIMIT ? OFFSET ?`;
  db.all(sql, [limit, offset], (err, rows) => {
    if (err) {
      console.log("Error: " + err.message);
    } else {
      let response = [];
      rows.forEach((row) => {
        response.push(row);
      });
      res.send(JSON.stringify(response));
    }
  });
});

app.get("/itemdata", (req, res) => {
  let itemid = req.query.id;
  let sql = `SELECT *
           FROM items
           WHERE  itemid = ?`;
  db.get(sql, [itemid], (err, row) => {
    if (err) {
      console.log("Error: " + err.message);
    } else {
      res.send(JSON.stringify({
        "itemid": row.itemid,
        "name": row.name,
        "description": row.description,
        "locationid": row.locationid,
        "image": row.image}));
    }
  });
});

app.get("/location", (req, res) => {
  let locationid = req.query.id;
  let sql = `SELECT *
           FROM locations
           WHERE  locationid = ?`;
  db.get(sql, [locationid], (err, row) => {
    if (err) {
      console.log("Error: " + err.message);
    } else {
      res.send(JSON.stringify({"id": row.locationid,
        "name": row.name,
        "description": row.description,
        "image": row.image}));
    }
  });
});

app.post("/delitem", (req, res) => {
  let itemid = request.body.itemid;
  let sql = `DELETE FROM items WHERE itemid = ?`;
  db.run(sql, [itemid]);
});

app.post("/dellocation", (req, res) => {
  let locationid = request.body.locationid;
  let sql = `DELETE FROM locations WHERE locationid = ?`;
  db.run(sql, [locationid]);
});

app.post("/additem", (req, res) => {
  let itemid =  req.body.itemid;
  let name = req.body.name;
  let description = req.body.description;
  let locationid = req.body.locationid;
  let image = req.body.image;
  let sql = `INSERT INTO items VALUES(?,?,?,?,?)`;
  db.run(sql, [itemid, name, description, locationid, image]);
  res.send(req.body);
});

app.post("/addlocation", (req, res) => {
  let locationid =  req.body.locationid;
  let name = req.body.name;
  let description = req.body.description;
  let image = req.body.image;
  let sql = `INSERT INTO items VALUES(?,?,?,?)`;
  db.run(sql, [locationid, name, description, image]);
});

app.get("*", (req, res) => res.send("404"));

app.listen(80, () => {
  console.log("App listening on 80");
});
