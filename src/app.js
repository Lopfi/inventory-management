const express = require('express');
const loaders = require('./loaders');
const dotenv = require('dotenv');
dotenv.config();

async function startServer() {

    const app = express();

    await loaders({ expressApp: app });

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });}

startServer();

