# CareerTrack — Job Application Tracker (MERN)

CareerTrack is a full-stack MERN application built to organize, monitor, and streamline job applications across every stage of the hiring pipeline. Featuring a custom **Teal & Mint** design system, client-side routing, automated testing, and cloud deployment ready for production.

---

## 🚀 Features & Multi-Page Navigation

- **Dashboard Overview (`/dashboard`)**:
  - Real-time pipeline metrics: Total Applications, Applied, Interviews, and Offers.
  - Upcoming interviews spotlight with interview dates and prep notes.
  - Quick recent applications feed with one-click actions.
- **All Applications (`/applications`)**:
  - Full application records with live search across company and role.
  - Status filter dropdown (`All`, `Applied`, `Interview`, `Offer`, `Rejected`).
  - Sorting by date, company, or salary expectation.
- **Applied Pipeline (`/applied`)**:
  - Focus view on active submissions awaiting recruiter response.
- **Interviews Stage (`/interviews`)**:
  - Dedicated interview pipeline clearly distinguishing **Upcoming & Today** from **Past Interviews**.
  - Sorting by soonest interview date and prep notes management.
- **Job Offers (`/offers`)**:
  - Offer tracker with compensation highlights (Top offer, average package).
- **Archived & Rejected (`/rejected`)**:
  - Log past outcomes, interview learnings, and recruiter feedback.
- **Interactive Application Modal**:
  - Reusable Add/Edit modal with field validation and pre-populated values.
- **Responsive Navigation**:
  - Desktop sidebar with status counters and active route indicators.
  - Mobile slide-out drawer with hamburger menu.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router 7, Axios, Lucide React, Vanilla CSS |
| **Backend** | Node.js (v18+), Express.js 5, Mongoose 9 |
| **Database** | MongoDB (Local MongoDB Server & MongoDB Atlas Cloud) |
| **Testing** | Node.js Test Runner (`node:test`, `node:assert`), Postman Collection |
| **Deployment** | MongoDB Atlas (DB), Render (API Web Service), Vercel / Render (Static Site) |

---

## 📡 REST API Reference

All endpoints return JSON responses with standard HTTP status codes:

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check endpoint | None |
| `GET` | `/api/applications/stats` | Aggregate pipeline counts by status | None |
| `GET` | `/api/applications` | List applications with filtering & search | `?search=Google&status=Interview` |
| `POST` | `/api/applications` | Create a new job application | JSON application payload |
| `PUT` | `/api/applications/:id` | Update application details or status | JSON application payload |
| `DELETE` | `/api/applications/:id` | Delete an application | None |

---

## 🧪 Testing

### 1. Automated API Test Suite
The backend contains a self-contained test suite that automatically manages its connection lifecycle:

```bash
cd backend
npm test
```

**Results:**
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
Import the pre-configured collection file directly:
```text
backend/test/CareerTrack_API_Postman_Collection.json
```

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/jobtracker
```

Start the backend server:
```bash
npm run dev
```
Backend runs at `http://localhost:3000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## ☁️ Cloud Deployment Guide

### 1. Database (MongoDB Atlas)
1. Create a free shared cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Under **Security** ➜ **Database Access**, create a user (e.g. `kollaakshara646_db_user`).
3. Under **Security** ➜ **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. Get your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.bf7qyw0.mongodb.net/jobtracker?retryWrites=true&w=majority
   ```

### 2. Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com) from the GitHub repo.
2. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Environment Variables:
   - `MONGO_URI`: *(your Atlas connection string)*

### 3. Frontend (Vercel or Render Static Site)
- **Vercel**:
  - Import repo, set **Root Directory** to `frontend`.
  - Framework Preset: `Vite`.
  - Environment Variable: `VITE_API_URL = https://<your-render-backend>.onrender.com/api`.
  - Includes `frontend/vercel.json` for client-side SPA routing rewrites.
- **Render Static Site**:
  - Build Command: `npm run build`, Publish Directory: `dist`.
  - Add Rewrite: Source `/*` ➜ Destination `/index.html`.

---

## 📋 5-Day Plan Deliverables Checklist

| Day | Objectives | Status |
| :---: | :--- | :---: |
| **Day 1** | Define features, MongoDB schemas, and REST endpoint contract | ✅ Complete |
| **Day 2** | Build Express server, database connection, and JSON APIs | ✅ Complete |
| **Day 3** | Build React pages, forms, API calls with Axios | ✅ Complete |
| **Day 4** | Complete CRUD flows, validation, loading/error states | ✅ Complete |
| **Day 5** | Test APIs, fix bugs, write README, deploy frontend & backend | ✅ Complete |
