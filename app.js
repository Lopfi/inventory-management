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
	  item_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location_id INTEGER NOT NULL,
    image TEXT
    );`, function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Initialized items table.`);
    });

db.run(`
CREATE TABLE IF NOT EXISTS locations (
    location_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT
    );`, function(err) {
if (err) {
  return console.log(err.message);
}
console.log(`Initialized locations table.`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => res.sendFile(path.join(__dirname, '/content', 'index.html')));
app.get("/add", (req, res) => res.sendFile(path.join(__dirname, '/content', 'add.html')));
app.get("/del", (req, res) => res.sendFile(path.join(__dirname, '/content', 'delete.html')));

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

app.get("/items", (req, res) => {
  let location_id = req.query.location_id;
  let sql = `SELECT *
           FROM items
           WHERE location_id = ?`;
  db.all(sql, [location_id], (err, rows) => {
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

app.get("/locations", (req, res) => {
  let limit = req.query.limit;
  let offset = req.query.offset;
  let sql = `SELECT *
           FROM locations
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

app.get("/itemdata", (req, res) => {  //maybe rename to /item
  let item_id = req.query.id;
  let sql = `SELECT *
           FROM items
           WHERE item_id = ?`;
  db.get(sql, [item_id], (err, row) => {
    if (err) {
      console.log("Error: " + err.message);
    } else {
      res.send(JSON.stringify(row));
    }
  });
});

app.get("/locationdata", (req, res) => {  //maybe rename to /location
  let location_id = req.query.id;
  let sql = `SELECT *
           FROM locatoins
           WHERE  location_id = ?`;
  db.get(sql, [location_id], (err, row) => {
    if (err) {
      console.log("Error: " + err.message);
    } else {
      res.send(JSON.stringify(row));
    }
  });
});

app.post("/delitem", (req, res) => {
  let itemid = req.body.id;
  let sql = `DELETE FROM items WHERE itemid = ?`;
  db.run(sql, [itemid]);
});

app.post("/dellocation", (req, res) => {
  let locationid = req.body.id;
  let sql = `DELETE FROM locations WHERE locationid = ?`;
  db.run(sql, [locationid]);
});

app.post("/additem", (req, res) => {
  console.log()
  let name = req.body.name;
  let description = req.body.description;
  let locationid = req.body.location_id;
  let image = req.body.image;
  let sql = `INSERT INTO items (name, description, location_id, image) VALUES(?,?,?,?)`;
  db.run(sql, [name, description, locationid, image]);
});

app.post("/addlocation", (req, res) => {
  let name = req.body.name;
  let description = req.body.description;
  let image = req.body.image;
  let sql = `INSERT INTO locations (name, description, image) VALUES(?,?,?,?)`;
  db.run(sql, [name, description, image]);
});

app.get("*", (req, res) => res.status(404).send("404"));

app.listen(80, () => {
  console.log("App listening on 80");
});
