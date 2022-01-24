const mysql = require('mysql');
const config = require('../../config.json').sql;

module.exports = function () {
    var db = mysql.createPool(config);

    let locations = `
    CREATE TABLE IF NOT EXISTS locations 
    (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT
    );`;

    let items = `
    CREATE TABLE IF NOT EXISTS items
    (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    location INTEGER,
    amount INTEGER DEFAULT 1,
    image TEXT, 
    FOREIGN KEY ( location ) 
        REFERENCES locations ( id )
    );`;

    let defaultLocation = `INSERT INTO locations (name, description, image) VALUES ( 'Default', 'No Location specified', 'default.png')`;
    // TODO check if default location exists
    db.query(locations + items + defaultLocation, function (error, results) {
        if (error) throw error;
        console.log('added default Tables and rows');
    });

    return db;
};
