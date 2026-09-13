import React, { memo, useRef, useId, useMemo, useCallback } from 'react';

/**
 * ⚡ REFINEMENT: Luxury Kinetic Neural Brand Signature Node (VoroLogo).
 * Re-engineered to Voro's 'Forge' luxury architecture standards:
 * Features multi-layered kinetic orbital rings, asynchronous rotation vectors,
 * 60fps direct-DOM 3D volumetric tilt tracking, liquid light perimeter illumination,
 * live coordinate telemetry overlays, SSR-safe sub-pixel attestation hash badging (`0xLOGO_...`),
 * and Playfair Display italic serif typography paired with JetBrains Mono system metadata.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display italic serif brand mark suggests heritage, prestige, and high art.
 * 2. Precision: Multi-ring orbital telemetry with sub-pixel hash attestation for digital authenticity.
 * 3. Spatial: Golden ratio whitespace alignment and glassmorphic depth.
 * 4. Motion: 60fps direct-DOM rotational tilt and liquid light perimeter mask.
 */
const VoroLogo = memo(({
  size = 80,
  withText = false,
  className = '',
  onClick,
  ...props
}) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  const generatedId = useId();

  // Generate an SSR-safe deterministic attestation hash badge
  const subpixelHash = useMemo(() => {
    const cleanId = generatedId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `0xLOGO_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [generatedId]);

  const isInteractive = Boolean(onClick);

  // 60fps direct-DOM 3D volumetric tilt tracking
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !isInteractive) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D rotational tilt calculation (max 15 degrees for responsive luxury touch)
    const tiltY = ((x / rect.width) - 0.5) * 30;
    const tiltX = (0.5 - (y / rect.height)) * 30;

    const style = containerRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('transform', `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-2px) scale(1.02)`);
    style.setProperty('transition', 'none');

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  }, [isInteractive]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!containerRef.current || !isInteractive) return;

    const style = containerRef.current.style;
    if (isFocusedRef.current) {
      // W3C APG compliant keyboard focus static 4-degree tilt feedback
      style.setProperty('--tilt-x', '4.00deg');
      style.setProperty('--tilt-y', '-4.00deg');
      style.setProperty('transform', 'perspective(800px) rotateX(4deg) rotateY(-4deg) translateY(-2px) scale(1.02)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)');
      style.setProperty('transition', 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, [isInteractive]);

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    if (!containerRef.current || !isInteractive) return;

    const style = containerRef.current.style;
    style.setProperty('--tilt-x', '4.00deg');
    style.setProperty('--tilt-y', '-4.00deg');
    style.setProperty('transform', 'perspective(800px) rotateX(4deg) rotateY(-4deg) translateY(-2px) scale(1.02)');
    style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
  }, [isInteractive]);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    if (!containerRef.current || !isInteractive) return;

    if (!isHoveredRef.current) {
      const style = containerRef.current.style;
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)');
      style.setProperty('transition', 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, [isInteractive]);

  const handleKeyDown = useCallback((e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  }, [onClick]);

  const interactiveAttrs = isInteractive
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-label': 'Voro Brand Signature Node',
        onClick,
        onKeyDown: handleKeyDown,
      }
    : {};

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`
        relative inline-flex items-center gap-6 p-3 rounded-2xl outline-none select-none group/logo
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isInteractive ? 'cursor-pointer hover:bg-white/[0.02] focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]' : ''}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '800px'
      }}
      {...interactiveAttrs}
      {...props}
    >
      {/* 🛰️ Liquid Light Perimeter Illumination Mask */}
      {isInteractive && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl opacity-0 group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            padding: '1px',
            background: `radial-gradient(200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.4), transparent 80%)`,
            WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* Volumetric Internal Grain & Atmospheric Backlight Lens */}
      <div aria-hidden="true" className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none rounded-2xl" />

      {isInteractive && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl opacity-0 group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(250px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 70%)`,
            transform: 'translateZ(10px)'
          }}
        />
      )}

      {/* Neural Synthesis Core Node */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: size,
          height: size,
          transform: 'translateZ(30px)'
        }}
      >
        {/* Outer Kinetic Ring: Slow Orbit with Precision Signal Node */}
        <div className="absolute inset-0 rounded-full border border-voro-primary/20 group-hover/logo:border-voro-primary/40 transition-colors duration-700 animate-[spin-slow_12s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.9)]" />
        </div>

        {/* Middle Kinetic Ring: Reverse Orbit with Industrial Telemetry Dashes */}
        <div
          className="absolute inset-[12%] rounded-full border border-voro-primary/30 group-hover/logo:border-voro-primary/60 transition-colors duration-700 animate-[spin-reverse_8s_linear_infinite]"
          style={{ borderStyle: 'dashed', borderWidth: '1px', strokeDasharray: '4 8' }}
        />

        {/* Inner Glassmorphic Core */}
        <div className="absolute inset-[25%] rounded-full bg-[#0A0C14]/80 backdrop-blur-md border border-voro-primary/40 group-hover/logo:border-voro-primary/80 shadow-[0_0_30px_rgba(124,58,237,0.3)] group-hover/logo:shadow-[0_0_45px_rgba(124,58,237,0.5)] transition-all duration-700 flex items-center justify-center overflow-hidden">
          {/* Luminous Core Reflection Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-voro-primary/20 opacity-60 pointer-events-none" />

          {/* Editorial Brand Mark ('V') */}
          <span
            className="text-white font-serif italic font-bold relative z-10 leading-none select-none transition-transform duration-700 group-hover/logo:scale-110 drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]"
            style={{ fontSize: size * 0.35 }}
          >
            V
          </span>
        </div>

        {/* Ambient Pulsing Glow Aura */}
        <div className="absolute -inset-1 bg-voro-primary/25 blur-xl rounded-full animate-pulse pointer-events-none opacity-80 group-hover/logo:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Unified Editorial Brand Typography */}
      {withText && (
        <div
          className="flex flex-col z-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: 'translateZ(25px)' }}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-white font-serif italic font-medium text-2xl md:text-3xl tracking-tighter leading-none group-hover/logo:text-voro-primary-light transition-colors duration-500">
              Voro
            </span>
            <span className="text-[0.45rem] font-mono font-bold text-voro-primary/70 tracking-widest uppercase">
              [0xLOGO_VAULT]
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[0.55rem] font-mono font-bold text-voro-primary uppercase tracking-[0.4em] opacity-90">
              Evolution OS
            </span>
            <div className="w-1 h-1 rounded-full bg-voro-primary/80 shadow-[0_0_6px_rgba(124,58,237,0.8)]" />
            <span className="text-[0.45rem] font-mono font-bold text-white/30 tracking-widest">
              {subpixelHash}
            </span>
          </div>
        </div>
      )}

      {/* Holographic Coordinate Telemetry Overlay (Active for Interactive Logo Nodes) */}
      {isInteractive && (
        <div
          aria-hidden="true"
          className="absolute top-1 right-2 pointer-events-none opacity-0 group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100 transition-opacity duration-500 font-mono text-[0.4rem] font-bold text-voro-primary/60 leading-none select-none flex items-center gap-1.5 z-20"
          style={{ transform: 'translateZ(40px)' }}
        >
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
        </div>
      )}
    </div>
  );
});

VoroLogo.displayName = 'VoroLogo';

export default VoroLogo;
