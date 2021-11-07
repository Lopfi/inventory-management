const express = require('express');
const loaders = require('./loaders');

async function startServer() {

    const app = express();

    await loaders({ expressApp: app });

    app.listen(3000, () => console.log('Inventory management listening on port 3000!'));
}

startServer();

