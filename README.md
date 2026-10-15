# CareerTrack — Job Application Tracker

A full-stack MERN application designed to organize, track, and streamline job applications across every stage of the hiring pipeline. The system provides real-time application metrics, categorized pipeline management, upcoming interview scheduling, compensation tracking, and an interactive modal-based workflow.

Live Demo: [https://careertrack-47mr.onrender.com](https://careertrack-47mr.onrender.com)  
API Server: [https://careertrack-api-ky4w.onrender.com](https://careertrack-api-ky4w.onrender.com)

---

## Project Structure

```text
/
├── backend/                             # Express + Node.js REST API
│   ├── models/
│   │   └── Application.js               # Mongoose schema and database model
│   ├── test/
│   │   ├── api.test.js                  # Automated API test suite (node:test)
│   │   └── CareerTrack_API_Postman_Collection.json  # Postman / Thunder Client collection
│   ├── package.json
│   └── server.js                        # Express app, middleware, routes, and DB connection
│
├── frontend/                            # React 19 + Vite client application
│   ├── src/
│   │   ├── api/
│   │   │   └── applications.js          # Axios API service client
│   │   ├── components/
│   │   │   ├── ApplicationForm.jsx      # Modal form for adding and editing applications
│   │   │   ├── ApplicationsTable.jsx    # Tabular list view with row actions
│   │   │   ├── EmptyState.jsx           # Contextual empty state illustrations
│   │   │   ├── Sidebar.jsx              # Responsive navigation drawer with live count badges
│   │   │   ├── StatCard.jsx             # Metric card for dashboard statistics
│   │   │   └── Toast.jsx                # Notification banners for feedback
│   │   ├── context/
│   │   │   ├── AppContext.jsx           # Global state provider for stats and modals
│   │   │   ├── AppContextDefinition.js  # React Context instance
│   │   │   └── useApp.js                # Custom hook for consuming app state
│   │   ├── pages/
│   │   │   ├── AllApplications.jsx      # Route: /applications (full search & filter table)
│   │   │   ├── AppliedPage.jsx          # Route: /applied (initial submissions)
│   │   │   ├── Dashboard.jsx            # Route: /dashboard (overview & recent activity)
│   │   │   ├── InterviewsPage.jsx       # Route: /interviews (upcoming vs past schedule)
│   │   │   ├── OffersPage.jsx           # Route: /offers (received offers & compensation)
│   │   │   └── RejectedPage.jsx         # Route: /rejected (archived decisions & notes)
│   │   ├── App.css                      # Custom Teal & Mint design system
│   │   ├── App.jsx                      # Client-side router and shell layout
│   │   ├── index.css                    # Base global typography and resets
│   │   └── main.jsx                     # Vite entry point
│   ├── index.html                       # HTML5 template
│   ├── package.json
│   ├── vercel.json                      # Single Page Application rewrite rules
│   └── vite.config.js                   # Vite configuration
│
├── .gitignore                           # Root-level ignore rules (secrets, dependencies)
└── README.md
```

---

## Features

| Module | Description |
| :--- | :--- |
| **Dashboard** | Overview metrics (Total, Applied, Interviews, Offers), upcoming interviews with date tracking, and recent application records. |
| **All Applications** | Full searchable catalog across all stages with live text search, status filters, and multiple sorting criteria. |
| **Applied Pipeline** | Dedicated management for applications awaiting recruiter review or first contact. |
| **Interview Scheduler** | Tracks upcoming vs. past interview rounds, schedule dates, and interview preparation notes. |
| **Offer Management** | Reviews received offers, highlights top compensation packages, and tracks negotiation details. |
| **Archived / Rejected** | Preserves records of closed applications with feedback notes and learnings for future cycles. |
| **Interactive Modals** | Add and edit applications with automatic form pre-population, numeric validation, and keyboard dismissal. |
| **Feedback System** | Non-blocking toast notifications for CRUD actions and user confirmation dialogs before deletions. |

---

## Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js v5
- **Database**: MongoDB (Local Community Server / MongoDB Atlas Cloud)
- **ODM**: Mongoose v9
- **CORS**: cors
- **Environment**: dotenv
- **Testing**: Node.js Built-in Test Runner (`node:test`, `node:assert`)

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Custom Design System with CSS Custom Properties)
- **Fonts**: DM Sans, Manrope (Google Fonts)

---

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB instance (Local MongoDB Community Server on port 27017 or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/akolla646/CareerTrack.git
cd CareerTrack
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/jobtracker
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The backend server will run on `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will run on `http://localhost:5173`.

---

## Application Pipeline & Routing

| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/` | Redirect | Automatically redirects to `/dashboard`. |
| `/dashboard` | Dashboard | High-level summary, stat cards, upcoming interviews, and recent entries. |
| `/applications` | All Applications | Complete list of all applications regardless of status, with search and filtering. |
| `/applied` | Applied | Applications currently in the `Applied` stage. |
| `/interviews` | Interviews | Applications with status `Interview`, grouped by upcoming and past dates. |
| `/offers` | Offers | Applications with status `Offer`, highlighting compensation figures. |
| `/rejected` | Rejected | Applications with status `Rejected`, storing notes and retrospective details. |

---

## Testing

### Automated Backend Tests
The backend includes a self-contained automated test suite covering health checks, aggregation stats, input validation, and full CRUD operations. The suite automatically detects if an external server is running, or launches an ephemeral instance:

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

### API Collection (Postman / Thunder Client)
A pre-configured JSON collection is available at:
`backend/test/CareerTrack_API_Postman_Collection.json`

Import this file directly into Postman or Thunder Client to test all endpoints.

---

## Key API Endpoints

### Health & Statistics

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Service health check |
| `GET` | `/api/applications/stats` | Status counts aggregation (Total, Applied, Interview, Offer, Rejected) |

### Applications CRUD

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/applications` | Retrieve applications | `?status=Interview`, `?search=Google` |
| `POST` | `/api/applications` | Create a new record | `{ company, role, jobLink, salaryExpectation, status, applicationDate, interviewDate, notes }` |
| `PUT` | `/api/applications/:id` | Update existing record | Fields to update (JSON body) |
| `DELETE` | `/api/applications/:id` | Remove application by ID | Path parameter `id` |

---

## Cloud Deployment

### Database (MongoDB Atlas)
1. Host a free M0 cluster on MongoDB Atlas.
2. In Network Access, add `0.0.0.0/0` to allow connections from dynamic cloud IPs.
3. In Database Access, configure a user with read/write privileges.
4. Set the `MONGO_URI` connection string in the cloud hosting provider.

### Backend (Render Web Service)
- **Service Type**: Web Service
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**:
  - `MONGO_URI`: Atlas connection string

### Frontend (Render Static Site / Vercel)
- **Service Type**: Static Site
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://careertrack-api-ky4w.onrender.com/api`
- **SPA Rewrite Rule**: Source `/*` ➜ Destination `/index.html`

---

## License

This project was developed for academic and educational evaluation.
