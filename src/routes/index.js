const express = require('express');
const path = require('path');
const {sendSqlQuery, getImagePaths} = require('../utils');

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
        .post(upload.array("files"), (req, res) => {
        const {itemName, description, amount, locationID} = req.body;
        let sql = `INSERT INTO items (itemName, description, amount, locationID, image)
                   VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [itemName, description, amount, locationID, getImagePaths(req.files)], (err) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"})
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
                   GROUP BY locations.locationName
                   LIMIT ? OFFSET ?`;
        sendSqlQuery(db, sql, [limit, offset], res);
    })
        .put(upload.array("files"), (req, res) => {
        const {locationName, description} = req.body;
        let sql = `INSERT INTO locations (locationName, description, image)
                   VALUES (?, ?, ?)`;
        db.run(sql, [locationName, description, getImagePaths(req.files)], (err) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"})
            } else res.status(200).json({message: "successfully added location to database"});
        });
    });

    router.route("/locations/:id")
        .get((req, res) => {
            let sql = `SELECT *
                   FROM locations
                   WHERE locationID = ?`;
            sendSqlQuery(db, sql, [req.params.id], res);
        })
        .delete((req, res) => {
        let sql = `DELETE
                   FROM locations
                   WHERE locationID = ?`;
        db.run(sql, [req.params.id], (err) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"})
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

    router.get("*", (req, res) => res.status(404).send("404"));

    return router;
}