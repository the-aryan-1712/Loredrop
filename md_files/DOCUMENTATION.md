# Loredrop - Comprehensive Documentation

*A campus event management platform built with React + TypeScript frontend and Node.js + MongoDB backend.*

---

## 🏗️ 1. Project Overview & Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│              FIREBASE AUTHENTICATION LAYER                   │
│  • Email/Password & Social Authentication                    │
│  • JWT Token Management & Session Persistence                │
└─────────────────────────────────────────────────────────────┘
         ▲                                    ▲
         │ Bearer Token                       │ Firebase Config
┌────────┴──────────────┐          ┌────────┴──────────────┐
│   FRONTEND (React)    │          │  BACKEND (Node.js)    │
│   Port: 5173          │◄────────►│  Port: 3001           │
└──────────┬────────────┘   REST   └──────┬────────────────┘
           │                               │
           └─ Event Polling         ┌──────▼────────────┐
              (10s interval)        │  MONGODB (Port:   │
                                    │  27017 / Atlas)   │
                                    └───────────────────┘
```

### Technology Stack
**Frontend:** React 19, TypeScript, Vite, React Router, Tailwind CSS, Shadcn UI, next-themes, Sonner
**Backend:** Node.js, Express.js, TypeScript, MongoDB + Mongoose, CORS
**Auth & Services:** Firebase Authentication, Google SMTP (for email verification)

### Directory Structure
- **`frontend/`**: Vite + React frontend workspace.
- **`backend/`**: Express + TypeScript backend workspace.

---

## 🚀 2. Quick Start & Setup Guide

### Prerequisites
- Node.js 18+
- MongoDB local instance or Atlas connection
- pnpm (or npm)

### Installation
```bash
# Install dependencies for both packages (pnpm workspace)
pnpm install

# Backend dependencies
cd backend && pnpm install && cd ..
```

### Environment Variables
**1. Frontend (`frontend/.env.local`)**
```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CONVEX_URL=http://localhost:3000
```

**2. Backend (`backend/.env`)**
```env
# Database & Server
MONGODB_URI=mongodb://localhost:27017/loredrop
PORT=3001
CLIENT_URL=http://localhost:5173

# Firebase Admin SDK (Service Account)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...

# Email Configuration (for OTP verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=16-digit-app-password
EMAIL_FROM=your-email@gmail.com
NODE_ENV=development
```

### Running the App
```bash
# Start MongoDB (if using local)
mongod

# Run development servers in parallel from project root
pnpm run dev

# Or separately:
# Terminal 1: cd frontend && pnpm dev (Runs on http://localhost:5173)
# Terminal 2: cd backend && pnpm dev (Runs on http://localhost:3001)
```

---

## ✨ 3. Features & User Workflows

### Core User Features
- **Theme Toggle**: Light/Dark mode via `next-themes` saved to localStorage.
- **Real-Time Event Feed**: Polling mechanism (every 10s) keeps the feed, upvotes, and comments updated. Includes pagination and organization filters.
- **Event Interactions**: Upvote (❤️), Comment (💬), and Save to Calendar (📅).
- **Notifications**: Real-time notification bell with unread badge (caps at 9+), history, and read status.
- **User Profile**: View user information and a structured list of calendar-saved events.

### Admin Dashboard (`/admin`)
- Accessible to Organization Admins.
- Create new events (Title, Description, Location, Date/Time, Capacity, Organization).
- Events are instantly published to the feed.
- View and track engagement for all organization events.

### Routing
- `/` - Landing page
- `/feed` - Main event feed (some public content)
- `/calendar` - Saved events calendar (Auth required)
- `/admin` - Organization admin dashboard (Auth + Admin required)
- `/profile` - User profile page (Auth required)
- `/auth/callback` - Authentication callback route

---

## 🔐 4. Authentication & Security

### Firebase Migration (Replacing Hercules/Convex Auth)
The app integrates Firebase Authentication for seamless login flows:
- Uses Google Sign-In popup rather than heavy redirects.
- Firebase handles token creation, lifecycle, and auto-refresh.
- Client passes the Firebase ID token in the `Authorization: Bearer <token>` header for all API calls.
- Backend verifies the token using the Firebase Admin SDK middleware.

### IITK Email Verification Flow
To ensure restricted access to IITK community members, a strict 3-step verification flow is implemented:
1. **Email Entry**: User enters an `@iitk.ac.in` email on `/auth/verify-email`.
2. **Google Sign-In**: User authenticates with the exact corresponding Google account.
3. **OTP Verification**: A 6-digit verification code is sent via SMTP to the entered email. The user must input this code to proceed.
   - *Dev Mode Note*: If SMTP fails or during testing, the 6-digit OTP is logged to the backend console.

### Security Rules
- Frontend route guards prevent unauthenticated access to `/feed`, `/admin`, and `/profile`.
- Backend middleware verifies the Bearer token and checks user permissions before mutating data.
- OTPs are single-use, expire in 15 minutes, and are completely managed server-side.

---

## 🗄️ 5. Backend API & Database Schema

### API Structure (`/api`)
- **Events (`/events`)**: GET /feed, GET /upcoming, POST /, GET /by-organization/:orgId
- **Interactions (`/interactions`)**:
  - Upvotes: POST /upvote/:eventId, GET /upvote/:eventId/check
  - Comments: POST /comments/:eventId, GET /comments/:eventId
  - Calendar Saves: POST /calendar/:eventId, GET /calendar/saved/all
  - Notifications: GET /notifications, PATCH /notifications/:id/read
- **Organizations (`/organizations`)**: GET /, GET /:slug
- **Auth (`/auth`)**: POST /send-verification-code, POST /verify-code

### Document Schemas (Mongoose)
1. **Users**: `_id, email, displayName, avatar, metadata`
2. **Organizations**: `_id, name, slug, description, logo, members`
3. **Events**: `_id, title, description, location, dateTime, organizationId, authorId, capacity, isPublished, upvoteCount, commentCount`
4. **EventUpvotes**: `_id, eventId, userId, createdAt`
5. **EventComments**: `_id, eventId, userId, text, createdAt`
6. **CalendarSaves**: `_id, eventId, userId, createdAt`
7. **Notifications**: `_id, userId, type, message, eventId, read, createdAt`

*(Note: Appropriate indexes exist for performance, such as `{ organizationId, dateTime }` on Events).*

---

## 🐛 6. Troubleshooting & Development Notes

### Common Issues
- **`auth/configuration-not-found`**: Google Sign-In is not enabled in the Firebase Console.
- **Login Button Doesn't Work**: Ensure your `frontend/.env.local` contains all Firebase variables and `localhost:5173` is added to Authorized Domains in Firebase.
- **SMTP Auth Failed**: Check your Gmail 16-character app password and ensure 2FA is enabled. Remove any spaces when copying the password.
- **"Failed to fetch" on DB**: Check if `mongod` is running and `MONGODB_URI` is correctly set in `backend/.env`.

### Production Deployment
**Frontend (Vercel/Netlify):**
```bash
pnpm run build # Deploys the dist/ folder
```
**Backend (Heroku/Railway/Render):**
```bash
cd backend && pnpm run build
```
Ensure you update `VITE_API_URL` on the frontend, and provide production variations of `MONGODB_URI`, `CLIENT_URL`, and SMTP credentials on the backend.
