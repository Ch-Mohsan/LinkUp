const Notification = require('../models/Notification');

// Get user's notifications
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { type } = req.query;

    let query = { recipient: req.user._id };
    
    // Filter by type if provided
    if (type && type !== 'all') {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'username name avatar')
      .populate('post', 'image')
      .populate('comment', 'content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      notifications,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user owns the notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({ 
      message: 'Notification marked as read',
      notification
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({ message: 'All notifications marked as read' });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user owns the notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: 'Notification deleted successfully' });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.status(200).json({ unreadCount: count });

  } catch (error) {
    console.error('Get unread notification count error:', error);
    res.status(500).json({
      message: 'Error fetching unread notification count',
      error: error.message
    });
  }
};

// Delete all notifications
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });

    res.status(200).json({ message: 'All notifications deleted successfully' });

  } catch (error) {
    console.error('Delete all notifications error:', error);
    res.status(500).json({
      message: 'Error deleting all notifications',
      error: error.message
    });
  }
}; 