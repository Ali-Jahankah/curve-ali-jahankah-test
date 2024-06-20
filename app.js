const express = require('express'); // app.js
require('dotenv').config();

const routes = require('./routes/index');
const { rootRoute } = require('./constants/routes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4001;
app.get(rootRoute.url, routes);
app.listen(PORT, () => {
  console.log(`\n \n server running at on port ==> ${PORT} \n`);
});
module.exports = app;
