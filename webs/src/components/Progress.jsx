import React, { memo } from "react";

const colors = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500"
};

/**
 * ⚡ OPTIMIZATION: Memoized Progress component using transform instead of width.
 * Using scaleX avoids layout reflows (Layout -> Paint -> Composite) and instead
 * stays in the Composite layer for better performance during transitions.
 * Static 'colors' object moved outside to avoid re-allocation on each render.
 */
export const Progress = memo(({ value = 0, max = 100, color = "primary", className = "", label }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-300">{label}</span>
          <span className="text-gray-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-border">
        <div
          className={`h-full ${colors[color]} transition-transform duration-300 origin-left w-full`}
          style={{ transform: `scaleX(${percentage / 100})` }}
        />
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;
