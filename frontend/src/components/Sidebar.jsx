import { NavLink } from 'react-router-dom'
import { Home, Search, Plus, Heart, User, MessageCircle, Settings, LogOut, Sun, Moon, User as UserIcon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'
import { api } from '../services/api'

const Sidebar = ({ onNavClick }) => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    if (user) {
      api.messages.getUnreadCount().then(res => setUnreadMessages(res.unreadCount || 0)).catch(() => {})
      api.notifications.getUnreadCount().then(res => setUnreadNotifications(res.unreadCount || 0)).catch(() => {})
    }
  }, [user])

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Search, label: 'Explore' },
    { to: '/create', icon: Plus, label: 'Create Post' },
    { to: '/messages', icon: MessageCircle, label: 'Messages', badge: unreadMessages },
    { to: '/notifications', icon: Heart, label: 'Notifications', badge: unreadNotifications },
    { to: `/profile/${user?.username}`, icon: User, label: 'Profile' },
  ]

  return (
    <aside className="fixed top-0 left-0 h-screen w-80 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-r border-white/20 dark:border-white/10">
      <div className="flex flex-col h-full overflow-y-auto pt-6">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <NavLink to="/" className="flex items-center space-x-3" onClick={onNavClick}>
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">LinkUp</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Social</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="p-0 mt-2 space-y-2">
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
              onClick={onNavClick}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
              {badge > 0 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-violet-500 text-white text-xs rounded-full px-2 py-0.5">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Settings */}
        <div className="p-6 mt-auto border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            {user?.avatar ? (
            <img
                src={user.avatar}
                alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <UserIcon size={28} className="text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
            </div>
          </div>

          {/* Settings & Theme */}
          <div className="space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar 