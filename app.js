const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes/index');
const { rootRoute, dbUri } = require('./constants');
const { extractedRows } = require('./utils/dataHandler');
const { connectDb } = require('./config/db');

const app = express();
const startServer = async () => {
  try {
    await connectDb(dbUri);
    await extractedRows();
    const PORT = process.env.PORT || 4001;
    const server = app.listen(PORT, () => {
      console.log(`\n \n server running at on port ==> ${PORT} \n`);
    });
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('DB disconnected via app termination');
        server.close(() => {
          console.log('Server stopped via app termination');
          process.exit(0);
        });
      } catch (err) {
        console.error('Error in closing MongoDB connection:', err);
        process.exit(1);
      }
    });
    return server;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('Error starting the server:', err);
    process.exit(1);
  });
}
app.get(rootRoute.url, routes);

module.exports = app;
