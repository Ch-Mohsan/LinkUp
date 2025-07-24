const cloudinary = require('cloudinary').v2;

// This will automatically use process.env.CLOUDINARY_URL
cloudinary.config();

module.exports = cloudinary; 