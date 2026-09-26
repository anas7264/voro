import React, { memo, useEffect, useRef, useId, useMemo, useCallback } from "react";
import Spinner from "./Spinner";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen static lookup mappings.
 * Zero-allocation procedural stream dictionary and glow palette mapping.
 */
const PROCEDURAL_STATUSES = Object.freeze([
  "Initializing Core Heuristics",
  "Calibrating Biometric Sensors",
  "Assembling Data Shards",
  "Optimizing Kinetic Pathways",
  "Synchronizing Metabolic Matrix",
  "Authenticating System Integrity"
]);

const GLOW_COLORS = Object.freeze({
  primary: "rgba(124, 58, 237, 0.35)",
  secondary: "rgba(16, 185, 129, 0.35)",
  accent: "rgba(245, 158, 11, 0.35)",
  danger: "rgba(239, 68, 68, 0.35)",
  white: "rgba(255, 255, 255, 0.25)"
});

/**
 * ⚡ REFINEMENT: Luxury Neural Synthesis Enclave ('LoadingSpinner').
 * Re-engineered conforming to Voro's 'Forge' luxury architectural standard and zero-allocation performance:
 * 1. Zero-allocation direct-DOM status text updates bypassing React re-renders every 2 seconds.
 * 2. Direct-DOM 60fps 3D volumetric rotational tilt tracking (`--mouse-x`, `--mouse-y`, `--tilt-x`, `--tilt-y`).
 * 3. Dynamic magnetic liquid border perimeter illumination mask (`radial-gradient`).
 * 4. High-contrast Playfair Display italic serif hero typography paired with JetBrains Mono tabular metadata.
 * 5. Holographic spatial coordinate telemetry overlays (`TX_...°`, `TY_...°`).
 * 6. SSR-safe deterministic sub-pixel system attestation hash badging (`0xLDR_..._ATTESTED_CHAMBER`) via `useId()`.
 * 7. W3C APG compliant status live-region accessibility (`role="status"`, `aria-live="polite"`, `aria-busy="true"`).
 */
