const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();;

let db = new sqlite3.Database("./db/content.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.log("Error: " + err.message);
  } else {
    console.log("db connection successful");
  }
});

db.run(`CREATE TABLE [IF NOT EXISTS] items (
	itemid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    locationid INTEGER NOT NULL,
    image TEXT
    );
    CREATE TABLE [IF NOT EXISTS] locations (
	locationid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT
    );`)


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(express.json());


app.get("/", (req, res) => res.sendfile("./content/index.html"));

app.get("/item?id=[itemid]", (req, res) => {
  let itemid = req.query.id;
  let sql = `SELECT *
           FROM items
           WHERE  itemid = ?`;
  db.get(sql, [itemid], (err, row) => {
    if (err) {
      console.log("Error: " + err.message);
    } else {
      res.send(JSON.stringify({"id": row.id,
        "name": row.name,
        "description": row.description,
        "location": row.location,
        "image": row.image}));
    }
  });
});

app.get("/location?id=[locationid]", (req, res) => {
  let locationid = req.query.id;
  let sql = `SELECT *
           FROM locations
           WHERE  locationid = ?`;
  db.get(sql, [locationid], (err, row) => {
    if (err) {
      console.log("Error: " + err.message);
    } else {
      res.send(JSON.stringify({"id": row.id,
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
  let itemid =  request.body.itemid;
  let name = request.body.name;
  let description = request.body.description;
  let location = request.body.location;
  let image = request.body.image;
  let sql = `INSERT INTO items VALUES(?,?,?,?,?)`;
  db.run(sql, [itemid, name, description, location, image]);
});

app.post("/addlocation", (req, res) => {
  let itemid =  request.body.itemid;
  let name = request.body.name;
  let description = request.body.description;
  let image = request.body.image;
  let sql = `INSERT INTO items VALUES(?,?,?,?)`;
  db.run(sql, [itemid, name, description, image]);
});

app.get("*", (req, res) => res.send("404"));

app.listen(80, () => {
  console.log("App listening on 80");
});
