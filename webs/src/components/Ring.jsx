import React, { memo, useId, useState } from 'react';

/**
 * ⚡ OPTIMIZATION: Memoized Ring component refined into an 'Exploded Chronographic View'.
 * Multi-layered SVG architecture with gradients, 3D spatial transforms, and architectural
 * connector lines that activate on hover to reveal hidden biometric metadata layers.
 */
const Ring = memo(({ value, max, size = 180, unit = 'kcal', color = '#7C3AED', label }) => {
  const [isHovered, setIsHovered] = useState(false);
  const safeMax = max > 0 ? max : 1;
  const percentage = Math.min((value / safeMax) * 100, 100);

  const radius = size * 0.35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Kinetic Signal Node position
  const angle = (percentage / 100) * 2 * Math.PI;
  const nodeX = size / 2 + radius * Math.cos(angle);
  const nodeY = size / 2 + radius * Math.sin(angle);

  const id = useId().replace(/:/g, '');

  const center = size / 2;

  // Corner Angles for Connector Lines (pointing to corners)
  const corners = [
    { name: 'TL', angle: Math.PI * 1.25, x: 0, y: 0 },
    { name: 'TR', angle: Math.PI * 1.75, x: size, y: 0 },
    { name: 'BL', angle: Math.PI * 0.75, x: 0, y: size },
    { name: 'BR', angle: Math.PI * 0.25, x: size, y: size }
  ];

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        width: size,
        height: size,
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Digital Complications - Displaced in 3D space on hover */}
      <div
        className="absolute inset-0 pointer-events-none p-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered ? 'translateZ(60px) scale(1.1)' : 'translateZ(0px) scale(1)'
        }}
      >
        <div
          className="absolute top-0 left-0 text-[0.4rem] font-mono text-zinc-600 uppercase tracking-[0.2em] flex flex-col transition-transform duration-700"
          style={{ transform: isHovered ? 'translate3d(-15%, -15%, 0)' : 'translate3d(0,0,0)' }}
        >
          <span>VORO_CORE</span>
          <span className="text-voro-secondary/80 font-bold">OPTIMAL</span>
        </div>
        <div
          className="absolute top-0 right-0 text-[0.4rem] font-mono text-zinc-600 uppercase tracking-[0.2em] flex flex-col items-end transition-transform duration-700"
          style={{ transform: isHovered ? 'translate3d(15%, -15%, 0)' : 'translate3d(0,0,0)' }}
        >
          <span>MACRO_SYNC</span>
          <span className="text-voro-primary/80 font-bold">LOCKED</span>
        </div>
        <div
          className="absolute bottom-0 left-0 text-[0.4rem] font-mono text-zinc-600 uppercase tracking-[0.2em] flex flex-col transition-transform duration-700"
          style={{ transform: isHovered ? 'translate3d(-15%, 15%, 0)' : 'translate3d(0,0,0)' }}
        >
          <span>BIOMETRY</span>
          <span className="text-white/40 font-bold">STABLE</span>
        </div>
        <div
          className="absolute bottom-0 right-0 text-[0.4rem] font-mono text-zinc-600 uppercase tracking-[0.2em] flex flex-col items-end transition-transform duration-700"
          style={{ transform: isHovered ? 'translate3d(15%, 15%, 0)' : 'translate3d(0,0,0)' }}
        >
          <span>SIGNAL</span>
          <span className="text-white/40 font-bold">ENCRYPTED</span>
        </div>
      </div>

      <svg
        width={size}
        height={size}
        className="absolute inset-0 overflow-visible transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isHovered ? 'rotateX(20deg) translateZ(20px)' : 'rotateX(0deg) translateZ(0px)',
          transformStyle: 'preserve-3d'
        }}
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

        {/* Architectural Connector Lines - Bridge the Ring to Complications */}
        {corners.map((corner) => (
          <line
            key={corner.name}
            x1={center + radius * Math.cos(corner.angle)}
            y1={center + radius * Math.sin(corner.angle)}
            x2={corner.x}
            y2={corner.y}
            stroke={color}
            strokeWidth="0.5"
            strokeDasharray="4 4"
            className={`transition-all duration-700 ${isHovered ? 'opacity-30' : 'opacity-0'}`}
          />
        ))}

        {/* Rotated Ticks for Depth */}
        <g className="transform -rotate-90 origin-center">
          {Array.from({ length: 60 }).map((_, i) => {
            const tickAngle = (i * 6 * Math.PI) / 180;
            const isMajor = i % 5 === 0;
            const tickRadius = radius + 10;
            const tickLength = isMajor ? 6 : 3;

            const x1 = center + tickRadius * Math.cos(tickAngle);
            const y1 = center + tickRadius * Math.sin(tickAngle);
            const x2 = center + (tickRadius + tickLength) * Math.cos(tickAngle);
            const y2 = center + (tickRadius + tickLength) * Math.sin(tickAngle);

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

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="4"
          />

          <circle
            cx={center}
            cy={center}
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

          <circle
            cx={center}
            cy={center}
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
        </g>
      </svg>

      <div
        className="relative z-10 text-center flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isHovered ? 'translateZ(100px) scale(1.05)' : 'translateZ(0px) scale(1)',
          transformStyle: 'preserve-3d'
        }}
      >
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
