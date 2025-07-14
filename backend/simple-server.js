require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('Loading routes one by one...');

try {
  console.log('Loading auth routes...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.log('❌ Auth routes failed:', error.message);
}

try {
  console.log('Loading post routes...');
  const postRoutes = require('./routes/posts');
  app.use('/api/posts', postRoutes);
  console.log('✅ Post routes loaded');
} catch (error) {
  console.log('❌ Post routes failed:', error.message);
}

try {
  console.log('Loading comment routes...');
  const commentRoutes = require('./routes/comments');
  app.use('/api/comments', commentRoutes);
  console.log('✅ Comment routes loaded');
} catch (error) {
  console.log('❌ Comment routes failed:', error.message);
}

try {
  console.log('Loading user routes...');
  const userRoutes = require('./routes/users');
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded');
} catch (error) {
  console.log('❌ User routes failed:', error.message);
}

try {
  console.log('Loading message routes...');
  const messageRoutes = require('./routes/messages');
  app.use('/api/messages', messageRoutes);
  console.log('✅ Message routes loaded');
} catch (error) {
  console.log('❌ Message routes failed:', error.message);
}

try {
  console.log('Loading notification routes...');
  const notificationRoutes = require('./routes/notifications');
  app.use('/api/notifications', notificationRoutes);
  console.log('✅ Notification routes loaded');
} catch (error) {
  console.log('❌ Notification routes failed:', error.message);
}

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Simple server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Simple server running on http://localhost:${PORT}`);
}); 