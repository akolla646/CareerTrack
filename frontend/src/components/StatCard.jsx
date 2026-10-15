export default function StatCard({
  label,
  value,
  caption,
  statusKey,
  icon: Icon,
  onClick
}) {
  return (
    <div
      className={`stat-card ${onClick ? "stat-card-clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="stat-top">
        <span className="stat-label-text">{label}</span>
        {statusKey ? (
          <span className={`stat-dot ${statusKey.toLowerCase()}`} />
        ) : Icon ? (
          <Icon size={16} className="stat-icon" />
        ) : null}
      </div>
      <strong>{value ?? 0}</strong>
      <span className="stat-caption">{caption}</span>
    </div>
  );
}
