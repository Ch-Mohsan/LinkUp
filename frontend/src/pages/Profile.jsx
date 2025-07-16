import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Settings, Grid, Bookmark, Heart, Users, MapPin, Link as LinkIcon, Calendar, User as UserIcon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import PostCard from '../components/PostCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { api } from '../services/api'
import { motion } from 'framer-motion'

const Profile = () => {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowing, setIsFollowing] = useState(false)
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [profileData, postsData] = await Promise.all([
        api.users.getProfile(username),
        api.posts.getUserPosts(username, 1, 10)
      ])
      
      setUser(profileData.user)
      setPosts(postsData.posts)
      setIsFollowing(profileData.user.followers?.includes(currentUser?._id) || false)
    } catch (error) {
      setError(error.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (username) {
      fetchProfile()
    }
  }, [username, currentUser?._id])

  const handleFollow = async () => {
    try {
      await api.users.follow(user._id)
      setIsFollowing(!isFollowing)
      // Update follower count
      setUser(prev => ({
        ...prev,
        followers: isFollowing ? prev.followers - 1 : prev.followers + 1
      }))
    } catch (error) {
      console.error('Failed to follow/unfollow:', error)
    }
  }

  const handleLike = async (postId) => {
    try {
      await api.posts.like(postId)
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      ))
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleSave = (postId) => {
    setPosts(posts.map(post => 
      post._id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ))
  }

  const handleDelete = async (postId) => {
    try {
      await api.posts.delete(postId)
      setPosts(posts.filter(post => post._id !== postId))
      // Update post count
      setUser(prev => ({ ...prev, posts: prev.posts - 1 }))
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    )
  }

  console.log('Profile page user:', user)

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={fetchProfile}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    )
  }

  const isOwnProfile = currentUser?.username === username

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-6">
        {/* Cover Image */}
        <div className="relative h-64 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          {user.coverImage ? (
            <>
              <img
                src={user.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400 text-lg font-semibold">Add cover image here</span>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative -mt-20 px-6">
          <div className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Profile Photo */}
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                      <UserIcon size={64} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users size={16} className="text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">{user.followers?.length || 0}</span> followers
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} className="text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">{user.following?.length || 0}</span> following
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Grid size={16} className="text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">{posts.length}</span> posts
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                {isOwnProfile ? (
                  <Link to="/edit-profile" className="btn-secondary flex items-center space-x-2">
                    <Settings size={20} />
                    <span>Edit Profile</span>
                  </Link>
                ) : (
                  <>
                    <button 
                      onClick={handleFollow}
                      className={`${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/messages?user=${user._id}`)}
                    >
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bio and Details */}
            <div className="mt-6 space-y-3">
              <p className="text-gray-900 dark:text-white">{user.bio || 'No bio yet.'}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center space-x-1">
                    <LinkIcon size={16} />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Grid size={20} />
              <span>Posts</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'saved'
                  ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Bookmark size={20} />
              <span>Saved</span>
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'liked'
                  ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Heart size={20} />
              <span>Liked</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 dark:text-gray-400 mb-4">
                      <Grid size={48} className="mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                      <p className="text-sm">
                        {isOwnProfile ? 'Share your first post!' : 'This user hasn\'t posted anything yet.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  posts.map(post => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onLike={handleLike}
                      onSave={handleSave}
                      onDelete={handleDelete}
                      currentUser={currentUser}
                    />
                  ))
                )}
              </div>
            )}
            
            {activeTab === 'saved' && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No saved posts</h3>
                  <p className="text-sm">Posts you save will appear here.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'liked' && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <Heart size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No liked posts</h3>
                  <p className="text-sm">Posts you like will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Profile 