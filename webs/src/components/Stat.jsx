import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Refined luxury Stat component.
 * Architected as a 'Luminous Biometric Node' featuring ultra-dark surfaces,
 * Playfair Display typography for metrics, and kinetic hover interactions.
 */
export const Stat = memo(({
  label,
  value,
  unit = "",
  change,
  icon: Icon,
  color = "voro-primary",
  className = ""
}) => {
  const isPositive = change !== undefined && parseFloat(change) >= 0;

  // Map color prop to specific Tailwind classes to ensure JIT compatibility
  const glowColors = {
    'voro-primary': 'bg-voro-primary',
    'voro-secondary': 'bg-voro-secondary',
    'voro-accent': 'bg-voro-accent',
    'voro-danger': 'bg-voro-danger',
    'primary': 'bg-voro-primary',
    'secondary': 'bg-voro-secondary'
  };

  const glowClass = glowColors[color] || 'bg-voro-primary';

  return (
    <div className={`
      group relative bg-[#0A0C14] border border-white/5 p-8 rounded-[2rem]
      transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
      hover:border-white/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40
      ${className}
    `}>
      {/* Background Glow Detail */}
      <div className={`
        absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-0
        group-hover:opacity-10 transition-opacity duration-700
        ${glowClass}
      `} />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-1">
            <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] group-hover:text-gray-400 transition-colors">
              {label}
            </p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-widest ${isPositive ? "text-voro-secondary" : "text-voro-danger"}`}>
                <span>{isPositive ? "↑" : "↓"}</span>
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>

          {Icon && (
            <div className={`
              p-3.5 rounded-xl bg-white/[0.02] border border-white/5
              text-gray-600 group-hover:text-white group-hover:bg-white/5
              transition-all duration-500
            `}>
              <Icon size={18} />
            </div>
          )}
        </div>

        <div className="mt-auto flex items-baseline gap-2">
          <p className="text-4xl font-serif italic font-medium text-white tracking-tight leading-none">
            {value}
          </p>
          {unit && (
            <p className="text-[0.65rem] font-mono font-medium text-gray-600 uppercase tracking-widest">
              {unit}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

Stat.displayName = "Stat";

export default Stat;
