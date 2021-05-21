const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');

const routes = require('../routes');

module.exports = function ({ app }, db, multer){

    app.get('/status', (req, res) => { res.status(200).end(); });
    app.head('/status', (req, res) => { res.status(200).end(); });

    app.use(express.static(path.join(__dirname, "../../public")));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.json());
    app.use(routes(db, multer));

    // Return the express app
    return app;
};