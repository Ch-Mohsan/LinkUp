const express = require('express');
const router = express.Router();
const messageControllers = require('../controllers/messageControllers');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Send a message
router.post('/', messageControllers.sendMessage);

// Get all conversations
router.get('/conversations', messageControllers.getConversations);

// Get unread message count (must come before parameterized routes)
router.get('/unread/count', messageControllers.getUnreadCount);

// Get conversation with specific user
router.get('/conversation/:userId', messageControllers.getConversation);

// Mark messages as read
router.put('/:userId/read', messageControllers.markAsRead);

// Delete a message
router.delete('/:messageId', messageControllers.deleteMessage);

// Edit a message
router.put('/:messageId', messageControllers.editMessage);

module.exports = router; 