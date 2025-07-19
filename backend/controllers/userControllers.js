const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Get user profile by username
exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select('-password')
      .populate('followers', 'username name avatar')
      .populate('following', 'username name avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Access control for private profiles
    if (user.isPrivate) {
      const isSelf = req.user && req.user._id.toString() === user._id.toString();
      const isMutual = req.user && user.followers.map(f=>f._id.toString()).includes(req.user._id.toString()) && user.following.map(f=>f._id.toString()).includes(req.user._id.toString());
      if (!isSelf && !isMutual) {
        return res.status(403).json({ message: 'This profile is private. Only mutual followers can view.' });
      }
    }

    // Get user's post count
    const postCount = await Post.countDocuments({ 
      author: user._id,
      isPublic: true 
    });

    const userProfile = {
      ...user.toObject(),
      postCount
    };

    res.status(200).json({ user: userProfile });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, location, website } = req.body;
    const avatar = req.files && req.files.avatar ? `/uploads/${req.files.avatar[0].filename}` : undefined;
    const coverImage = req.files && req.files.coverImage ? `/uploads/${req.files.coverImage[0].filename}` : undefined;

    const updateData = {
      name: name || req.user.name,
      bio: bio !== undefined ? bio : req.user.bio,
      location: location !== undefined ? location : req.user.location,
      website: website !== undefined ? website : req.user.website
    };

    if (avatar) {
      // Always return full URL for avatar
      updateData.avatar = `${req.protocol}://${req.get('host')}${avatar}`;
    }

    if (coverImage) {
      updateData.coverImage = `${req.protocol}://${req.get('host')}${coverImage}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    // After updating, ensure avatar and coverImage are full URLs in response
    if (updatedUser && updatedUser.avatar && !updatedUser.avatar.startsWith('http')) {
      updatedUser.avatar = `${req.protocol}://${req.get('host')}${updatedUser.avatar}`;
    }

    if (updatedUser && updatedUser.coverImage && !updatedUser.coverImage.startsWith('http')) {
      updatedUser.coverImage = `${req.protocol}://${req.get('host')}${updatedUser.coverImage}`;
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Follow/Unfollow a user
exports.toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if trying to follow self
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: userId }
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user._id }
      });

      res.status(200).json({ 
        message: 'User unfollowed',
        following: false
      });
    } else {
      // Check if private
      if (userToFollow.isPrivate) {
        // If already requested, do not duplicate
        if (!userToFollow.followRequests.includes(req.user._id)) {
          await User.findByIdAndUpdate(userId, {
            $addToSet: { followRequests: req.user._id }
          });
          // Create notification for follow request
          await Notification.create({
            recipient: userId,
            sender: req.user._id,
            type: 'follow_request',
            action: 'sent you a follow request'
          });
        }
        return res.status(200).json({
          message: 'Follow request sent',
          followRequest: true
        });
      } else {
        // Public: follow immediately
        await User.findByIdAndUpdate(req.user._id, {
          $push: { following: userId }
        });
        await User.findByIdAndUpdate(userId, {
          $push: { followers: req.user._id }
        });
        // Create notification
        if (userId !== req.user._id.toString()) {
          await Notification.create({
            recipient: userId,
            sender: req.user._id,
            type: 'follow',
            action: 'started following you'
          });
        }
        res.status(200).json({ 
          message: 'User followed',
          following: true
        });
      }
    }

  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({
      message: 'Error toggling follow',
      error: error.message
    });
  }
};

// Get user's followers
exports.getFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followers = await User.find({ _id: { $in: user.followers } })
      .select('username name avatar bio')
      .skip(skip)
      .limit(limit);

    const total = user.followers.length;

    res.status(200).json({
      followers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      message: 'Error fetching followers',
      error: error.message
    });
  }
};

// Get user's following
exports.getFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const following = await User.find({ _id: { $in: user.following } })
      .select('username name avatar bio')
      .skip(skip)
      .limit(limit);

    const total = user.following.length;

    res.status(200).json({
      following,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      message: 'Error fetching following',
      error: error.message
    });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user._id } // Exclude current user
    })
    .select('username name avatar bio')
    .skip(skip)
    .limit(limit);

    const total = await User.countDocuments({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user._id }
    });

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      message: 'Error searching users',
      error: error.message
    });
  }
};

// Get suggested users to follow
exports.getSuggestedUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const currentUser = await User.findById(req.user._id);
    
    // Get users that the current user doesn't follow and are not the current user
    const suggestedUsers = await User.find({
      _id: { 
        $nin: [...currentUser.following, req.user._id] 
      }
    })
    .select('username name avatar bio')
    .limit(limit)
    .sort({ followers: -1 }); // Sort by follower count

    res.status(200).json({ suggestedUsers });

  } catch (error) {
    console.error('Get suggested users error:', error);
    res.status(500).json({
      message: 'Error fetching suggested users',
      error: error.message
    });
  }
};

// Get pending follow requests for the logged-in user
exports.getFollowRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('followRequests', 'username name avatar');
    res.status(200).json({ followRequests: user.followRequests });
  } catch (error) {
    console.error('Get follow requests error:', error);
    res.status(500).json({
      message: 'Error fetching follow requests',
      error: error.message
    });
  }
};

// Accept or reject a follow request
exports.respondToFollowRequest = async (req, res) => {
  try {
    const { requesterId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    const user = await User.findById(req.user._id);
    if (!user.followRequests.includes(requesterId)) {
      return res.status(400).json({ message: 'No such follow request' });
    }
    if (action === 'accept') {
      // Add each other as followers/following
      await User.findByIdAndUpdate(req.user._id, {
        $push: { followers: requesterId },
        $pull: { followRequests: requesterId }
      });
      await User.findByIdAndUpdate(requesterId, {
        $push: { following: req.user._id }
      });
      // Send notification to requester
      await Notification.create({
        recipient: requesterId,
        sender: req.user._id,
        type: 'follow_accept',
        action: 'accepted your follow request'
      });
      return res.status(200).json({ message: 'Follow request accepted' });
    } else if (action === 'reject') {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { followRequests: requesterId }
      });
      return res.status(200).json({ message: 'Follow request rejected' });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Respond to follow request error:', error);
    res.status(500).json({
      message: 'Error responding to follow request',
      error: error.message
    });
  }
}; 