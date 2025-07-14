const express = require('express');
const router = express.Router();
const commentControllers = require('../controllers/commentControllers');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Add comment to post
router.post('/posts/:postId', commentControllers.addComment);

// Get comments for a post
router.get('/posts/:postId', commentControllers.getComments);

// Like/Unlike a comment
router.post('/:commentId/like', commentControllers.toggleCommentLike);

// Update a comment
router.put('/:commentId', commentControllers.updateComment);

// Delete a comment
router.delete('/:commentId', commentControllers.deleteComment);

// Get replies to a comment
router.get('/:commentId/replies', commentControllers.getReplies);

module.exports = router; 