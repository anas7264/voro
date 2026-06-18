import React, { memo } from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Neural Notification Specimen (Alert).
 * Elevated with multi-layered glassmorphism, kinetic status pulses,
 * and high-fidelity editorial typography.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display serif title for editorial weight.
 * 2. Precision: JetBrains Mono metadata for technical system context.
 * 3. Motion: Kinetic status indicator pulses suggesting live system monitoring.
 * 4. Atmosphere: Ultra-low opacity backgrounds with deep backdrop blurs.
 */
export const Alert = memo(({ type = "info", title, message, onClose, className = "" }) => {
  const icons = {
    error: <AlertCircle size={18} />,
    success: <CheckCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
    danger: <AlertCircle size={18} />
  };

  const variants = {
    error: "border-red-500/30 bg-red-500/[0.03] text-red-400",
    success: "border-emerald-500/30 bg-emerald-500/[0.03] text-emerald-400",
    warning: "border-amber-500/30 bg-amber-500/[0.03] text-amber-400",
    info: "border-voro-primary/30 bg-voro-primary/[0.03] text-voro-primary",
    danger: "border-red-500/30 bg-red-500/[0.03] text-red-400"
  };

  const statusGlow = {
    error: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
    success: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    warning: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
    info: "bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]",
    danger: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
  };

  const currentVariant = variants[type] || variants.info;
  const currentGlow = statusGlow[type] || statusGlow.info;

  return (
    <div
      role="alert"
      className={`
        relative overflow-hidden group
        flex items-start gap-5 p-6 rounded-2xl
        backdrop-blur-2xl border ${currentVariant}
        shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:scale-[1.02] hover:border-white/20
        ${className}
      `}
    >
      {/* Kinetic Status Indicator */}
      <div className="relative flex-shrink-0 mt-1">
        <div className={`w-2 h-2 rounded-full ${currentGlow} animate-pulse`} />
        <div className={`absolute inset-0 w-2 h-2 rounded-full ${currentGlow} animate-ping opacity-40`} />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <span className="text-[0.5rem] font-mono font-black uppercase tracking-[0.4em] opacity-40">
               {type.toUpperCase()}_LOG
             </span>
             <div className="h-px w-4 bg-current opacity-20" />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-white transition-colors p-1 -mr-2 outline-none focus-visible:ring-1 focus-visible:ring-current rounded-full"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="space-y-1">
          {title && (
            <h4 className="text-xl font-serif italic font-medium text-white tracking-tight leading-none">
              {title}
            </h4>
          )}
          {message && (
            <p className="text-xs font-mono font-medium text-gray-400 leading-relaxed tracking-tight max-w-[280px]">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Decorative Architectural Marker */}
      <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
        <div className="font-mono text-[2.5rem] font-black leading-none select-none">
          {type.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Liquid Light Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-10" />
    </div>
  );
});

Alert.displayName = "Alert";

export default Alert;
