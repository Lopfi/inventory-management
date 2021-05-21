const express = require('express');
const path = require('path');
const {sendSqlQuery} = require('../utils');

const router = express.Router()

module.exports = function (db, upload) {
    router.get("/", (req, res) => res.sendFile(path.join(__dirname, '../../public/html', 'index.html')));
    router.get("/add", (req, res) => res.sendFile(path.join(__dirname, '../../public/html', 'add.html')));
    router.get("/scan", (req, res) => res.sendFile(path.join(__dirname, '../../public/html', 'scanner.html')));

    router.get("/itemlist", (req, res) => {
        const {limit, offset} = req.query;
        let sql = `
            SELECT items.itemID, items.itemName, items.image, locations.locationID, locations.locationName
            FROM items
                     LEFT JOIN locations
                               ON items.locationID = locations.locationID
            LIMIT ? OFFSET ?`;
        sendSqlQuery(db, sql, [limit, offset], res);
    });

    router.get("/locationlist", (req, res) => {
        const {limit, offset} = req.query;
        let sql = `SELECT locations.locationID, locations.locationName, locations.image, count(items.itemID) AS amount
                   FROM locations
                            LEFT JOIN items
                                      ON locations.locationID = items.locationID
                   GROUP BY locations.locationName
                   LIMIT ? OFFSET ?`;
        sendSqlQuery(db, sql, [limit, offset], res);
    });

    router.get("/items", (req, res) => {
        let locationID = req.query.locationID;
        let sql = `SELECT *
                   FROM items
                   WHERE locationID = ?`;
        sendSqlQuery(db, sql, [locationID], res);
    });

    router.get("/itemdata", (req, res) => {  //maybe rename to /item
        let itemID = req.query.itemID;
        let sql = `SELECT *
                   FROM items
                   WHERE itemID = ?`;
        db.get(sql, [itemID], (err, row) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"})
            } else {
                res.status(200).json(row);
            }
        });
    });

    router.get("/locationdata", (req, res) => {  //maybe rename to /location
        let locationID = req.query.locationID;
        let sql = `SELECT *
                   FROM locations
                   WHERE locationID = ?`;
        db.get(sql, [locationID], (err, row) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"})
            } else {
                let response = []
                response.push(row);
                res.status(200).json(response);
            }
        });
    });

    router.delete("/delitem", (req, res) => {
        let itemID = req.body.itemID;
        console.log("Deleting item " + itemID + " from database");
        let sql = `DELETE
                   FROM items
                   WHERE itemID = ?`;
        db.run(sql, [itemID], (err) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"})
            } else res.status(200).json({message: "successfully deleted from items"});
        });
    });

    router.delete("/dellocation", (req, res) => {
        let locationID = req.body.locationID;
        let sql = `DELETE
                   FROM items
                   WHERE itemID = ?`;
        db.run(sql, [locationID], (err) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"})
            } else res.status(200).json({message: "successfully deleted from locations"});
        });
    });

    router.put("/additem", upload.array("files"), (req, res) => {
        const {itemName, description, amount, locationID} = req.body;
        let images = req.files;
        console.log("adding item to database");
        let paths = [];
        if (images) for (const image of images) paths.push(image.filename);
        else paths.push("default.jpg");
        let sql = `INSERT INTO items (itemName, description, amount, locationID, image)
                   VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [itemName, description, amount, locationID, paths], (err) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"})
            } else res.status(200).json({message: "successfully added item to database", uploaded: images.length});
        });
    });

    router.put("/addlocation", upload.array("image"), (req, res) => {
        const {locationName, description} = req.body;
        let images = req.files;
        let paths = [];
        if (images) for (const image of images) paths.push(image.filename);
        else paths.push("default.jpg");
        let sql = `INSERT INTO locations (locationName, description, image)
                   VALUES (?, ?, ?)`;
        db.run(sql, [locationName, description, paths], (err) => {
            if (err) {
                console.log("Error: " + err.message);
                res.status(500).json({message: "database error"})
            } else res.status(200).json({
                message: "successfully added location to database",
                uploaded: req.files.length
            });
        });
    });

    router.get("*", (req, res) => res.status(404).send("404"));

    return router;
}