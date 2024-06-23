const mongoose = require('mongoose');

const connectDb = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to DB');
  } catch (error) {
    console.error('Error in connecting to MongoDB:', error);
    throw error;
  }
};

module.exports = { connectDb };
