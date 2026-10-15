import { BriefcaseBusiness, Plus } from "lucide-react";

export default function EmptyState({
  icon: Icon = BriefcaseBusiness,
  title = "No applications found",
  description = "Get started by adding your first job application.",
  actionText,
  onAction
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={28} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionText && onAction && (
        <button className="primary-button" onClick={onAction}>
          <Plus size={16} />
          {actionText}
        </button>
      )}
    </div>
  );
}
