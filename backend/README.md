# Social Media Backend API

A complete Node.js backend for a social media application with JWT authentication, file uploads, and real-time features.

## Features

- **Authentication**: JWT-based user registration and login
- **Posts**: Create, read, update, delete posts with image uploads
- **Comments**: Add, edit, delete comments with nested replies
- **Messages**: Direct messaging between users
- **Notifications**: Real-time notifications for likes, follows, comments
- **User Profiles**: Profile management, following/unfollowing
- **File Uploads**: Multer middleware for image uploads
- **Search**: User search functionality
- **Pagination**: Efficient data loading with pagination

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/social_media_app

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
```

### 3. Database Setup

Make sure MongoDB is running on your system or use MongoDB Atlas.

### 4. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Posts
- `POST /api/posts` - Create a new post (protected)
- `GET /api/posts` - Get home feed posts (protected)
- `GET /api/posts/explore` - Get explore posts (protected)
- `GET /api/posts/:id` - Get single post (protected)
- `POST /api/posts/:id/like` - Like/unlike post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `GET /api/posts/user/:username` - Get user's posts (protected)

### Comments
- `POST /api/comments/posts/:postId` - Add comment to post (protected)
- `GET /api/comments/posts/:postId` - Get post comments (protected)
- `POST /api/comments/:commentId/like` - Like/unlike comment (protected)
- `PUT /api/comments/:commentId` - Update comment (protected)
- `DELETE /api/comments/:commentId` - Delete comment (protected)
- `GET /api/comments/:commentId/replies` - Get comment replies (protected)

### Users
- `GET /api/users/profile/:username` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `POST /api/users/:userId/follow` - Follow/unfollow user (protected)
- `GET /api/users/:username/followers` - Get user's followers (protected)
- `GET /api/users/:username/following` - Get user's following (protected)
- `GET /api/users/search` - Search users (protected)
- `GET /api/users/suggested` - Get suggested users (protected)

### Messages
- `POST /api/messages` - Send message (protected)
- `GET /api/messages/conversations` - Get all conversations (protected)
- `GET /api/messages/conversation/:userId` - Get conversation with user (protected)
- `PUT /api/messages/:userId/read` - Mark messages as read (protected)
- `DELETE /api/messages/:messageId` - Delete message (protected)
- `GET /api/messages/unread/count` - Get unread count (protected)

### Notifications
- `GET /api/notifications` - Get user's notifications (protected)
- `PUT /api/notifications/:notificationId/read` - Mark notification as read (protected)
- `PUT /api/notifications/read-all` - Mark all notifications as read (protected)
- `DELETE /api/notifications/:notificationId` - Delete notification (protected)
- `GET /api/notifications/unread/count` - Get unread count (protected)
- `DELETE /api/notifications` - Delete all notifications (protected)

## Database Models

### User
- username, name, email, password
- avatar, coverImage, bio, location, website
- followers[], following[], savedPosts[]
- isPrivate, isVerified, lastSeen, isOnline

### Post
- author (ref: User), image, caption
- likes[] (ref: User), comments[] (ref: Comment)
- tags[], location, isPublic, viewCount

### Comment
- author (ref: User), post (ref: Post), content
- likes[] (ref: User), replies[] (ref: Comment)
- parentComment (ref: Comment), isEdited

### Message
- sender (ref: User), receiver (ref: User), content
- messageType, attachments[], isRead, readAt

### Notification
- recipient (ref: User), sender (ref: User), type
- post (ref: Post), comment (ref: Comment), message (ref: Message)
- action, isRead, readAt

## File Upload

The API supports image uploads for:
- Post images
- User avatars
- User cover images

Files are stored in the `uploads/` directory and served statically.

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Handling

The API returns consistent error responses:
```json
{
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode with nodemon
npm run dev

# Run tests (if implemented)
npm test
```

## Production

```bash
# Install dependencies
npm install --production

# Start the server
npm start
```

Make sure to set appropriate environment variables for production. 