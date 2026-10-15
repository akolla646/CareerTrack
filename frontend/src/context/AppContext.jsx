import { useState, useEffect, useCallback } from "react";
import { getApplicationStats } from "../api/applications";
import { AppContext } from "./AppContextDefinition";

export function AppProvider({ children }) {
  const [stats, setStats] = useState({
    total: 0,
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    editingApplication: null,
    defaultStatus: "Applied"
  });

  const [toast, setToast] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getApplicationStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch application stats:", err);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getApplicationStats()
      .then((response) => {
        if (!ignore) {
          setStats(response.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load initial stats:", err);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const openCreateModal = useCallback((defaultStatus = "Applied") => {
    setModalState({
      isOpen: true,
      editingApplication: null,
      defaultStatus
    });
  }, []);

  const openEditModal = useCallback((application) => {
    setModalState({
      isOpen: true,
      editingApplication: application,
      defaultStatus: application?.status || "Applied"
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      editingApplication: null
    }));
  }, []);

  const notifyDataChanged = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    fetchStats();
  }, [fetchStats]);

  return (
    <AppContext.Provider
      value={{
        stats,
        fetchStats,
        modalState,
        openCreateModal,
        openEditModal,
        closeModal,
        toast,
        showToast,
        hideToast,
        refreshTrigger,
        notifyDataChanged
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Re-export useApp with eslint disable for Vite fast-refresh
/* eslint-disable react-refresh/only-export-components */
export { useApp } from "./useApp";
