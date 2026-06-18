import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

export const Alert = ({ type = "info", title, message, onClose, className = "" }) => {
  const icons = {
    error: <AlertCircle size={18} className="text-red-500/80" />,
    success: <CheckCircle size={18} className="text-voro-primary/80" />,
    warning: <AlertTriangle size={18} className="text-orange-500/80" />,
    info: <Info size={18} className="text-blue-400/80" />
  };

  const variants = {
    error: "border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]",
    success: "border-voro-primary/20 shadow-[0_0_15px_rgba(212,163,115,0.05)]",
    warning: "border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]",
    info: "border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]"
  };

  const glows = {
    error: "bg-red-500/5",
    success: "bg-voro-primary/5",
    warning: "bg-orange-500/5",
    info: "bg-blue-500/5"
  };

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`relative overflow-hidden backdrop-blur-xl bg-white/[0.03] border rounded-px p-4 flex items-start gap-4 group transition-all duration-300 ${variants[type]} ${className}`}
    >
      {/* Architectural Glow */}
      <div className={`absolute -right-4 -top-4 w-16 h-16 blur-2xl rounded-full opacity-50 ${glows[type]}`} />

      <div className="relative mt-0.5 flex-shrink-0">{icons[type]}</div>

      <div className="relative flex-1 min-w-0">
        {title && (
          <h4 className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/40 mb-1">
            {title}
          </h4>
        )}
        {message && (
          <p className="font-serif italic text-sm text-white/90 leading-relaxed">
            {message}
          </p>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="relative hover:text-white text-white/20 transition-colors active:scale-90"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Alert;
