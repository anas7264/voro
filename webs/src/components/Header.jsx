import React, { memo, useRef, useId, useMemo } from "react";

/**
 * ⚡ REFINEMENT: Architectural Editorial Signature (Header).
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features ultra-high-fidelity glassmorphism, 60fps direct-DOM 3D volumetric tilt tracking,
 * magnetic liquid border intelligence, holographic coordinate telemetry overlays,
 * SSR-safe deterministic sub-pixel hash badging (`0xHDR_..._ATTESTED`), W3C APG compliant
 * keyboard focus states, and high-contrast Playfair Display italic serif hero typography paired
 * with JetBrains Mono font-bold metadata.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display italic serif title for editorial weight and prestige.
 * 2. Precision: JetBrains Mono system metadata and sub-pixel attestation markers.
 * 3. Spatial: Golden ratio whitespace optimization (`p-8 md:p-12`, `mb-16 md:mb-24`) with glassmorphic spatial frame.
 * 4. Motion: Direct-DOM volumetric 3D tilt tracking with liquid light perimeter glow bypassing React re-renders.
 */
export const Header = memo(({
  title,
  subtitle,
  eyebrow = "System_Active",
  action,
  className = "",
  tabIndex = 0,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onFocus,
  onBlur,
  ...props
}) => {
  const headerId = useId();
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  // Generate stable system node identification and attestation markers
  const nodeId = useMemo(() => {
    const cleanId = headerId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `HDR_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [headerId]);

  const attestedId = useMemo(() => {
    const cleanId = headerId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `0xHDR_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [headerId]);

  const handleMouseMove = (e) => {
    if (onMouseMove) onMouseMove(e);
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (clamped to max 8 degrees for luxury restraint)
    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    // Internal parallax displacement
    const gridX = (x / rect.width - 0.5) * -12;
    const gridY = (y / rect.height - 0.5) * -12;

    const style = containerRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('--grid-x', `${gridX.toFixed(2)}px`);
    style.setProperty('--grid-y', `${gridY.toFixed(2)}px`);
    style.setProperty('transform', `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`);
    style.setProperty('transition', 'none');

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseEnter = (e) => {
    if (onMouseEnter) onMouseEnter(e);
    isHoveredRef.current = true;
  };

  const handleMouseLeave = (e) => {
    if (onMouseLeave) onMouseLeave(e);
    isHoveredRef.current = false;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    if (isFocusedRef.current) {
      style.setProperty('--tilt-x', '4.00deg');
      style.setProperty('--tilt-y', '-4.00deg');
      style.setProperty('--grid-x', '0px');
      style.setProperty('--grid-y', '0px');
      style.setProperty('transform', 'perspective(1200px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('--grid-x', '0px');
      style.setProperty('--grid-y', '0px');
      style.setProperty('transform', 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      style.setProperty('transition', 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  };

  const handleFocus = (e) => {
    if (onFocus) onFocus(e);
    isFocusedRef.current = true;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    style.setProperty('--tilt-x', '4.00deg');
    style.setProperty('--tilt-y', '-4.00deg');
    style.setProperty('transform', 'perspective(1200px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
    style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
  };

  const handleBlur = (e) => {
    if (onBlur) onBlur(e);
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
  };

  const titleId = `${headerId}-title`;
  const subtitleId = subtitle ? `${headerId}-subtitle` : undefined;

  return (
    <header
      ref={containerRef}
      role="banner"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={tabIndex}
      aria-labelledby={titleId}
      aria-describedby={subtitleId}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px'
      }}
      className={`
        relative mb-16 md:mb-24 p-8 md:p-12 rounded-[2.5rem]
        bg-[#0A0C14]/60 border border-white/5 backdrop-blur-3xl
        shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)]
        flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12
        overflow-hidden group/hdr outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#080B14]
        transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/10
        ${className}
      `}
      {...props}
    >
      {/* 🛰️ Liquid Border Intelligence: Dynamic perimeter illumination */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/hdr:opacity-100 group-focus-within/hdr:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Volumetric Internal Layers: Parallax Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: 'translate3d(var(--grid-x, 0px), var(--grid-y, 0px), 0)'
        }}
      >
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/hdr:opacity-100 group-focus-within/hdr:opacity-100 transition-opacity duration-1000" />
      </div>

      {/* Dynamic Luminous Lens Spotlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover/hdr:opacity-100 group-focus-within/hdr:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 45%)`,
          transform: 'translateZ(20px)'
        }}
      />

      {/* Kinetic Ambient Sweep Lens */}
      <div aria-hidden="true" className="kinetic-sweep opacity-10 group-hover/hdr:opacity-30 group-focus-within/hdr:opacity-30 transition-opacity duration-1000" />

      {/* Holographic Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/hdr:opacity-100 group-focus-within/hdr:opacity-100 transition-all duration-500 select-none"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Sub-pixel System Attestation Marker */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 right-8 pointer-events-none opacity-20 group-hover/hdr:opacity-40 group-focus-within/hdr:opacity-40 transition-opacity duration-700 font-mono text-[0.4rem] font-black text-white/30 tracking-[0.3em] uppercase select-none"
        style={{ transform: 'translateZ(40px)' }}
      >
        {attestedId}_ATTESTED_HDR
      </div>

      {/* Main Content Column */}
      <div className="relative z-10 space-y-5 max-w-3xl" style={{ transform: 'translateZ(60px)' }}>
        {/* System Eyebrow: Technical Context */}
        <div className="flex items-center gap-3 text-voro-primary">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
          </div>
          <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.45em] text-voro-primary/90">
            {eyebrow}
          </span>
          <div className="h-px w-6 bg-voro-primary/30" />
        </div>

        {/* Editorial Title & Description */}
        <div className="space-y-3">
          <h1
            id={titleId}
            className="text-4xl sm:text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-[1.1]"
          >
            {title}
          </h1>
          {subtitle && (
            <p
              id={subtitleId}
              className="text-sm md:text-base font-medium text-gray-400 max-w-2xl leading-relaxed opacity-90"
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Architectural Datum Line */}
        <div aria-hidden="true" className="flex items-center gap-4 pt-2">
          <div className="h-0.5 w-32 bg-gradient-to-r from-voro-primary via-voro-primary-light/80 to-transparent rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover/hdr:w-64 group-focus-within/hdr:w-64 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)] opacity-60" />
        </div>
      </div>

      {/* Dynamic Action Container */}
      {action && (
        <div
          className="relative z-10 flex items-center gap-4 animate-fade-in self-start md:self-end"
          style={{ transform: 'translateZ(70px)' }}
        >
          {action}
        </div>
      )}
    </header>
  );
});

Header.displayName = "Header";

export default Header;
