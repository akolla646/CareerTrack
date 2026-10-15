import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  RefreshCw,
  Calendar,
  ArrowRight,
  BriefcaseBusiness,
  ExternalLink,
  CalendarCheck,
  Clock
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getApplications } from "../api/applications";
import StatCard from "../components/StatCard";
import ApplicationsTable from "../components/ApplicationsTable";
import EmptyState from "../components/EmptyState";

export default function Dashboard() {
  const { stats, openCreateModal, refreshTrigger, fetchStats } = useApp();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getApplications();
      setApplications(response.data);
      fetchStats();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load applications. Ensure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  useEffect(() => {
    let ignore = false;
    getApplications()
      .then((response) => {
        if (!ignore) {
          setApplications(response.data);
          setError("");
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
              "Unable to load applications. Ensure the backend server is running."
          );
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [refreshTrigger]);

  // Recent applications (first 5)
  const recentApplications = applications.slice(0, 5);

  // Upcoming interviews (status: Interview, sorted by interviewDate)
  const interviewApplications = applications
    .filter((app) => app.status === "Interview")
    .sort((a, b) => {
      if (!a.interviewDate) return 1;
      if (!b.interviewDate) return -1;
      return new Date(a.interviewDate) - new Date(b.interviewDate);
    });

  const today = new Date().setHours(0, 0, 0, 0);
  const upcomingInterviews = interviewApplications.filter(
    (app) => !app.interviewDate || new Date(app.interviewDate).setHours(0, 0, 0, 0) >= today
  );

  return (
    <div className="page-container">
      <header className="topbar">
        <div>
          <p className="eyebrow">YOUR CAREER WORKSPACE</p>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">
            Keep track of your journey to your next role.
          </p>
        </div>

        <div className="topbar-actions">
          <button
            className="icon-button"
            onClick={refreshData}
            title="Refresh dashboard data"
            aria-label="Refresh data"
          >
            <RefreshCw size={17} />
          </button>
          <button
            className="primary-button"
            onClick={() => openCreateModal("Applied")}
          >
            <Plus size={18} />
            <span>Add Application</span>
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {/* Statistics Cards */}
      <section className="stats-grid" aria-label="Application statistics">
        <StatCard
          label="Total Applications"
          value={stats.total}
          caption="Applications tracked"
          statusKey="total"
          onClick={() => navigate("/applications")}
        />
        <StatCard
          label="Applied"
          value={stats.Applied}
          caption="Awaiting response"
          statusKey="Applied"
          onClick={() => navigate("/applied")}
        />
        <StatCard
          label="Interviews"
          value={stats.Interview}
          caption="In interview process"
          statusKey="Interview"
          onClick={() => navigate("/interviews")}
        />
        <StatCard
          label="Offers"
          value={stats.Offer}
          caption="Job offers received"
          statusKey="Offer"
          onClick={() => navigate("/offers")}
        />
      </section>

      {/* Upcoming Interviews Highlight Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <CalendarCheck size={20} className="section-icon teal" />
            <div>
              <h2>Upcoming Interviews</h2>
              <p>Applications currently in the interview stage</p>
            </div>
          </div>
          <Link to="/interviews" className="view-all-link">
            <span>View interview schedule</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="dashboard-subcard empty-subcard">
            <Clock size={24} className="text-muted" />
            <div>
              <h4>No upcoming interviews scheduled</h4>
              <p>Keep applying to top roles and update statuses when invited to interview.</p>
            </div>
            <button
              className="secondary-button btn-sm"
              onClick={() => openCreateModal("Interview")}
            >
              <Plus size={14} />
              Schedule Interview
            </button>
          </div>
        ) : (
          <div className="interview-cards-grid">
            {upcomingInterviews.slice(0, 3).map((app) => (
              <div className="interview-card" key={app._id}>
                <div className="interview-card-top">
                  <div>
                    <span className="interview-card-company">{app.company}</span>
                    <h3 className="interview-card-role">{app.role}</h3>
                  </div>
                  <span className="status-badge interview">Interview</span>
                </div>

                <div className="interview-card-details">
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span>
                      {app.interviewDate
                        ? new Date(app.interviewDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })
                        : "Date to be scheduled"}
                    </span>
                  </div>
                  {app.salaryExpectation && (
                    <div className="detail-item salary">
                      <span>₹{Number(app.salaryExpectation).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>

                {app.notes && (
                  <p className="interview-card-notes">
                    <strong>Prep Notes:</strong> {app.notes}
                  </p>
                )}

                {app.jobLink && (
                  <a
                    href={app.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="job-link mt-auto"
                  >
                    <span>View job posting</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Applications Section */}
      <section className="applications-panel dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent Applications</h2>
            <p>Your most recently tracked job opportunities</p>
          </div>

          <Link to="/applications" className="view-all-link">
            <span>View All Applications ({stats.total})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="empty-state">Loading applications...</div>
        ) : recentApplications.length === 0 ? (
          <EmptyState
            icon={BriefcaseBusiness}
            title="No applications yet"
            description="Start building your career pipeline by tracking your first application."
            actionText="Add Application"
            onAction={() => openCreateModal("Applied")}
          />
        ) : (
          <ApplicationsTable
            applications={recentApplications}
            showInterviewDate={false}
            showNotes={true}
          />
        )}
      </section>
    </div>
  );
}
