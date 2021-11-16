const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');

const routes = require('../routes');

module.exports = function ({ app }, db, multer){

    app.get('/status', (req, res) => { res.status(200).end(); });
    app.head('/status', (req, res) => { res.status(200).end(); });

    app.use(express.static(path.join(__dirname, "../../client/dist")));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.json());
    app.use('/api', routes(db, multer));
    app.get("/", (req, res) => res.sendFile(path.join(__dirname, '../../client/dist', 'index.html')));

    // Return the express app
    return app;
};