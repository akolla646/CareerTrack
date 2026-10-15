import { useState } from "react";
import {
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  FileText,
  Loader2
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { deleteApplication } from "../api/applications";

export default function ApplicationsTable({
  applications = [],
  showInterviewDate = false,
  showNotes = true
}) {
  const { openEditModal, notifyDataChanged, showToast } = useApp();
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(app) {
    const confirmMessage = `Delete application for ${app.role} at ${app.company}?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setDeletingId(app._id);
      await deleteApplication(app._id);
      showToast(`Deleted application for ${app.company}`);
      notifyDataChanged();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete application.",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  }

  function formatCurrency(amount) {
    if (amount == null || amount === "") return "—";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  }

  function formatDate(dateString) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function getInterviewStatus(dateString) {
    if (!dateString) return null;
    const interviewTime = new Date(dateString).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    if (interviewTime > today) {
      return { label: "Upcoming", className: "interview-upcoming" };
    } else if (interviewTime === today) {
      return { label: "Today", className: "interview-today" };
    } else {
      return { label: "Past", className: "interview-past" };
    }
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>COMPANY / ROLE</th>
            <th>APPLIED ON</th>
            {showInterviewDate && <th>INTERVIEW DATE</th>}
            <th>STATUS</th>
            <th>SALARY EXPECTATION</th>
            {showNotes && <th>NOTES</th>}
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const interviewStatus = getInterviewStatus(app.interviewDate);
            return (
              <tr key={app._id}>
                <td>
                  <div className="company-name">{app.company}</div>
                  <div className="role-name">{app.role}</div>
                  {app.jobLink && (
                    <a
                      className="job-link"
                      href={app.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>View job posting</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </td>

                <td>{formatDate(app.applicationDate)}</td>

                {showInterviewDate && (
                  <td>
                    {app.interviewDate ? (
                      <div className="interview-date-cell">
                        <span className="interview-date-text">
                          <Calendar size={13} />
                          {formatDate(app.interviewDate)}
                        </span>
                        {interviewStatus && (
                          <span
                            className={`interview-tag ${interviewStatus.className}`}
                          >
                            {interviewStatus.label}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                )}

                <td>
                  <span
                    className={`status-badge ${(app.status || "applied").toLowerCase()}`}
                  >
                    {app.status}
                  </span>
                </td>

                <td className="salary-cell">
                  {formatCurrency(app.salaryExpectation)}
                </td>

                {showNotes && (
                  <td className="notes-cell">
                    {app.notes ? (
                      <div className="notes-text" title={app.notes}>
                        <FileText size={12} className="notes-icon" />
                        <span>{app.notes}</span>
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                )}

                <td>
                  <div className="row-actions">
                    <button
                      className="icon-button"
                      title="Edit application"
                      onClick={() => openEditModal(app)}
                      aria-label={`Edit ${app.company}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="icon-button delete-button"
                      title="Delete application"
                      onClick={() => handleDelete(app)}
                      disabled={deletingId === app._id}
                      aria-label={`Delete ${app.company}`}
                    >
                      {deletingId === app._id ? (
                        <Loader2 size={15} className="spinner" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
