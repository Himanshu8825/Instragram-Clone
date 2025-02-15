require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./utils/DB');
const userRouter = require('./routes/userRoutes');

const app = express();

//! Environment variables
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//!middilewares
app.use(
  cors({
    origin: ['http://localhost:5173'],

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use('/api/v1/users', userRouter);

//"http://localhost:3000/api/v1/users"

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
