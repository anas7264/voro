import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

export const Alert = ({ type = "info", title, message, onClose, className = "" }) => {
  const icons = {
    error: <AlertCircle size={20} />,
    success: <CheckCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />
  };

  const colors = {
    error: "bg-red-500 bg-opacity-10 border-red-500 text-red-400",
    success: "bg-green-500 bg-opacity-10 border-green-500 text-green-400",
    warning: "bg-yellow-500 bg-opacity-10 border-yellow-500 text-yellow-400",
    info: "bg-blue-500 bg-opacity-10 border-blue-500 text-blue-400"
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${colors[type]} ${className}`}>
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold">{title}</h4>}
        {message && <p className="text-sm mt-1">{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-75 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
