const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { content, parentCommentId } = req.body;
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = new Comment({
      author: req.user._id,
      post: postId,
      content,
      parentComment: parentCommentId || null
    });

    await newComment.save();

    // Add comment to post
    post.comments.push(newComment._id);
    await post.save();

    // Populate author details
    await newComment.populate('author', 'username name avatar');

    // Create notification if not commenting on own post
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        post: postId,
        comment: newComment._id,
        action: 'commented on your post'
      });
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ 
      post: postId,
      parentComment: null // Only top-level comments
    })
    .populate('author', 'username name avatar')
    .populate('likes', 'username name avatar')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'username name avatar'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Comment.countDocuments({ 
      post: postId,
      parentComment: null 
    });

    res.status(200).json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

// Like/Unlike a comment
exports.toggleCommentLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(req.user._id);
    
    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
      await comment.save();
      
      res.status(200).json({ 
        message: 'Comment unliked',
        liked: false,
        likeCount: comment.likes.length
      });
    } else {
      // Like
      comment.likes.push(req.user._id);
      await comment.save();

      // Create notification if not liking own comment
      if (comment.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: comment.author,
          sender: req.user._id,
          type: 'like',
          comment: comment._id,
          action: 'liked your comment'
        });
      }

      res.status(200).json({ 
        message: 'Comment liked',
        liked: true,
        likeCount: comment.likes.length
      });
    }

  } catch (error) {
    console.error('Toggle comment like error:', error);
    res.status(500).json({
      message: 'Error toggling comment like',
      error: error.message
    });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    // Populate author details
    await comment.populate('author', 'username name avatar');

    res.status(200).json({
      message: 'Comment updated successfully',
      comment
    });

  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      message: 'Error updating comment',
      error: error.message
    });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or the post
    const post = await Post.findById(comment.post);
    const isCommentOwner = comment.author.toString() === req.user._id.toString();
    const isPostOwner = post.author.toString() === req.user._id.toString();

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove comment from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    });

    // Delete the comment and its replies
    await Comment.findByIdAndDelete(comment._id);
    await Comment.deleteMany({ parentComment: comment._id });

    res.status(200).json({ message: 'Comment deleted successfully' });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

// Get replies to a comment
exports.getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const replies = await Comment.find({ parentComment: commentId })
      .populate('author', 'username name avatar')
      .populate('likes', 'username name avatar')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ parentComment: commentId });

    res.status(200).json({
      replies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });

  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({
      message: 'Error fetching replies',
      error: error.message
    });
  }
}; 