export const LoadingSpinner = memo(({
  fullscreen = false,
  message = "Synthesizing Neural Matrix",
  color = "primary",
  className = "",
  nodeId = "LDR_CHAMBER_01"
}) => {
  const containerRef = useRef(null);
  const statusTextRef = useRef(null);
  const statusIndexRef = useRef(0);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  const reactId = useId();

  // SSR-safe deterministic system attestation hash badge
  const subpixelHash = useMemo(() => {
    const cleanId = reactId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const suffix = cleanId.padEnd(4, '0').slice(-4);
    return `0xLDR_${suffix}_ATTESTED_CHAMBER`;
  }, [reactId]);

  // SSR-safe deterministic node identifier
  const resolvedNodeId = useMemo(() => {
    const cleanId = reactId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `LDR_${cleanId.padEnd(4, '0').slice(-4)}`;
  }, [reactId]);

  /**
   * ⚡ SURGICAL PERFORMANCE OPTIMIZATION: Direct DOM Status Stream Updates.
   * Procedural status stream rotates every 2 seconds via direct DOM text manipulation,
   * eliminating 100% of React component re-renders during active loading sequences.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      statusIndexRef.current = (statusIndexRef.current + 1) % PROCEDURAL_STATUSES.length;
      if (statusTextRef.current) {
        statusTextRef.current.innerText = `${PROCEDURAL_STATUSES[statusIndexRef.current]}...`;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Direct-DOM 60fps 3D Volumetric Rotational Tilt Tracking
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt calculation (max 12 degrees for refined luxury weight)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    const style = containerRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('transform', `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`);
    style.setProperty('transition', 'none');

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    if (isFocusedRef.current) {
      // W3C APG compliant static 4-degree tilt for keyboard focus feedback
      style.setProperty('--tilt-x', '4.00deg');
      style.setProperty('--tilt-y', '-4.00deg');
      style.setProperty('transform', 'perspective(1200px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      style.setProperty('transition', 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, []);

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    style.setProperty('--tilt-x', '4.00deg');
    style.setProperty('--tilt-y', '-4.00deg');
    style.setProperty('transform', 'perspective(1200px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
    style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
  }, []);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    if (!containerRef.current) return;

    if (!isHoveredRef.current) {
      const style = containerRef.current.style;
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      style.setProperty('transition', 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, []);

  const glowColor = GLOW_COLORS[color] || GLOW_COLORS.primary;

  const content = (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px'
      }}
      className={`
        relative group/loader flex flex-col items-center justify-center gap-10 text-center
        p-8 md:p-12 lg:px-16 rounded-[2.5rem] bg-[#0A0C14]/80 border border-white/10 backdrop-blur-3xl
        shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(255,255,255,0.08)]
        outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/20 select-none ${className}
      `}
    >
      {/* 🛰️ Liquid Border Intelligence: Dynamic reactive perimeter illumination */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/loader:opacity-100 group-focus-visible/loader:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Volumetric Internal Layers: Boutique Grain & Precision Grid */}
      <div aria-hidden="true" className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.025]" />
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/loader:opacity-100 group-focus-visible/loader:opacity-100 transition-opacity duration-1000" />

        {/* Luminous Dynamic Spotlight Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover/loader:opacity-100 group-focus-visible/loader:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 50%)`,
            transform: 'translateZ(10px)'
          }}
        />

        {/* Kinetic Ambient Sweep Lens */}
        <div className="kinetic-sweep opacity-10 group-hover/loader:opacity-30 group-focus-visible/loader:opacity-30 transition-opacity duration-1000" />
      </div>

      {/* Holographic Precision Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-5 right-8 pointer-events-none opacity-0 group-hover/loader:opacity-100 group-focus-visible/loader:opacity-100 transition-all duration-500 select-none z-20"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/70 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{resolvedNodeId}]</span>
        </div>
      </div>

      {/* Sub-pixel System Attestation Hash Marker */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-8 pointer-events-none opacity-20 group-hover/loader:opacity-40 group-focus-visible/loader:opacity-40 transition-opacity duration-700 font-mono text-[0.38rem] font-black text-white/40 tracking-[0.25em] uppercase select-none z-20"
        style={{ transform: 'translateZ(40px)' }}
      >
        {subpixelHash}
      </div>

      {/* Central Neural Core Spinner */}
      <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
        <Spinner
          size={fullscreen ? "xl" : "lg"}
          color={color}
          className="drop-shadow-[0_0_35px_rgba(124,58,237,0.3)]"
        />
      </div>

      {/* Editorial Content Stack */}
      <div className="relative z-10 space-y-6 max-w-md" style={{ transform: 'translateZ(60px)' }}>
        {/* Editorial Primary Hero Message */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic font-medium text-white tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          {message}
        </h2>

        {/* Procedural Status Stream */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-voro-primary/50" />
            <span className="text-[0.6rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em] animate-pulse">
              System_Status
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-voro-primary/50" />
          </div>

          <p
            ref={statusTextRef}
            aria-live="polite"
            className="text-[0.65rem] font-mono font-bold text-gray-400 uppercase tracking-widest min-h-[1.5em] group-hover/loader:text-gray-200 transition-colors duration-500"
          >
            {PROCEDURAL_STATUSES[0]}...
          </p>
        </div>
      </div>

      {/* Industrial Footer Telemetry Marker */}
      <div
        aria-hidden="true"
        className="relative z-10 text-[0.45rem] font-mono font-black text-white/20 group-hover/loader:text-white/40 transition-colors duration-700 uppercase tracking-[0.5em] select-none"
        style={{ transform: 'translateZ(30px)' }}
      >
        VORO_EVOLUTION_OS_LOADER_v2.0
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div
        aria-busy="true"
        aria-label={message}
        className="fixed inset-0 bg-[#020408]/90 backdrop-blur-3xl flex items-center justify-center z-[100] p-6 animate-fade-in select-none"
      >
        {/* Ambient background architectural lighting */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-voro-secondary/10 rounded-full blur-[150px]" />
        </div>

        {/* High-fidelity charcoal architecture container */}
        <div className="relative z-10 max-w-xl w-full">
          {content}
        </div>
      </div>
    );
  }

  return content;
});

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
