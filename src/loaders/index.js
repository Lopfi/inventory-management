const expressLoader = require('./express');
const dbLoader = require('./db');
const multerLoader = require('./multer');

module.exports = async function ({ expressApp }) {
    const db = await dbLoader();
    console.log('DB Initialized');
    const multer = await multerLoader();
    console.log('Multer Initialized');
    await expressLoader({ app: expressApp }, db, multer);
    console.log('Express Initialized');
};
