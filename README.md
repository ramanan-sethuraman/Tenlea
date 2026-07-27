# TENLEA — Monetize Your Space

> A trusted marketplace connecting landowners with unused parking/land space and vehicle owners looking for safe temporary parking in India.

---

## 🏗 Project Architecture

```
Tenlea2/
├── client/                     # Frontend Application (React + Vite + Tailwind CSS)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/         # Common, Layout, & Home components
│   │   ├── context/            # React Auth & Global context
│   │   ├── hooks/              # Custom hooks
│   │   ├── layouts/            # Page layouts
│   │   ├── pages/              # Public & Dashboard pages
│   │   ├── routes/             # App routing configuration
│   │   ├── services/           # Axios API client
│   │   ├── utils/              # Helper functions
│   │   ├── App.jsx             # Main Router component
│   │   ├── index.css           # Global Tailwind CSS styles
│   │   └── main.jsx            # React DOM entry point
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend API (Node.js + Express + MongoDB)
│   ├── config/                 # DB connection configuration
│   ├── controllers/            # API request logic
│   ├── middleware/             # Auth, error, & upload middlewares
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express API routes
│   ├── services/               # Business logic
│   ├── uploads/                # Local file storage
│   ├── utils/                  # Helper utilities
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express entry server
│
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance running at `mongodb://localhost:27017` OR MongoDB Atlas connection string.

---

### 1. Backend Setup (`/server`)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start backend server
npm run dev
```

The Express API server will start on `http://localhost:5000`.

---

### 2. Frontend Setup (`/client`)

```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start Vite dev server
npm run dev
```

The React frontend web application will start on `http://localhost:3000`.

---

## 🔑 Environment Variables Setup

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/tenlea_db
JWT_SECRET=tenlea_super_secret_jwt_key_2026_production_ready
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=demo_key_id
RAZORPAY_KEY_SECRET=demo_key_secret
```

### Client (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 🛡 License
© 2026 TENLEA PVT. LTD. All Rights Reserved. | Made in India
