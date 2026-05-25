import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Memoized Stat component to prevent unnecessary re-renders.
 * This component is often used in grids (like Dashboard) where multiple instances
 * are present. Memoization ensures they only re-render when their specific data changes.
 */
export const Stat = memo(({ label, value, unit = "", change, icon: Icon, color = "primary", className = "" }) => {
  const isPositive = change && change >= 0;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-bold text-white">{value}</p>
            {unit && <p className="text-gray-400 text-sm">{unit}</p>}
          </div>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? "+" : ""}{change}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-${color} bg-opacity-10`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
        )}
      </div>
    </div>
  );
});

Stat.displayName = "Stat";

export default Stat;
