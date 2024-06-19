const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  version: {
    type: String,
    default: ''
  },
  artist: {
    type: String,
    default: ''
  },
  isrc: {
    type: String,
    required: true
  },
  pLine: {
    type: String,
    default: ''
  },
  aliases: {
    type: [String],
    default: []
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    default: null
  }
});
const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
