import React, { memo, useId, useState, useRef, useMemo } from 'react';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted pre-computed trigonometric tick map.
 * Pre-calculates 60 trigonometric (cos/sin) tick positions and major step markers
 * at module load, eliminating Array.from heap allocations and 120 Math.cos/Math.sin
 * evaluations on every component render.
 */
const TICK_ANGLES = Object.freeze(
  Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 * Math.PI) / 180;
    return Object.freeze({
      i,
      isMajor: i % 5 === 0,
      cos: Math.cos(angle),
      sin: Math.sin(angle)
    });
  })
);

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted corner vector calculations template builder.
 * Pre-calculates polar angle vectors for exploded complication connectors.
 */
const getCornerVectors = (size) => Object.freeze([
  Object.freeze({ name: 'TL', angle: Math.PI * 1.25, x: 0, y: 0 }),
  Object.freeze({ name: 'TR', angle: Math.PI * 1.75, x: size, y: 0 }),
  Object.freeze({ name: 'BL', angle: Math.PI * 0.75, x: 0, y: size }),
  Object.freeze({ name: 'BR', angle: Math.PI * 0.25, x: size, y: size })
]);

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Kinetic Biometric Chronograph & Radial Lens Node.
 * Re-engineered into a bespoke 60fps Volumetric 3D Interactive Biometric Node featuring:
 * 1. Direct-DOM magnetic 3D mouse-tracked rotational tilt (--tilt-x, --tilt-y).
 * 2. Holographic spatial coordinate telemetry overlays (TX/TY).
 * 3. W3C APG accessible static 4-degree keyboard focus tilts and focus rings.
 * 4. Luminous radial spotlight lens and liquid border perimeter illumination.
 * 5. Editorial Playfair Display italic serif hero typography paired with JetBrains Mono metadata.
 * 6. Sub-pixel attestation hash badging (0xRNG_..._ATTESTED).
 */
