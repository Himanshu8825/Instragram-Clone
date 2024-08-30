const mongoose = require('mongoose');

const messageModel = new mongoose.Schema({
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receiverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model('Message', messageModel);

module.exports = Message;
