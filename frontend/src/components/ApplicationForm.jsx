import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { createApplication, updateApplication } from "../api/applications";

const statuses = ["Applied", "Interview", "Offer", "Rejected"];

function ApplicationFormDialog({
  editingApplication,
  defaultStatus,
  closeModal,
  notifyDataChanged,
  showToast
}) {
  const [form, setForm] = useState(() => {
    if (editingApplication) {
      return {
        company: editingApplication.company || "",
        role: editingApplication.role || "",
        jobLink: editingApplication.jobLink || "",
        salaryExpectation:
          editingApplication.salaryExpectation != null
            ? String(editingApplication.salaryExpectation)
            : "",
        status: editingApplication.status || "Applied",
        applicationDate: editingApplication.applicationDate
          ? editingApplication.applicationDate.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        interviewDate: editingApplication.interviewDate
          ? editingApplication.interviewDate.slice(0, 10)
          : "",
        notes: editingApplication.notes || ""
      };
    }
    return {
      company: "",
      role: "",
      jobLink: "",
      salaryExpectation: "",
      status: defaultStatus || "Applied",
      applicationDate: new Date().toISOString().slice(0, 10),
      interviewDate: "",
      notes: ""
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Handle keyboard Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        closeModal();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.company.trim()) {
      setFormError("Company name is required.");
      return;
    }
    if (!form.role.trim()) {
      setFormError("Job role is required.");
      return;
    }

    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      jobLink: form.jobLink.trim(),
      status: form.status,
      applicationDate: form.applicationDate || undefined,
      interviewDate: form.interviewDate ? form.interviewDate : null,
      notes: form.notes.trim()
    };

    if (form.salaryExpectation !== "") {
      const parsedSalary = Number(form.salaryExpectation);
      if (isNaN(parsedSalary) || parsedSalary < 0) {
        setFormError("Salary expectation must be a valid positive number.");
        return;
      }
      payload.salaryExpectation = parsedSalary;
    } else {
      payload.salaryExpectation = null;
    }

    try {
      setIsSubmitting(true);
      if (editingApplication?._id) {
        await updateApplication(editingApplication._id, payload);
        showToast(`Updated application for ${payload.company}`);
      } else {
        await createApplication(payload);
        showToast(`Added application for ${payload.company}`);
      }
      notifyDataChanged();
      closeModal();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Failed to save the application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <section
        className="application-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-heading">
          <div>
            <h2 id="modal-title">
              {editingApplication ? "Edit Application" : "Add Application"}
            </h2>
            <p>
              {editingApplication
                ? "Update the details for this job opportunity."
                : "Enter the details of the job opportunity."}
            </p>
          </div>
          <button
            className="icon-button"
            onClick={closeModal}
            aria-label="Close form"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {formError && <div className="error-message">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Company *
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                required
                autoFocus
              />
            </label>

            <label>
              Job Role *
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
                required
              />
            </label>

            <label>
              Job Posting URL
              <input
                name="jobLink"
                type="url"
                value={form.jobLink}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <label>
              Salary Expectation (₹)
              <input
                name="salaryExpectation"
                type="number"
                min="0"
                value={form.salaryExpectation}
                onChange={handleChange}
                placeholder="e.g. 700000"
              />
            </label>

            <label>
              Application Date
              <input
                name="applicationDate"
                type="date"
                value={form.applicationDate}
                onChange={handleChange}
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Interview Date {form.status === "Interview" ? "(Recommended)" : "(Optional)"}
              <input
                name="interviewDate"
                type="date"
                value={form.interviewDate}
                onChange={handleChange}
              />
            </label>

            <label className="full-width">
              Notes & Preparation
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Recruiter contacts, interview rounds, preparation tips, follow-up dates..."
                rows="3"
              />
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 size={16} className="spinner" />}
              {editingApplication ? "Save Changes" : "Save Application"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function ApplicationForm() {
  const { modalState, closeModal, notifyDataChanged, showToast } = useApp();
  const { isOpen, editingApplication, defaultStatus } = modalState;

  if (!isOpen) return null;

  return (
    <ApplicationFormDialog
      key={editingApplication?._id || defaultStatus || "new"}
      editingApplication={editingApplication}
      defaultStatus={defaultStatus}
      closeModal={closeModal}
      notifyDataChanged={notifyDataChanged}
      showToast={showToast}
    />
  );
}
