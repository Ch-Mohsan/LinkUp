const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/postControllers');
const auth = require('../middleware/auth');
const { uploadPostImage } = require('../middleware/upload');

// All routes require authentication
router.use(auth);

// Create post
router.post('/', uploadPostImage, postControllers.createPost);

// Get posts (home feed)
router.get('/', postControllers.getPosts);

// Get explore posts
router.get('/explore', postControllers.getExplorePosts);

// Get user's posts (must come before /:id route)
router.get('/user/:username', postControllers.getUserPosts);

// Get single post
router.get('/:id', postControllers.getPost);

// Like/Unlike post
router.post('/:id/like', postControllers.toggleLike);

// Delete post
router.delete('/:id', postControllers.deletePost);

// Edit a post
router.put('/:id', postControllers.editPost);

module.exports = router; 