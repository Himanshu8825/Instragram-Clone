const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { getReciverSocketID, io } = require('../socket/socket');

const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;
    

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    //!Socket IO Implementation
    const reciverSocketID = getReciverSocketID(receiverId);
    if (reciverSocketID) {
      io.to(reciverSocketID).emit('newMessage', newMessage);

    }

    return res.status(201).json({
      message: 'Message sent successfully',
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false });
  }
};

const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    }).populate('messages');

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    return res
      .status(201)
      .json({ success: true, messages: conversation?.messages });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Can't get message" });
  }
};

module.exports = {
  sendMessage,
  getMessage,
};
