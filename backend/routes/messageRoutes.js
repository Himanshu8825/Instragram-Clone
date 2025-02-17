const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { sendMessage, getMessage } = require('../controllers/messageController');

const messageRouter  = express.Router();


messageRouter.post('/send/:id' , isAuthenticated , sendMessage);

messageRouter.get('/all/:id' , isAuthenticated , getMessage);


module.exports = messageRouter;
