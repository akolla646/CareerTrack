import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Search, RefreshCw, Award, Sparkles, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getApplications } from "../api/applications";
import ApplicationsTable from "../components/ApplicationsTable";
import EmptyState from "../components/EmptyState";

export default function OffersPage() {
  const { openCreateModal, refreshTrigger, fetchStats } = useApp();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("salary-desc");

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getApplications({
        status: "Offer",
        search: search.trim() || undefined
      });
      setApplications(response.data);
      fetchStats();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load offers. Ensure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }, [search, fetchStats]);

  useEffect(() => {
    let ignore = false;
    getApplications({
      status: "Offer",
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
              "Unable to load offers. Ensure the backend server is running."
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
      case "salary-desc":
        return list.sort((a, b) => (b.salaryExpectation || 0) - (a.salaryExpectation || 0));
      case "salary-asc":
        return list.sort((a, b) => (a.salaryExpectation || 0) - (b.salaryExpectation || 0));
      case "newest":
        return list.sort(
          (a, b) => new Date(b.applicationDate || b.createdAt) - new Date(a.applicationDate || a.createdAt)
        );
      case "company-asc":
        return list.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
      default:
        return list;
    }
  }, [applications, sortBy]);

  // Statistics for offers
  const { highestOffer, averageOffer } = useMemo(() => {
    const offersWithSalary = applications
      .map((app) => app.salaryExpectation)
      .filter((s) => s != null && s > 0);
    if (offersWithSalary.length === 0) {
      return { highestOffer: null, averageOffer: null };
    }
    const max = Math.max(...offersWithSalary);
    const avg = Math.round(
      offersWithSalary.reduce((sum, val) => sum + val, 0) / offersWithSalary.length
    );
    return { highestOffer: max, averageOffer: avg };
  }, [applications]);

  return (
    <div className="page-container">
      <header className="topbar">
        <div>
          <p className="eyebrow">STAGE: OFFERS</p>
          <h1>Job Offers</h1>
          <p className="subtitle">
            Celebrate your success and review compensation packages across your received offers.
          </p>
        </div>

        <div className="topbar-actions">
          <button
            className="icon-button"
            onClick={refreshData}
            title="Refresh offers"
            aria-label="Refresh offers"
          >
            <RefreshCw size={17} />
          </button>
          <button
            className="primary-button"
            onClick={() => openCreateModal("Offer")}
          >
            <Plus size={18} />
            <span>Add Offer</span>
          </button>
        </div>
      </header>

      {/* Offer Highlights if any offer exists */}
      {applications.length > 0 && (
        <div className="offer-summary-grid">
          <div className="offer-summary-card">
            <div className="summary-icon mint">
              <Award size={20} />
            </div>
            <div>
              <span className="summary-label">Total Offers Received</span>
              <strong>{applications.length}</strong>
            </div>
          </div>
          {highestOffer && (
            <div className="offer-summary-card">
              <div className="summary-icon teal">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="summary-label">Top Compensation Package</span>
                <strong>₹{highestOffer.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          )}
          {averageOffer && (
            <div className="offer-summary-card">
              <div className="summary-icon teal">
                <TrendingUp size={20} />
              </div>
              <div>
                <span className="summary-label">Average Offer</span>
                <strong>₹{averageOffer.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          )}
        </div>
      )}

      <section className="applications-panel">
        <div className="panel-heading">
          <div>
            <h2>Received Offers ({sortedApplications.length})</h2>
            <p>Compare roles, compensation, and negotiation notes</p>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role..."
              aria-label="Search offers"
            />
          </div>

          <div className="filter-group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort offers"
            >
              <option value="salary-desc">Sort: Highest Salary</option>
              <option value="salary-asc">Sort: Lowest Salary</option>
              <option value="newest">Sort: Offer Date (Newest)</option>
              <option value="company-asc">Sort: Company (A-Z)</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="empty-state">Loading offers...</div>
        ) : sortedApplications.length === 0 ? (
          <EmptyState
            icon={Award}
            title={
              search
                ? "No matching offers found"
                : "No job offers yet"
            }
            description={
              search
                ? "Try searching for a different company name."
                : "Keep up the momentum! When an offer comes in, celebrate and log it here."
            }
            actionText={!search ? "Record an Offer" : undefined}
            onAction={!search ? () => openCreateModal("Offer") : undefined}
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
