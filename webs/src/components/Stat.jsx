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
  const [isFocused, setIsFocused] = useState(false);

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

    // Direct update for Prismatic Refraction displacement
    containerRef.current.style.setProperty('--refract-x', `${tiltY * 0.5}px`);
    containerRef.current.style.setProperty('--refract-y', `${-tiltX * 0.5}px`);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      // Provide a subtle static tilt for keyboard focus feedback
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      containerRef.current.style.setProperty('--tilt-x-num', '4');
      containerRef.current.style.setProperty('--tilt-y-num', '-4');

      // Update telemetry text for focus state
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";

      containerRef.current.style.setProperty('--refract-x', '-2px');
      containerRef.current.style.setProperty('--refract-y', '-2px');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Memoize random marker to prevent flickering on mouse move re-renders
  const attestedId = useMemo(() => Math.floor(Math.random() * 0x1000000).toString(16).toUpperCase().padStart(6, '0'), []);

  const isPositive = change !== undefined && parseFloat(change) >= 0;
  const activeColor = TOKEN_MAP[color] || 'var(--voro-primary)';
  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      role="group"
      aria-label={`${label}: ${value}${unit ? ` ${unit}` : ''}`}
      style={{
        transform: interactionActive
          ? `perspective(2000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-12px)`
          : `perspective(2000px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
        transition: isHovered ? 'none' : 'transform 1.2s var(--ease-expo-out)',
        transformStyle: 'preserve-3d'
      }}
      className={`Stat group relative bg-[#0C0906] border border-white/5 p-10 rounded-[3.5rem] hover:border-white/20 hover:shadow-[0_60px_120px_rgba(0,0,0,0.9)] focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#080B14] outline-none transition-all duration-500 ${className}`}
    >
      {/* Container clipping mask (individually applied to internal layers to preserve 3D) */}
      <div className="absolute inset-0 rounded-[3.5rem] overflow-hidden pointer-events-none">
        {/* Neural Data Stream: Scrolling procedural telemetry */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-1000 font-mono text-[0.4rem] text-white whitespace-pre leading-none select-none p-4"
          style={{ transform: 'translateZ(5px)' }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
              0x{Math.random().toString(16).slice(2, 10).toUpperCase()} // SYNCHRONIZING_CORE_HEURISTICS_{i} // STABLE
            </div>
          ))}
        </div>

        {/* Precision Grid Background - Emerges on Interaction */}
        <div
          className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.15] group-focus-visible:opacity-[0.15] transition-opacity duration-1000"
          style={{ transform: 'translateZ(10px)' }}
        />

        {/* Prismatic Refraction: Spectrum edge shear */}
        <div
          className="absolute -inset-2 opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-[2px] mix-blend-overlay"
          style={{
            background: `linear-gradient(var(--tilt-x, 0deg), transparent, rgba(255,0,0,0.1), rgba(0,255,0,0.1), rgba(0,0,255,0.1), transparent)`,
            transform: `translate3d(var(--refract-x, 0), var(--refract-y, 0), 15px)`
          }}
        />

        {/* Volumetric Gloss Reflection Layer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 group-focus-visible:opacity-30 transition-opacity duration-700"
          style={{
            background: `linear-gradient(calc(135deg + (var(--tilt-y-num, 0) * 2deg)), transparent 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 100%)`,
            transform: `translateX(calc(var(--tilt-y-num, 0) * 5px)) translateY(calc(var(--tilt-x-num, 0) * 5px)) translateZ(50px)`,
          }}
        />

        {/* Dynamic Light Lens (Mouse Tracking or Focus) */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-700"
          style={{
            background: isHovered
              ? `radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${activeColor}, transparent 85%), transparent 40%)`
              : `radial-gradient(800px circle at 50% 50%, color-mix(in srgb, ${activeColor}, transparent 85%), transparent 40%)`,
            transform: 'translateZ(20px)'
          }}
        />

        {/* Glitch Overlay Detail */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] group-focus-visible:opacity-[0.03] pointer-events-none mix-blend-overlay group-hover:animate-glitch group-focus-visible:animate-glitch"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${activeColor} 3px, transparent 3px)`,
            backgroundSize: '100% 4px'
          }}
        />
      </div>

      {/* Precision Coordinate Terminal Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none transition-all duration-700 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
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
        className="absolute -right-24 -top-24 w-64 h-64 rounded-full blur-[120px] opacity-0 group-hover:opacity-20 group-focus-visible:opacity-20 transition-opacity duration-1000"
        style={{ backgroundColor: activeColor }}
      />

      <div className="relative flex flex-col h-full z-10" style={{ transform: 'translateZ(60px)' }}>
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-1.5">
            <p className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-[0.4em] group-hover:text-gray-400 group-focus-visible:text-gray-400 transition-colors duration-500">
              {label}
            </p>
            {change !== undefined && (
              <div
                className={`flex items-center gap-1 text-[0.6rem] font-black uppercase tracking-widest ${isPositive ? "text-voro-secondary" : "text-voro-danger"}`}
                aria-label={`${isPositive ? 'Increased' : 'Decreased'} by ${Math.abs(change)}%`}
              >
                <span className="opacity-60" aria-hidden="true">{isPositive ? "↑" : "↓"}</span>
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>

          {Icon && (
            <div
              style={{ transform: 'translateZ(40px)' }}
              className={`
              p-4 rounded-2xl bg-white/[0.02] border border-white/5
              text-gray-600 group-hover:text-white group-focus-visible:text-white group-hover:bg-white/5 group-focus-visible:bg-white/5
              group-hover:scale-110 group-focus-visible:scale-110 group-hover:border-white/10 group-focus-visible:border-white/10
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
          <div className="flex items-baseline gap-2" style={{ transform: 'translateZ(80px)' }}>
            <p className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tighter leading-none">
              {value}
            </p>
            {unit && (
              <p className="text-[0.65rem] font-mono font-bold text-gray-500 uppercase tracking-[0.3em] group-hover:text-gray-300 group-focus-visible:text-gray-300 transition-colors duration-700">
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
              <span className="absolute text-[0.5rem] font-mono font-bold text-gray-500 group-hover:text-white group-focus-visible:text-white transition-colors duration-700">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Stat.displayName = "Stat";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted token map.
 * Prevents redundant object allocation on every component render.
 */
const TOKEN_MAP = {
  'voro-primary': 'var(--voro-primary)',
  'voro-secondary': 'var(--voro-secondary)',
  'voro-accent': 'var(--voro-accent)',
  'voro-danger': 'var(--voro-danger)',
  'voro-info': 'var(--voro-info)',
  'primary': 'var(--voro-primary)',
  'secondary': 'var(--voro-secondary)'
};

export default Stat;
