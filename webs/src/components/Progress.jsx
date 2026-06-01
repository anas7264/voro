import React, { memo } from "react";

/**
 * Optimized Progress component
 * ⚡ Performance Boost:
 * 1. Uses React.memo to prevent unnecessary re-renders of the progress bar.
 * 2. Swaps 'width' animation for 'transform: scaleX' to move work to the compositor thread (GPU),
 *    avoiding expensive Layout and Reflow stages of the rendering pipeline.
 * 3. Uses 'will-change: transform' to hint the browser for optimization.
 */
export const Progress = memo(({ value = 0, max = 100, color = "primary", className = "", label }) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500"
  };

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
          className={`h-full ${colors[color] || colors.primary} transition-transform duration-300 ease-out origin-left will-change-transform`}
          style={{
            transform: `scaleX(${percentage / 100})`,
            width: '100%'
          }}
        />
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;
