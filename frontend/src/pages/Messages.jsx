import { useState, useEffect, useRef } from 'react'
import { Send, MoreVertical, Search, Phone, Video, Edit2, Trash2, ArrowDown, MoreHorizontal } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import React from 'react'

function SafeMessages(props) {
  try {
    return <MessagesInner {...props} />
  } catch (err) {
    return (
      <div className="p-8 text-center text-red-600">
        Something went wrong in Messages: {err.message}
      </div>
    )
  }
}

function MessagesInner() {
  const { user: currentUser } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [editingMsgId, setEditingMsgId] = useState(null)
  const [editMsgContent, setEditMsgContent] = useState('')
  const [editMsgLoading, setEditMsgLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const messageListRef = useRef(null)
  const [showScrollDown, setShowScrollDown] = useState(false)
  const [showMenu, setShowMenu] = useState(null)

  // Fetch conversations from backend
  useEffect(() => {
    api.messages.getConversations().then(data => setChats(data.conversations || []))
  }, [])

  // Fetch messages for selected chat
  useEffect(() => {
    if (selectedChat && selectedChat.user && selectedChat.user._id) {
      api.messages.getConversation(selectedChat.user._id).then(data => setMessages(data.messages || []))
    }
  }, [selectedChat])

  // Handle user search
  useEffect(() => {
    if (search.trim() === '') {
      setSearchResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    const timeout = setTimeout(() => {
      api.users.search(search).then(res => {
        setSearchResults(res.users || [])
        setSearching(false)
      }).catch(() => setSearching(false))
    }, 400)
    return () => clearTimeout(timeout)
  }, [search])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  // Show scroll down button if not at bottom
  const handleScroll = () => {
    if (!messageListRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = messageListRef.current
    setShowScrollDown(scrollTop + clientHeight < scrollHeight - 50)
  }

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (message.trim() && selectedChat && selectedChat.user && selectedChat.user._id) {
      await api.messages.send(selectedChat.user._id, message)
      setMessage('')
      // Refetch messages after sending
      api.messages.getConversation(selectedChat.user._id).then(data => setMessages(data.messages || []))
    }
  }

  // Start chat with a searched user
  const handleStartChat = (user) => {
    // Check if chat already exists (handle cases where chat.user may be undefined)
    const existing = chats.find(chat =>
      (chat.user && user && chat.user._id === user._id) ||
      (chat._id && user && chat._id._id === user._id)
    )
    if (existing) {
      setSelectedChat(existing)
    } else {
      // Create a temporary chat object
      setSelectedChat({ _id: user._id, user })
    }
    setSearch('')
    setSearchResults([])
  }

  const handleEditMsg = (msg) => {
    setEditingMsgId(msg._id)
    setEditMsgContent(msg.content)
  }

  const handleEditMsgSubmit = async (e, msgId) => {
    e.preventDefault()
    setEditMsgLoading(true)
    try {
      await api.messages.edit(msgId, editMsgContent)
      setEditingMsgId(null)
      setEditMsgContent('')
      // Refresh messages
      if (selectedChat && selectedChat.user && selectedChat.user._id) {
        api.messages.getConversation(selectedChat.user._id).then(data => setMessages(data.messages || []))
      }
    } catch (error) {
      alert('Failed to edit message')
    } finally {
      setEditMsgLoading(false)
    }
  }

  const handleDeleteMsg = async (msg) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await api.messages.delete(msg._id)
      if (selectedChat && selectedChat.user && selectedChat.user._id) {
        api.messages.getConversation(selectedChat.user._id).then(data => setMessages(data.messages || []))
      }
    }
  }

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto overflow-x-hidden min-w-0">
        {/* Chat List */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto">
          {chats.map(chat => (
            <div
              key={chat._id?._id || chat._id}
              onClick={() => setSelectedChat({ ...chat, user: chat._id })}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                (selectedChat && selectedChat.user && ((selectedChat.user._id === (chat._id?._id || chat._id))) ? 'bg-violet-50 dark:bg-violet-900/20' : '')
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={chat._id?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                  alt={chat._id?.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {chat._id?.name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-500">{chat.timestamp || ''}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {typeof chat.lastMessage?.content === 'string' ? chat.lastMessage.content : ''}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="w-6 h-6 bg-violet-500 text-white text-xs rounded-full flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 bg-white dark:bg-gray-800">
        {/* Chat Header */}
        {selectedChat && selectedChat.user ? (
          <div className="h-16 flex items-center border-b border-gray-200 dark:border-gray-700 px-6">
            <img
              src={selectedChat.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
              alt={selectedChat.user?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {selectedChat.user?.name || 'User'}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedChat.user?.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Phone size={20} className="text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Video size={20} className="text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <MoreVertical size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 text-gray-500">
            Select a chat to start messaging
          </div>
        )}
        {/* Message List */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 min-h-0 relative"
          ref={messageListRef}
          onScroll={handleScroll}
        >
          {selectedChat && selectedChat.user && messages.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {messages.map(msg => {
                const isSender = msg.sender && currentUser && msg.sender._id === currentUser._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex items-center group relative max-w-[400px] w-fit ${isSender ? 'self-end' : 'self-start'}`}
                  >
                    <div className={`flex items-end gap-2 ${isSender ? 'flex-row-reverse' : ''}`}>
                      <img
                        src={msg.sender.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                        alt={msg.sender.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover shadow"
                      />
                      <div className="relative">
                        <div
                          className={`px-4 py-2 rounded-2xl inline-block max-w-[250px] break-words whitespace-pre-line shadow ${
                            isSender
                              ? 'bg-violet-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white mr-auto'
                          }`}
                        >
                          {editingMsgId === msg._id ? (
                            <form onSubmit={e => handleEditMsgSubmit(e, msg._id)}>
                              <input
                                className="w-full p-1 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-1"
                                value={editMsgContent}
                                onChange={e => setEditMsgContent(e.target.value)}
                                disabled={editMsgLoading}
                                maxLength={2000}
                                autoFocus
                              />
                              <div className="flex gap-2 justify-end">
                                <button type="button" className="btn-secondary btn-xs" onClick={() => setEditingMsgId(null)}>Cancel</button>
                                <button type="submit" className="btn-primary btn-xs" disabled={editMsgLoading}>{editMsgLoading ? 'Saving...' : 'Save'}</button>
                              </div>
                            </form>
                          ) : (
                            <>
                              {msg.content}
                              {msg.isEdited && <span className="ml-2 text-xs text-gray-400">(edited)</span>}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Three dots icon (outside bubble, end of row) */}
                    {isSender && (
                      <button
                        className="ml-2 opacity-0 group-hover:opacity-100 transition"
                        onClick={() => setShowMenu(showMenu === msg._id ? null : msg._id)}
                        tabIndex={-1}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    )}
                    {/* Dropdown menu */}
                    {isSender && showMenu === msg._id && (
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 shadow rounded z-10 border border-gray-200 dark:border-gray-700 flex flex-col min-w-[100px]">
                        <button onClick={() => { setShowMenu(null); handleEditMsg(msg); }} className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">Edit</button>
                        <button onClick={() => { setShowMenu(null); handleDeleteMsg(msg); }} className="px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">No messages yet. Say hello!</div>
          )}
          <div ref={messagesEndRef} />
          {showScrollDown && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-28 right-8 z-50 bg-violet-500 hover:bg-violet-600 text-white p-2 rounded-full shadow-lg transition-all"
              title="Scroll to bottom"
            >
              <ArrowDown size={20} />
            </button>
          )}
        </div>
        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="h-20 flex items-center border-t border-gray-200 dark:border-gray-700 px-6 bg-white dark:bg-gray-800 gap-2"
          style={{ minHeight: '64px' }}
        >
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 max-w-[400px] rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-none outline-none text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="p-2 rounded-full bg-violet-500 hover:bg-violet-600 text-white transition-colors disabled:opacity-50 flex-shrink-0"
            disabled={!message.trim()}
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  )
}

const Messages = () => {
  return <SafeMessages />
}

export default Messages 