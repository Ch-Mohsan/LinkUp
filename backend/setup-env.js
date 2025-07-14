const fs = require('fs');
const path = require('path');

const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# Replace this with your MongoDB Atlas connection string or local MongoDB URI
MONGODB_URI=mongodb://localhost:27017/social_media_app

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_123456789
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the MONGODB_URI with your actual database connection string');
  console.log('🔗 For MongoDB Atlas: Get your connection string from https://cloud.mongodb.com');
  console.log('🏠 For local MongoDB: Install MongoDB and use mongodb://localhost:27017/social_media_app');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
} 