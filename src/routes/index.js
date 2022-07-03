const express = require("express");
const path = require("path");
const {
  sendSqlQuery,
  executeSqlQuery,
  getImagePaths,
  generatePDF,
} = require("../utils");

const router = express.Router();

module.exports = function (db, upload) {
  router
    .route("/items")
    .get((req, res) => {
      const { limit, offset } = req.query;
      let sql = `
            SELECT items.id as itemID, items.name as itemName, items.image, locations.id as locationID, locations.name as locationName
            FROM items
                     LEFT JOIN locations
                               ON items.location = locations.id
            LIMIT ? OFFSET ?`;
      sendSqlQuery(db, sql, [parseInt(limit), parseInt(offset)], res);
    })
    .put(upload.array("files"), (req, res) => {
      const { name, description, amount, location } = req.body;
      let sql = `INSERT INTO items (name, description, amount, location, image)
                   VALUES (?, ?, ?, ?, ?)`;
      executeSqlQuery(
        db,
        sql,
        [name, description, amount, location, getImagePaths(req.files)],
        res,
        "successfully added item to database"
      );
    });

  router
    .route("/locations")
    .get((req, res) => {
      const { limit, offset } = req.query;
      let sql = `SELECT locations.id as locationID, locations.name as locationName, locations.image, count(items.id) AS amount
                   FROM locations
                            LEFT JOIN items
                                      ON locations.id = items.location
                   GROUP BY locations.id
                   LIMIT ? OFFSET ?`;
      sendSqlQuery(db, sql, [parseInt(limit), parseInt(offset)], res);
    })
    .put(upload.array("files"), (req, res) => {
      const { name, description } = req.body;
      let sql = `INSERT INTO locations (name, description, image)
                   VALUES (?, ?, ?)`;
      executeSqlQuery(
        db,
        sql,
        [name, description, getImagePaths(req.files)],
        res,
        "successfully added location to database"
      );
    });

  router.get("/locations/labels", (req, res) => {
    console.log("generating labels");
    let sql = `SELECT id as locationID, name as locationName FROM locations LIMIT ?`;
    db.query(sql, [100], (err, rows) => {
      if (err) {
        console.log("Error: " + err.message);
        res.status(500).json({ message: "database error" });
      } else {
        //TODO: add fail check
        generatePDF(rows);
        setTimeout(() => {}, 500);
        res
          .status(200)
          .download(path.join(__dirname, "../utils/temp/labels.pdf"));
      }
    });
  });

  router
    .route("/locations/:id")
    .get((req, res) => {
      let sql = `SELECT id as locationID, name as locationName, image, description
                   FROM locations
                   WHERE id = ?`;
      sendSqlQuery(db, sql, [req.params.id], res);
    })
    .patch((req, res) => {
      const { id, name, description, amount, location } = req.body;
      let sql = `UPDATE items SET name=?, description=?, amount=?, location=? 
            WHERE id=?`;
      executeSqlQuery(
        db,
        sql,
        [name, description, amount, location, id],
        res,
        "successfully updated item in database"
      );
    })
    .delete((req, res) => {
      let sql = `DELETE
                    FROM locations
                    WHERE id = ?`;
      executeSqlQuery(
        db,
        sql,
        [req.params.id],
        res,
        "successfully deleted from locations"
      );
    });

  router.get("/locations/:id/items", (req, res) => {
    let sql = `SELECT id as itemID, name as itemName, image, description, location, amount
                   FROM items
                   WHERE location = ?`;
    sendSqlQuery(db, sql, [req.params.id], res);
  });

  router
    .route("/items/:id")
    .get((req, res) => {
      let sql = `SELECT id as itemID, name as itemName, image, description, location as locationID, amount
                   FROM items
                   WHERE id = ?`;
      sendSqlQuery(db, sql, [req.params.id], res);
    })
    .delete((req, res) => {
      let sql = `DELETE
                   FROM items
                   WHERE id = ?`;
      executeSqlQuery(
        db,
        sql,
        [req.params.id],
        res,
        "successfully deleted from items"
      );
    });

  router.get("/search", (req, res) => {
    var { string, limit, offset } = req.query;
    string = "%" + string + "%";
    let sql = `SELECT locations.id as locationID, locations.name as locationName, locations.image, count(items.id) AS amount
                   FROM locations
                            LEFT JOIN items
                                      ON locations.id = items.location
                   WHERE items.name LIKE ? OR locations.name LIKE ? OR items.description LIKE ? OR locations.description LIKE ?
                   LIMIT ? OFFSET ?`;
    sendSqlQuery(
      db,
      sql,
      [string, string, string, string, parseInt(limit), parseInt(offset)],
      res
    );
  });

  router.get("/img/:img", (req, res) =>
    res
      .status(200)
      .sendFile(path.join(__dirname, "../../db/images/", req.params.img))
  );

  router.get("*", (req, res) => res.status(404).send("404"));

  return router;
};
