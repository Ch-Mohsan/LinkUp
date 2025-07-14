import { createContext, useContext, useState, useEffect } from 'react'
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token and user data
    const token = getAuthToken()
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      // Verify token is still valid by calling getMe
      api.auth.getMe()
        .then((data) => {
          setUser(data.user)
        })
        .catch((error) => {
          console.error('Token validation failed:', error)
          // Token is invalid, clear everything
          removeAuthToken()
          localStorage.removeItem('user')
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const data = await api.auth.login(credentials)
      setUser(data.user)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const data = await api.auth.register(userData)
      setUser(data.user)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      removeAuthToken()
      localStorage.removeItem('user')
    }
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const refreshUser = async () => {
    try {
      const data = await api.auth.getMe()
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      console.error('Failed to refresh user:', error)
      // If refresh fails, logout the user
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      updateUser, 
      refreshUser,
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  )
} 