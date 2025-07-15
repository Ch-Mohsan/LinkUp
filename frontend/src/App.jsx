import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Explore from './pages/Explore'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import EditProfile from './pages/EditProfile'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="profile/:username" element={<Profile />} />
                <Route path="explore" element={<Explore />} />
                <Route path="post/:id" element={<PostDetail />} />
                <Route path="create" element={<CreatePost />} />
                <Route path="messages" element={<Messages />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="edit-profile" element={<EditProfile />} />
              </Route>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App 