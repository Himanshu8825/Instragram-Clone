require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./utils/DB');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const messageRouter = require('./routes/messageRoutes');
const { app, server } = require('./socket/socket');
const path = require('path');

//! Environment variables
const port = process.env.PORT || 5000;

const ___dirname = path.resolve();

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

//!middilewares
app.use(
  cors({
    origin: '*',

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/messages', messageRouter);

//"http://localhost:3000/api/v1/users"

app.use(express.static(path.join(___dirname, '/frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(___dirname, 'frontend', 'dist', 'index.html'));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
