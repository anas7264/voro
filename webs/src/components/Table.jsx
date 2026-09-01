import React, { memo, useRef, useState, useId, useMemo } from "react";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted and frozen static default fallbacks.
 * Eliminates array allocation overhead per render cycle.
 */
const EMPTY_HEADERS = Object.freeze([]);
const EMPTY_ROWS = Object.freeze([]);

/**
 * ⚡ REFINEMENT: Precision Data Matrix Node (Table).
 * Re-engineered to Voro's 'Forge' luxury architecture with 3D spatial transforms,
 * 60fps direct-DOM magnetic mouse tracking, holographic coordinate telemetry,
 * dynamic liquid perimeter illumination, and high-contrast editorial typography.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display italic serif table headers for editorial prestige and weight.
 * 2. Precision: JetBrains Mono tabular figures for alignment with sub-pixel hash badging.
 * 3. Motion: Direct-DOM 3D volumetric tilt tracking with liquid light perimeter glow.
 * 4. Spatial Architecture: Mathematical padding with golden-ratio whitespace spacing.
 */
export const Table = memo(({
  headers = EMPTY_HEADERS,
  rows = EMPTY_ROWS,
  className = "",
  onRowClick,
  hoverable = true,
  striped = false,
  compact = false
}) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const reactId = useId();

  // Generate a stable system node identification and attestation markers
  const nodeId = useMemo(() => {
    const cleanId = reactId.replace(/:/g, '');
    return `TBL_${cleanId.slice(0, 4).toUpperCase()}`;
  }, [reactId]);

  const attestedHash = useMemo(() => {
    const cleanId = reactId.replace(/:/g, '');
    return `0xTBL_MTX_${cleanId.padEnd(6, '0').slice(0, 6).toUpperCase()}`;
  }, [reactId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (clamped to max 6 degrees for structural luxury stability)
    const tiltY = ((x / rect.width) - 0.5) * 12;
    const tiltX = (0.5 - (y / rect.height)) * 12;

    containerRef.current.style.setProperty("--mouse-x", `${x}px`);
    containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    containerRef.current.style.setProperty("--tilt-x", `${tiltX}deg`);
    containerRef.current.style.setProperty("--tilt-y", `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '3deg');
      containerRef.current.style.setProperty('--tilt-y', '-3deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "3.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-3.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current && !isHovered) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (containerRef.current && !isFocused) {
          containerRef.current.style.setProperty('--tilt-x', '0deg');
          containerRef.current.style.setProperty('--tilt-y', '0deg');
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      aria-label="Precision Data Matrix Table"
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        Table group/table relative overflow-hidden bg-[#0A0C14]/95 border border-white/5
        rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)]
        backdrop-blur-3xl outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#080B14]
        transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/10
        ${className}
      `}
    >
      {/* Dynamic Liquid Border Perimeter Illumination */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/table:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Precision Grid Background - Emerges on Hover */}
      <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/table:opacity-100 pointer-events-none transition-opacity duration-1000" />
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />

      {/* Dynamic Light Lens (Mouse Tracking Spotlight) */}
      <div
        className="absolute inset-0 opacity-0 group-hover/table:opacity-100 group-focus-visible/table:opacity-100 pointer-events-none transition-opacity duration-700"
        style={{
          background: isHovered
            ? `radial-gradient(700px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 45%)`
            : `radial-gradient(700px circle at 50% 50%, rgba(124, 58, 237, 0.08), transparent 45%)`,
          transform: 'translateZ(20px)'
        }}
      />

      {/* Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-4 right-8 pointer-events-none opacity-0 group-hover/table:opacity-100 group-focus-within/table:opacity-100 transition-all duration-500 z-20"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar relative z-10" style={{ transform: 'translateZ(30px)' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`
                    text-left text-[0.65rem] font-mono font-bold text-voro-primary uppercase tracking-[0.4em]
                    ${compact ? 'px-6 py-5' : 'px-10 py-8'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-serif italic capitalize text-xl md:text-2xl font-medium tracking-tight text-white/90 group-hover/table:text-white transition-colors">
                      {header}
                    </span>
                    <div className="h-px w-6 bg-gradient-to-r from-voro-primary/40 to-transparent" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length || 1}
                  className="px-10 py-16 text-center text-xs font-mono text-gray-500 uppercase tracking-widest"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]"></span>
                    </div>
                    <span className="text-voro-primary/80 font-bold tracking-[0.4em] text-xs">// NO_RECORDS_FOUND</span>
                    <span className="text-[0.6rem] text-gray-500 font-sans tracking-normal uppercase opacity-70">
                      No data entries currently registered in system matrix
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row, rowIndex)}
                  className={`
                    group/row border-b border-white/[0.03] last:border-0 transition-all duration-500 relative
                    ${striped && rowIndex % 2 === 1 ? 'bg-white/[0.01]' : ''}
                    ${hoverable ? 'hover:bg-white/[0.03] cursor-pointer' : ''}
                    ${onRowClick ? 'active:scale-[0.995]' : ''}
                  `}
                >
                  {Array.isArray(row) ? (
                    row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`
                          font-mono text-sm text-gray-400 group-hover/row:text-gray-100 transition-colors duration-500 relative
                          ${compact ? 'px-6 py-4' : 'px-10 py-6'}
                          ${cellIndex === 0 ? "text-voro-primary/90 group-hover/row:text-voro-primary font-bold" : ""}
                        `}
                      >
                        {/* Liquid Light Indicator Datum (First Column) */}
                        {cellIndex === 0 && (
                          <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-voro-primary scale-y-0 group-hover/row:scale-y-100 transition-transform duration-500 origin-center shadow-[0_0_15px_rgba(124,58,237,0.9)] rounded-r-full" />
                        )}
                        {cell}
                      </td>
                    ))
                  ) : (
                    <td className={`font-mono text-sm text-gray-400 group-hover/row:text-gray-100 transition-colors duration-500 relative ${compact ? 'px-6 py-4' : 'px-10 py-6'}`}>
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-voro-primary scale-y-0 group-hover/row:scale-y-100 transition-transform duration-500 origin-center shadow-[0_0_15px_rgba(124,58,237,0.9)] rounded-r-full" />
                      {row}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Boutique Footer & Telemetry Detail */}
      <div className="p-6 border-t border-white/[0.03] flex justify-between items-center bg-black/40 relative z-10" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-voro-primary/60 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-voro-primary/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-voro-primary/20" />
          </div>
          <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-[0.2em]">
            {rows.length} {rows.length === 1 ? 'RECORD' : 'RECORDS'} MATRIX
          </span>
        </div>
        <span className="text-[0.45rem] font-mono text-white/20 tracking-[0.6em] uppercase group-hover/table:text-voro-primary/60 transition-colors duration-1000">
          {attestedHash}
        </span>
      </div>
    </div>
  );
});

Table.displayName = "Table";

export default Table;
