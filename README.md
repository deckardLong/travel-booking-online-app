# Travel Booking Online App

A comprehensive mobile and web travel booking application built with React Native, Expo, and Firebase. This application enables users to discover, search, and book travel packages seamlessly across multiple platforms.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Firebase Configuration](#firebase-configuration)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)

---

## Overview

Travel Booking Online App is a full-stack application designed to provide a seamless travel booking experience. The system consists of three main components:

- **Mobile Application** (`etravelmobileapp`): React Native/Expo-based cross-platform mobile app
- **Backend APIs** (`etravelbookingapis`): Python Django REST API for travel packages and bookings
- **Firebase Backend**: Real-time database, authentication, and cloud functions

---

## Tech Stack

### Frontend (Mobile)
- **React Native** (v0.81.5) - Cross-platform mobile framework
- **Expo** (v54.0.34) - Development platform and services
- **React Navigation** (v7.x) - Navigation solution
- **React Native Paper** (v5.15.1) - UI Component library
- **Axios** (v1.15.0) - HTTP client
- **Firebase** (v12.12.1) - Authentication, Firestore, Realtime Database

### Backend (APIs)
- **Django** - Web framework
- **Firebase Admin SDK** (v13.6.0) - Firebase management
- **Firebase Functions** (v7.0.0) - Serverless functions
- **Express.js** (v5.2.1) - Web server for functions
- **Google Genkit** (v1.33.0) - AI/ML integration
- **Python 3.x** - Backend logic

### Database & Storage
- **Firebase Realtime Database** - Real-time data synchronization
- **Firestore** - Document-based database
- **Firebase Storage** - File/image storage
- **Firebase Authentication** - User authentication & authorization

### Tools & DevOps
- **TypeScript** - Type safety
- **Node.js** (v24) - JavaScript runtime
- **ESLint** - Code linting
- **Firebase CLI** - Firebase project management

---

## Project Structure

```
travel-booking-online-app/
├── etravelmobileapp/              # Mobile application (React Native/Expo)
│   ├── src/
│   │   ├── dataconnect-generated/ # Firebase DataConnect SDK (auto-generated)
│   │   ├── features/              # Feature modules (authentication, search, booking, etc.)
│   │   ├── components/            # Reusable UI components
│   │   ├── styles/                # Global styles and themes
│   │   └── utils/                 # Utility functions and helpers
│   ├── configs/                   # Configuration files (firebase.js, constants)
│   ├── assets/                    # Images, fonts, and static assets
│   ├── functions/                 # Cloud functions (if applicable)
│   ├── App.js                     # Root component
│   ├── app.json                   # Expo configuration
│   ├── firestore.rules            # Firestore security rules
│   ├── firestore.indexes.json     # Firestore index configurations
│   └── package.json               # Dependencies and scripts
│
├── etravelbookingapis/            # Django REST API backend
│   ├── etravelbookingapis/        # Django project settings
│   ├── travels/                   # Django app for travel packages and bookings
│   ├── manage.py                  # Django management script
│   ├── requirements.txt           # Python dependencies
│   └── db.sqlite3                 # SQLite database (development)
│
└── README.md                      # This file
```

---

## Features

### Mobile Application Features
- 🔐 **User Authentication** - Sign up, login, and password reset via Firebase Auth
- 🔍 **Travel Package Search** - Browse and search travel packages with filters
- 📍 **Destination Discovery** - Explore popular destinations with detailed information
- 📅 **Booking Management** - Create, view, and manage travel bookings
- 💬 **Chat/Messaging** - Real-time chat with support team (react-native-gifted-chat)
- 📊 **Analytics Dashboard** - View booking statistics and trends
- 📸 **Image Picker** - Upload travel photos during booking process
- 🗺️ **Map Integration** - Location-based features and destination mapping
- 🏨 **Hotel & Flight Search** - Integrated travel package search
- 💳 **Payment Integration** - Secure booking transactions
- ⭐ **Reviews & Ratings** - User reviews and destination ratings
- 📱 **Responsive Design** - Works seamlessly on iOS, Android, and Web

### Backend Features
- 🔄 **RESTful API** - Comprehensive API for travel packages, bookings, and users
- 🔒 **Security** - Firestore security rules and authentication middleware
- 🔔 **Real-time Updates** - Firebase Realtime Database for live data synchronization
- 📧 **Notifications** - Cloud Functions for email and push notifications
- 📈 **Scalable Architecture** - Built for growth and high availability
- 🗂️ **Database Indexing** - Optimized Firestore indexes for fast queries
- 🔐 **Role-Based Access Control** - User roles and permissions management

---

## Installation & Setup

### Prerequisites
- **Node.js** (v18+) and npm
- **Python** (v3.8+) and pip
- **Firebase Project** - Create one at [Firebase Console](https://console.firebase.google.com)
- **Expo CLI** - `npm install -g expo-cli`
- **Firebase CLI** - `npm install -g firebase-tools`

### Mobile Application Setup

```bash
# Navigate to mobile app directory
cd etravelmobileapp

# Install dependencies
npm install

# Create firebase.js configuration (see Firebase Configuration section)
# Create src/configs/firebase.js file with your Firebase credentials

# Start the development server
npm start

# Run on specific platform
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser
```

### Backend API Setup

```bash
# Navigate to Django project
cd etravelbookingapis

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run migrations (if applicable)
python manage.py migrate

# Start development server
python manage.py runserver
```

### Firebase Functions Setup

```bash
# Navigate to Firebase functions directory
cd etravelmobileapp/functions

# Install dependencies
npm install

# Build TypeScript
npm run build

# Deploy functions
npm run deploy

# Run locally (testing)
npm run serve
```

---

## Firebase Configuration

### Important: firebase.js Configuration File

**The `firebase.js` file is NOT included in the repository for security reasons.**

You must create this file manually in `etravelmobileapp/src/configs/firebase.js` using your Firebase project credentials:

```javascript
// src/configs/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Get your config from Firebase Console: Project Settings > Add App > Web
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  // Realtime Database URL (required for this app)
  databaseURL: 'https://your-project.firebaseio.com',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app);           // Realtime Database
export const firestore = getFirestore(app);   // Firestore (if using both)
export const storage = getStorage(app);       // Storage for images/files

export default app;
```

### Steps to Get Your Firebase Credentials:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Project Settings** (gear icon)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key** to get service account credentials
6. Copy the configuration to `firebase.js`

### Firebase Services Configuration:

Enable these services in your Firebase project:

- ✅ **Authentication** - Enable Email/Password and Social login methods
- ✅ **Realtime Database** - Create a database in your region
- ✅ **Firestore** - Create a Firestore database for document storage
- ✅ **Storage** - Enable Cloud Storage for images/files
- ✅ **Cloud Functions** - Deploy backend functions

---

## API Endpoints

### Base URLs
- **Mobile App Firebase**: `https://your-project.firebaseio.com`
- **Django Backend**: `http://localhost:8000/api/`
- **Firebase Cloud Functions**: `https://region-your-project.cloudfunctions.net`

### Authentication Endpoints (Firebase Auth)
```
POST   /auth/signup           - Register new user
POST   /auth/login            - Login user
POST   /auth/logout           - Logout user
POST   /auth/password-reset   - Reset password
POST   /auth/verify-email     - Verify email address
GET    /auth/user             - Get current user profile
```

### Travel Package Endpoints (Django API)
```
GET    /api/packages/                    - List all travel packages
GET    /api/packages/<id>/               - Get package details
POST   /api/packages/                    - Create new package (admin only)
PUT    /api/packages/<id>/               - Update package (admin only)
DELETE /api/packages/<id>/               - Delete package (admin only)

GET    /api/destinations/                - List all destinations
GET    /api/destinations/<id>/           - Get destination details
GET    /api/destinations/search/         - Search destinations
POST   /api/destinations/                - Create destination (admin only)
```

### Booking Endpoints (Django API)
```
GET    /api/bookings/                    - List user's bookings
POST   /api/bookings/                    - Create new booking
GET    /api/bookings/<id>/               - Get booking details
PUT    /api/bookings/<id>/               - Update booking
DELETE /api/bookings/<id>/               - Cancel booking
POST   /api/bookings/<id>/confirm/       - Confirm booking
GET    /api/bookings/<id>/invoice/       - Get booking invoice
```

### User Endpoints (Firebase + Django)
```
GET    /api/users/<id>/profile/          - Get user profile
PUT    /api/users/<id>/profile/          - Update user profile
POST   /api/users/<id>/avatar/           - Upload user avatar
GET    /api/users/<id>/bookings/         - Get user booking history
POST   /api/users/<id>/wishlist/         - Add to wishlist
DELETE /api/users/<id>/wishlist/<pkg>/   - Remove from wishlist
GET    /api/users/<id>/reviews/          - Get user reviews
```

### Search & Filter Endpoints
```
GET    /api/packages/search?destination=<dest>&date_from=<date>&date_to=<date>&price_min=<min>&price_max=<max>
GET    /api/packages/filter?category=<cat>&rating=<rate>&page=<page>
GET    /api/destinations/trending/       - Get trending destinations
GET    /api/packages/featured/           - Get featured packages
```

### Review & Rating Endpoints
```
GET    /api/packages/<id>/reviews/       - Get package reviews
POST   /api/packages/<id>/reviews/       - Add review
GET    /api/destinations/<id>/ratings/   - Get destination ratings
POST   /api/destinations/<id>/ratings/   - Add rating
```

### Payment Endpoints
```
POST   /api/payments/create-intent/      - Create payment intent
POST   /api/payments/confirm/            - Confirm payment
GET    /api/payments/<booking_id>/status - Check payment status
POST   /api/payments/refund/             - Process refund
```

### Chat & Support Endpoints
```
GET    /api/chats/                       - Get chat conversations
POST   /api/chats/                       - Start new chat
GET    /api/chats/<id>/messages/         - Get chat messages
POST   /api/chats/<id>/messages/         - Send message
POST   /api/support/tickets/             - Create support ticket
GET    /api/support/tickets/<id>/        - Get ticket details
```

### Admin Endpoints
```
GET    /api/admin/dashboard/             - Admin dashboard stats
GET    /api/admin/users/                 - List all users
GET    /api/admin/bookings/              - List all bookings
GET    /api/admin/reports/               - Generate reports
POST   /api/admin/config/                - Update app configuration
```

### Query Parameters
```
?page=<number>           - Pagination (default: 1)
?limit=<number>          - Items per page (default: 20)
?sort=<field>            - Sort by field (ascending)
?sort=-<field>           - Sort by field (descending)
?search=<query>          - Full-text search
?filter[field]=<value>   - Filter by field
```

---

## Database Schema

### Firebase Realtime Database Structure

```
/
├── users/
│   └── {userId}/
│       ├── profile/
│       │   ├── email: string
│       │   ├── firstName: string
│       │   ├── lastName: string
│       │   ├── phone: string
│       │   ├── avatar: string (URL)
│       │   └── createdAt: timestamp
│       ├── bookings/
│       │   └── {bookingId}: boolean
│       ├── wishlist/
│       │   └── {packageId}: boolean
│       └── preferences/
│           ├── theme: string
│           ├── language: string
│           └── notifications: boolean
│
├── packages/
│   └── {packageId}/
│       ├── title: string
│       ├── description: string
│       ├── destination: string
│       ├── price: number
│       ├── currency: string
│       ├── duration: number (days)
│       ├── images: string[] (URLs)
│       ├── category: string
│       ├── rating: number
│       ├── reviews: number
│       ├── availability: boolean
│       ├── startDate: timestamp
│       ├── endDate: timestamp
│       ├── maxParticipants: number
│       ├── currentParticipants: number
│       └── createdAt: timestamp
│
├── bookings/
│   └── {bookingId}/
│       ├── userId: string
│       ├── packageId: string
│       ├── status: string (pending, confirmed, cancelled)
│       ├── numberOfPeople: number
│       ├── totalPrice: number
│       ├── paymentStatus: string
│       ├── checkInDate: timestamp
│       ├── checkOutDate: timestamp
│       ├── specialRequests: string
│       ├── confirmationNumber: string
│       └── createdAt: timestamp
│
├── destinations/
│   └── {destinationId}/
│       ├── name: string
│       ├── description: string
│       ├── country: string
│       ├── region: string
│       ├── coordinates: {lat, lng}
│       ├── image: string (URL)
│       ├── rating: number
│       ├── reviews: number
│       ├── popularFor: string[]
│       └── highlights: string[]
│
├── reviews/
│   └── {packageId}/
│       └── {reviewId}/
│           ├── userId: string
│           ├── rating: number (1-5)
│           ├── comment: string
│           ├── images: string[]
│           ├── helpful: number
│           └── createdAt: timestamp
│
└── chats/
    └── {chatId}/
        ├── participants: string[]
        ├── lastMessage: string
        ├── lastMessageTime: timestamp
        └── messages/
            └── {messageId}/
                ├── userId: string
                ├── text: string
                ├── timestamp: timestamp
                └── read: boolean
```

### Firestore Collections (Alternative/Complementary)

```
users/
├── Documents: {userId}
│   ├── email: string
│   ├── profile: {firstName, lastName, phone, avatar}
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp

packages/
├── Documents: {packageId}
│   ├── title: string
│   ├── destination: reference to destinations/
│   ├── price: number
│   ├── availability: boolean
│   └── ... (similar to Realtime DB)

bookings/
├── Documents: {bookingId}
│   ├── userId: reference to users/
│   ├── packageId: reference to packages/
│   ├── status: string
│   ├── dates: {startDate, endDate}
│   └── ...

reviews/ (Subcollection under packages)
├── Subcollection of packages/{packageId}/reviews
│   └── Documents: {reviewId}
│       ├── userId: reference to users/
│       ├── rating: number
│       ├── comment: string
│       └── createdAt: Timestamp
```

---

## Environment Variables

### Mobile App (`.env` or Expo constants)

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api
EXPO_PUBLIC_API_TIMEOUT=10000

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### Django Backend (`.env`)

```env
# Django Settings
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email@your-project.iam.gserviceaccount.com

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password

# Payment Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key

# AWS S3 (if using)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_STORAGE_BUCKET_NAME=your_bucket_name
```

### Firebase Functions (`.env.local`)

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email@your-project.iam.gserviceaccount.com
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## Running the Application

### Development Mode

```bash
# Mobile App
cd etravelmobileapp
npm start

# Django Backend
cd etravelbookingapis
python manage.py runserver

# Firebase Functions (in separate terminal)
cd etravelmobileapp/functions
npm run serve
```

### Production Deployment

```bash
# Build and deploy Firebase Functions
cd etravelmobileapp/functions
npm run build
firebase deploy --only functions

# Build for mobile platforms
expo build:android
expo build:ios

# Deploy Django to Heroku/Cloud Run
heroku login
heroku create your-app-name
git push heroku main
```

---

## Development Guidelines

### Code Style
- Use **ESLint** for linting: `npm run lint`
- Follow **Airbnb JavaScript Style Guide**
- Use **TypeScript** for type safety
- Components should be functional with React Hooks

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Testing
```bash
# Run tests (if configured)
npm test

# Run with coverage
npm test -- --coverage
```

### Best Practices
- ✅ Keep components small and reusable
- ✅ Use Firebase security rules for database access
- ✅ Implement error handling and loading states
- ✅ Optimize images before uploading
- ✅ Use environment variables for sensitive data
- ✅ Document complex logic with comments
- ✅ Follow DRY (Don't Repeat Yourself) principle
- ✅ Test API endpoints thoroughly
- ✅ Use pagination for large datasets
- ✅ Implement proper authentication checks

---

## Security Best Practices

### Firebase Security Rules
- Configure proper Firestore and Realtime Database rules
- Never allow public read/write access
- Implement role-based access control
- Enable Firebase Authentication
- Use SSL/TLS for all communications

### Backend Security
- Never hardcode API keys or secrets
- Use environment variables for sensitive data
- Implement rate limiting on API endpoints
- Validate all user inputs server-side
- Use HTTPS only in production
- Implement CORS properly

### Mobile App Security
- Never store sensitive data in plain text
- Use secure storage for tokens (AsyncStorage with encryption)
- Implement certificate pinning for API calls
- Validate SSL certificates

---

## Troubleshooting

### Common Issues

**Firebase initialization error:**
- Ensure `firebase.js` is created in `src/configs/`
- Verify all Firebase credentials are correct
- Check Firebase project has Realtime Database enabled

**Expo build issues:**
```bash
# Clear cache and rebuild
expo start --clear
```

**Django database error:**
```bash
# Reset migrations
python manage.py migrate zero
python manage.py migrate
```

**Package installation issues:**
```bash
# Clear npm cache
npm cache clean --force
npm install
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is open source and available under the MIT License.

---

## Support & Contact

For questions or issues:
- 📧 Email: support@travelbookingapp.com
- 🐛 Report bugs on GitHub Issues
- 💬 Join our community discussions
- 📖 Check our documentation wiki

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Core booking functionality
- User authentication
- Real-time database integration
- Chat support system
- Payment processing

---

## Roadmap

- 🚀 AI-powered travel recommendations
- 🏆 Loyalty rewards program
- 🌍 Multi-language support
- 📱 Progressive Web App (PWA)
- 🔔 Advanced push notifications
- 🎯 Social features and referrals
- 📊 Advanced analytics dashboard

---

**Last Updated:** May 13, 2026

**Maintained by:** deckardLong

For the latest information, visit our [GitHub repository](https://github.com/deckardLong/travel-booking-online-app)
