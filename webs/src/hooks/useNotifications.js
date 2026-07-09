import { useContext } from "react";
import { NotificationMethodsContext, NotificationStateContext } from "../context/NotificationContext";

/**
 * ⚡ OPTIMIZATION: Surgical Reactivity for Notifications.
 * useNotifications provides stable action methods (add, remove, success, etc.)
 * that do NOT trigger re-renders when the notification list changes.
 */
export const useNotifications = () => {
  const context = useContext(NotificationMethodsContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }

  return context;
};

/**
 * ⚡ OPTIMIZATION: Targeted subscription to notification state.
 * useNotificationState provides the reactive list of notifications.
 * Use this only in components that need to display the notifications.
 */
export const useNotificationState = () => {
  const context = useContext(NotificationStateContext);

  if (context === undefined) {
    throw new Error("useNotificationState must be used within NotificationProvider");
  }

  return context;
};

export default useNotifications;
