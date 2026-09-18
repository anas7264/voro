import React, { memo, useRef, useId, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted and frozen static default fallbacks.
 * Eliminates array allocation overhead per render cycle.
 */
const EMPTY_ITEMS = Object.freeze([]);

/**
 * ⚡ REFINEMENT: Luxury Kinetic Spatial Navigation Matrix (Breadcrumb).
 * Re-engineered with the Voro 'Forge' design system: high-fidelity charcoal architecture,
 * zero-allocation direct-DOM volumetric 3D tilt tracking, holographic coordinate telemetry,
 * dynamic liquid border lighting, and W3C APG compliant focus states.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display italic serif headings for active terminal nodes.
 * 2. Precision: JetBrains Mono for navigation path segments and technical telemetry.
 * 3. Motion: Direct-DOM 60fps volumetric tilt bypassing React component re-renders.
 * 4. Spatial: Mathematical alignment of technical metadata nodes with luxury gallery aesthetics.
 */
export const Breadcrumb = memo(({ items = EMPTY_ITEMS, className = "" }) => {
  const containerRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  const generatedId = useId();

  // Generate stable system node identification and attestation markers
  const nodeId = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `BRD_${cleanId.slice(0, 4).toUpperCase()}`;
  }, [generatedId]);

  const attestedHash = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `0xBRD_SEQ_${cleanId.padEnd(6, '0').slice(0, 6).toUpperCase()}`;
  }, [generatedId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Direct DOM volumetric 3D tilt calculation (max 8deg rotation)
    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    const style = containerRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('transform', `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-2px)`);
    style.setProperty('transition', 'none');

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    if (isFocusedRef.current) {
      style.setProperty('--tilt-x', '4deg');
      style.setProperty('--tilt-y', '-4deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
      style.setProperty('transition', 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)');
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      style.setProperty('transition', 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)');
      if (txRef.current) txRef.current.innerText = "0.0";
      if (tyRef.current) tyRef.current.innerText = "0.0";
    }
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    style.setProperty('--tilt-x', '4deg');
    style.setProperty('--tilt-y', '-4deg');
    style.setProperty('transform', 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
    style.setProperty('transition', 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)');
    if (txRef.current) txRef.current.innerText = "4.0";
    if (tyRef.current) tyRef.current.innerText = "-4.0";
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    if (!containerRef.current) return;

    if (!isHoveredRef.current) {
      const style = containerRef.current.style;
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      style.setProperty('transition', 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)');
      if (txRef.current) txRef.current.innerText = "0.0";
      if (tyRef.current) tyRef.current.innerText = "0.0";
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      className={`
        Breadcrumb group/breadcrumb relative overflow-hidden bg-[#0A0C14]/90 border border-white/5
        rounded-[1.75rem] px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_0_rgba(255,255,255,0.05)]
        backdrop-blur-2xl outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#080B14]
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/15
        ${className}
      `}
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Dynamic Liquid Border Perimeter Illumination */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[1.75rem] opacity-0 group-hover/breadcrumb:opacity-100 group-focus-within/breadcrumb:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Grid & Grain Background */}
      <div aria-hidden="true" className="absolute inset-0 bg-grid-white opacity-0 group-hover/breadcrumb:opacity-[0.03] group-focus-within/breadcrumb:opacity-[0.03] transition-opacity duration-1000 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />

      {/* Dynamic Liquid Light Spot Follower */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover/breadcrumb:opacity-100 group-focus-within/breadcrumb:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(250px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124,58,237,0.12), transparent 70%)`
        }}
      />

      {/* Holographic Telemetry & System Node ID */}
      <div
        aria-hidden="true"
        className="absolute top-2 right-5 pointer-events-none opacity-0 group-hover/breadcrumb:opacity-100 group-focus-within/breadcrumb:opacity-100 transition-all duration-500 z-20"
      >
        <div className="flex items-center gap-3 font-mono text-[0.4rem] font-bold text-voro-primary/70 uppercase tracking-widest">
          <span>TX_<span ref={txRef}>0.0</span>° TY_<span ref={tyRef}>0.0</span>°</span>
          <span className="text-white/20">[{attestedHash}]</span>
        </div>
      </div>

      <ol className="relative z-10 flex items-center gap-2 md:gap-4 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const segmentId = `NAV_0${index + 1}`;

          return (
            <li key={index} className="flex items-center gap-2 md:gap-4">
              {index > 0 && (
                <div className="flex items-center text-gray-600/60 group-hover/breadcrumb:text-voro-primary/60 transition-colors duration-500">
                  <ChevronRight
                    size={14}
                    className="flex-shrink-0"
                    aria-hidden="true"
                  />
                </div>
              )}

              <div className="flex items-center group/breadcrumb-node">
                {!isLast ? (
                  <Link
                    to={item.href || "#"}
                    aria-label={`Navigate to ${item.label}`}
                    className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-500 hover:bg-white/[0.04] hover:backdrop-blur-md focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none group/link"
                  >
                    {/* System Telemetry Marker */}
                    <span
                      className="text-[0.45rem] font-mono font-bold text-gray-600 group-hover/link:text-voro-primary group-focus-visible/link:text-voro-primary transition-colors duration-500"
                      aria-hidden="true"
                    >
                      {segmentId}
                    </span>

                    {/* Path Segment */}
                    <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.2em] text-gray-400 group-hover/link:text-gray-100 group-focus-visible/link:text-gray-100 transition-colors duration-500">
                      {item.label}
                    </span>

                    {/* Kinetic Underline */}
                    <div className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-voro-primary scale-x-0 group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                  </Link>
                ) : (
                  <div
                    className="flex items-center gap-3 px-3 py-1.5"
                    aria-current="page"
                  >
                    {/* Active Segment Marker */}
                    <div
                      className="w-2 h-2 rounded-full bg-voro-primary shadow-[0_0_12px_rgba(124,58,237,0.9)] animate-pulse"
                      aria-hidden="true"
                    />

                    {/* Editorial Terminal Node */}
                    <span className="text-xl md:text-2xl font-serif italic font-medium text-white tracking-tight filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
                      {item.label}
                    </span>

                    {/* Tactical End Marker */}
                    <div
                      className="h-px w-6 bg-gradient-to-r from-voro-primary/50 to-transparent"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Sub-pixel Hash Badge (Industrial Detail) */}
      <div className="absolute bottom-0 right-0 p-1 opacity-[0.04] group-hover/breadcrumb:opacity-20 transition-opacity duration-500 pointer-events-none">
        <div className="font-mono text-[0.4rem] font-black leading-none select-none tracking-tighter">
          [0xBRD_VAULT]
        </div>
      </div>
    </nav>
  );
});

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
