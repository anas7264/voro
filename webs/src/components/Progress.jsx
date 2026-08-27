import React, { memo, useRef, useState, useMemo } from "react";

/**
 * ⚡ REFINEMENT: Luxury Neural Progress Conduit ('Volumetric Progress Lens').
 * Re-engineered with Voro's elite 'Forge' luxury design system standard:
 * high-fidelity charcoal architecture, 60fps direct-DOM volumetric mouse tracking,
 * interactive holographic telemetry, and W3C APG compliant focus physics.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Heavy charcoal surfaces (#0C0906) with multi-layered glassmorphic depth.
 * 2. Precision: Playfair Display italic headers paired with monospaced telemetry metadata.
 * 3. Motion: Direct-DOM 60fps 3D volumetric hover tilts bypassing React render passes.
 * 4. Atmosphere: Kinetic shimmer gradients, luminous lead-edge optics, and sub-pixel grid texture.
 */
export const Progress = memo(({
  value = 0,
  max = 100,
  color = "primary",
  size = "md",
  label,
  showValue = true,
  className = "",
  nodeId: customNodeId,
  "aria-label": ariaLabel,
  ...props
}) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Generate a stable system node ID for telemetry attestation
  const nodeId = useMemo(() => {
    if (customNodeId) return customNodeId;
    const randomHex = Math.floor(Math.random() * 0x1000).toString(16).toUpperCase().padStart(3, '0');
    return `PRG_${randomHex}`;
  }, [customNodeId]);

  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt calculation (max 10deg)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!containerRef.current) return;

    if (isFocused) {
      // Revert to static 4-degree tilt on keyboard focus
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    } else {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!containerRef.current) return;

    // Static 4-degree tilt for keyboard feedback
    containerRef.current.style.setProperty('--tilt-x', '4deg');
    containerRef.current.style.setProperty('--tilt-y', '-4deg');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!containerRef.current && !isHovered) return;

    if (!isHovered && containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const activeColor = CONDUIT_COLORS[color] || CONDUIT_COLORS.primary;
  const activeGlow = GLOW_COLORS[color] || GLOW_COLORS.primary;
  const activeSize = SIZES[size] || SIZES.md;
  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel || label || `Progress conduit: ${Math.round(percentage)}%`}
      style={{
        transform: interactionActive
          ? `perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        group relative p-5 md:p-6 rounded-2xl md:rounded-3xl bg-[#0C0906] border border-white/5
        hover:border-white/20 hover:shadow-[0_30px_70px_rgba(0,0,0,0.8)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408]
        transition-all duration-500 w-full ${className}
      `}
      {...props}
    >
      {/* Precision Micro-Grid & Boutique Grain Overlay */}
      <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.05] group-focus-visible:opacity-[0.05] transition-opacity duration-700" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Light Lens: Mouse Track Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-700"
          style={{
            background: isHovered
              ? `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${activeGlow}, transparent 70%)`
              : `radial-gradient(400px circle at 50% 50%, ${activeGlow}, transparent 70%)`,
          }}
        />
      </div>

      {/* Header Info: Label, Percentage, & Holographic Telemetry */}
      <div className="relative z-10 flex items-center justify-between mb-3.5 gap-4" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)] animate-pulse" />
            <span className="text-[0.45rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em] opacity-80">
              0x{nodeId}
            </span>
          </div>

          {label && (
            <span className="text-xs md:text-sm font-serif italic font-medium text-white/90 truncate tracking-tight group-hover:text-white transition-colors duration-300">
              {label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Spatial Coordinate Telemetry Overlay */}
          <div
            aria-hidden="true"
            className="hidden sm:flex items-center gap-2 font-mono text-[0.45rem] font-bold text-white/30 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500 tracking-widest"
          >
            <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
            <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          </div>

          {showValue && (
            <div className="flex items-baseline gap-0.5 font-mono text-xs md:text-sm font-bold text-white tracking-wider">
              <span>{Math.round(percentage)}</span>
              <span className="text-[0.6rem] text-white/40 font-normal">%</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Track Architecture */}
      <div
        className={`
          relative w-full ${activeSize} rounded-full bg-white/[0.04] border border-white/5
          shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-md p-[2px]
        `}
        style={{ transform: 'translateZ(30px)' }}
      >
        {/* Kinetic Fill Conduit */}
        <div
          className={`
            relative w-full h-full rounded-full bg-gradient-to-r ${activeColor}
            transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
            origin-left shadow-lg
          `}
          style={{ transform: `scaleX(${percentage / 100})` }}
        >
          {/* Internal Kinetic Shimmer Beam */}
          <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-40 mix-blend-overlay" />

          {/* Luminous Pulsing Lead-Edge Lens */}
          {percentage > 0 && (
            <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-white via-white/80 to-transparent rounded-r-full shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse" />
          )}
        </div>
      </div>

      {/* Sub-pixel Architectural Footnote */}
      <div
        aria-hidden="true"
        className="relative z-10 flex items-center justify-between mt-2.5 text-[0.45rem] font-mono text-white/20 tracking-[0.3em] uppercase pointer-events-none"
        style={{ transform: 'translateZ(10px)' }}
      >
        <span>SYS_CONDUIT // LIVE</span>
        <span>{value} / {max} UNIT</span>
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen static maps.
 * Prevents garbage collection overhead and heap allocations on every render pass.
 */
const CONDUIT_COLORS = Object.freeze({
  primary: "from-voro-primary via-purple-500 to-indigo-400 shadow-[0_0_20px_rgba(124,58,237,0.5)]",
  secondary: "from-voro-secondary via-emerald-400 to-teal-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]",
  accent: "from-voro-accent via-amber-400 to-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]",
  danger: "from-voro-danger via-rose-500 to-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]",
  info: "from-voro-info via-cyan-400 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]",
});

const GLOW_COLORS = Object.freeze({
  primary: "rgba(124, 58, 237, 0.12)",
  secondary: "rgba(16, 185, 129, 0.12)",
  accent: "rgba(245, 158, 11, 0.12)",
  danger: "rgba(239, 68, 68, 0.12)",
  info: "rgba(59, 130, 246, 0.12)",
});

const SIZES = Object.freeze({
  xs: "h-2",
  sm: "h-3",
  md: "h-4",
  lg: "h-5",
  xl: "h-6"
});

export default Progress;
