# Loredrop - Campus Event Organizing App
## Quick Start Guide

### Prerequisites
- Node.js 18+
- MongoDB local instance or Atlas connection
- Firebase project setup
- pnpm (or npm)

---

## 🚀 Getting Started

### 1. **Clone & Install**
```bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend
pnpm install
cd ..
```

### 2. **Environment Setup**

**Frontend** - Create `.env`:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_URL=http://localhost:3001/api
```

**Backend** - Create `backend/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/loredrop

# Server
PORT=3001
CLIENT_URL=http://localhost:5173

# Firebase Admin SDK
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

### 3. **Start MongoDB**
```bash
# Using local MongoDB
mongod

# Or use MongoDB Atlas - update MONGODB_URI with your connection string
```

### 4. **Run Development Servers**

**Terminal 1 - Frontend:**
```bash
pnpm dev
# Runs on http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd backend
pnpm dev
# Runs on http://localhost:3001
```

### 5. **Build for Production**

**Frontend:**
```bash
pnpm run build
# Output in dist/
```

**Backend:**
```bash
cd backend
pnpm run build
# Compiled to dist/
```

---

## 📖 Feature Usage

### 1. **Theme Toggle**
- Click the Moon/Sun icon in the header
- Theme preference saved automatically
- Applies to entire application

### 2. **Sign In**
- Click "Sign In" button
- Use Firebase authentication (email/password or social)
- Redirected to callback after auth

### 3. **Browse Feed**
- View all campus events
- Filter by organization
- Scroll through paginated events
- Click event for more details

### 4. **Interact with Events**
- ❤️ **Upvote**: Click heart to like events
- 💬 **Comment**: Click comment icon to view/add comments
- 📅 **Save**: Click bookmark to save to calendar
- All interactions require authentication

### 5. **View Profile**
- Click avatar in header → "My Profile"
- View saved events
- See profile information
- Quick stats on interactions

### 6. **Admin Dashboard**
- Click avatar in header → "Admin Dashboard"
- Or navigate to `/admin`
- Select organization from sidebar
- Create new events with full details
- View all created events
- Track event engagement

### 7. **Notifications**
- Click bell icon in header
- View notification history
- Mark as read
- Auto-refreshes every 10 seconds
- Badge shows unread count

### 8. **Calendar**
- Navigate to `/calendar`
- View all saved events
- See upcoming saved events
- Quick links to event details

---

## 🔑 Key Routes

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Landing page | Public |
| `/feed` | Main event feed | Public (some features need auth) |
| `/calendar` | Saved events | Authenticated |
| `/admin` | Create events | Authenticated |
| `/profile` | User profile | Authenticated |
| `/auth/callback` | Auth redirect | Auth flow |

---

## 🔐 Authentication Flow

1. User clicks "Sign In"
2. Firebase auth modal opens
3. User signs in (email/password or social)
4. Redirected to `/auth/callback`
5. Token stored in Firebase
6. Redirected to `/feed`
7. Token sent with API requests as Bearer token

---

## 🧪 Testing the App

### Test Workflow:
1. Sign up with test email
2. Browse events in feed
3. Upvote an event
4. Add a comment
5. Save event to calendar
6. View profile - should show saved event
7. Sign in as another user - comments visible
8. Toggle theme - preference persists
9. Go to admin - create new event
10. Refresh feed - new event visible

---

## 📊 Database Schema

### Events
```javascript
{
  title: String,
  description: String,
  dateTime: Date,
  location: String,
  organizationId: ObjectId,
  authorId: ObjectId,
  capacity: Number,
  isPublished: Boolean,
  upvoteCount: Number,
  commentCount: Number
}
```

### EventUpvotes
```javascript
{
  eventId: ObjectId,
  userId: ObjectId,
  createdAt: Date
}
```

### EventComments
```javascript
{
  eventId: ObjectId,
  userId: ObjectId,
  text: String,
  createdAt: Date
}
```

### CalendarSaves
```javascript
{
  eventId: ObjectId,
  userId: ObjectId,
  createdAt: Date
}
```

### Notifications
```javascript
{
  userId: ObjectId,
  type: String,
  message: String,
  eventId: ObjectId,
  read: Boolean,
  createdAt: Date
}
```

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Backend connection issues
```bash
# Check MongoDB is running
# Verify connection string in .env
# Check port 3001 is available
lsof -i :3001  # Linux/Mac
netstat -ano | findstr :3001  # Windows
```

### Firebase auth errors
- Verify Firebase project setup
- Check credentials in `.env.local`
- Ensure redirect URLs configured in Firebase
- Check CORS settings in backend

### API errors
- Check backend is running
- Verify VITE_API_URL points to correct server
- Check network tab in DevTools
- Ensure Bearer token in Authorization header

---

## 📝 API Documentation

### Authentication Header
All authenticated requests require:
```
Authorization: Bearer <firebase_id_token>
```

### Common Response Format
```javascript
// Success
{
  data: {...},
  message: "Success"
}

// Error
{
  error: "Error message",
  status: 400
}
```

---

## 🎨 Customization

### Change Brand Color
Edit `tailwind.config.js`:
```javascript
primary: 'your-color',
accent: 'your-color'
```

### Change Application Name
Update:
- `src/pages/_components/Header.tsx` - "Loredrop" text
- `index.html` - Browser tab title
- `convex.json` - App name

### Change Theme Colors
Edit CSS variables in stylesheet or use Tailwind config

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Hamburger menu on mobile
- ✅ Responsive tables and lists
- ✅ Touch-friendly buttons
- ✅ Optimized layouts

---

## 🚀 Deployment

### Frontend (Vercel, Netlify, etc.)
```bash
pnpm run build
# Deploy dist/ folder
```

### Backend (Heroku, Railway, Digital Ocean, etc.)
```bash
cd backend
pnpm run build
# Deploy with Node.js runtime
```

**Environment variables needed on production:**
- MONGODB_URI (Production Atlas instance)
- Firebase credentials
- CLIENT_URL (Frontend URL)
- NODE_ENV=production

---

## 📞 Support

For issues or questions:
1. Check error messages in console
2. Review API response in Network tab
3. Check MongoDB connection
4. Verify Firebase setup
5. Review browser console for JavaScript errors

---

**Last Updated**: February 1, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
