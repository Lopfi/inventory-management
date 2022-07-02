const mysql = require("mysql");
const config = require("../../config.json").sql;

module.exports = function () {
  var db = mysql.createPool(config);

  //CREATE DATABASE `inventory_management` /*!40100 COLLATE 'utf8mb4_general_ci' */

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

  db.query(locations + items, function (error, results) {
    if (error) throw error;
    console.log("added default Tables and rows");
  });

  db.query(
    `SELECT * FROM locations WHERE name='Default'`,
    function (error, results) {
      if (error) throw error;
      else if (results.length === 0) {
        console.log("No default locations found, creating default locations");
        db.query(defaultLocation, function (err, results) {
          if (error) throw error;
          else console.log("Default locations created");
        });
      }
    }
  );

  return db;
};
