import { useState, useEffect } from 'react'
import { Heart, UserPlus, MessageCircle, ThumbsUp, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const navigate = useNavigate()

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'like',
      user: {
        name: 'Sarah Johnson',
        username: 'sarahj',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      action: 'liked your post',
      postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
      timestamp: '2 minutes ago',
      isRead: false
    },
    {
      id: 2,
      type: 'follow',
      user: {
        name: 'Mike Chen',
        username: 'mikechen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      action: 'started following you',
      timestamp: '1 hour ago',
      isRead: false
    },
    {
      id: 3,
      type: 'comment',
      user: {
        name: 'Emma Wilson',
        username: 'emmaw',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      action: 'commented on your post',
      comment: 'Amazing photo! Love the composition.',
      postImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
      timestamp: '3 hours ago',
      isRead: true
    },
    {
      id: 4,
      type: 'like',
      user: {
        name: 'Alex Rodriguez',
        username: 'alexr',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      action: 'liked your post',
      postImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&h=100&fit=crop',
      timestamp: '5 hours ago',
      isRead: true
    },
    {
      id: 5,
      type: 'follow',
      user: {
        name: 'Lisa Park',
        username: 'lisap',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      action: 'started following you',
      timestamp: '1 day ago',
      isRead: true
    }
  ]

  useEffect(() => {
    setNotifications(mockNotifications)
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={20} className="text-red-500" />
      case 'follow':
        return <UserPlus size={20} className="text-blue-500" />
      case 'comment':
        return <MessageCircle size={20} className="text-green-500" />
      default:
        return <Bell size={20} className="text-gray-500" />
    }
  }

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return (
          <span>
            <span className="font-semibold">{notification.user.name}</span> liked your post
          </span>
        )
      case 'follow':
        return (
          <span>
            <span className="font-semibold">{notification.user.name}</span> started following you
          </span>
        )
      case 'comment':
        return (
          <div>
            <span>
              <span className="font-semibold">{notification.user.name}</span> commented on your post
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              "{notification.comment}"
            </p>
          </div>
        )
      default:
        return notification.action
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notification.isRead
    return notification.type === activeTab
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <button className="text-violet-600 dark:text-violet-400 hover:underline">
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Bell size={20} />
            <span>All</span>
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'unread'
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <ThumbsUp size={20} />
            <span>Unread</span>
          </button>
          <button
            onClick={() => setActiveTab('like')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'like'
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Heart size={20} />
            <span>Likes</span>
          </button>
          <button
            onClick={() => setActiveTab('follow')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'follow'
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <UserPlus size={20} />
            <span>Follows</span>
          </button>
        </div>

        {/* Notifications List */}
        <motion.div
          className="divide-y divide-gray-200 dark:divide-gray-700"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <motion.div
                key={notification.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                }}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.isRead ? 'bg-violet-50 dark:bg-violet-900/10' : ''
                } cursor-pointer`}
                onClick={() => {
                  if (notification.type === 'like' || notification.type === 'comment') {
                    // For mock data, use a placeholder postId or notification.id
                    navigate(`/post/${notification.postId || notification.id}`)
                  } else if (notification.type === 'follow') {
                    navigate(`/profile/${notification.user.username}`)
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start space-x-3">
                      <img
                        src={notification.user.avatar}
                        alt={notification.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getNotificationText(notification)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                      {notification.postImage && (
                        <img
                          src={notification.postImage}
                          alt="Post"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTab === 'all' 
                  ? 'You\'re all caught up!' 
                  : `No ${activeTab} notifications yet`
                }
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Notifications 