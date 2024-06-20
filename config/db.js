const mongoose = require('mongoose');
const app = require('../app');
const { dbUri } = require('../constants/db');
const Contract = require('../models/contract');

mongoose.connect(dbUri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('--- DB connected! ---'));

module.exports = db;
