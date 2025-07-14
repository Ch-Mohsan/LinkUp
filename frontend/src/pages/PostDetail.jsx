import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Share, Bookmark, Send, ArrowLeft } from 'lucide-react'
import PostCard from '../components/PostCard'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)

  // Mock post data
  const mockPost = {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      username: 'sarahj',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    caption: 'Amazing sunset at the mountains today! 🌄 The colors were absolutely breathtaking. This is one of those moments that makes you realize how beautiful our world truly is. #nature #photography #sunset #mountains #beauty #peaceful #inspiration',
    likes: 1247,
    comments: 89,
    timestamp: '2 hours ago',
    isLiked: false,
    isSaved: false
  }

  const mockComments = [
    {
      id: 1,
      user: {
        name: 'Mike Chen',
        username: 'mikechen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      comment: 'Absolutely stunning! The colors are incredible. Where was this taken?',
      timestamp: '1 hour ago',
      likes: 12
    },
    {
      id: 2,
      user: {
        name: 'Emma Wilson',
        username: 'emmaw',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      comment: 'This is so beautiful! Makes me want to go hiking right now. 😍',
      timestamp: '45 minutes ago',
      likes: 8
    },
    {
      id: 3,
      user: {
        name: 'Alex Rodriguez',
        username: 'alexr',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      comment: 'The composition is perfect! What camera settings did you use?',
      timestamp: '30 minutes ago',
      likes: 5
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPost(mockPost)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }))
  }

  const handleSave = () => {
    setPost(prev => ({
      ...prev,
      isSaved: !prev.isSaved
    }))
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      // Handle comment submission
      setComment('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Post</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Image */}
        <div className="lg:order-1">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="lg:order-2 flex flex-col">
          {/* Post Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {post.user.name}
                </h3>
                <p className="text-sm text-gray-500">{post.timestamp}</p>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-3">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">
                  <span className="font-semibold mr-2">{post.user.username}</span>
                  {post.caption}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    post.isLiked
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Heart size={24} className={post.isLiked ? 'fill-current' : ''} />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <MessageCircle size={24} />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <Share size={24} />
                </button>
              </div>
              <button
                onClick={handleSave}
                className={`p-2 rounded-full transition-all duration-200 ${
                  post.isSaved
                    ? 'text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark size={24} className={post.isSaved ? 'fill-current' : ''} />
              </button>
            </div>

            <div className="mb-4">
              <span className="font-semibold text-gray-900 dark:text-white">
                {post.likes.toLocaleString()} likes
              </span>
            </div>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {mockComments.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl px-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm mr-2">
                        {comment.user.username}
                      </span>
                      <span className="text-gray-900 dark:text-white text-sm">
                        {comment.comment}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 px-4">
                      <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        Like
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        Reply
                      </button>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmitComment} className="flex items-center space-x-3">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="text-violet-500 hover:text-violet-600 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail 