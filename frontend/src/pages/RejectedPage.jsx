import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Search, RefreshCw, XCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getApplications } from "../api/applications";
import ApplicationsTable from "../components/ApplicationsTable";
import EmptyState from "../components/EmptyState";

export default function RejectedPage() {
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
        status: "Rejected",
        search: search.trim() || undefined
      });
      setApplications(response.data);
      fetchStats();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load rejected applications. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  }, [search, fetchStats]);

  useEffect(() => {
    let ignore = false;
    getApplications({
      status: "Rejected",
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
              "Unable to load rejected applications. Check backend connection."
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
      default:
        return list;
    }
  }, [applications, sortBy]);

  return (
    <div className="page-container">
      <header className="topbar">
        <div>
          <p className="eyebrow">STAGE: REJECTED / ARCHIVED</p>
          <h1>Archived & Rejected</h1>
          <p className="subtitle">
            Keep track of past decisions and interview learnings. Every attempt is valuable experience.
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
            onClick={() => openCreateModal("Rejected")}
          >
            <Plus size={18} />
            <span>Add Application</span>
          </button>
        </div>
      </header>

      <section className="applications-panel">
        <div className="panel-heading">
          <div>
            <h2>Archived Submissions ({sortedApplications.length})</h2>
            <p>Applications that did not proceed to an offer</p>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role..."
              aria-label="Search rejected applications"
            />
          </div>

          <div className="filter-group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort applications"
            >
              <option value="newest">Sort: Date (Newest first)</option>
              <option value="oldest">Sort: Date (Oldest first)</option>
              <option value="company-asc">Sort: Company (A-Z)</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="empty-state">Loading applications...</div>
        ) : sortedApplications.length === 0 ? (
          <EmptyState
            icon={XCircle}
            title={
              search
                ? "No matching rejected applications"
                : "No rejected applications recorded"
            }
            description={
              search
                ? "Try searching for another company or role title."
                : "No rejected records yet. Maintain focus and keep applying!"
            }
            actionText={!search ? "Log Application" : undefined}
            onAction={!search ? () => openCreateModal("Rejected") : undefined}
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
