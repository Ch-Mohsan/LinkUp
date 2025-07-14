# LinkUp Social Media Application

A modern, professional, and visually attractive social media application built with React.js, Tailwind CSS, and modern web technologies. This application features a sleek, futuristic design with smooth user interactions and comprehensive social media functionality.

## 🎨 Design Features

- **Modern UI/UX**: Sleek, futuristic design with smooth animations
- **Dark/Light Mode**: Full theme support with automatic system preference detection
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Glassmorphism Effects**: Subtle glass effects on modals and cards
- **Neumorphism Elements**: Soft shadow effects for depth
- **Color Scheme**: Violet, indigo, and slate color palette
- **Typography**: Clean hierarchy with Inter font family

## 🚀 Features

### Authentication
- ✅ Login page with minimalist design
- ✅ Registration with profile image upload
- ✅ Form validation and error handling
- ✅ Remember me functionality

### Social Features
- ✅ Home feed with infinite scroll
- ✅ Story/Status system
- ✅ Post creation with image/video upload
- ✅ Like, comment, and share functionality
- ✅ User profiles with cover images
- ✅ Follow/unfollow system
- ✅ Real-time notifications

### User Interface
- ✅ Responsive navigation (mobile bottom, desktop sidebar)
- ✅ Explore page with trending content
- ✅ Messages/Chat system
- ✅ Notifications center
- ✅ Profile editing
- ✅ Post detail views

### Technical Features
- ✅ Component-based architecture
- ✅ Context API for state management
- ✅ React Router for navigation
- ✅ Loading skeletons
- ✅ Smooth transitions and animations
- ✅ Mobile-first responsive design

## 🛠️ Tech Stack

- **Frontend**: React.js 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: npm

## 📱 Screens Included

1. **Login Page** - Minimalist authentication
2. **Register Page** - Account creation with image upload
3. **Home Feed** - Infinite scroll posts with stories
4. **Profile Page** - User profiles with tabs
5. **Explore Page** - Trending posts, users, and hashtags
6. **Create Post** - Image/video upload with caption
7. **Messages** - Chat system with online indicators
8. **Notifications** - Activity feed with filters
9. **Edit Profile** - Profile customization
10. **Post Detail** - Full post view with comments

## 🎯 Design Principles

- **Visual Consistency**: Unified design language throughout
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Performance**: Optimized loading with skeletons
- **User Experience**: Intuitive navigation and interactions
- **Modern Aesthetics**: Clean, professional appearance

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd linkup-social
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Navigation.jsx  # Mobile navigation
│   ├── Sidebar.jsx     # Desktop sidebar
│   ├── PostCard.jsx    # Post component
│   ├── StoryBar.jsx    # Stories component
│   └── LoadingSkeleton.jsx
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Authentication state
│   └── ThemeContext.jsx # Theme management
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Home.jsx
│   ├── Profile.jsx
│   ├── Explore.jsx
│   ├── CreatePost.jsx
│   ├── Messages.jsx
│   ├── Notifications.jsx
│   ├── EditProfile.jsx
│   └── PostDetail.jsx
├── App.jsx             # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🎨 Customization

### Colors
The application uses a custom color palette defined in `tailwind.config.js`:
- Primary: Slate colors
- Accent: Violet and Indigo gradients
- Dark mode support

### Components
All components are built with Tailwind CSS classes and can be easily customized by modifying the class names or extending the configuration.

### Themes
The theme system supports:
- Light mode (default)
- Dark mode
- System preference detection
- Persistent theme selection

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px (bottom navigation)
- Tablet: 768px - 1024px
- Desktop: > 1024px (sidebar navigation)

## 🔧 Configuration

### Tailwind CSS
Custom configuration includes:
- Extended color palette
- Custom animations
- Glassmorphism utilities
- Neumorphism shadows

### Vite
Optimized build configuration for:
- Fast development
- Production optimization
- Hot module replacement

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with zero configuration

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **LinkUp** - For the amazing design vision
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icons
- **Unsplash** - For the placeholder images

---

Built with ❤️ by LinkUp Team 