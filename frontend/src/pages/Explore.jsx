import { useState, useEffect } from 'react'
import { Search, TrendingUp, Users, Hash } from 'lucide-react'
import PostCard from '../components/PostCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { api } from '../services/api'
import { motion } from 'framer-motion'

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('trending')
  const [posts, setPosts] = useState([])
  const [trendingUsers, setTrendingUsers] = useState([])
  const [trendingHashtags, setTrendingHashtags] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock trending posts
  const mockTrendingPosts = [
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        username: 'sarahj',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      caption: 'Amazing sunset at the mountains today! 🌄 #nature #photography #sunset',
      likes: 1247,
      comments: 89,
      timestamp: '2 hours ago',
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      user: {
        name: 'Mike Chen',
        username: 'mikechen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      caption: 'Just finished this new project! The power of modern web development is incredible. #coding #webdev #react',
      likes: 892,
      comments: 156,
      timestamp: '5 hours ago',
      isLiked: true,
      isSaved: true
    },
    {
      id: 3,
      user: {
        name: 'Emma Wilson',
        username: 'emmaw',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
      caption: 'Perfect day for a hike in the forest! The fresh air and beautiful scenery are exactly what I needed. #hiking #nature #outdoors',
      likes: 2156,
      comments: 234,
      timestamp: '1 day ago',
      isLiked: false,
      isSaved: false
    }
  ]

  const mockTrendingUsers = [
    {
      id: 1,
      name: 'Alex Rodriguez',
      username: 'alexr',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      followers: 15420,
      isFollowing: false
    },
    {
      id: 2,
      name: 'Lisa Park',
      username: 'lisap',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      followers: 8920,
      isFollowing: true
    },
    {
      id: 3,
      name: 'David Kim',
      username: 'davidk',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      followers: 23450,
      isFollowing: false
    }
  ]

  const mockTrendingHashtags = [
    { id: 1, tag: '#photography', posts: 125000 },
    { id: 2, tag: '#coding', posts: 89000 },
    { id: 3, tag: '#nature', posts: 156000 },
    { id: 4, tag: '#travel', posts: 234000 },
    { id: 5, tag: '#food', posts: 189000 }
  ]

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.posts.getExplore(),
      api.users.getSuggested()
    ])
      .then(([postsData, usersData]) => {
        setPosts(postsData.posts)
        setTrendingUsers(usersData.users)
        setTrendingHashtags(mockTrendingHashtags) // keep mock hashtags for now
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const handleSave = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ))
  }

  const handleFollow = (userId) => {
    setTrendingUsers(users => 
      users.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    )
  }

  // Add filtered lists based on searchQuery
  const filteredPosts = (posts || []).filter(post => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    // Check post author (user) and caption
    const author = post.author || post.user || {};
    return (
      (author.name && author.name.toLowerCase().includes(q)) ||
      (author.username && author.username.toLowerCase().includes(q)) ||
      (post.caption && post.caption.toLowerCase().includes(q))
    );
  });

  const filteredUsers = (trendingUsers || []).filter(user => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.username && user.username.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts, people, or hashtags..."
          className="input-field pl-12"
        />
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'trending'
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <TrendingUp size={20} />
            <span>Trending</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Users size={20} />
            <span>People</span>
          </button>
          <button
            onClick={() => setActiveTab('hashtags')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'hashtags'
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Hash size={20} />
            <span>Hashtags</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'trending' && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              className="space-y-6"
            >
              {filteredPosts.map((post, idx) => (
                <motion.div
                  key={post._id || post.id || idx}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <PostCard post={post} onLike={handleLike} onSave={handleSave} currentUser={null} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              {filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(user.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      user.isFollowing
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        : 'btn-primary'
                    }`}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'hashtags' && (
            <div className="space-y-4">
              {trendingHashtags.map(hashtag => (
                <div key={hashtag.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Hash className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{hashtag.tag}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{hashtag.posts.toLocaleString()} posts</p>
                    </div>
                  </div>
                  <button className="btn-secondary">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Explore 