import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Image, Video, Smile, Hash, ArrowLeft } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import ReactDOM from 'react-dom'

const CreatePost = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const captionRef = useRef()
  const emojiBtnRef = useRef(null)

  useEffect(() => {
    if (showEmojiPicker && emojiBtnRef.current) {
      emojiBtnRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [showEmojiPicker])

  const getPickerStyle = () => {
    if (!emojiBtnRef.current) return { display: 'none' }
    const rect = emojiBtnRef.current.getBoundingClientRect()
    return {
      position: 'absolute',
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + rect.width / 2 + window.scrollX,
      transform: 'translateX(-50%)',
      zIndex: 1000,
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }

      setSelectedFile(file)
      setError('')
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Please select an image to upload')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('caption', caption)

      await api.posts.create(formData)
      navigate('/')
    } catch (error) {
      setError(error.message || 'Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreview(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEmojiSelect = (emoji) => {
    // Insert emoji at cursor position (v3+ emoji-mart)
    const emojiChar = emoji.native || emoji.skins?.[0]?.native || '';
    const textarea = captionRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCaption = caption.slice(0, start) + emojiChar + caption.slice(end);
    setCaption(newCaption);
    setShowEmojiPicker(false);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emojiChar.length;
    }, 0);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          disabled={loading}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create Post</h1>
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Posting...' : 'Share'}
        </button>
      </div>

      <div className="card">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* File Upload Area */}
        {!selectedFile ? (
          <div className="p-8 text-center">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12">
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Upload Photo
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Share your moments with the world
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
                disabled={loading}
              >
                Select Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-96 object-cover rounded-t-2xl"
              />
              <button
                onClick={removeFile}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                disabled={loading}
              >
                <X size={20} />
              </button>
            </div>

            {/* Caption Input */}
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    ref={captionRef}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    className="w-full min-h-[120px] bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                    disabled={loading}
                    maxLength={2000}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <button 
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    disabled={loading}
                  >
                    <Image size={20} />
                  </button>
                  <button 
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    disabled={loading}
                  >
                    <Video size={20} />
                  </button>
                  <button 
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    disabled={loading}
                    onClick={() => setShowEmojiPicker((v) => !v)}
                    ref={emojiBtnRef}
                  >
                    <Smile size={20} />
                  </button>
                  <button 
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    disabled={loading}
                  >
                    <Hash size={20} />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {caption.length}/2000
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showEmojiPicker &&
        ReactDOM.createPortal(
          <div style={getPickerStyle()}>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="auto" />
          </div>,
          document.body
        )
      }
    </div>
  )
}

export default CreatePost 