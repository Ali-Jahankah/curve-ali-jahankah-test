const mongoose = require('mongoose');

const contractSchem = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
const Contract = mongoose.model('Contract', contractSchem);

module.exports = Contract;
