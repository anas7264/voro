import React, { memo, useRef, useMemo, useId } from "react";

/**
 * ⚡ REFINEMENT: Luxury Forge-Standard Card Container ('Spatial Artifact Enclave').
 * Features ultra-high-fidelity glassmorphic surfaces, 60fps direct-DOM 3D volumetric tilt,
 * magnetic liquid border intelligence, holographic coordinate telemetry overlays,
 * sub-pixel hash badging, and W3C APG compliant keyboard focus states.
 */
const Card = memo(({
  children,
  className = "",
  hover = false,
  variant = "glass",
  nodeId = "CARD_01",
  tabIndex,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onFocus,
  onBlur,
  ...props
}) => {
  const generatedId = useId();
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  // Generate a deterministic sub-pixel hash badge using useId for SSR safety
  const subpixelHash = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `0xCRD_${cleanId.slice(0, 4).toUpperCase().padStart(4, '0')}`;
  }, [generatedId]);

  const isInteractive = hover || variant === "premium" || variant === "interactive";

  const handleMouseMove = (e) => {
    if (onMouseMove) onMouseMove(e);
    if (!containerRef.current || !isInteractive) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt calculation (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    // Internal Parallax Displacement
    const gridX = (x / rect.width - 0.5) * -15;
    const gridY = (y / rect.height - 0.5) * -15;

    const style = containerRef.current.style;
    style.setProperty('--mouse-x', `${x}px`);
    style.setProperty('--mouse-y', `${y}px`);
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
    if (!containerRef.current || !isInteractive) return;

    const style = containerRef.current.style;
    if (isFocusedRef.current) {
      // Return to focus state static 4-degree tilt
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
    if (!containerRef.current || !isInteractive) return;

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
    if (!containerRef.current || !isInteractive) return;

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

  const resolvedVariantClass = VARIANTS[variant] || VARIANTS.glass;

  const baseClasses = [
    "relative border rounded-[2.5rem] p-10 overflow-hidden group/card transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/50 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]",
    resolvedVariantClass,
    isInteractive && "cursor-pointer hover:border-white/10 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]",
    className
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
      className={baseClasses}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px'
      }}
      {...props}
    >
      {/* 🛰️ Liquid Border Intelligence: Reactive perimeter illumination */}
      {isInteractive && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            padding: '1px',
            background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.35), transparent 80%)`,
            WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* Volumetric Internal Parallax & Grain Layers */}
      {variant !== 'flat' && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: 'translate3d(var(--grid-x, 0px), var(--grid-y, 0px), 0)'
          }}
        >
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
          <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent" />
        </div>
      )}

      {/* Kinetic Sweep & Holographic Spotlight Lens */}
      {isInteractive && (
        <>
          <div aria-hidden="true" className="kinetic-sweep opacity-10 group-hover/card:opacity-35 group-focus-visible/card:opacity-35 transition-opacity duration-1000" />

          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.06), transparent 45%)`,
              transform: 'translateZ(20px)'
            }}
          />

          {/* Holographic Coordinate Telemetry Overlay */}
          <div
            aria-hidden="true"
            className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 transition-all duration-500 select-none"
            style={{ transform: 'translateZ(80px)' }}
          >
            <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
              <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
              <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
              <span className="text-white/20">[{nodeId}]</span>
            </div>
          </div>

          {/* Sub-pixel System Attestation Badge */}
          <div
            aria-hidden="true"
            className="absolute bottom-4 left-8 text-[0.4rem] font-mono font-bold text-white/10 group-hover/card:text-white/30 group-focus-visible/card:text-white/30 transition-colors duration-700 tracking-[0.25em] pointer-events-none select-none"
            style={{ transform: 'translateZ(40px)' }}
          >
            {subpixelHash}
          </div>
        </>
      )}

      {/* Main Content Layer with Volumetric Z-Displacement */}
      <div className="relative z-10" style={isInteractive ? { transform: 'translateZ(50px)' } : {}}>
        {children}
      </div>
    </div>
  );
});

Card.displayName = "Card";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Variant CSS Mappings.
 * Zero heap allocations during component render cycles.
 */
const VARIANTS = Object.freeze({
  glass: "bg-[#0A0C14]/80 backdrop-blur-2xl border-white/5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.05)]",
  solid: "bg-[#0A0C14] border-white/5 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)]",
  flat: "bg-[#020408] border-white/[0.03] shadow-none",
  premium: "bg-[#0A0C14]/60 backdrop-blur-3xl border-white/[0.03] shadow-[0_100px_160px_-40px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(255,255,255,0.05)]",
  interactive: "bg-[#0A0C14]/70 backdrop-blur-2xl border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]"
});

export default Card;
