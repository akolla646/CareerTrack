# CareerTrack — Job Application Tracker (MERN)

CareerTrack is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to track and manage job applications throughout every stage of the hiring pipeline.

---

## 🚀 Features

- **Dashboard Overview**: Key metrics (Total Applications, Applied, Interviews, Offers), upcoming interviews with date countdowns, and recent applications list.
- **Multi-Page Pipeline**:
  - `/dashboard`: Comprehensive workspace summary.
  - `/applications`: View and manage all applications with search, status filtering, and sorting.
  - `/applied`: Track applications submitted that are awaiting recruiter response.
  - `/interviews`: Manage interview rounds, prep notes, with upcoming vs. past tabs and sorting by interview date.
  - `/offers`: Celebrate offers received, review top package compensation, and negotiation notes.
  - `/rejected`: Archived applications with feedback and interview learnings.
- **Interactive Modals**: Add and edit applications with automatic form pre-population, field validation, and keyboard support.
- **Responsive Teal & Mint Design**: Modern, professional UI with mobile drawer navigation, accessible states, and instant toast notifications.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router 7, Axios, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express.js 5, Mongoose 9
- **Database**: MongoDB (Local Community Server / MongoDB Atlas Cloud)
- **Testing**: Node.js Built-in Test Runner (`node:test`, `node:assert`)

---

## 📁 Project Structure

```text
job-tracker/
├── backend/
│   ├── models/
│   │   └── Application.js          # Mongoose schema and model
│   ├── test/
│   │   ├── api.test.js             # Automated API test suite (10 tests)
│   │   └── CareerTrack_API_Postman_Collection.json  # Postman/Thunder Client export
│   ├── .env.example                # Template for environment variables
│   ├── package.json
│   └── server.js                   # Express server and REST API endpoints
├── frontend/
│   ├── public/                     # Static assets and icons
│   ├── src/
│   │   ├── api/
│   │   │   └── applications.js     # Axios API service client
│   │   ├── components/
│   │   │   ├── ApplicationForm.jsx # Add / Edit application modal dialog
│   │   │   ├── ApplicationsTable.jsx # Reusable data table with actions
│   │   │   ├── EmptyState.jsx      # Clean empty states with action triggers
│   │   │   ├── Sidebar.jsx         # Responsive sidebar navigation with active badges
│   │   │   ├── StatCard.jsx        # Dashboard metric cards
│   │   │   └── Toast.jsx           # Floating notification banners
│   │   ├── context/
│   │   │   ├── AppContext.jsx      # Application state, stats & modal manager
│   │   │   ├── AppContextDefinition.js
│   │   │   └── useApp.js           # Custom hook for context consumption
│   │   ├── pages/
│   │   │   ├── AllApplications.jsx # /applications page
│   │   │   ├── AppliedPage.jsx     # /applied page
│   │   │   ├── Dashboard.jsx       # /dashboard page
│   │   │   ├── InterviewsPage.jsx  # /interviews page
│   │   │   ├── OffersPage.jsx      # /offers page
│   │   │   └── RejectedPage.jsx    # /rejected page
│   │   ├── App.css                 # Theme styles, mobile drawer, responsive grid
│   │   ├── App.jsx                 # Client-side routing and shell layout
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vercel.json                 # SPA rewrites for Vercel deployment
│   └── vite.config.js
└── README.md
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check endpoint | — |
| `GET` | `/api/applications/stats` | Aggregated statistics | Returns counts for Total, Applied, Interview, Offer, Rejected |
| `GET` | `/api/applications` | List applications | `?status=Interview`, `?search=Google` |
| `POST` | `/api/applications` | Create a new application | JSON body: `{ company, role, jobLink, salaryExpectation, status, applicationDate, interviewDate, notes }` |
| `PUT` | `/api/applications/:id` | Update application details | JSON body with fields to update |
| `DELETE` | `/api/applications/:id` | Delete an application | Path parameter `id` |

---

## 📦 Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (or copy from `.env.example`):

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/jobtracker
```

Start the backend development server:

```bash
npm run dev
```

The backend runs on `http://localhost:3000`.

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend app runs on `http://localhost:5173`.

---

## 🧪 Testing APIs

### 1. Automated Test Suite
The project includes a self-contained automated test suite covering all endpoints, CRUD operations, and error handling:

```bash
cd backend
npm test
```

Expected output:
```text
▶ CareerTrack API Test Suite
  ✔ 1. GET / - Health Check Endpoint
  ✔ 2. GET /api/applications/stats - Aggregation Statistics
  ✔ 3. POST /api/applications - Validation Error on Missing Required Fields
  ✔ 4. POST /api/applications - Create Application (CRUD: Create)
  ✔ 5. GET /api/applications - List All Applications (CRUD: Read)
  ✔ 6. GET /api/applications?search=... - Search Filtering
  ✔ 7. GET /api/applications?status=Applied - Status Filtering
  ✔ 8. PUT /api/applications/:id - Update Application (CRUD: Update)
  ✔ 9. DELETE /api/applications/:id - Delete Application (CRUD: Delete)
  ✔ 10. DELETE /api/applications/:id - 404 for Non-Existent ID
✔ CareerTrack API Test Suite
ℹ tests 10 | pass 10 | fail 0
```

### 2. Postman / Thunder Client Collection
Import the pre-configured collection file:
- `backend/test/CareerTrack_API_Postman_Collection.json`

---

## 🌐 Cloud Deployment Guide

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Security ➜ Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere).
3. Under **Security ➜ Database Access**, create a database user and password.
4. Copy your connection string (`mongodb+srv://.../jobtracker?retryWrites=true&w=majority`).

### 2. Backend (Render Web Service)
1. On [Render](https://render.com), create a **New Web Service** connected to your GitHub repo.
2. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variable**: `MONGO_URI` = `<Your MongoDB Atlas Connection String>`

### 3. Frontend (Render Static Site or Vercel)
- **Render Static Site**:
  - **Root Directory**: `frontend`
  - **Build Command**: `npm run build`
  - **Publish Directory**: `dist`
  - **Environment Variable**: `VITE_API_URL` = `<Your Deployed Backend URL>/api`
  - **Redirects / Rewrites**: Type `Rewrite`, Source `/*`, Destination `/index.html`
- **Vercel**:
  - Import repo, set Root Directory to `frontend`.
  - Add Environment Variable `VITE_API_URL` = `<Your Deployed Backend URL>/api`.
  - Client-side routing is handled automatically via `frontend/vercel.json`.
