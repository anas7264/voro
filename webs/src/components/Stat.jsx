import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Refined luxury Stat component.
 * Architected as a 'Luminous Biometric Node' featuring ultra-dark surfaces,
 * Playfair Display typography for metrics, and kinetic hover interactions.
 * Re-engineered for the Boutique Masterclass with precision grid systems and light sweeps.
 */
export const Stat = memo(({
  label,
  value,
  unit = "",
  change,
  progress,
  icon: Icon,
  color = "voro-primary",
  className = ""
}) => {
  const isPositive = change !== undefined && parseFloat(change) >= 0;

  const colorMap = {
    'voro-primary': '#7C3AED',
    'voro-secondary': '#10B981',
    'voro-accent': '#F59E0B',
    'voro-danger': '#EF4444',
    'primary': '#7C3AED',
    'secondary': '#10B981'
  };

  const activeColor = colorMap[color] || '#7C3AED';

  return (
    <div className={`
      Stat group relative bg-[#0A0C14] border border-white/5 p-10 rounded-[2.5rem]
      transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
      hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60
      overflow-hidden ${className}
    `}>
      {/* Precision Grid Background - Emerges on Hover */}
      <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      {/* Kinetic Light Sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-kinetic-sweep" />
      </div>

      {/* Ambient Glow Detail */}
      <div
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000"
        style={{ backgroundColor: activeColor }}
      />

      <div className="relative flex flex-col h-full z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-1.5">
            <p className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-[0.4em] group-hover:text-gray-400 transition-colors duration-500">
              {label}
            </p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-[0.6rem] font-black uppercase tracking-widest ${isPositive ? "text-voro-secondary" : "text-voro-danger"}`}>
                <span className="opacity-60">{isPositive ? "↑" : "↓"}</span>
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>

          {Icon && (
            <div className={`
              p-4 rounded-2xl bg-white/[0.02] border border-white/5
              text-gray-600 group-hover:text-white group-hover:bg-white/5
              group-hover:scale-110 group-hover:border-white/10
              transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
              flex items-center justify-center
            `}>
              {typeof Icon === 'string' ? (
                <span className="text-lg leading-none">{Icon}</span>
              ) : (
                <Icon size={18} />
              )}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-4 mt-auto">
          <div className="flex items-baseline gap-2">
            <p className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-none">
              {value}
            </p>
            {unit && (
              <p className="text-[0.65rem] font-mono font-bold text-gray-600 uppercase tracking-[0.2em]">
                {unit}
              </p>
            )}
          </div>

          {progress !== undefined && (
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-white/5"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke={activeColor}
                  strokeWidth="3"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (progress / 100) * 125.6}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-[0.5rem] font-mono font-bold text-gray-500">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Stat.displayName = "Stat";

export default Stat;
