# 🚗 TENLEA — Monetize & Rent Parking Spaces

> **TENLEA** is a peer-to-peer marketplace connecting landowners with unused parking or land spaces with vehicle owners seeking safe, affordable temporary or long-term parking across India.

---

## 🌟 Key Features

- **🏠 Landowner / Host Portal**: List unused land or parking slots with custom pricing, amenities, images, and availability.
- **🚘 Vehicle Owner / Guest Portal**: Search, filter, and book parking spaces nearby with real-time slot availability.
- **🔒 Secure Authentication & KYC**: JWT-based authentication with role-based access control (User, Host, Admin) and KYC verification.
- **📄 Digital Rental Agreements**: Auto-generated legal agreements between space providers and renters.
- **💳 Payments & Payouts**: Secure payment gateway integration with transaction logs and payout tracking.
- **⭐ Reviews & Ratings**: Rate and review host spaces and guest experiences.
- **🚨 Dispute Management**: Dedicated support flow for resolution of booking or space issues.
- **🔔 Real-time Notifications**: Updates on booking status, payment receipts, and security alerts.

---

## 🏗 Project Architecture

```text
Tenlea/
├── frontend/                   # Frontend Web Application (React + Vite + Tailwind CSS)
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── assets/             # Brand logos & icons
│   │   ├── components/         # Reusable UI components & layouts
│   │   ├── context/            # Auth & Global application state
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Page shell layouts
│   │   ├── pages/              # Public, Host, Renter & Admin views
│   │   ├── routes/             # App routing configuration
│   │   ├── services/           # Axios HTTP client & API endpoints
│   │   ├── utils/              # Formatter & helper functions
│   │   ├── App.jsx             # Root App component
│   │   ├── index.css           # Tailwind CSS & global styles
│   │   └── main.jsx            # Application entry point
│   ├── .env.example            # Sample frontend environment config
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies & scripts
│   ├── postcss.config.js       # PostCSS config for Tailwind
│   ├── tailwind.config.js      # Tailwind design system configuration
│   └── vite.config.js          # Vite build tool setup
│
├── backend/                    # Backend REST API Server (Node.js + Express + MongoDB)
│   ├── config/                 # Database connection setup
│   ├── controllers/            # Request handlers & controller logic
│   ├── middleware/             # Auth, error handling, rate limiting & upload middleware
│   ├── models/                 # Mongoose schemas (User, Land, Booking, Payment, etc.)
│   ├── routes/                 # Express API routing tables
│   ├── services/               # Core business services
│   ├── uploads/                # Local file storage for images & documents
│   ├── utils/                  # Utility helpers & validators
│   ├── .env.example            # Sample backend environment config
│   ├── package.json            # Backend dependencies & scripts
│   └── server.js               # Express API entry server
│
├── package.json                # Root package configuration & script runner
├── start.js                    # Concurrent frontend & backend launcher script
└── README.md                   # Project documentation
```

---

## ⚡ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Router v6, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose ORM |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt, Helmet.js, Express Rate Limit |
| **File Handling** | Multer |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance running at `mongodb://localhost:27017` OR MongoDB Atlas connection string.

---

### Option A: Run Full Stack Simultaneously (Recommended)

From the root project directory:

```bash
# Install dependencies in all packages
npm install
npm --prefix backend install
npm --prefix frontend install

# Start both backend and frontend concurrently
npm start
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000`

---

### Option B: Run Services Separately

#### 1. Start Backend Server (`/backend`)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### 2. Start Frontend App (`/frontend`)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🔑 Environment Variables Setup

### Backend Environment (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/tenlea_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend Environment (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 📄 License

© 2026 TENLEA PVT. LTD. All Rights Reserved. | Made in India
