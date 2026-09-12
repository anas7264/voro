import React, { memo, useRef, useState, useId, useMemo } from "react";

/**
 * ⚡ REFINEMENT: Luxury Kinetic Neural Stratum Conduit & Telemetry Node (Divider).
 * Re-engineered to Voro's 'Forge' luxury system standard: features deterministic SSR-safe
 * node identification, sub-pixel attestation hash badging (`0xDIV_...`), zero-allocation
 * 60fps direct-DOM 3D volumetric tilt tracking, dynamic liquid perimeter illumination,
 * live coordinate telemetry overlays, W3C APG compliant non-focusable separator semantics,
 * and editorial Playfair Display italic serif typography paired with JetBrains Mono metadata.
 */
export const Divider = memo(({ label, className = "" }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const reactId = useId();

  // Generate stable system node identification and attestation markers
  const nodeId = useMemo(() => {
    const cleanId = reactId.replace(/:/g, '');
    return `DIV_${cleanId.slice(0, 4).toUpperCase()}`;
  }, [reactId]);

  const attestedHash = useMemo(() => {
    const cleanId = reactId.replace(/:/g, '');
    return `0xDIV_STRATUM_${cleanId.padEnd(6, '0').slice(0, 6).toUpperCase()}`;
  }, [reactId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt calculation (clamped to max 4 degrees for subtle stratum depth)
    const tiltY = ((x / rect.width) - 0.5) * 8;
    const tiltX = (0.5 - (y / rect.height)) * 8;

    containerRef.current.style.setProperty("--mouse-x", `${x}px`);
    containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    containerRef.current.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    containerRef.current.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (containerRef.current) {
          containerRef.current.style.setProperty('--tilt-x', '0deg');
          containerRef.current.style.setProperty('--tilt-y', '0deg');
        }
      }}
      role="separator"
      aria-orientation="horizontal"
      aria-label={label ? `Stratum divider: ${label}` : "Stratum divider"}
      style={{
        transform: isHovered
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-1px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative flex items-center justify-between gap-6 my-8 py-3 px-4 rounded-xl
        bg-[#0A0C14]/30 border border-white/[0.03] backdrop-blur-md
        group/divider outline-none
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
        ${className}
      `}
    >
      {/* Dynamic Liquid Border Perimeter Illumination */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover/divider:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.25), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Precision Grid Background & Boutique Grain Overlay */}
      <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/divider:opacity-100 pointer-events-none transition-opacity duration-1000 rounded-xl" />
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none rounded-xl" />

      {/* Dynamic Light Spotlight Lens */}
      <div
        className="absolute inset-0 opacity-0 group-hover/divider:opacity-100 pointer-events-none transition-opacity duration-700 rounded-xl"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.06), transparent 45%)`
            : `radial-gradient(400px circle at 50% 50%, rgba(124, 58, 237, 0.06), transparent 45%)`,
          transform: 'translateZ(10px)'
        }}
      />

      {/* Holographic Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-1 right-3 pointer-events-none opacity-0 group-hover/divider:opacity-100 transition-all duration-500 z-20"
        style={{ transform: 'translateZ(40px)' }}
      >
        <div className="flex items-center gap-2 font-mono text-[0.38rem] font-bold text-voro-primary/60 tracking-[0.2em]">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Lead Conduit: High-fidelity charcoal gradient */}
      <div className="relative flex-1 h-px z-10" style={{ transform: 'translateZ(20px)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-voro-primary/50" />
        <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-20 group-hover/divider:opacity-40 transition-opacity duration-1000" />
      </div>

      {/* Center Stratum Label or Minimalist Node */}
      <div className="relative z-10 flex items-center gap-3 px-2" style={{ transform: 'translateZ(30px)' }}>
        {/* Kinetic Signal Node (Left) */}
        <div className="relative flex h-1.5 w-1.5 shrink-0">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-50" />
          <div className="relative inline-flex rounded-full h-1.5 w-1.5 bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
        </div>

        {label ? (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[0.5rem] font-mono font-bold uppercase tracking-[0.3em] text-voro-primary/70">
              STRATUM // {nodeId}
            </span>
            <span className="text-sm md:text-base font-serif italic font-medium text-white tracking-tight group-hover/divider:text-voro-primary transition-colors duration-500">
              {label}
            </span>
          </div>
        ) : (
          <span className="text-[0.5rem] font-mono font-bold uppercase tracking-[0.3em] text-voro-primary/70">
            STRATUM_CONDUIT
          </span>
        )}

        {/* Kinetic Signal Node (Right) */}
        <div className="relative flex h-1.5 w-1.5 shrink-0">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-30" />
          <div className="relative inline-flex rounded-full h-1.5 w-1.5 bg-voro-primary/60 shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
        </div>
      </div>

      {/* Trailing Conduit: High-fidelity charcoal gradient */}
      <div className="relative flex-1 h-px z-10" style={{ transform: 'translateZ(20px)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-voro-primary/50 via-white/[0.05] to-transparent" />
        <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-20 group-hover/divider:opacity-40 transition-opacity duration-1000" />
      </div>

      {/* Sub-pixel System Attestation Hash Badge */}
      <div
        aria-hidden="true"
        className="absolute -bottom-2.5 left-4 text-[0.38rem] font-mono font-bold text-white/10 group-hover/divider:text-white/30 transition-colors duration-700 tracking-[0.2em] pointer-events-none select-none z-20"
        style={{ transform: 'translateZ(30px)' }}
      >
        {attestedHash}
      </div>
    </div>
  );
});

Divider.displayName = "Divider";

export default Divider;
