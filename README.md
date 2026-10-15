# CareerTrack — Job Application Tracker (MERN)

CareerTrack is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to track and manage job applications throughout every stage of the hiring pipeline.

## 🚀 Features

- **Dashboard Overview**: Key metrics (Total, Applied, Interviews, Offers), upcoming interviews, and recent applications.
- **Multi-Page Pipeline**:
  - `/dashboard`: Comprehensive workspace summary.
  - `/applications`: All applications with search, status filtering, and sorting.
  - `/applied`: Applications currently awaiting recruiter response.
  - `/interviews`: Scheduled interviews clearly distinguishing upcoming vs. past rounds.
  - `/offers`: Received offers with compensation benchmarks and package summaries.
  - `/rejected`: Archived applications with feedback and learnings.
- **Interactive Modals**: Add and edit applications with automatic pre-population and validation.
- **Teal & Mint Aesthetic**: Modern, accessible UI with mobile drawer navigation and toast feedback.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router 7, Axios, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)

### 1. Backend Setup

```bash
cd backend
npm install
# Ensure .env exists with:
# PORT=3000
# MONGO_URI=mongodb://127.0.0.1:27017/jobtracker
npm run dev
```

The backend server runs on `http://localhost:3000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend app runs on `http://localhost:5173`.
