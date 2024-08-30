const mongoose = require('mongoose');

const chatModel = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  message: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

const Chat = mongoose.model('Chat', chatModel);

module.exports = Chat;
