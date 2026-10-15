import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  CalendarCheck,
  Clock,
  History
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getApplications } from "../api/applications";
import ApplicationsTable from "../components/ApplicationsTable";
import EmptyState from "../components/EmptyState";

export default function InterviewsPage() {
  const { openCreateModal, refreshTrigger, fetchStats } = useApp();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("all"); // 'all', 'upcoming', 'past'
  const [sortBy, setSortBy] = useState("interview-asc"); // 'interview-asc', 'interview-desc', 'company-asc'

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getApplications({
        status: "Interview",
        search: search.trim() || undefined
      });
      setApplications(response.data);
      fetchStats();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load interview applications. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  }, [search, fetchStats]);

  useEffect(() => {
    let ignore = false;
    getApplications({
      status: "Interview",
      search: search.trim() || undefined
    })
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
              "Unable to load interview applications. Check backend connection."
          );
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [search, refreshTrigger]);

  const today = new Date().setHours(0, 0, 0, 0);

  // Group applications into upcoming and past
  const { upcomingCount, pastCount } = useMemo(() => {
    let upcoming = 0;
    let past = 0;
    applications.forEach((app) => {
      if (!app.interviewDate) {
        upcoming++; // unassigned date treated as upcoming action item
      } else {
        const interviewTime = new Date(app.interviewDate).setHours(0, 0, 0, 0);
        if (interviewTime >= today) {
          upcoming++;
        } else {
          past++;
        }
      }
    });
    return { upcomingCount: upcoming, pastCount: past };
  }, [applications, today]);

  // Filter based on timeFilter
  const filteredList = useMemo(() => {
    return applications.filter((app) => {
      if (timeFilter === "all") return true;
      if (!app.interviewDate) return timeFilter === "upcoming";
      const interviewTime = new Date(app.interviewDate).setHours(0, 0, 0, 0);
      if (timeFilter === "upcoming") return interviewTime >= today;
      if (timeFilter === "past") return interviewTime < today;
      return true;
    });
  }, [applications, timeFilter, today]);

  // Sort list
  const sortedApplications = useMemo(() => {
    const list = [...filteredList];
    switch (sortBy) {
      case "interview-asc":
        return list.sort((a, b) => {
          if (!a.interviewDate) return 1;
          if (!b.interviewDate) return -1;
          return new Date(a.interviewDate) - new Date(b.interviewDate);
        });
      case "interview-desc":
        return list.sort((a, b) => {
          if (!a.interviewDate) return 1;
          if (!b.interviewDate) return -1;
          return new Date(b.interviewDate) - new Date(a.interviewDate);
        });
      case "company-asc":
        return list.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
      case "applied-newest":
        return list.sort(
          (a, b) => new Date(b.applicationDate || 0) - new Date(a.applicationDate || 0)
        );
      default:
        return list;
    }
  }, [filteredList, sortBy]);

  return (
    <div className="page-container">
      <header className="topbar">
        <div>
          <p className="eyebrow">STAGE: INTERVIEWS</p>
          <h1>Interview Pipeline</h1>
          <p className="subtitle">
            Track scheduled interview rounds, preparation notes, and interview outcomes.
          </p>
        </div>

        <div className="topbar-actions">
          <button
            className="icon-button"
            onClick={refreshData}
            title="Refresh list"
            aria-label="Refresh interviews"
          >
            <RefreshCw size={17} />
          </button>
          <button
            className="primary-button"
            onClick={() => openCreateModal("Interview")}
          >
            <Plus size={18} />
            <span>Schedule Interview</span>
          </button>
        </div>
      </header>

      {/* Filter Tabs for Upcoming vs Past */}
      <div className="tab-bar">
        <button
          className={`tab-item ${timeFilter === "all" ? "active" : ""}`}
          onClick={() => setTimeFilter("all")}
        >
          <span>All Interviews</span>
          <span className="tab-badge">{applications.length}</span>
        </button>
        <button
          className={`tab-item ${timeFilter === "upcoming" ? "active" : ""}`}
          onClick={() => setTimeFilter("upcoming")}
        >
          <Clock size={14} />
          <span>Upcoming & Today</span>
          <span className="tab-badge upcoming">{upcomingCount}</span>
        </button>
        <button
          className={`tab-item ${timeFilter === "past" ? "active" : ""}`}
          onClick={() => setTimeFilter("past")}
        >
          <History size={14} />
          <span>Past Interviews</span>
          <span className="tab-badge">{pastCount}</span>
        </button>
      </div>

      <section className="applications-panel">
        <div className="panel-heading">
          <div>
            <h2>
              {timeFilter === "all"
                ? "All Interview Stages"
                : timeFilter === "upcoming"
                ? "Upcoming Scheduled Interviews"
                : "Completed / Past Interviews"}{" "}
              ({sortedApplications.length})
            </h2>
            <p>
              {timeFilter === "upcoming"
                ? "Review preparation notes and upcoming interview dates"
                : "Manage and record feedback for your interview rounds"}
            </p>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role..."
              aria-label="Search interviews"
            />
          </div>

          <div className="filter-group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort interviews"
            >
              <option value="interview-asc">Sort: Interview Date (Soonest first)</option>
              <option value="interview-desc">Sort: Interview Date (Latest first)</option>
              <option value="company-asc">Sort: Company (A-Z)</option>
              <option value="applied-newest">Sort: Applied Date (Newest)</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="empty-state">Loading interviews...</div>
        ) : sortedApplications.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title={
              search
                ? "No matching interviews found"
                : timeFilter === "upcoming"
                ? "No upcoming interviews"
                : timeFilter === "past"
                ? "No past interviews recorded"
                : "No interview rounds scheduled yet"
            }
            description={
              search
                ? "Try searching for a different company name or role."
                : timeFilter === "upcoming"
                ? "Keep practicing! When you receive an invitation, schedule it here."
                : "When an application advances to the interview stage, schedule it here to prepare thoroughly."
            }
            actionText={
              !search && timeFilter !== "past"
                ? "Schedule Interview"
                : undefined
            }
            onAction={
              !search && timeFilter !== "past"
                ? () => openCreateModal("Interview")
                : undefined
            }
          />
        ) : (
          <ApplicationsTable
            applications={sortedApplications}
            showInterviewDate={true}
            showNotes={true}
          />
        )}
      </section>
    </div>
  );
}
