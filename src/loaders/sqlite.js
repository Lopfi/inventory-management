const sqlite3 = require('sqlite3').verbose();

module.exports = function () {
    const db = new sqlite3.Database("./db/content.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.log("Error: " + err.message);
        } else {
        }
    });
    //TODO: rename columns
    db.run(`
    CREATE TABLE IF NOT EXISTS items
    (
        itemID INTEGER PRIMARY KEY NOT NULL,
        itemName TEXT NOT NULL,
        description TEXT,
        locationID INTEGER,
        amount INTEGER DEFAULT 1,
        image TEXT, 
        FOREIGN KEY ( locationID ) 
            REFERENCES locations ( locationID )
        );`, function (err) {
        if (err) {
            return console.log(err.message);
        }
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS locations
    (
        locationID
        INTEGER
        PRIMARY
        KEY,
        locationName
        TEXT
        NOT
        NULL,
        description
        TEXT,
        image
        TEXT
    );`, function (err) {
        if (err) {
            return console.log(err.message);
        }
    });

    db.run(`INSERT INTO locations (locationID, locationName, description, image)
        SELECT 0, 'Default', 'No Location specified', 'default.png'
        WHERE NOT EXISTS (SELECT locationID FROM locations WHERE locationID = 0);`, function (err) {
        if (err) {
            return console.log(err.message);
        }
    });
    return db;
}