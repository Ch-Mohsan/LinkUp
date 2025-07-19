import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, ArrowLeft, Save, User as UserIcon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { motion } from 'framer-motion'

const EditProfile = () => {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    isPrivate: user?.isPrivate || false
  })
  const [profileImage, setProfileImage] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(user?.avatar)
  const [coverImagePreview, setCoverImagePreview] = useState(user?.coverImage)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = new FormData()
      form.append('name', formData.name)
      form.append('username', formData.username)
      form.append('email', formData.email)
      form.append('bio', formData.bio)
      form.append('location', formData.location)
      form.append('website', formData.website)
      form.append('isPrivate', formData.isPrivate)
      if (profileImage && profileImage instanceof File) {
        form.append('avatar', profileImage)
      }
      if (coverImage && coverImage instanceof File) {
        form.append('coverImage', coverImage)
      }
      // Debug logs
      console.log('Submitting profile update...')
      for (let pair of form.entries()) {
        console.log(pair[0], pair[1])
      }
      // Call backend API
      const result = await api.users.updateProfile(form)
      console.log('API result:', result)
      if (result && result.user) {
        await refreshUser();
        navigate(`/profile/${result.user.username}`)
      }
    } catch (err) {
      console.error('Profile update error:', err)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      if (type === 'profile') {
        setProfileImage(file)
        setProfileImagePreview(URL.createObjectURL(file))
      } else {
        setCoverImage(file)
        setCoverImagePreview(URL.createObjectURL(file))
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Save size={20} />
                <span>Save</span>
              </>
            )}
          </button>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image */}
            <div className="relative h-48 rounded-t-2xl overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800">
              {coverImagePreview ? (
              <img
                  src={coverImagePreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              ) : (
                <span className="text-gray-500 dark:text-gray-400 text-lg font-semibold">Add cover image here</span>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                    className="hidden"
                  />
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Camera className="text-white" size={24} />
                  </div>
                </label>
              </div>
            </div>

            {/* Profile Image */}
            <div className="relative -mt-20 px-6">
              <div className="relative inline-block">
                {profileImagePreview ? (
                <img
                    src={profileImagePreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <UserIcon size={64} className="text-gray-400" />
                  </div>
                )}
                <label className="absolute -bottom-1 -right-1 w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center text-white hover:bg-violet-600 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                    className="hidden"
                  />
                  <Camera size={20} />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="px-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-field"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Tell us about yourself..."
                  maxLength={2200}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.bio.length}/2200
                </p>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                  placeholder="Where are you located?"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="input-field"
                  placeholder="Your website (optional)"
                />
              </div>

              {/* Account Privacy Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Privacy
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={!formData.isPrivate}
                      onChange={() => setFormData({ ...formData, isPrivate: false })}
                      className="form-radio text-violet-500 focus:ring-violet-500"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Public</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={formData.isPrivate}
                      onChange={() => setFormData({ ...formData, isPrivate: true })}
                      className="form-radio text-violet-500 focus:ring-violet-500"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Private</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.isPrivate
                    ? 'Only approved followers can see your posts and profile.'
                    : 'Anyone can see your posts and profile.'}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

export default EditProfile 