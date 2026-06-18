import React from "react";
import { useNotifications } from "../hooks/useNotifications";
import { Alert } from "./Alert";

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-8 right-8 space-y-3 z-[100] max-w-sm w-full px-4 sm:px-0">
      {notifications.map(notification => (
        <Alert
          key={notification.id}
          type={notification.type}
          title={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
          className="animate-slide-up"
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
