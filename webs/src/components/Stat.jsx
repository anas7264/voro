import React, { memo, useState, useMemo, useRef } from "react";

/**
 * ⚡ OPTIMIZATION: Refined luxury Stat component.
 * Architected as a 'Kinetic Biometric Lens' featuring ultra-dark surfaces,
 * mouse-tracked radial illumination, and monospaced system markers.
 * Re-engineered with 'Surgical Reactivity': mouse tracking is handled via
 * direct DOM manipulation of CSS variables to bypass React re-renders.
 */
export const Stat = memo(({
  label,
  value,
  unit = "",
  change,
  progress,
  icon: Icon,
  color = "voro-primary",
  className = "",
  nodeId = "NODE_01"
}) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate volumetric tilt (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
    containerRef.current.style.setProperty('--tilt-x-num', tiltX);
    containerRef.current.style.setProperty('--tilt-y-num', tiltY);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  // Memoize random marker to prevent flickering on mouse move re-renders
  const attestedId = useMemo(() => Math.floor(Math.random() * 0x1000000).toString(16).toUpperCase().padStart(6, '0'), []);

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
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`Stat group relative bg-[#0A0C14] border border-white/5 p-10 rounded-[3rem] hover:border-white/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] ${className}`}
    >
      {/* Container clipping mask (individually applied to internal layers to preserve 3D) */}
      <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
        {/* Precision Grid Background - Emerges on Hover */}
        <div
          className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
          style={{ transform: 'translateZ(10px)' }}
        />

        {/* Volumetric Gloss Reflection Layer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
          style={{
            background: `linear-gradient(calc(135deg + (var(--tilt-y-num, 0) * 2deg)), transparent 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 100%)`,
            transform: `translateX(calc(var(--tilt-y-num, 0) * 5px)) translateY(calc(var(--tilt-x-num, 0) * 5px)) translateZ(50px)`,
          }}
        />

        {/* Dynamic Light Lens (Mouse Tracking) */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${activeColor.startsWith('#') ? activeColor + '15' : 'rgba(124, 58, 237, 0.08)'}, transparent 40%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Precision Coordinate Terminal Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none transition-all duration-700 opacity-0 group-hover:opacity-100"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Corner System Markers */}
      <div
        className="absolute bottom-6 left-10 text-[0.45rem] font-mono font-bold text-white/5 group-hover:text-white/20 transition-colors duration-700 tracking-[0.2em] pointer-events-none"
        style={{ transform: 'translateZ(40px)' }}
      >
        0x{attestedId}_ATTESTED
      </div>

      {/* Ambient Glow Detail */}
      <div
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000"
        style={{ backgroundColor: activeColor }}
      />

      <div className="relative flex flex-col h-full z-10" style={{ transform: 'translateZ(30px)' }}>
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
            <p className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tighter leading-none">
              {value}
            </p>
            {unit && (
              <p className="text-[0.65rem] font-mono font-bold text-gray-500 uppercase tracking-[0.3em] group-hover:text-gray-300 transition-colors duration-700">
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
                  className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
              </svg>
              <span className="absolute text-[0.5rem] font-mono font-bold text-gray-500 group-hover:text-white transition-colors duration-700">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Stat.displayName = "Stat";

export default Stat;
