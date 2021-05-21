const expressLoader = require('./express');
const sqliteLoader = require('./sqlite');
const multerLoader = require('./multer');

module.exports = async function ({expressApp}) {
    const db = await sqliteLoader();
    console.log('Sqlite Initialized');
    const multer = await multerLoader();
    console.log('Multer Initialized');
    await expressLoader({app: expressApp}, db, multer);
    console.log('Express Initialized');
}