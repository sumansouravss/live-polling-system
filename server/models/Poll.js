const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  responses: {
    type: Map,
    of: Number,
    default: {},
  },
  isActive: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Poll', pollSchema);
