import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Memoized Stat component to prevent unnecessary re-renders.
 * This component is often used in grids (like Dashboard) where multiple instances
 * are present. Memoization ensures they only re-render when their specific data changes.
 */
export const Stat = memo(({ label, value, unit = "", change, icon: Icon, color = "primary", className = "" }) => {
  const isPositive = change && change >= 0;

  return (
    <div className={`bg-[#0A0C14] border border-white/5 rounded-sm p-8 group hover:border-white/10 transition-all ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[0.3em] mb-4">{label}</p>
          <div className="flex items-baseline gap-4">
            <p className="text-5xl font-serif italic text-white tracking-tighter">{value}</p>
            {unit && <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{unit}</p>}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-2 mt-4">
               <div className={`w-2 h-2 rounded-full ${isPositive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
               <p className={`text-[10px] font-mono font-bold tracking-widest ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                {isPositive ? "+" : ""}{change}% DELTA
               </p>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-500">
            <Icon size={20} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    </div>
  );
});

Stat.displayName = "Stat";

export default Stat;
