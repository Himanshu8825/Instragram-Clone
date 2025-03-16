const { Server } = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

//! Initialize Socket.io server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

//! Object to store userId and corresponding socketId
const userSocketMap = {};

  const getReciverSocketID = (reciverID) => {
  return userSocketMap[reciverID];
};

//! Handle new socket connections
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    // console.log(
    //   `User connected with UserID: ${userId} & socketID: ${socket.id}`
    // );
  }

  //! Emit updated online users list to all connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  //! Handle socket disconnection
  socket.on('disconnect', () => {
    if (userId) {
      // console.log(
      //   `User disconnected with UserID: ${userId} & socketID: ${socket.id}`
      // );
      delete userSocketMap[userId];
    }

    //! Emit updated online users list after disconnection
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

//! Export app, server, and io instance for use in other files
module.exports = { app, server, io , getReciverSocketID };
