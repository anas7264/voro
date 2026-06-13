import React, { memo, useId } from 'react';

/**
 * ⚡ OPTIMIZATION: Memoized Ring component refined into a 'Luminous Bio-Ring'.
 * Multi-layered SVG architecture with gradients and filters for a premium aesthetic.
 */
const Ring = memo(({ value, max, size = 180, unit = 'kcal', color = '#7C3AED', label }) => {
  const safeMax = max > 0 ? max : 1;
  const percentage = Math.min((value / safeMax) * 100, 100);

  // Refined mathematical architecture: Radius shrunk to 35% of size to ensure
  // chronographic complications and ticks never clip within the container.
  const radius = size * 0.35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Kinetic Signal Node position
  const angle = (percentage / 100) * 2 * Math.PI;
  const nodeX = size / 2 + radius * Math.cos(angle);
  const nodeY = size / 2 + radius * Math.sin(angle);

  // Unique ID for SVG gradients/filters to avoid collisions
  const id = useId().replace(/:/g, '');

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Digital Complications - Contextually refined labels with high-legibility zinc contrast */}
      <div className="absolute inset-0 pointer-events-none p-1">
        <div className="absolute top-0 left-0 text-[0.4rem] font-mono text-zinc-600 uppercase tracking-[0.2em] flex flex-col">
          <span>VORO_CORE</span>
          <span className="text-voro-secondary/80 font-bold">OPTIMAL</span>
        </div>
        <div className="absolute top-0 right-0 text-[0.4rem] font-mono text-zinc-600 uppercase tracking-[0.2em] flex flex-col items-end">
          <span>MACRO_SYNC</span>
          <span className="text-voro-primary/80 font-bold">LOCKED</span>
        </div>
        <div className="absolute bottom-0 left-0 text-[0.4rem] font-mono text-zinc-600 uppercase tracking-[0.2em] flex flex-col">
          <span>BIOMETRY</span>
          <span className="text-white/40 font-bold">STABLE</span>
        </div>
        <div className="absolute bottom-0 right-0 text-[0.4rem] font-mono text-zinc-600 uppercase tracking-[0.2em] flex flex-col items-end">
          <span>SIGNAL</span>
          <span className="text-white/40 font-bold">ENCRYPTED</span>
        </div>
      </div>

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

        {/* Precision Chronographic Ticks - Spaced perfectly between ring and complications */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 * Math.PI) / 180;
          const isMajor = i % 5 === 0;
          const tickRadius = radius + 10;
          const tickLength = isMajor ? 6 : 3;

          const x1 = size / 2 + tickRadius * Math.cos(angle);
          const y1 = size / 2 + tickRadius * Math.sin(angle);
          const x2 = size / 2 + (tickRadius + tickLength) * Math.cos(angle);
          const y2 = size / 2 + (tickRadius + tickLength) * Math.sin(angle);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMajor ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}
              strokeWidth={isMajor ? 1 : 0.5}
              className="transition-opacity duration-1000"
            />
          );
        })}

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

        {/* Kinetic Signal Node */}
        <g className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <circle
            cx={nodeX}
            cy={nodeY}
            r="8"
            fill={color}
            filter={`url(#${id}-glow)`}
            className="opacity-80"
          />
          <circle
            cx={nodeX}
            cy={nodeY}
            r="3"
            fill="white"
            className="shadow-sm"
          />
        </g>
      </svg>

      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="text-[0.65rem] font-serif italic font-medium uppercase tracking-tighter text-gray-500 mb-1">
          {label || 'Metabolic'}
        </div>
        <div className="text-5xl font-serif italic font-medium text-white leading-none tracking-tight">
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
