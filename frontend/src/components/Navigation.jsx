import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, Search, Plus, Heart, User, LogOut, Settings, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const Navigation = () => {
  const [showMenu, setShowMenu] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    if (user) {
      api.messages.getUnreadCount().then(res => setUnreadMessages(res.unreadCount || 0)).catch(() => {})
      api.notifications.getUnreadCount().then(res => setUnreadNotifications(res.unreadCount || 0)).catch(() => {})
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/"
            className="p-3 text-gray-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
          >
            <Home size={24} />
          </Link>
          
          <Link
            to="/explore"
            className="p-3 text-gray-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
          >
            <Search size={24} />
          </Link>
          
          <Link
            to="/create"
            className="p-3 text-gray-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
          >
            <Plus size={24} />
          </Link>
          
          <Link
            to="/messages"
            className="p-3 text-gray-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors relative"
          >
            <MessageCircle size={24} />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-violet-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {unreadMessages}
              </span>
            )}
          </Link>
          
          <Link
            to="/notifications"
            className="p-3 text-gray-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors relative"
          >
            <Heart size={24} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-violet-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {unreadNotifications}
              </span>
            )}
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-3 text-gray-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
            >
              <User size={24} />
            </button>
            
            {showMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <Link
                  to={`/profile/${user.username}`}
                  onClick={() => setShowMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/edit-profile"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 