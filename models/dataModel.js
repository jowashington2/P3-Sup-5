const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  content: { type: String, required: true },
  extra: { type: String },
});

module.exports = mongoose.model('Data', DataSchema);
