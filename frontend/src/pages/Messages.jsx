import { useState, useEffect, useRef } from 'react'
import { Send, MoreVertical, Search, Phone, Video, Edit2, Trash2, ArrowDown, MoreHorizontal, ArrowLeft } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import React from 'react'
import { toast } from 'react-toastify'

// Hook to detect mobile screen
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

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
  const menuRef = useRef(null)
  const isMobile = useIsMobile();
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [chatRestricted, setChatRestricted] = useState(false)

  // Fetch conversations from backend
  useEffect(() => {
    api.messages.getConversations().then(data => setChats(data.conversations || []))
  }, [])

  // Fetch messages for selected chat
  useEffect(() => {
    if (selectedChat && selectedChat.user && selectedChat.user._id) {
      setChatRestricted(false)
      api.messages.getConversation(selectedChat.user._id)
        .then(data => setMessages(data.messages || []))
        .catch(error => {
          if (error.response && error.response.status === 403) {
            setChatRestricted(true)
          }
        })
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
    if (chatRestricted) return
    if (message.trim() && selectedChat && selectedChat.user && selectedChat.user._id) {
      try {
        await api.messages.send(selectedChat.user._id, message)
        setMessage('')
        // Refetch messages after sending
        api.messages.getConversation(selectedChat.user._id).then(data => setMessages(data.messages || []))
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setChatRestricted(true)
          toast.info('You can only chat with users who follow you back.')
        }
      }
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
    toast.info(
      <div>
        Are you sure you want to delete this message?
        <div className="mt-2 flex gap-2 justify-end">
          <button onClick={async () => {
      await api.messages.delete(msg._id)
      if (selectedChat && selectedChat.user && selectedChat.user._id) {
        api.messages.getConversation(selectedChat.user._id).then(data => setMessages(data.messages || []))
      }
            toast.dismiss()
            toast.success('Message deleted!')
          }} className="px-3 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
          <button onClick={() => toast.dismiss()} className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-xs">Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false }
    )
  }

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  // When a chat is selected on mobile, show chat view
  useEffect(() => {
    if (isMobile && selectedChat) {
      setShowChatMobile(true);
    }
  }, [isMobile, selectedChat]);

  // When back is pressed, deselect chat and show list
  const handleBackMobile = () => {
    setShowChatMobile(false);
    setSelectedChat(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar (User/Search List) */}
      {(!isMobile || (isMobile && !showChatMobile)) && (
        <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto">
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
            {search.trim() ? (
              searching ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map(user => (
                  <div
                    key={user._id}
                    onClick={() => handleStartChat(user)}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center space-x-3"
                  >
                    <img
                      src={user.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                      alt={user.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No users found.</div>
              )
            ) : (
              chats.map(chat => (
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
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {chat._id?.name || 'Unknown User'}
                    </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.timestamp || ''}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {typeof chat.lastMessage?.content === 'string' ? chat.lastMessage.content : ''}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                      <div className="w-6 h-6 bg-violet-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Chat View */}
      {(!isMobile || (isMobile && showChatMobile)) && selectedChat && (
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-x-hidden">
          {/* Mobile back arrow */}
          {isMobile && (
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <button onClick={handleBackMobile} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft size={24} />
              </button>
              <span className="font-semibold text-lg text-gray-900 dark:text-white">Chat</span>
      </div>
          )}
          {/* If chat is restricted, show message and hide chat UI */}
          {chatRestricted ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 text-center p-8">
              You can only chat with users who follow you back.
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 flex items-center border-b border-gray-200 dark:border-gray-700 px-6 flex-shrink-0">
                <img
                  src={selectedChat.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                  alt={selectedChat.user?.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {selectedChat.user?.name || 'User'}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {selectedChat.user?.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
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

              {/* Message List */}
              <div
                  className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-4 min-h-0 relative"
                ref={messageListRef}
                onScroll={handleScroll}
              >
                {selectedChat && selectedChat.user && messages.length > 0 ? (
                    <div className="flex flex-col space-y-4">
                    {messages.map(msg => {
                      const isSender = msg.sender && currentUser && msg.sender._id === currentUser._id;
                      return (
                        <div
                          key={msg._id}
                            className={`flex items-start group relative w-full ${isSender ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end gap-2 max-w-[70%] ${isSender ? 'flex-row-reverse' : ''}`}>
                            <img
                              src={msg.sender.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                              alt={msg.sender.name || 'User'}
                                className="w-8 h-8 rounded-full object-cover shadow flex-shrink-0"
                            />
                            <div className="relative">
                              <div
                                  className={`px-4 py-2 rounded-2xl break-words whitespace-pre-wrap shadow ${
                                  isSender
                                    ? 'bg-violet-500 text-white'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}
                              >
                                {editingMsgId === msg._id ? (
                                  <form onSubmit={e => handleEditMsgSubmit(e, msg._id)}>
                                      <textarea
                                        className="w-full p-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-2 resize-none"
                                      value={editMsgContent}
                                      onChange={e => setEditMsgContent(e.target.value)}
                                      disabled={editMsgLoading}
                                      maxLength={2000}
                                      autoFocus
                                        rows={3}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button 
                                          type="button" 
                                          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500" 
                                          onClick={() => setEditingMsgId(null)}
                                        >
                                          Cancel
                                        </button>
                                        <button 
                                          type="submit" 
                                          className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-600 disabled:opacity-50" 
                                          disabled={editMsgLoading}
                                        >
                                          {editMsgLoading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                  </form>
                                ) : (
                                  <>
                                      <span className="block">{msg.content}</span>
                                      {msg.isEdited && <span className="text-xs opacity-70 block mt-1">(edited)</span>}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                            
                            {/* Three dots menu for sender's messages */}
                            <div className="relative">
                              <button
                                className="ml-2 opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                onClick={() => setShowMenu(showMenu === msg._id ? null : msg._id)}
                              >
                                <MoreHorizontal size={16} className="text-gray-500" />
                              </button>
                              {/* Dropdown menu */}
                              {showMenu === msg._id && (
                                <div ref={menuRef} className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10 border border-gray-200 dark:border-gray-700 min-w-[120px]">
                          {isSender && (
                            <button
                                      onClick={() => { setShowMenu(null); handleEditMsg(msg); }} 
                                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                            >
                                      <Edit2 size={14} />
                                      Edit
                            </button>
                          )}
                              <button 
                                onClick={() => { setShowMenu(null); handleDeleteMsg(msg); }} 
                                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                        </div>
                              )}
                            </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                      <div>
                        <p className="text-lg mb-2">No messages yet</p>
                        <p className="text-sm">Say hello to start the conversation!</p>
                      </div>
                    </div>
                  )}
                  
                <div ref={messagesEndRef} />
                  
                {showScrollDown && (
                  <button
                    onClick={scrollToBottom}
                      className="fixed bottom-28 right-8 z-50 bg-violet-500 hover:bg-violet-600 text-white p-3 rounded-full shadow-lg transition-all"
                    title="Scroll to bottom"
                  >
                    <ArrowDown size={20} />
                  </button>
                )}
              </div>

              {/* Input Bar */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex-shrink-0">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type a message..."
                      className="flex-1 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-500"
                      maxLength={2000}
                />
                <button
                  type="submit"
                      className="p-2 rounded-full bg-violet-500 hover:bg-violet-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  disabled={!message.trim()}
                >
                      <Send size={20} />
                </button>
              </form>
            </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const Messages = () => {
  return <SafeMessages />
}

export default Messages 