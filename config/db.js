const mongoose = require('mongoose');
const { dbUri } = require('../constants');

mongoose.connect(dbUri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = db;
