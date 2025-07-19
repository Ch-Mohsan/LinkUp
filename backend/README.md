# LinkUp Backend API Documentation

## Overview
LinkUp is a social media backend built with Node.js, Express, and MongoDB. It supports user authentication, posts, comments, likes, messaging, notifications, and robust privacy controls (public/private accounts, follow requests, mutual-follow chat).

---

## Authentication

### Register
- **POST** `/api/auth/register`
- **Description:** Register a new user (choose public/private account)
- **Body:** `{ name, username, email, password, isPrivate }`
- **Response:** `{ token, user }`

### Login
- **POST** `/api/auth/login`
- **Description:** Login with email and password
- **Body:** `{ email, password }`
- **Response:** `{ token, user }`

### Get Current User
- **GET** `/api/auth/me`
- **Auth:** Bearer token required
- **Response:** `{ user }`

### Logout
- **POST** `/api/auth/logout`
- **Auth:** Bearer token required
- **Response:** `{ message }`

---

## Users

### Search Users
- **GET** `/api/users/search?q=...`
- **Auth:** Required
- **Response:** `{ users: [...] }`

### Suggested Users
- **GET** `/api/users/suggested`
- **Auth:** Required
- **Response:** `{ suggestedUsers: [...] }`

### Get User Profile
- **GET** `/api/users/profile/:username`
- **Auth:** Required
- **Response:** `{ user }`
- **Note:** If the user is private and you are not a mutual follower, only minimal info is returned and posts are hidden.

### Update Profile
- **PUT** `/api/users/profile`
- **Auth:** Required
- **Body:** `FormData` (fields: name, username, email, bio, location, website, isPrivate, avatar, coverImage)
- **Response:** `{ user }`

### Follow/Unfollow
- **POST** `/api/users/:userId/follow`
- **Auth:** Required
- **Response:** `{ message, following?, followRequest? }`
- **Note:** If the target is private, a follow request is sent instead of following directly.

### Get Followers
- **GET** `/api/users/:username/followers`
- **Auth:** Required
- **Response:** `{ followers: [...] }`

### Get Following
- **GET** `/api/users/:username/following`
- **Auth:** Required
- **Response:** `{ following: [...] }`

### Follow Requests (Private Accounts)
- **GET** `/api/users/follow-requests`
- **Auth:** Required
- **Response:** `{ followRequests: [...] }`

- **POST** `/api/users/follow-requests/:requesterId/respond`
- **Auth:** Required
- **Body:** `{ action: 'accept' | 'reject' }`
- **Response:** `{ message }`

---

## Posts

### Create Post
- **POST** `/api/posts/`
- **Auth:** Required
- **Body:** `FormData` (image required, caption, tags, location)
- **Response:** `{ post }`

### Get Home Feed
- **GET** `/api/posts/`
- **Auth:** Required
- **Response:** `{ posts: [...] }`

### Get Explore Posts
- **GET** `/api/posts/explore`
- **Auth:** Required
- **Response:** `{ posts: [...] }`

### Get User's Posts
- **GET** `/api/posts/user/:username`
- **Auth:** Required
- **Response:** `{ posts: [...] }`
- **Note:** If the user is private and you are not a mutual follower, returns 403.

### Get Single Post
- **GET** `/api/posts/:id`
- **Auth:** Required
- **Response:** `{ post }`

### Like/Unlike Post
- **POST** `/api/posts/:id/like`
- **Auth:** Required
- **Response:** `{ liked, likeCount }`

### Delete Post
- **DELETE** `/api/posts/:id`
- **Auth:** Required
- **Response:** `{ message }`

### Edit Post
- **PUT** `/api/posts/:id`
- **Auth:** Required
- **Body:** `{ caption, tags, location }`
- **Response:** `{ post }`

---

## Comments

### Add Comment
- **POST** `/api/comments/posts/:postId`
- **Auth:** Required
- **Body:** `{ content, parentCommentId? }`
- **Response:** `{ comment }`

### Get Comments
- **GET** `/api/comments/posts/:postId`
- **Auth:** Required
- **Response:** `{ comments: [...] }`

### Like/Unlike Comment
- **POST** `/api/comments/:commentId/like`
- **Auth:** Required
- **Response:** `{ liked, likeCount }`

### Update Comment
- **PUT** `/api/comments/:commentId`
- **Auth:** Required
- **Body:** `{ content }`
- **Response:** `{ comment }`

### Delete Comment
- **DELETE** `/api/comments/:commentId`
- **Auth:** Required
- **Response:** `{ message }`

### Get Replies
- **GET** `/api/comments/:commentId/replies`
- **Auth:** Required
- **Response:** `{ replies: [...] }`

---

## Messages

### Send Message
- **POST** `/api/messages/`
- **Auth:** Required
- **Body:** `{ receiverId, content, messageType? }`
- **Response:** `{ messageData }`
- **Note:** Only mutual followers can chat. 403 if not allowed.

### Get All Conversations
- **GET** `/api/messages/conversations`
- **Auth:** Required
- **Response:** `{ conversations: [...] }`

### Get Unread Message Count
- **GET** `/api/messages/unread/count`
- **Auth:** Required
- **Response:** `{ unreadCount }`

### Get Conversation With User
- **GET** `/api/messages/conversation/:userId`
- **Auth:** Required
- **Response:** `{ messages: [...] }`
- **Note:** Only mutual followers can chat. 403 if not allowed.

### Mark Messages as Read
- **PUT** `/api/messages/:userId/read`
- **Auth:** Required
- **Response:** `{ message }`

### Delete Message
- **DELETE** `/api/messages/:messageId`
- **Auth:** Required
- **Response:** `{ message }`

### Edit Message
- **PUT** `/api/messages/:messageId`
- **Auth:** Required
- **Body:** `{ content }`
- **Response:** `{ messageData }`

---

## Notifications

### Get Notifications
- **GET** `/api/notifications/`
- **Auth:** Required
- **Response:** `{ notifications: [...] }`

### Mark All As Read
- **PUT** `/api/notifications/read-all`
- **Auth:** Required
- **Response:** `{ message }`

### Get Unread Notification Count
- **GET** `/api/notifications/unread/count`
- **Auth:** Required
- **Response:** `{ unreadCount }`

### Mark Notification As Read
- **PUT** `/api/notifications/:notificationId/read`
- **Auth:** Required
- **Response:** `{ message, notification }`

### Delete Notification
- **DELETE** `/api/notifications/:notificationId`
- **Auth:** Required
- **Response:** `{ message }`

### Delete All Notifications
- **DELETE** `/api/notifications/`
- **Auth:** Required
- **Response:** `{ message }`

---

## Special Logic & Notes
- **Private Accounts:** Only mutual followers can view posts, profile, and chat. Others see only minimal info and can send follow requests.
- **Follow Requests:** Private users must accept follow requests before others can follow, view posts, or chat.
- **Access Control:** All endpoints enforce authentication and privacy rules. 403 errors are returned if access is denied.

---

For more details, see the controller files or contact the project maintainer. 