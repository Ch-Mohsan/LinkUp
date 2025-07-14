const express = require('express');
const router = express.Router();
const notificationControllers = require('../controllers/notificationControllers');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get user's notifications
router.get('/', notificationControllers.getNotifications);

// Mark all notifications as read (must come before parameterized routes)
router.put('/read-all', notificationControllers.markAllAsRead);

// Get unread notification count (must come before parameterized routes)
router.get('/unread/count', notificationControllers.getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', notificationControllers.markAsRead);

// Delete a notification
router.delete('/:notificationId', notificationControllers.deleteNotification);

// Delete all notifications
router.delete('/', notificationControllers.deleteAllNotifications);

module.exports = router; 