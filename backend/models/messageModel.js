const mongoose = require('mongoose');

const messageModel = new mongoose.Schema({

})

const Message = mongoose.model('Message' , messageModel);

module.exports = Message;
