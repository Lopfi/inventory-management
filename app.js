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
	itemID INTEGER PRIMARY KEY,
    itemName TEXT NOT NULL,
    description TEXT,
    locationID INTEGER NOT NULL,
    count INTEGER NOT NULL,
    image TEXT
    );`, function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Initialized items table.`);
    });

db.run(`
CREATE TABLE IF NOT EXISTS locations (
    locationID INTEGER PRIMARY KEY,
    locationName TEXT NOT NULL,
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
app.get("/scan", (req, res) => res.sendFile(path.join(__dirname, '/content', 'scanner.html')));

app.get("/itemlist", (req, res) => {
  let limit = req.query.limit;
  let offset = req.query.offset;
  let sql = `
           SELECT items.itemID, items.itemName, items.image, locations.locationID, locations.locationName
           FROM items
           INNER JOIN locations
           ON items.locationID = locations.locationID
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

app.get("/locationlist", (req, res) => {
  let limit = req.query.limit;
  let offset = req.query.offset;
  let sql = `SELECT locations.locationID, locations.locationName, locations.image, count(items.itemID) AS amount
             FROM locations
             INNER JOIN items
             ON locations.locationID = items.locationID
             GROUP BY locations.locationName
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
  let locationID = req.query.locationID;
  let sql = `SELECT *
           FROM items
           WHERE locationID = ?`;
  db.all(sql, [locationID], (err, rows) => {
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
  let itemID = req.query.itemID;
  let sql = `SELECT *
           FROM items
           WHERE itemID = ?`;
  db.get(sql, [itemID], (err, row) => {
    if (err) {
      console.log("Error: " + err.message);
    } else {
      res.send(JSON.stringify(row));
    }
  });
});

app.get("/locationdata", (req, res) => {  //maybe rename to /location
  let locationID = req.query.locationID;
  let sql = `SELECT *
           FROM locations
           WHERE  locationID = ?`;
  db.get(sql, [locationID], (err, row) => {
    if (err) {
      console.log("Error: " + err.message);
    } else {
      res.send(JSON.stringify(row));
    }
  });
});

app.post("/delitem", (req, res) => {
  let itemID = req.body.itemID;
  let sql = `DELETE FROM items WHERE itemID = ?`;
  db.run(sql, [itemID], (err) => {
    if (err) console.log("Error: " + err.message);
  });
});

app.post("/dellocation", (req, res) => {
  let locationID = req.body.locationID;
  let sql = `DELETE FROM locations WHERE locationID = ?`;
  db.run(sql, [locationID], (err) => {
    if (err) console.log("Error: " + err.message);
  });
});

app.post("/additem", (req, res) => {
  console.log()
  let itemName = req.body.itemName;
  let description = req.body.description;
  let locationID = req.body.locationID;
  let image = req.body.image;
  let sql = `INSERT INTO items (itemName, description, locationID, image) VALUES(?,?,?,?)`;
  db.run(sql, [itemName, description, locationID, image], (err) => {
    if (err) console.log("Error: " + err.message);
  });
});

app.post("/addlocation", (req, res) => {
  let locationName = req.body.locationName;
  let description = req.body.description;
  let image = req.body.image;
  let sql = `INSERT INTO locations (locationName, description, image) VALUES(?,?,?)`;
  db.run(sql, [locationName, description, image], (err) => {
    if (err) console.log("Error: " + err.message);
  });
});

app.get("*", (req, res) => res.status(404).send("404"));

app.listen(80, () => {
  console.log("App listening on 80");
});