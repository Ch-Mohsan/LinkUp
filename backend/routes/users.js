const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const auth = require('../middleware/auth');
const { uploadAvatar, uploadProfileImages } = require('../middleware/upload');

// All routes require authentication
router.use(auth);

// Search and suggested routes (must come before parameterized routes)
router.get('/search', userControllers.searchUsers);
router.get('/suggested', userControllers.getSuggestedUsers);

// Get user profile by username
router.get('/profile/:username', userControllers.getUserProfile);

// Update user profile
router.put('/profile', uploadProfileImages, userControllers.updateProfile);

// Follow/Unfollow a user
router.post('/:userId/follow', userControllers.toggleFollow);

// Get user's followers
router.get('/:username/followers', userControllers.getFollowers);

// Get user's following
router.get('/:username/following', userControllers.getFollowing);

module.exports = router; 