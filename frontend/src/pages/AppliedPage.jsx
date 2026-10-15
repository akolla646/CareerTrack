import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Search, RefreshCw, Send } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getApplications } from "../api/applications";
import ApplicationsTable from "../components/ApplicationsTable";
import EmptyState from "../components/EmptyState";

export default function AppliedPage() {
  const { openCreateModal, refreshTrigger, fetchStats } = useApp();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getApplications({
        status: "Applied",
        search: search.trim() || undefined
      });
      setApplications(response.data);
      fetchStats();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load applied applications. Ensure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, [search, fetchStats]);

  useEffect(() => {
    let ignore = false;
    getApplications({
      status: "Applied",
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
              "Unable to load applied applications. Ensure the backend is running."
          );
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [search, refreshTrigger]);

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
          <p className="eyebrow">STAGE: APPLIED</p>
          <h1>Applied Applications</h1>
          <p className="subtitle">
            Applications submitted that are actively awaiting review or recruiter response.
          </p>
        </div>

        <div className="topbar-actions">
          <button
            className="icon-button"
            onClick={refreshData}
            title="Refresh list"
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
            <h2>Active Submissions ({sortedApplications.length})</h2>
            <p>Review and manage roles currently in the initial applied stage</p>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applied company or role..."
              aria-label="Search applications"
            />
          </div>

          <div className="filter-group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort applications"
            >
              <option value="newest">Sort: Applied Date (Newest)</option>
              <option value="oldest">Sort: Applied Date (Oldest)</option>
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
            icon={Send}
            title={
              search
                ? "No matching applied applications"
                : "No applied applications yet"
            }
            description={
              search
                ? "Try searching for a different company or job title."
                : "Submit new applications and track their progress here."
            }
            actionText={!search ? "Add Application" : undefined}
            onAction={!search ? () => openCreateModal("Applied") : undefined}
          />
        ) : (
          <ApplicationsTable
            applications={sortedApplications}
            showInterviewDate={false}
            showNotes={true}
          />
        )}
      </section>
    </div>
  );
}
