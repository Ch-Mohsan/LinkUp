const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Helper function to get headers with auth token
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // If token is invalid, remove it and redirect to login
    if (response.status === 401) {
      removeAuthToken();
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// API service functions
export const api = {
  // Authentication
  auth: {
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(userData),
      });
      const data = await handleResponse(response);
      if (data.token) {
        setAuthToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    },

    login: async (credentials) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(credentials),
      });
      const data = await handleResponse(response);
      if (data.token) {
        setAuthToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    },

    logout: async () => {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getHeaders(),
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        removeAuthToken();
        localStorage.removeItem('user');
      }
    },

    getMe: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Posts
  posts: {
    create: async (formData) => {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: formData, // FormData for file upload
      });
      return handleResponse(response);
    },

    getAll: async (page = 1, limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getExplore: async (page = 1, limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/posts/explore?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    like: async (id) => {
      const response = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getUserPosts: async (username, page = 1, limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/posts/user/${username}?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    edit: async (id, data) => {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
  },

  // Comments
  comments: {
    add: async (postId, content, parentCommentId = null) => {
      const response = await fetch(`${API_BASE_URL}/comments/posts/${postId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content, parentCommentId }),
      });
      return handleResponse(response);
    },

    getByPost: async (postId, page = 1, limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/comments/posts/${postId}?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    like: async (commentId) => {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    update: async (commentId, content) => {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ content }),
      });
      return handleResponse(response);
    },

    delete: async (commentId) => {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getReplies: async (commentId, page = 1, limit = 5) => {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/replies?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Users
  users: {
    getProfile: async (username) => {
      const response = await fetch(`${API_BASE_URL}/users/profile/${username}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    updateProfile: async (formData) => {
      const headers = {
        'Authorization': `Bearer ${getAuthToken()}`
      }
      // Don't set Content-Type if using FormData
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers,
        body: formData, // FormData for avatar upload
      });
      return handleResponse(response);
    },

    follow: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getFollowers: async (username, page = 1, limit = 20) => {
      const response = await fetch(`${API_BASE_URL}/users/${username}/followers?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getFollowing: async (username, page = 1, limit = 20) => {
      const response = await fetch(`${API_BASE_URL}/users/${username}/following?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    search: async (query, page = 1, limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getSuggested: async (limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/users/suggested?limit=${limit}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Messages
  messages: {
    send: async (receiverId, content, messageType = 'text') => {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ receiverId, content, messageType }),
      });
      return handleResponse(response);
    },

    getConversations: async () => {
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getConversation: async (userId, page = 1, limit = 20) => {
      const response = await fetch(`${API_BASE_URL}/messages/conversation/${userId}?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    markAsRead: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/messages/${userId}/read`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    delete: async (messageId) => {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getUnreadCount: async () => {
      const response = await fetch(`${API_BASE_URL}/messages/unread/count`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    edit: async (messageId, content) => {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ content }),
      });
      return handleResponse(response);
    },
  },

  // Notifications
  notifications: {
    getAll: async (page = 1, limit = 20, type = 'all') => {
      const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}&type=${type}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    markAsRead: async (notificationId) => {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    markAllAsRead: async () => {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    delete: async (notificationId) => {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getUnreadCount: async () => {
      const response = await fetch(`${API_BASE_URL}/notifications/unread/count`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    deleteAll: async () => {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },
};

export { getAuthToken, setAuthToken, removeAuthToken }; 