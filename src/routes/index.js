const express = require('express');
const path = require('path');
const {sendSqlQuery, getImagePaths, generatePDF} = require('../utils');

const router = express.Router()

module.exports = function (db, upload) {
    router.get("/", (req, res) => res.sendFile(path.join(__dirname, '../../public/html', 'index.html')));
    router.get("/add", (req, res) => res.sendFile(path.join(__dirname, '../../public/html', 'add.html')));
    router.get("/scan", (req, res) => res.sendFile(path.join(__dirname, '../../public/html', 'scanner.html')));

    router.route("/items")
        .get((req, res) => {
        const {limit, offset} = req.query;
        let sql = `
            SELECT items.itemID, items.itemName, items.image, locations.locationID, locations.locationName
            FROM items
                     LEFT JOIN locations
                               ON items.locationID = locations.locationID
            LIMIT ? OFFSET ?`;
        sendSqlQuery(db, sql, [limit, offset], res);
    })
        .put(upload.array("files"), (req, res) => {
        const {name, description, amount, location} = req.body;
        let sql = `INSERT INTO items (itemName, description, amount, locationID, image)
                   VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [name, description, amount, location, getImagePaths(req.files)], (err) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"});
            } else res.status(200).json({message: "successfully added item to database"});
        });
    });

    router.route("/locations")
        .get((req, res) => {
        const {limit, offset} = req.query;
        let sql = `SELECT locations.locationID, locations.locationName, locations.image, count(items.itemID) AS amount
                   FROM locations
                            LEFT JOIN items
                                      ON locations.locationID = items.locationID
                   GROUP BY locations.locationID
                   LIMIT ? OFFSET ?`;
        sendSqlQuery(db, sql, [limit, offset], res);
    })
        .put(upload.array("files"), (req, res) => {
        const {name, description} = req.body;
        let sql = `INSERT INTO locations (locationName, description, image)
                   VALUES (?, ?, ?)`;
        db.run(sql, [name, description, getImagePaths(req.files)], (err) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"});
            } else res.status(200).json({message: "successfully added location to database"});
        });
    });

    router.get("/locations/labels", (req, res) => {
        const {limit, offset} = req.query;
        let sql = `SELECT locationID, locationName FROM locations LIMIT ? OFFSET ?`;
        db.all(sql, [limit, offset], (err, rows) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"})
            } else {
                //TODO: add fail check
                res.status(200).sendFile(generatePDF(rows));
            }
        });
    });
    router.route("/locations/:id")
        .get((req, res) => {
            let sql = `SELECT *
                   FROM locations
                   WHERE locationID = ?`;
            sendSqlQuery(db, sql, [req.params.id], res);
        })
        .patch((req, res) => {
            const {id, name, description, amount, location} = req.body;
            let sql = `UPDATE items SET itemName=?, description=?, amount=?, locationID=? 
            WHERE itemID=?`;
            db.run(sql, [name, description, amount, location, id], (err) => {
                if (err) {
                    console.log("Error: " + err.message);
                    res.status(500).json({message: "database error"});
                } else res.status(200).json({message: "successfully updated item in database"});
            });
        })
        .delete((req, res) => {
            let sql = `DELETE
                    FROM locations
                    WHERE locationID = ?`;
            db.run(sql, [req.params.id], (err) => {
                if (err) {
                    console.log("Error: " + err.message);
                    res.status(500).json({message: "database error"});
                } else res.status(200).json({message: "successfully deleted from locations"});
            });
        });

    router.get("/locations/:id/items", (req, res) => {
        let sql = `SELECT *
                   FROM items
                   WHERE locationID = ?`;
        sendSqlQuery(db, sql, [req.params.id], res);
    });

    router.route("/items/:id")
        .get((req, res) => {
            let sql = `SELECT *
                   FROM items
                   WHERE itemID = ?`;
            sendSqlQuery(db, sql, [req.params.id], res);
        })
        .delete((req, res) => {
            let sql = `DELETE
                   FROM items
                   WHERE itemID = ?`;
            db.run(sql, [req.params.id], (err) => {
                if (err) {
                    console.log("Error: " + err.message);
                    res.status(500).json({message: "database error"})
                } else res.status(200).json({message: "successfully deleted from items"});
            });
        });


    router.get("/search", (req, res) => {
        const {string, limit, offset} = req.query;
        let sql = `SELECT locations.locationID, locations.locationName, locations.image, count(items.itemID) AS amount
                   FROM locations
                            LEFT JOIN items
                                      ON locations.locationID = items.locationID
                   WHERE itemName LIKE ? OR locationName LIKE ? OR items.description LIKE ? OR locations.description LIKE ?
                   LIMIT ? OFFSET ?`;
        sendSqlQuery(db, sql, [string, string, string, string, limit, offset], res);
    });

    router.get("/img/:img", (req, res) => res.status(200).sendFile(path.join(__dirname, '../../db/images/', req.params.img)));

    router.get("*", (req, res) => res.status(404).send("404"));

    return router;
}