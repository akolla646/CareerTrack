import { NavLink } from "react-router-dom";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  Send,
  CalendarCheck,
  Award,
  XCircle,
  X
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { stats } = useApp();

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: "/applications",
      label: "All Applications",
      icon: BriefcaseBusiness,
      badge: stats.total
    },
    {
      to: "/applied",
      label: "Applied",
      icon: Send,
      badge: stats.Applied
    },
    {
      to: "/interviews",
      label: "Interviews",
      icon: CalendarCheck,
      badge: stats.Interview
    },
    {
      to: "/offers",
      label: "Offers",
      icon: Award,
      badge: stats.Offer
    },
    {
      to: "/rejected",
      label: "Rejected",
      icon: XCircle,
      badge: stats.Rejected
    }
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <BriefcaseBusiness size={23} />
          </div>
          <div>
            <h2>CareerTrack</h2>
            <span>JOB APPLICATIONS</span>
          </div>
          {mobileOpen && (
            <button
              className="sidebar-close-btn"
              onClick={onCloseMobile}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                onClick={onCloseMobile}
              >
                <div className="nav-item-content">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-note">
          <div className="note-symbol">✦</div>
          <h3>Your next opportunity awaits.</h3>
          <p>Keep every application organized in one place.</p>
        </div>
      </aside>
    </>
  );
}
