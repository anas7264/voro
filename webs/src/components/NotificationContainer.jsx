import React from "react";
import { useNotifications } from "../hooks/useNotifications";
import { Alert } from "./Alert";

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50 max-w-md">
      {notifications.map(notification => (
        <Alert
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
          className="animate-slideUp shadow-lg"
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
