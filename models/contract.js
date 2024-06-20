const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
