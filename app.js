const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes/index');
const { rootRoute } = require('./constants');
const db = require('./config/db');
const { ingestDataHandler } = require('./utils/dataHandler');

const app = express();
const PORT = process.env.PORT || 4001;
app.get(rootRoute.url, routes);
app.listen(PORT, () => {
  console.log(`\n \n server running at on port ==> ${PORT} \n`);
  db.once('open', async () => {
    console.log('!!!! DB Connected !!!!!');

    try {
      await ingestDataHandler();
    } catch (error) {
      console.log(error);
    } finally {
      mongoose.connection.close();
      console.log('!!!! DB Disconnected !!!!!');
    }
  });
});
module.exports = app;
