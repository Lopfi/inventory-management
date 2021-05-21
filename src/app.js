const express = require('express');
const loaders = require('./loaders');

async function startServer() {

    const app = express();

    await loaders({ expressApp: app });

    app.listen(80, () => console.log('Inventory management listening on port 80!'))
}

startServer();

