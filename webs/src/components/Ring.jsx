import React, { memo, useId } from 'react';

/**
 * ⚡ OPTIMIZATION: Memoized Ring component refined into a 'Luminous Bio-Ring'.
 * Multi-layered SVG architecture with gradients and filters for a premium aesthetic.
 */
const Ring = memo(({ value, max, size = 180, unit = 'kcal', color = '#7C3AED', label }) => {
  const safeMax = max > 0 ? max : 1;
  const percentage = Math.min((value / safeMax) * 100, 100);
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Unique ID for SVG gradients/filters to avoid collisions
  const id = useId().replace(/:/g, '');

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 absolute inset-0 overflow-visible"
      >
        <defs>
          <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background track: Thinner and more subtle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth="4"
        />

        {/* Glow stroke: Blurred layer for ambient light */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter={`url(#${id}-glow)`}
          className="transition-all duration-1000 ease-out opacity-20"
        />

        {/* Primary indicator: Precise and high-contrast */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id}-grad)`}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </svg>

      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-gray-500 mb-1">
          {label || 'Metabolic'}
        </div>
        <div className="text-4xl font-serif font-bold text-white leading-none tracking-tight">
          {Math.round(value).toLocaleString()}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[0.6rem] font-bold text-gray-500 uppercase tracking-widest">{unit}</span>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-[0.65rem] font-black text-voro-primary tracking-wider">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  );
});

Ring.displayName = 'Ring';

export default Ring;
