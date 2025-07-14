# Social Media App - Full Stack

A modern social media application built with React frontend and Node.js backend, featuring user authentication, posts, comments, messaging, and more.

## Features

### Frontend (React + Vite)
- 🎨 Modern UI with Tailwind CSS and dark mode
- 🔐 JWT Authentication with localStorage
- 📱 Responsive design with mobile-first approach
- 🖼️ Image upload with preview
- 💬 Real-time comments and likes
- 👥 User profiles and following system
- 📨 Direct messaging
- 🔔 Notifications
- 🔍 Search functionality

### Backend (Node.js + Express + MongoDB)
- 🔐 JWT Authentication
- 📝 CRUD operations for posts and comments
- 👤 User management and profiles
- 💬 Messaging system
- 🔔 Notification system
- 🖼️ File upload with Multer
- 🔍 Search and filtering
- 📊 Pagination support

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React (Icons)
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcrypt for password hashing
- CORS for cross-origin requests

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd App
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
```

### 4. Start the Application

#### Start Backend
```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

#### Start Frontend
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/explore` - Get explore posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (with image upload)
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post

### Comments
- `GET /api/comments/posts/:postId` - Get comments for post
- `POST /api/comments/posts/:postId` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like/unlike comment

### Users
- `GET /api/users/profile/:username` - Get user profile
- `PUT /api/users/profile` - Update profile (with avatar upload)
- `POST /api/users/:userId/follow` - Follow/unfollow user
- `GET /api/users/:username/followers` - Get user followers
- `GET /api/users/:username/following` - Get user following
- `GET /api/users/search` - Search users
- `GET /api/users/suggested` - Get suggested users

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/conversation/:userId` - Get conversation with user
- `POST /api/messages` - Send message
- `PUT /api/messages/:userId/read` - Mark messages as read
- `DELETE /api/messages/:id` - Delete message

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Frontend-Backend Integration

### Authentication Flow
1. User registers/logs in through frontend forms
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Token is automatically included in API requests
5. Backend validates token on protected routes

### Image Upload
1. Frontend uses FormData to send images
2. Backend uses Multer middleware to handle file uploads
3. Images are stored in `uploads/` directory
4. Image URLs are saved in database

### State Management
- Uses React Context API for global state
- JWT token stored in localStorage
- User data cached in context
- Automatic token refresh and validation

## File Structure

```
App/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── package.json
│   └── simple-server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # If nodemon is configured
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database
Make sure MongoDB is running locally or update the connection string in `.env` to point to your MongoDB instance.

## Production Deployment

### Backend
1. Set up environment variables
2. Install dependencies: `npm install --production`
3. Start server: `npm start`

### Frontend
1. Build the app: `npm run build`
2. Serve the `dist` folder with a static server

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is properly configured
2. **JWT Token Issues**: Check JWT_SECRET in backend .env
3. **Image Upload Failures**: Ensure uploads/ directory exists and is writable
4. **Database Connection**: Verify MongoDB is running and connection string is correct

### Debug Mode
- Backend: Add `console.log` statements in routes/controllers
- Frontend: Use browser dev tools and React DevTools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 