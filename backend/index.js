require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./utilities/db');

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://mediaapp-production.up.railway.app',
      'https://linkupcode-6hb2m4xs2-mohsan-alis-projects-a2ecac61.vercel.app',
      'https://linkup-git-main-mohsan-alis-projects-a2ecac61.vercel.app',
      'https://link-up-n13j-git-main-mohsan-alis-projects-a2ecac61.vercel.app',
      'https://link-up-n13j-1oj5lnthl-mohsan-alis-projects-a2ecac61.vercel.app',
      'https://link-up-7bgc-git-main-mohsan-alis-projects-a2ecac61.vercel.app',
      'http://localhost:3000', // Allow local dev
    ];
    // Allow all Vercel preview URLs for your project
    const vercelPreviewRegex = /^https:\/\/link-up-[\w-]+-mohsan-alis-projects-a2ecac61\.vercel\.app$/;
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      vercelPreviewRegex.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Allow CORS for static files in /uploads
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Connect to database
connectDB();

// Load routes one by one to identify the problematic one
console.log('Loading routes...');

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
  res.json({ 
    message: 'Social Media API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      comments: '/api/comments',
      users: '/api/users',
      messages: '/api/messages',
      notifications: '/api/notifications'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
