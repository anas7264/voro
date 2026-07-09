import React, { createContext, useState, useCallback, useRef, useMemo } from "react";

export const NotificationStateContext = createContext();
export const NotificationMethodsContext = createContext();
export const NotificationContext = NotificationMethodsContext;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const notificationIdRef = useRef(0);

  // Add notification
  const addNotification = useCallback((message, type = "info", duration = 3000) => {
    const id = notificationIdRef.current++;
    const notification = {
      id,
      message,
      type, // "success", "error", "warning", "info"
      duration,
      createdAt: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after duration (if duration > 0)
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Success notification
  const success = useCallback((message, duration = 3000) => {
    return addNotification(message, "success", duration);
  }, [addNotification]);

  // Error notification
  const error = useCallback((message, duration = 5000) => {
    return addNotification(message, "error", duration);
  }, [addNotification]);

  // Warning notification
  const warning = useCallback((message, duration = 4000) => {
    return addNotification(message, "warning", duration);
  }, [addNotification]);

  // Info notification
  const info = useCallback((message, duration = 3000) => {
    return addNotification(message, "info", duration);
  }, [addNotification]);

  // Loading notification (no auto-remove)
  const loading = useCallback((message) => {
    return addNotification(message, "info", 0);
  }, [addNotification]);

  // Update notification
  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updates } : n))
    );
  }, []);

  // Promise-based notification (show loading, then success/error)
  const withNotification = useCallback(async (promise, loadingMessage = "Loading...", successMessage = "Done!", errorMessage = "Error occurred") => {
    const loadingId = loading(loadingMessage);

    try {
      const result = await promise;
      removeNotification(loadingId);
      success(successMessage);
      return result;
    } catch (err) {
      removeNotification(loadingId);
      error(errorMessage);
      throw err;
    }
  }, [loading, removeNotification, success, error]);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Splits notification state from stable action methods. This ensures that
   * the 40+ pages that only trigger notifications do not re-render when the
   * global notification list changes.
   */
  const methodsValue = useMemo(() => ({
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
    loading,
    updateNotification,
    withNotification
  }), [
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
    loading,
    updateNotification,
    withNotification
  ]);

  return (
    <NotificationMethodsContext.Provider value={methodsValue}>
      <NotificationStateContext.Provider value={notifications}>
        {children}
      </NotificationStateContext.Provider>
    </NotificationMethodsContext.Provider>
  );
};

export default NotificationContext;