const Ring = memo(({ value, max, size = 180, unit = 'kcal', color = '#7C3AED', label, className = "" }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const safeMax = max > 0 ? max : 1;
  const percentage = Math.min((value / safeMax) * 100, 100);

  const radius = size * 0.35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Kinetic Signal Node position
  const angle = (percentage / 100) * 2 * Math.PI;
  const nodeX = size / 2 + radius * Math.cos(angle);
  const nodeY = size / 2 + radius * Math.sin(angle);

  const reactId = useId();
  const nodeId = useMemo(() => {
    const cleanId = reactId.replace(/:/g, '');
    return `RNG_${cleanId.slice(0, 4).toUpperCase()}`;
  }, [reactId]);

  const attestedId = useMemo(() => {
    const cleanId = reactId.replace(/:/g, '');
    return `0x${cleanId.padEnd(6, 'F').slice(0, 6).toUpperCase()}`;
  }, [reactId]);

  const center = size / 2;
  const corners = useMemo(() => getCornerVectors(size), [size]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D rotational tilt calculation (max 15 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 30;
    const tiltX = (0.5 - (y / rect.height)) * 30;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current && !isHovered) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (containerRef.current) {
      if (isFocused) {
        containerRef.current.style.setProperty('--tilt-x', '4deg');
        containerRef.current.style.setProperty('--tilt-y', '-4deg');
        if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
        if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
      } else {
        containerRef.current.style.setProperty('--tilt-x', '0deg');
        containerRef.current.style.setProperty('--tilt-y', '0deg');
      }
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      role="progressbar"
      tabIndex={0}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${label || 'Metabolic'} progress: ${Math.round(value)} of ${max} ${unit} (${Math.round(percentage)}%)`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`
        relative flex flex-col items-center justify-center select-none group/ring outline-none
        rounded-[2rem] p-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        ${className}
      `}
      style={{
        width: size + 32,
        height: size + 32,
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[2rem] bg-[#0A0C14]/60 border border-white/5 backdrop-blur-xl opacity-0 group-hover/ring:opacity-100 group-focus-visible/ring:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none rounded-[2rem]" />

      {/* Liquid Border Perimeter Illumination */}
      <div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover/ring:opacity-100 group-focus-visible/ring:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${color}55, transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Luminous Dynamic Spotlight Lens */}
      <div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover/ring:opacity-100 group-focus-visible/ring:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: isHovered
            ? `radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${color}15, transparent 70%)`
            : `radial-gradient(350px circle at 50% 50%, ${color}15, transparent 70%)`,
          transform: 'translateZ(20px)'
        }}
      />

      {/* Holographic Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-2 right-4 pointer-events-none opacity-0 group-hover/ring:opacity-100 group-focus-visible/ring:opacity-100 transition-all duration-500 z-20"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/70 tracking-[0.2em]">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Sub-pixel Attestation Hash Badge */}
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-4 pointer-events-none opacity-0 group-hover/ring:opacity-40 transition-opacity duration-700 font-mono text-[0.38rem] font-black text-white/30 tracking-[0.25em] uppercase z-20"
        style={{ transform: 'translateZ(40px)' }}
      >
        {attestedId}_ATTESTED
      </div>

      {/* Digital Complications - Displaced in 3D space on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-4 pointer-events-none p-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10"
        style={{
          transformStyle: 'preserve-3d',
          transform: interactionActive ? 'translateZ(60px) scale(1.05)' : 'translateZ(0px) scale(1)'
        }}
      >
        <div
          className="absolute top-0 left-0 text-[0.4rem] font-mono text-gray-500 uppercase tracking-[0.2em] flex flex-col transition-transform duration-700"
          style={{ transform: interactionActive ? 'translate3d(-8%, -8%, 0)' : 'translate3d(0,0,0)' }}
        >
          <span>VORO_CORE</span>
          <span className="text-voro-secondary/80 font-bold">OPTIMAL</span>
        </div>
        <div
          className="absolute top-0 right-0 text-[0.4rem] font-mono text-gray-500 uppercase tracking-[0.2em] flex flex-col items-end transition-transform duration-700"
          style={{ transform: interactionActive ? 'translate3d(8%, -8%, 0)' : 'translate3d(0,0,0)' }}
        >
          <span>MACRO_SYNC</span>
          <span className="text-voro-primary/80 font-bold">LOCKED</span>
        </div>
        <div
          className="absolute bottom-0 left-0 text-[0.4rem] font-mono text-gray-500 uppercase tracking-[0.2em] flex flex-col transition-transform duration-700"
          style={{ transform: interactionActive ? 'translate3d(-8%, 8%, 0)' : 'translate3d(0,0,0)' }}
        >
          <span>BIOMETRY</span>
          <span className="text-white/40 font-bold">STABLE</span>
        </div>
        <div
          className="absolute bottom-0 right-0 text-[0.4rem] font-mono text-gray-500 uppercase tracking-[0.2em] flex flex-col items-end transition-transform duration-700"
          style={{ transform: interactionActive ? 'translate3d(8%, 8%, 0)' : 'translate3d(0,0,0)' }}
        >
          <span>SIGNAL</span>
          <span className="text-white/40 font-bold">ENCRYPTED</span>
        </div>
      </div>

      {/* Main SVG Lens & Progress Chronograph */}
      <svg
        width={size}
        height={size}
        className="relative z-10 overflow-visible transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: interactionActive ? 'rotateX(12deg) translateZ(30px)' : 'rotateX(0deg) translateZ(0px)',
          transformStyle: 'preserve-3d'
        }}
      >
        <defs>
          <linearGradient id={`${reactId}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
          <filter id={`${reactId}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Architectural Connector Lines - Bridge the Ring to Complications */}
        {corners.map((corner) => (
          <line
            aria-hidden="true"
            key={corner.name}
            x1={center + radius * Math.cos(corner.angle)}
            y1={center + radius * Math.sin(corner.angle)}
            x2={corner.x}
            y2={corner.y}
            stroke={color}
            strokeWidth="0.5"
            strokeDasharray="4 4"
            className={`transition-all duration-700 ${interactionActive ? 'opacity-40' : 'opacity-0'}`}
          />
        ))}

        {/* Rotated Ticks for Spatial Chronometer Depth */}
        <g aria-hidden="true" className="transform -rotate-90 origin-center">
          {TICK_ANGLES.map(({ i, isMajor, cos, sin }) => {
            const tickRadius = radius + 10;
            const tickLength = isMajor ? 6 : 3;

            const x1 = center + tickRadius * cos;
            const y1 = center + tickRadius * sin;
            const x2 = center + (tickRadius + tickLength) * cos;
            const y2 = center + (tickRadius + tickLength) * sin;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}
                strokeWidth={isMajor ? 1.2 : 0.6}
                className="transition-opacity duration-1000"
              />
            );
          })}

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="5"
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
            filter={`url(#${reactId}-glow)`}
            className="transition-all duration-1000 ease-out opacity-25"
          />

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${reactId}-grad)`}
            strokeWidth="4.5"
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
              filter={`url(#${reactId}-glow)`}
              className="opacity-90 animate-pulse"
            />
            <circle
              cx={nodeX}
              cy={nodeY}
              r="3.5"
              fill="white"
              className="shadow-sm"
            />
          </g>
        </g>
      </svg>

      {/* Center Editorial Typography & Value Display */}
      <div
        className="absolute z-20 text-center flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
        style={{
          transform: interactionActive ? 'translateZ(90px) scale(1.08)' : 'translateZ(0px) scale(1)',
          transformStyle: 'preserve-3d'
        }}
      >
        <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 mb-1">
          {label || 'Metabolic'}
        </span>
        <div className="text-4xl md:text-5xl font-serif italic font-medium text-white leading-none tracking-tight filter drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
          {Math.round(value).toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[0.55rem] font-mono font-bold text-gray-400 uppercase tracking-widest">{unit}</span>
          <div className="w-1 h-1 rounded-full bg-voro-primary/60 shadow-[0_0_6px_rgba(124,58,237,0.8)]" />
          <span className="text-[0.6rem] font-mono font-black text-voro-primary tracking-wider">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  );
});

Ring.displayName = 'Ring';

export default Ring;
