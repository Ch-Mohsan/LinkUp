const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text' } = req.body;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Check if sender and receiver are mutual followers
    const sender = await User.findById(req.user._id);
    const isMutual = sender.following.map(f=>f.toString()).includes(receiverId) && sender.followers.map(f=>f.toString()).includes(receiverId) && receiver.following.map(f=>f.toString()).includes(req.user._id.toString()) && receiver.followers.map(f=>f.toString()).includes(req.user._id.toString());
    if (!isMutual) {
      return res.status(403).json({ message: 'You can only chat with users who follow you back.' });
    }

    // Check if sender and receiver are the same
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const newMessage = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
      messageType
    });

    await newMessage.save();

    // Populate sender and receiver details
    await newMessage.populate('sender', 'username name avatar');
    await newMessage.populate('receiver', 'username name avatar');

    // Create notification
    if (receiverId.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: receiverId,
        sender: req.user._id,
        type: 'message',
        message: newMessage._id,
        action: 'sent you a message'
      });
    }

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: newMessage
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Check if other user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current user and other user are mutual followers
    const currentUser = await User.findById(req.user._id);
    const isMutual = currentUser.following.map(f=>f.toString()).includes(userId) && currentUser.followers.map(f=>f.toString()).includes(userId) && otherUser.following.map(f=>f.toString()).includes(req.user._id.toString()) && otherUser.followers.map(f=>f.toString()).includes(req.user._id.toString());
    if (!isMutual) {
      return res.status(403).json({ message: 'You can only chat with users who follow you back.' });
    }

    // Get messages between the two users, filter out those deleted for current user
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ],
      deletedFor: { $ne: req.user._id }
    })
    .populate('sender', 'username name avatar')
    .populate('receiver', 'username name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Message.countDocuments({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ],
      deletedFor: { $ne: req.user._id }
    });

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      messages: messages.reverse(), // Reverse to get chronological order
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      message: 'Error fetching conversation',
      error: error.message
    });
  }
};

// Get all conversations for current user
exports.getConversations = async (req, res) => {
  try {
    // Get all unique users the current user has conversations with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', req.user._id] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate user details for each conversation
    const populatedConversations = await User.populate(conversations, [
      {
        path: '_id',
        select: 'username name avatar isOnline lastSeen'
      },
      {
        path: 'lastMessage.sender',
        select: 'username name avatar'
      },
      {
        path: 'lastMessage.receiver',
        select: 'username name avatar'
      }
    ]);

    res.status(200).json({
      conversations: populatedConversations
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      { sender: userId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({ message: 'Messages marked as read' });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // If sender deletes, remove for both
    if (message.sender.toString() === req.user._id.toString()) {
      await Message.findByIdAndDelete(req.params.messageId);
      return res.status(200).json({ message: 'Message deleted for everyone' });
    }

    // If receiver deletes, soft delete for them only
    if (message.receiver.toString() === req.user._id.toString()) {
      if (!message.deletedFor.includes(req.user._id)) {
        message.deletedFor.push(req.user._id);
        await message.save();
      }
      return res.status(200).json({ message: 'Message deleted for you' });
    }

    return res.status(403).json({ message: 'Not authorized to delete this message' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      message: 'Error deleting message',
      error: error.message
    });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    res.status(200).json({ unreadCount: count });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      message: 'Error fetching unread count',
      error: error.message
    });
  }
};

// Edit a message
exports.editMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.sender.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to edit this message' });

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    res.status(200).json({ message: 'Message updated', messageData: message });
  } catch (error) {
    res.status(500).json({ message: 'Error editing message', error: error.message });
  }
}; 