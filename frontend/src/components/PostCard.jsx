import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark, Send, Trash2, Edit2 } from 'lucide-react'
import { FaWhatsapp, FaTwitter, FaFacebook } from 'react-icons/fa'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import Picker from '@emoji-mart/react'

const PostCard = ({ post, onLike, onSave, onDelete, currentUser }) => {
  // Safety check for post data
  if (!post || !post.author) {
    return (
      <div className="card p-4">
        <p className="text-gray-500 dark:text-gray-400">Post data is loading...</p>
      </div>
    );
  }
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [comment, setComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editCaption, setEditCaption] = useState(post.caption)
  const [editLoading, setEditLoading] = useState(false)

  // Fetch comments when showComments is toggled on
  useEffect(() => {
    if (showComments) {
      fetchComments()
    }
    // eslint-disable-next-line
  }, [showComments])

  const fetchComments = async () => {
    setLoadingComments(true)
    try {
      const data = await api.comments.getByPost(post._id)
      setComments(data.comments || [])
    } catch (error) {
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (comment.trim() && !submittingComment) {
      setSubmittingComment(true)
      try {
        await api.comments.add(post._id, comment.trim())
        setComment('')
        fetchComments() // Refresh comments after adding
      } catch (error) {
        console.error('Failed to add comment:', error)
      } finally {
        setSubmittingComment(false)
      }
    }
  }

  const handleDelete = async () => {
    toast.info(
      <div>
        Are you sure you want to delete this post?
        <div className="mt-2 flex gap-2 justify-end">
          <button onClick={async () => {
            await onDelete(post._id)
            toast.dismiss()
            toast.success('Post deleted!')
          }} className="px-3 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
          <button onClick={() => toast.dismiss()} className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-xs">Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false }
    )
    setShowMenu(false)
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const isPostOwner = currentUser && post.author._id === currentUser._id

  const postUrl = `${window.location.origin}/post/${post._id}`;

  const handleShare = () => {
    setShowShareMenu((prev) => !prev);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast.success('Post link copied to clipboard!');
    setShowShareMenu(false);
  };

  const handleShareApp = (app) => {
    let url = '';
    if (app === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(postUrl)}`;
    } else if (app === 'twitter') {
      url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=Check%20out%20this%20post!`;
    } else if (app === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    }
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  const handleEdit = () => {
    setEditCaption(post.caption)
    setShowEditModal(true)
    setShowMenu(false)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      await api.posts.edit(post._id, { caption: editCaption })
      setShowEditModal(false)
      if (typeof window !== 'undefined') window.location.reload() // or trigger parent refresh
    } catch (error) {
      alert('Failed to edit post')
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <motion.div
      className="card overflow-hidden max-w-md w-full mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <Link 
              to={`/profile/${post.author.username}`}
              className="font-semibold text-gray-900 dark:text-white hover:text-violet-500 transition-colors"
            >
              {post.author.name}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTimestamp(post.createdAt)}
            </p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <MoreHorizontal size={20} className="text-gray-500" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              {isPostOwner && (
                <>
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <Edit2 size={16} />
                    <span>Edit Post</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                  >
                    <Trash2 size={16} />
                    <span>Delete Post</span>
                  </button>
                </>
              )}
              <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      <div className="relative w-full aspect-square bg-gray-900 rounded-xl overflow-hidden my-2 shadow-md">
        <img
          src={post.image}
          alt="Post"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(post._id)}
              className={`p-2 rounded-full transition-all duration-200 ${
                post.isLiked
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Heart size={24} className={post.isLiked ? 'fill-current' : ''} />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <MessageCircle size={24} />
            </button>
            <div className="relative inline-block">
              <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" onClick={handleShare}>
                <Share size={24} />
              </button>
              {showShareMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <button onClick={handleCopyLink} className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span role="img" aria-label="link">🔗</span> Copy Link
                  </button>
                  <button onClick={() => handleShareApp('whatsapp')} className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FaWhatsapp className="text-green-500" /> WhatsApp
                  </button>
                  <button onClick={() => handleShareApp('twitter')} className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FaTwitter className="text-blue-400" /> Twitter
                  </button>
                  <button onClick={() => handleShareApp('facebook')} className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FaFacebook className="text-blue-600" /> Facebook
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => onSave(post._id)}
            className={`p-2 rounded-full transition-all duration-200 ${
              post.isSaved
                ? 'text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Bookmark size={24} className={post.isSaved ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            {Array.isArray(post.likes) ? post.likes.length : (typeof post.likes === 'number' ? post.likes : 0)} likes
          </span>
        </div>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-gray-900 dark:text-white mr-2">
            {post.author.username}
          </span>
          <span className="text-gray-900 dark:text-white">{post.caption}</span>
        </div>

        {/* Comments Count */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-gray-500 dark:text-gray-400 text-sm mb-4 hover:underline"
        >
          View all {post.comments?.length || 0} comments
        </button>

        {/* Comment Input */}
        <form onSubmit={handleSubmitComment} className="flex items-center space-x-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
            disabled={submittingComment}
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="text-xl px-2"
          >
            😊
          </button>
          <button
            type="submit"
            disabled={!comment.trim() || submittingComment}
            className="text-violet-500 hover:text-violet-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
        {showEmojiPicker && (
          <div className="mt-2">
            <Picker
              onSelect={emoji => setComment(comment + (emoji.native || emoji.colons))}
              theme="light"
            />
          </div>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
          {loadingComments ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Loading comments...</p>
          ) : (
            <motion.div
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {comments && comments.length > 0 ? (
                comments.map((comment) => {
                  const commentUser = comment.author;
                  return (
                    <motion.div
                      key={comment._id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                      }}
                      className="flex space-x-3"
                    >
                      <img
                        src={commentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                        alt={commentUser?.username || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-2">
                          <span className="font-semibold text-gray-900 dark:text-white text-sm mr-2">
                            {commentUser?.username || commentUser?.name || 'Unknown'}
                          </span>
                          <span className="text-gray-900 dark:text-white text-sm">
                            {comment.content}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 px-4">
                          <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            Like
                          </button>
                          <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            Reply
                          </button>
                          <span className="text-xs text-gray-500">
                            {comment.createdAt ? formatTimestamp(comment.createdAt) : ''}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </motion.div>
          )}
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleEditSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Edit Post</h2>
            <textarea
              className="w-full p-2 border rounded mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              value={editCaption}
              onChange={e => setEditCaption(e.target.value)}
              rows={3}
              maxLength={2000}
              disabled={editLoading}
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  )
}

export default PostCard 