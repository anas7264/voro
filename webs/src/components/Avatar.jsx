import React, { memo, useRef, useMemo, useId, useCallback } from "react";

/**
 * ⚡ REFINEMENT: Luxury Neural Identity Node ('Avatar').
 * Re-engineered conforming to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features ultra-high-fidelity glassmorphism, 60fps direct-DOM 3D volumetric tilt tracking,
 * magnetic liquid border intelligence, holographic coordinate telemetry overlays,
 * SSR-safe deterministic sub-pixel attestation badging (`0xAVT_...`), and W3C APG compliant keyboard accessibility.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Architectural framing suggests a protected biological asset specimen.
 * 2. Precision: Playfair Display serif accents paired with JetBrains Mono system telemetry.
 * 3. Motion: Direct-DOM 60fps 3D volumetric mouse tracking bypassing React render loops.
 * 4. Atmosphere: Kinetic shimmer gradients, liquid border perimeter, and sub-pixel boutique grain.
 */
export const Avatar = memo(({
  src,
  alt = "Subject Specimen",
  size = "md",
  status = "online",
  nodeId = "AVT_01",
  interactive = false,
  className = "",
  id,
  tabIndex,
  onClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onFocus,
  onBlur,
  ...props
}) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  const generatedId = useId();

  // Determine whether the component responds to interactive gestures
  const isInteractive = interactive || Boolean(onClick);

  // Generate an SSR-safe deterministic sub-pixel attestation hash
  const subpixelHash = useMemo(() => {
    const cleanId = generatedId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `0xAVT_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [generatedId]);

  // Generate a stable specimen identifier
  const specimenId = useMemo(() => {
    if (id) return id;
    const cleanId = generatedId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `ID_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [id, generatedId]);

  const handleMouseMove = useCallback((e) => {
    if (onMouseMove) onMouseMove(e);
    if (!containerRef.current || !isInteractive) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Direct-DOM 60fps 3D volumetric tilt calculation (max 15 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 30;
    const tiltX = (0.5 - (y / rect.height)) * 30;

    const style = containerRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('transform', `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px) scale(1.02)`);
    style.setProperty('transition', 'none');

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  }, [isInteractive, onMouseMove]);

  const handleMouseEnter = useCallback((e) => {
    if (onMouseEnter) onMouseEnter(e);
    isHoveredRef.current = true;
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback((e) => {
    if (onMouseLeave) onMouseLeave(e);
    isHoveredRef.current = false;
    if (!containerRef.current || !isInteractive) return;

    const style = containerRef.current.style;
    if (isFocusedRef.current) {
      // W3C APG static 4-degree keyboard focus tilt feedback
      style.setProperty('--tilt-x', '4.00deg');
      style.setProperty('--tilt-y', '-4.00deg');
      style.setProperty('transform', 'perspective(800px) rotateX(4deg) rotateY(-4deg) translateY(-2px) scale(1.01)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, [isInteractive, onMouseLeave]);

  const handleFocus = useCallback((e) => {
    if (onFocus) onFocus(e);
    isFocusedRef.current = true;
    if (!containerRef.current || !isInteractive) return;

    const style = containerRef.current.style;
    style.setProperty('--tilt-x', '4.00deg');
    style.setProperty('--tilt-y', '-4.00deg');
    style.setProperty('transform', 'perspective(800px) rotateX(4deg) rotateY(-4deg) translateY(-2px) scale(1.01)');
    style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
  }, [isInteractive, onFocus]);

  const handleBlur = useCallback((e) => {
    if (onBlur) onBlur(e);
    isFocusedRef.current = false;
    if (!containerRef.current || !isInteractive) return;

    if (!isHoveredRef.current) {
      const style = containerRef.current.style;
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, [isInteractive, onBlur]);

  const handleKeyDown = useCallback((e) => {
    if (onKeyDown) onKeyDown(e);
    if (isInteractive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.(e);
    }
  }, [isInteractive, onClick, onKeyDown]);

  const sizeClass = SIZES[size] || SIZES.md;
  const statusColorClass = STATUS_COLORS[status] || STATUS_COLORS.online;
  const glowColor = GLOW_COLORS[status] || GLOW_COLORS.online;
  const frameRadiusClass = FRAME_RADII[size] || FRAME_RADII.md;

  const isLarge = size.includes('specimen') || size === '2xl' || size === 'xl';

  const baseClasses = [
    "relative inline-block group/avatar transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]",
    isInteractive && "cursor-pointer hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.8)]",
    className
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
      role={isInteractive ? "button" : "figure"}
      aria-label={`${alt} - Status: ${status}`}
      className={baseClasses}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '800px'
      }}
      {...props}
    >
      {/* 🛰️ Liquid Border Intelligence: Dynamic reactive perimeter illumination */}
      {isInteractive && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 ${frameRadiusClass} opacity-0 group-hover/avatar:opacity-100 group-focus-visible/avatar:opacity-100 transition-opacity duration-700 pointer-events-none`}
          style={{
            padding: '1px',
            background: `radial-gradient(200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 80%)`,
            WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* Outer Specimen Architectural Frame */}
      <div className={`
        relative ${sizeClass} ${frameRadiusClass} overflow-hidden p-1
        bg-[#0A0C14]/80 border border-white/10 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        group-hover/avatar:border-white/25 group-hover/avatar:shadow-[0_30px_60px_rgba(0,0,0,0.7)]
      `}>
        {/* Kinetic Light Sweep */}
        <div aria-hidden="true" className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-0 group-hover/avatar:opacity-20 pointer-events-none" />

        {/* Volumetric Internal Grain & Light Layers */}
        <div aria-hidden="true" className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-white opacity-0 group-hover/avatar:opacity-10 transition-opacity duration-700 pointer-events-none" />

        {/* Biological Image Container */}
        <div className={`relative w-full h-full ${frameRadiusClass} overflow-hidden border border-white/10 group-hover/avatar:border-white/30 transition-all duration-700`}>
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-1000 ease-out scale-105 group-hover/avatar:scale-100"
            />
          ) : (
            <div
              role="img"
              aria-label={alt}
              className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.01] flex items-center justify-center"
            >
              <span className={`font-serif italic text-white/20 group-hover/avatar:text-voro-primary/50 transition-colors duration-700 ${isLarge ? 'text-4xl' : 'text-lg'}`}>
                V
              </span>
            </div>
          )}

          {/* Precision Scanline Effect */}
          <div aria-hidden="true" className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none" />
        </div>

        {/* Internal Luminous Lens */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 group-hover/avatar:opacity-100 group-focus-visible/avatar:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 70%)`,
            transform: 'translateZ(10px)'
          }}
        />
      </div>

      {/* Kinetic Status Beacon Node */}
      <div
        role="status"
        aria-label={`Status: ${status}`}
        title={`Status: ${status}`}
        className={`
          absolute bottom-0 right-0 p-1 bg-[#080B14] rounded-full border border-white/10 shadow-xl
          transition-transform duration-700 group-hover/avatar:scale-110 z-20
        `}
        style={{ transform: 'translateZ(25px)' }}
      >
        <div className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${statusColorClass}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColorClass}`} />
        </div>
      </div>

      {/* System Telemetry Overlay (Active on Hover/Focus) */}
      {isInteractive && (
        <div
          aria-hidden="true"
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 group-focus-visible/avatar:opacity-100 transition-all duration-500 translate-y-1 group-hover/avatar:translate-y-0 pointer-events-none select-none z-30"
          style={{ transform: 'translateZ(50px)' }}
        >
          <div className="flex items-center gap-1.5 text-[0.4rem] font-mono font-bold text-voro-primary uppercase tracking-[0.3em] bg-black/80 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
            <span>[{nodeId}]</span>
            <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
            <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
            <span className="text-white/30">{subpixelHash}</span>
          </div>
        </div>
      )}

      {/* Specimen Header Badge Overlay (For Large Luxury Specimen Sizes) */}
      {isLarge && !isInteractive && (
        <div
          aria-hidden="true"
          className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-all duration-700 translate-y-2 group-hover/avatar:translate-y-0 pointer-events-none z-20"
        >
          <span className="text-[0.45rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em] bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
            {specimenId}_SPECIMEN
          </span>
        </div>
      )}

      {/* Boutique Backglow Depth */}
      <div
        aria-hidden="true"
        className="absolute inset-2 rounded-full bg-voro-primary/10 blur-xl -z-10 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-1000 pointer-events-none"
      />
    </div>
  );
});

Avatar.displayName = "Avatar";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Static Lookup Objects.
 * Zero heap allocations during component render cycles.
 */
const SIZES = Object.freeze({
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
  "2xl": "w-24 h-24",
  "specimen-md": "w-28 h-28",
  "specimen-lg": "w-36 h-36",
  "specimen-xl": "w-48 h-48",
});

const FRAME_RADII = Object.freeze({
  sm: "rounded-full",
  md: "rounded-full",
  lg: "rounded-full",
  xl: "rounded-[1.25rem]",
  "2xl": "rounded-[1.75rem]",
  "specimen-md": "rounded-[1.75rem]",
  "specimen-lg": "rounded-[2rem]",
  "specimen-xl": "rounded-[2.5rem]",
});

const STATUS_COLORS = Object.freeze({
  online: "bg-voro-secondary shadow-[0_0_10px_rgba(16,185,129,0.5)]",
  idle: "bg-voro-accent shadow-[0_0_10px_rgba(245,158,11,0.5)]",
  offline: "bg-gray-600 shadow-[0_0_8px_rgba(156,163,175,0.3)]",
  syncing: "bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]"
});

const GLOW_COLORS = Object.freeze({
  online: "rgba(16, 185, 129, 0.4)",
  idle: "rgba(245, 158, 11, 0.4)",
  offline: "rgba(156, 163, 175, 0.2)",
  syncing: "rgba(124, 58, 237, 0.4)"
});

export default Avatar;
