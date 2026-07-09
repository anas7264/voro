import React from "react";
import { useNotifications, useNotificationState } from "../hooks/useNotifications";
import { Alert } from "./Alert";

/**
 * ⚡ REFINEMENT: Luxury Notification Matrix Container.
 * Adjusted spatial architecture with premium whitespace (top-12, right-12)
 * and vertical rhythm (space-y-6) to maintain an elite gallery aesthetic.
 * ⚡ OPTIMIZATION: Consumes notification state and methods via separate hooks
 * for surgical reactivity.
 */
export const NotificationContainer = () => {
  const notifications = useNotificationState();
  const { removeNotification } = useNotifications();

  return (
    <div className="fixed top-12 right-12 space-y-6 z-[100] max-w-md pointer-events-none">
      {notifications.map(notification => (
        <div key={notification.id} className="pointer-events-auto">
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
            className="animate-slide-up"
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
