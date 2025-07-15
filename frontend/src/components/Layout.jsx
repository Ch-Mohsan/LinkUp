import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navigation from './Navigation'
import Sidebar from './Sidebar'
import { useState } from 'react'

const Layout = () => {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen w-full overflow-x-hidden">
      {/* Hamburger menu for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-white dark:bg-gray-900 rounded-full shadow border border-gray-200 dark:border-gray-700"
          aria-label="Open menu"
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="7" x2="24" y2="7" />
            <line x1="4" y1="14" x2="24" y2="14" />
            <line x1="4" y1="21" x2="24" y2="21" />
          </svg>
        </button>
      </div>
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 hidden lg:block min-w-0 overflow-x-hidden">
        <Sidebar />
      </div>
      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
          {/* Sidebar Drawer */}
          <div className="relative w-64 max-w-full h-full bg-white dark:bg-gray-900 shadow-xl animate-slideInLeft min-w-0 overflow-x-hidden">
            <button
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <Sidebar onNavClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-h-0 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <Navigation />
      </div>
    </div>
  )
}

export default Layout 