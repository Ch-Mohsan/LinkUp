import { useState, useEffect } from 'react'
import { Heart, UserPlus, MessageCircle, ThumbsUp, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../services/api'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    api.notifications.getAll(1, 50, activeTab)
      .then(data => setNotifications(data.notifications || []))
      .finally(() => setLoading(false))
  }, [activeTab])

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true)
    await api.notifications.markAllAsRead()
    // Refetch notifications
    api.notifications.getAll(1, 50, activeTab)
      .then(data => setNotifications(data.notifications || []))
      .finally(() => setMarkingAll(false))
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      api.notifications.markAsRead(notification._id)
    }
    // Navigate based on type
    if (notification.type === 'like' || notification.type === 'comment') {
      if (notification.post) {
        navigate(`/post/${notification.post._id}`)
      }
    } else if (notification.type === 'follow') {
      if (notification.sender) {
        navigate(`/profile/${notification.sender.username}`)
      }
    } else if (notification.type === 'message') {
      if (notification.sender) {
        navigate(`/messages`)
      }
    }
  }

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
            <span className="font-semibold">{notification.sender?.name || notification.sender?.username}</span> liked your post
          </span>
        )
      case 'follow':
        return (
          <span>
            <span className="font-semibold">{notification.sender?.name || notification.sender?.username}</span> started following you
          </span>
        )
      case 'comment':
        return (
          <div>
            <span>
              <span className="font-semibold">{notification.sender?.name || notification.sender?.username}</span> commented on your post
            </span>
            {notification.comment && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                "{notification.comment.content}"
              </p>
            )}
          </div>
        )
      case 'message':
        return (
          <span>
            <span className="font-semibold">{notification.sender?.name || notification.sender?.username}</span> sent you a message
          </span>
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
        <button
          className="text-violet-600 dark:text-violet-400 hover:underline disabled:opacity-50"
          onClick={handleMarkAllAsRead}
          disabled={markingAll}
        >
          {markingAll ? 'Marking...' : 'Mark all as read'}
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
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <motion.div
                key={notification._id}
                className={`flex items-center gap-4 px-6 py-5 cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-violet-50 dark:bg-violet-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleNotificationClick(notification)}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex-shrink-0">
                  <img
                    src={notification.sender?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                    alt={notification.sender?.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notification.type)}
                    <span className="text-gray-900 dark:text-white text-base">
                      {getNotificationText(notification)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                {/* Show post image if available */}
                {notification.post && notification.post.image && (
                  <img
                    src={notification.post.image}
                    alt="Post"
                    className="w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                  />
                )}
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No notifications yet.</div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Notifications 