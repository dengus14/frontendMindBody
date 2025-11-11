# Mind & Body Fitness Tracker - Frontend

A React TypeScript web application for tracking workouts, earning achievement badges, completing fitness challenges, and competing on leaderboards. Provides an intuitive interface for logging PUSH/PULL/LEGS workouts with real-time streak tracking and gamification features.

## Tech Stack

- React 18 | TypeScript | Axios | React Router | CSS3 | JWT Authentication

## Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running (see [backend repository](https://github.com/yourusername/backend-mind-body))

## Local Setup

1. **Clone and navigate to project**
```bash
git clone https://github.com/yourusername/frontend-mind-body.git
cd frontend-mind-body/front-mind-body
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

Application will be available at `http://localhost:3000`

## Backend Integration

Ensure the backend API is running on `http://localhost:8080`. API configuration in [`src/services/api.ts`](src/services/api.ts):

```typescript
baseURL: 'http://localhost:8080/api'
```

JWT tokens are automatically attached to requests via Axios interceptors.

## Configuration

Update API base URL if backend runs on different port:
```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: 'http://localhost:YOUR_PORT/api'
});
```

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Features

- 🔐 User authentication (register/login)
- 💪 Workout logging with duration and notes
- 🏆 Achievement badge system with progress tracking
- 🎯 Daily and weekly challenges
- 📊 Workout history and statistics
- 🔥 Streak counter and longest streak tracking
- 🏅 Leaderboard with top users
