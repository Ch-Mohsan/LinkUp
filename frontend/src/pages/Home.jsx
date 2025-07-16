import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark } from 'lucide-react'
import PostCard from '../components/PostCard'
import StoryBar from '../components/StoryBar'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [likeLoading, setLikeLoading] = useState({})
  const { user } = useAuth()

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      const data = await api.posts.getAll(pageNum, 10)
      
      if (append) {
        setPosts(prev => [...prev, ...data.posts])
      } else {
        setPosts(data.posts)
      }
      
      setHasMore(data.posts.length === 10) // If we got less than 10 posts, we've reached the end
    } catch (error) {
      setError(error.message || 'Failed to load posts')
    }
  }

  useEffect(() => {
    fetchPosts(1, false)
      .finally(() => setLoading(false))
  }, [])

  const loadMore = async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    
    await fetchPosts(nextPage, true)
    setLoadingMore(false)
  }

  const handleLike = async (postId) => {
    if (likeLoading[postId]) return;
    setLikeLoading(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await api.posts.like(postId);
      setPosts(posts.map(post =>
        post._id === postId
          ? {
              ...post,
              isLiked: res.liked,
              likes: res.likeCount
            }
          : post
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setLikeLoading(prev => ({ ...prev, [postId]: false }));
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
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <StoryBar />
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stories */}
      <StoryBar />
      
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <button 
            onClick={() => {
              setError('')
              setLoading(true)
              fetchPosts(1, false).finally(() => setLoading(false))
            }}
            className="text-red-600 dark:text-red-400 text-sm underline mt-2"
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <Heart size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-sm">Follow some users to see their posts here!</p>
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
              currentUser={user}
              likeLoading={!!likeLoading[post._id]}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center py-8">
          <button 
            onClick={loadMore}
            disabled={loadingMore}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Home 