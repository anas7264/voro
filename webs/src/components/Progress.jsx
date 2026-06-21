import React, { memo } from "react";

/**
 * ⚡ REFINEMENT: Luxury Neural Progress Conduit.
 * Re-engineered with the Forge design system: glassmorphic tracks,
 * kinetic shimmer gradients, and luminous lead-edge optics.
 *
 * DESIGN PHILOSOPHY:
 * 1. Precision: JetBrains Mono for data points.
 * 2. Performance: scaleX transform to avoid layout reflows.
 * 3. Feedback: Luminous "lead edge" suggests active momentum.
 * 4. Atmosphere: Kinetic shimmer suggesting live data processing.
 */
export const Progress = memo(({
  value = 0,
  max = 100,
  color = "primary",
  className = "",
  label,
  showValue = true,
  size = "md"
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    primary: "from-voro-primary to-voro-primary-light shadow-[0_0_15px_rgba(124,58,237,0.4)]",
    secondary: "from-voro-secondary to-voro-secondary-light shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    accent: "from-voro-accent to-yellow-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
    danger: "from-voro-danger to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]",
    info: "from-voro-info to-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.4)]",
  };

  const sizes = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const activeColor = colors[color] || colors.primary;
  const activeSize = sizes[size] || sizes.md;

  return (
    <div className={`w-full group/progress ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax={max}>
      {label && (
        <div className="flex justify-between items-end mb-3">
          <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within/progress:text-voro-primary transition-colors">
            {label}
          </span>
          {showValue && (
            <span className="text-[0.65rem] font-mono font-bold text-gray-400 tracking-widest">
              {Math.round(percentage)}<span className="opacity-40 ml-0.5">%</span>
            </span>
          )}
        </div>
      )}

      {/* Progress Track: Glassmorphic Architecture */}
      <div className={`
        relative w-full ${activeSize} rounded-full
        bg-white/[0.03] border border-white/5
        shadow-inner overflow-hidden backdrop-blur-sm
      `}>
        {/* Fill Layer: Kinetic Conduit */}
        <div
          className={`
            absolute inset-0 w-full h-full rounded-full
            bg-gradient-to-r ${activeColor}
            transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
            origin-left
          `}
          style={{ transform: `scaleX(${percentage / 100})` }}
        >
          {/* Internal Shimmer Pulse */}
          <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-30" />

          {/* Luminous Lead Edge */}
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent blur-sm" />
        </div>

        {/* Tactical Overlay: Sub-pixel Detail */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-grid-white" />
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;
