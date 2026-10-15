import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon success" />,
    error: <AlertCircle size={18} className="toast-icon error" />,
    info: <Info size={18} className="toast-icon info" />
  };

  return (
    <div className={`toast-notification toast-${type}`} role="alert">
      {icons[type] || icons.info}
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={15} />
      </button>
    </div>
  );
}
