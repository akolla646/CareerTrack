import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Menu, BriefcaseBusiness } from "lucide-react";

import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import ApplicationForm from "./components/ApplicationForm";
import Toast from "./components/Toast";

import Dashboard from "./pages/Dashboard";
import AllApplications from "./pages/AllApplications";
import AppliedPage from "./pages/AppliedPage";
import InterviewsPage from "./pages/InterviewsPage";
import OffersPage from "./pages/OffersPage";
import RejectedPage from "./pages/RejectedPage";

import "./App.css";

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast, hideToast } = useApp();

  return (
    <div className="app-shell">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div className="mobile-brand">
          <div className="brand-icon small">
            <BriefcaseBusiness size={18} />
          </div>
          <span className="mobile-brand-name">CareerTrack</span>
        </div>
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Main Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<AllApplications />} />
          <Route path="/applied" element={<AppliedPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/rejected" element={<RejectedPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Shared Modals and Notifications */}
      <ApplicationForm />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
