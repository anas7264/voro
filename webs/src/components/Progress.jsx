import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Refined luxury Progress component – 'Kinetic Evolution Bar'.
 * Architected with industrial precision: sharp geometry, multi-layered fills,
 * and kinetic shimmer highlights. Optimized for the Composite layer.
 */
export const Progress = memo(({
  value = 0,
  max = 100,
  color = "primary",
  className = "",
  label,
  showValue = true,
  height = "h-2"
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorMap = {
    primary: "bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]",
    secondary: "bg-voro-secondary shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    accent: "bg-voro-accent shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    danger: "bg-voro-danger shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    info: "bg-voro-info shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    success: "bg-voro-secondary shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    warning: "bg-voro-accent shadow-[0_0_15px_rgba(245,158,11,0.3)]"
  };

  const activeColorClass = colorMap[color] || colorMap.primary;

  return (
    <div className={`Progress-Container group w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-end mb-3 px-1">
          {label && (
            <span className="text-[0.6rem] font-serif italic font-medium text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors duration-500">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-[0.65rem] font-mono font-black text-white/40 group-hover:text-voro-primary transition-colors duration-500">
              {Math.round(percentage)}<span className="opacity-40 ml-0.5">%</span>
            </span>
          )}
        </div>
      )}

      <div className={`relative ${height} bg-white/[0.02] border border-white/5 overflow-hidden backdrop-blur-sm`}>
        {/* Architectural Background Detail - Micro-grid/Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(90deg, #fff 1px, transparent 0)', backgroundSize: '20px 100%' }} />

        {/* Kinetic Evolution Fill */}
        <div
          className={`h-full ${activeColorClass} transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left w-full relative`}
          style={{ transform: `scaleX(${percentage / 100})` }}
        >
          {/* Internal Shimmer Highlight */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-kinetic-sweep opacity-30" />

          {/* Active Tip Glow */}
          <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white/40 shadow-[0_0_10px_#fff] opacity-50" />
        </div>
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;
