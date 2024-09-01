const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const discussionSchema = new mongoose.Schema({
  delivererId: { type: String, required: true },
  managerId: { type: String, required: true },
  messages: [messageSchema],
});

discussionSchema.index({ delivererId: 1, managerId: 1 }, { unique: true });

module.exports = mongoose.model('Discussion', discussionSchema);
