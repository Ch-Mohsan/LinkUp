const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable or fallback to local MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/social_media_app';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Please make sure MongoDB is running or set up MongoDB Atlas');
    console.log('You can also create a .env file with MONGODB_URI');
    process.exit(1); 
  }
};

module.exports = connectDB;
