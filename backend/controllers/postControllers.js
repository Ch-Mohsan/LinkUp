const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { caption, tags, location } = req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    if (!image) {
      return res.status(400).json({ message: 'Post image is required' });
    }

    const newPost = new Post({
      author: req.user._id,
      image,
      caption: caption || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      location: location || ''
    });

    await newPost.save();

    // Populate author details
    await newPost.populate('author', 'username name avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      message: 'Error creating post',
      error: error.message
    });
  }
};

// Get all posts (for home feed)
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get posts from users that the current user follows + their own posts
    const currentUser = await User.findById(req.user._id);
    const followingIds = [...currentUser.following, req.user._id];

    const posts = await Post.find({
      author: { $in: followingIds },
      isPublic: true
    })
    .populate('author', 'username name avatar')
    .populate('likes', 'username name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Post.countDocuments({
      author: { $in: followingIds },
      isPublic: true
    });

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// Get explore posts (all public posts)
exports.getExplorePosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublic: true })
      .populate('author', 'username name avatar')
      .populate('likes', 'username name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ isPublic: true });

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });

  } catch (error) {
    console.error('Get explore posts error:', error);
    res.status(500).json({
      message: 'Error fetching explore posts',
      error: error.message
    });
  }
};

// Get single post by ID
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username name avatar')
      .populate('likes', 'username name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username name avatar'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.status(200).json({ post });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// Like/Unlike a post
exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    let updatedPost;
    let liked;

    // Check if user already liked the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const hasLiked = post.likes.some(like => like.toString() === userId.toString());

    if (hasLiked) {
      // Unlike: remove user from likes
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
      liked = false;
    } else {
      // Like: add user to likes (no duplicates)
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
      liked = true;
      // Create notification if not liking own post
      if (post.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: userId,
          type: 'like',
          post: post._id,
          action: 'liked your post'
        });
      }
    }

    res.status(200).json({
      message: liked ? 'Post liked' : 'Post unliked',
      liked,
      likeCount: updatedPost.likes.length
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      message: 'Error toggling like',
      error: error.message
    });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      message: 'Error deleting post',
      error: error.message
    });
  }
};

// Get user's posts
exports.getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Access control for private profiles
    if (user.isPrivate) {
      const isSelf = req.user && req.user._id.toString() === user._id.toString();
      const isMutual = req.user && user.followers.map(f=>f.toString()).includes(req.user._id.toString()) && user.following.map(f=>f.toString()).includes(req.user._id.toString());
      if (!isSelf && !isMutual) {
        return res.status(403).json({ message: 'This user\'s posts are private. Only mutual followers can view.' });
      }
    }
    const posts = await Post.find({ 
      author: user._id,
      isPublic: true 
    })
    .populate('author', 'username name avatar')
    .populate('likes', 'username name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    const total = await Post.countDocuments({ 
      author: user._id,
      isPublic: true 
    });
    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      message: 'Error fetching user posts',
      error: error.message
    });
  }
};

// Edit a post
exports.editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to edit this post' });

    const { caption, tags, location } = req.body;
    if (caption !== undefined) post.caption = caption;
    if (tags !== undefined) post.tags = tags;
    if (location !== undefined) post.location = location;
    await post.save();

    res.status(200).json({ message: 'Post updated', post });
  } catch (error) {
    res.status(500).json({ message: 'Error editing post', error: error.message });
  }
}; 