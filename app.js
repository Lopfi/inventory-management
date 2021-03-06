const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();;
const bodyParser = require('body-parser');
const multer = require('multer');
const uuid = require('uuid').v4;

const imgStorage = multer.diskStorage({
   destination: (req, file, cb) => {
       cb(null, 'db/img');
   },
   filename: (req, file, cb) => {
       const { originalname } = file;
       cb(null, `${uuid()}-${originalname}`);
   }
});

var imgPath;

const imgUpload = multer({
    storage: imgStorage,
    onFileUploadComplete: function (file) {
    imgPath = file.path;
    console.log(file.originalname + ' uploaded to  ' + file.path);
    }
});

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
    amount INTEGER NOT NULL,
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
app.use(express.static(path.join(__dirname, "db/img")));
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
      res.status(500).json({message:"database error"})
    } else {
      let response = [];
      rows.forEach((row) => {
        response.push(row);
      });
      res.status(200).json(response);
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
      res.status(500).json({message:"database error"})
    } else {
      let response = [];
      rows.forEach((row) => {
        response.push(row);
      });
      res.status(200).json(response);
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
      res.status(500).json({message:"database error"})
    } else {
      let response = [];
      rows.forEach((row) => {
        response.push(row);
      });
      res.status(200).json(response);
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
      res.status(500).json({message:"database error"})
    } else {
      res.status(200).json(row);
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
      res.status(500).json({message:"database error"})
    } else {
        let response = []
        response.push(row);
        res.status(200).json(response);
    }
  });
});

app.delete("/delitem", (req, res) => {
    let itemID = req.body.itemID;
    console.log("Deleting item " + itemID + " from database");
    let sql = `DELETE FROM items WHERE itemID = ?`;
    db.run(sql, [itemID], (err) => {
        if (err) {
            console.log("Error: " + err.message);
            res.status(500).json({message:"database error"})
        }
        else res.status(200).json({message: "successfully deleted from items"});
    });
});

app.delete("/dellocation", (req, res) => {
    let locationID = req.body.locationID;
    let sql = `DELETE FROM items WHERE itemID = ?`;
    db.run(sql, [locationID], (err) => {
        if (err) {
            console.log("Error: " + err.message);
            res.status(500).json({message:"database error"})
        }
        else res.status(200).json({message: "successfully deleted from locations"});
    });
});

app.put("/additem", imgUpload.single("image"),(req, res) => {
  let itemName = req.body.itemName;
  let description = req.body.description;
  let amount  = req.body.amount;
  let locationID = req.body.locationID;
  let image = imgPath;
  console.log("adding item to database")
  let sql = `INSERT INTO items (itemName, description, amount, locationID, image) VALUES(?,?,?,?,?)`;
  db.run(sql, [itemName, description, amount, locationID, image], (err) => {
      if (err) {
          console.log("Error: " + err.message);
          res.status(500).json({message:"database error"})
      }
      else res.status(200).json({message:"successfully added item to database"});
  });
});

app.put("/addlocation", imgUpload.single("image"), (req, res) => {
  let locationName = req.body.locationName;
  let description = req.body.description;
  let image = imgPath;
  let sql = `INSERT INTO locations (locationName, description, image) VALUES(?,?,?)`;
  db.run(sql, [locationName, description, image], (err) => {
    if (err) {
        console.log("Error: " + err.message);
        res.status(500).json({message:"database error"})
    }
    else res.status(200).json({message:"successfully added location to database"});
  });
});

app.get("*", (req, res) => res.status(404).send("404"));

app.listen(80, () => {
  console.log("App listening on 80");
});