const mysql = require('mysql');

module.exports = function () {
    var db = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'inventory_management',
        multipleStatements: true,
    });

    let locations = `
    CREATE TABLE IF NOT EXISTS locations 
    (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT
    );`;

    let items = `
    CREATE TABLE IF NOT EXISTS items
    (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    location INTEGER,
    amount INTEGER DEFAULT 1,
    image TEXT, 
    FOREIGN KEY ( location ) 
        REFERENCES locations ( id )
    );`;

    let defaultLocation = `INSERT INTO locations (id, name, description, image)
    SELECT 0, 'Default', 'No Location specified', 'default.png'
    WHERE NOT EXISTS (SELECT id FROM locations WHERE id = 0);`;

    db.query(locations + items + defaultLocation, function (error, results) {
        if (error) throw error;
        console.log('added default Tables and rows');
    });

    return db;
};
