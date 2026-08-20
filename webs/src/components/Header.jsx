import React, { memo, useRef, useState, useId, useMemo } from "react";

/**
 * ⚡ REFINEMENT: Architectural Editorial Signature (Header).
 * Re-engineered to the 'Forge' luxury standard with 3D spatial transforms,
 * 60fps direct-DOM magnetic mouse tracking, holographic coordinate telemetry,
 * and high-contrast editorial typography.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display italic serif title for editorial weight and prestige.
 * 2. Precision: JetBrains Mono system metadata and sub-pixel attestation markers.
 * 3. Spatial: Golden ratio whitespace optimization with a glassmorphic spatial frame.
 * 4. Motion: Direct-DOM volumetric 3D tilt tracking with liquid light perimeter glow.
 */
export const Header = memo(({
  title,
  subtitle,
  eyebrow = "System_Active",
  action,
  className = ""
}) => {
  const headerId = useId();
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Generate stable system node identification and attestation markers
  const nodeId = useMemo(() => {
    const cleanId = headerId.replace(/:/g, '');
    return `HDR_${cleanId.slice(0, 4).toUpperCase()}`;
  }, [headerId]);

  const attestedId = useMemo(() => {
    const cleanId = headerId.replace(/:/g, '');
    return `0x${cleanId.padEnd(6, 'F').slice(0, 6).toUpperCase()}`;
  }, [headerId]);

  const handleMouseMove = (e) => {
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

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
    containerRef.current.style.setProperty('--grid-x', `${gridX}px`);
    containerRef.current.style.setProperty('--grid-y', `${gridY}px`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      // Provide a subtle static tilt for keyboard focus feedback
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
      containerRef.current.style.setProperty('--grid-x', '0px');
      containerRef.current.style.setProperty('--grid-y', '0px');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <header
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (containerRef.current && !isFocused) {
          containerRef.current.style.setProperty('--tilt-x', '0deg');
          containerRef.current.style.setProperty('--tilt-y', '0deg');
          containerRef.current.style.setProperty('--grid-x', '0px');
          containerRef.current.style.setProperty('--grid-y', '0px');
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      aria-labelledby={`${headerId}-title`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative mb-16 md:mb-24 p-8 md:p-12 rounded-[2.5rem]
        bg-[#0A0C14]/60 border border-white/5 backdrop-blur-3xl
        shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)]
        flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12
        overflow-hidden group/hdr outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#080B14]
        transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/10
        ${className}
      `}
    >
      {/* Liquid Border Perimeter Illumination */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/hdr:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Volumetric Internal Layers: Parallax Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: isHovered
            ? 'translate3d(var(--grid-x, 0px), var(--grid-y, 0px), 0)'
            : 'translate3d(0, 0, 0)',
          transition: isHovered ? 'none' : 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/hdr:opacity-100 transition-opacity duration-1000" />
      </div>

      {/* Dynamic Luminous Lens */}
      <div
        className="absolute inset-0 opacity-0 group-hover/hdr:opacity-100 group-focus-visible/hdr:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: isHovered
            ? `radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 45%)`
            : `radial-gradient(800px circle at 50% 50%, rgba(124, 58, 237, 0.08), transparent 45%)`,
          transform: 'translateZ(20px)'
        }}
      />

      {/* Kinetic Ambient Sweep */}
      <div className="kinetic-sweep opacity-10 group-hover/hdr:opacity-30 transition-opacity duration-1000" />

      {/* Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/hdr:opacity-100 group-focus-within/hdr:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Attestation Corner Marker */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 right-8 pointer-events-none opacity-20 group-hover/hdr:opacity-40 transition-opacity duration-700 font-mono text-[0.4rem] font-black text-white/30 tracking-[0.3em] uppercase"
        style={{ transform: 'translateZ(40px)' }}
      >
        {attestedId}_ATTESTED_HDR
      </div>

      {/* Main Content Column */}
      <div className="relative z-10 space-y-5 max-w-3xl" style={{ transform: 'translateZ(60px)' }}>
        {/* System Eyebrow: Technical Context */}
        <div className="flex items-center gap-3 text-voro-primary">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]"></span>
          </div>
          <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.45em] text-voro-primary/90">
            {eyebrow}
          </span>
          <div className="h-px w-6 bg-voro-primary/30" />
        </div>

        {/* Editorial Title & Description */}
        <div className="space-y-3">
          <h1
            id={`${headerId}-title`}
            className="text-4xl sm:text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-[1.1]"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm md:text-base font-medium text-gray-400 max-w-2xl leading-relaxed opacity-90">
              {subtitle}
            </p>
          )}
        </div>

        {/* Architectural Datum Line */}
        <div className="flex items-center gap-4 pt-2">
          <div className="h-0.5 w-32 bg-gradient-to-r from-voro-primary via-voro-primary-light/80 to-transparent rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover/hdr:w-64 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
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
