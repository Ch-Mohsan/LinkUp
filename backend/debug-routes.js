require('dotenv').config();
const express = require('express');
const router = express.Router();
const Notification = require('./models/Notification');

console.log('Testing route imports...');

try {
  console.log('Testing auth routes...');
  require('./routes/auth');
  console.log('✅ Auth routes OK');
} catch (error) {
  console.log('❌ Auth routes error:', error.message);
}

try {
  console.log('Testing post routes...');
  require('./routes/posts');
  console.log('✅ Post routes OK');
} catch (error) {
  console.log('❌ Post routes error:', error.message);
}

try {
  console.log('Testing comment routes...');
  require('./routes/comments');
  console.log('✅ Comment routes OK');
} catch (error) {
  console.log('❌ Comment routes error:', error.message);
}

try {
  console.log('Testing user routes...');
  require('./routes/users');
  console.log('✅ User routes OK');
} catch (error) {
  console.log('❌ User routes error:', error.message);
}

try {
  console.log('Testing message routes...');
  require('./routes/messages');
  console.log('✅ Message routes OK');
} catch (error) {
  console.log('❌ Message routes error:', error.message);
}

try {
  console.log('Testing notification routes...');
  require('./routes/notifications');
  console.log('✅ Notification routes OK');
} catch (error) {
  console.log('❌ Notification routes error:', error.message);
}

// DELETE /debug/notifications/self - Delete all self-notifications
router.delete('/notifications/self', async (req, res) => {
  try {
    const result = await Notification.deleteMany({ $expr: { $eq: ['$sender', '$recipient'] } });
    res.json({ message: 'Deleted self-notifications', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting self-notifications', error: error.message });
  }
});

console.log('Route testing complete!');
module.exports = router; 