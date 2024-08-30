const mongoose = require('mongoose');

const mongoDB = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose
      .connect(mongoDB)
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.error(err));
  } catch (error) {
    console.log('Failed while connect to mongoDB', error);
  }
};

module.exports = connectDB;
