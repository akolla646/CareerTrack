import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  BriefcaseBusiness
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getApplications } from "../api/applications";
import ApplicationsTable from "../components/ApplicationsTable";
import EmptyState from "../components/EmptyState";

const statuses = ["All", "Applied", "Interview", "Offer", "Rejected"];

export default function AllApplications() {
  const { openCreateModal, refreshTrigger, fetchStats } = useApp();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getApplications({
        search: search.trim() || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined
      });
      setApplications(response.data);
      fetchStats();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load applications. Please ensure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, fetchStats]);

  useEffect(() => {
    let ignore = false;
    getApplications({
      search: search.trim() || undefined,
      status: statusFilter !== "All" ? statusFilter : undefined
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
              "Failed to load applications. Please ensure the backend server is running."
          );
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [search, statusFilter, refreshTrigger]);

  // Client-side sorting for precision
  const sortedApplications = useMemo(() => {
    const list = [...applications];
    switch (sortBy) {
      case "newest":
        return list.sort(
          (a, b) => new Date(b.applicationDate || b.createdAt) - new Date(a.applicationDate || a.createdAt)
        );
      case "oldest":
        return list.sort(
          (a, b) => new Date(a.applicationDate || a.createdAt) - new Date(b.applicationDate || b.createdAt)
        );
      case "company-asc":
        return list.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
      case "salary-desc":
        return list.sort((a, b) => (b.salaryExpectation || 0) - (a.salaryExpectation || 0));
      default:
        return list;
    }
  }, [applications, sortBy]);

  return (
    <div className="page-container">
      <header className="topbar">
        <div>
          <p className="eyebrow">WORKFLOW</p>
          <h1>All Applications</h1>
          <p className="subtitle">
            Manage, filter, and track every application across all stages.
          </p>
        </div>

        <div className="topbar-actions">
          <button
            className="icon-button"
            onClick={refreshData}
            title="Refresh applications"
            aria-label="Refresh applications"
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

      <section className="applications-panel">
        <div className="panel-heading">
          <div>
            <h2>Application Records ({sortedApplications.length})</h2>
            <p>Full history of your job search submissions</p>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company or role..."
              aria-label="Search applications"
            />
          </div>

          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Statuses" : item}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort applications"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="company-asc">Sort: Company (A-Z)</option>
              <option value="salary-desc">Sort: Highest Salary</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="empty-state">Loading applications...</div>
        ) : sortedApplications.length === 0 ? (
          <EmptyState
            icon={BriefcaseBusiness}
            title={
              search || statusFilter !== "All"
                ? "No matching applications"
                : "No applications found"
            }
            description={
              search || statusFilter !== "All"
                ? "Try adjusting your search terms or filters."
                : "Add your first job application to get started."
            }
            actionText={
              !search && statusFilter === "All" ? "Add Application" : undefined
            }
            onAction={
              !search && statusFilter === "All"
                ? () => openCreateModal("Applied")
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
