import React, { memo, useId, useRef, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Fallbacks.
 * Zero object allocations during component render passes.
 */
const DEFAULT_COLORS = Object.freeze(["#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"]);

const CustomTooltip = memo(({ active, payload, totalValue, unit = "Units" }) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const val = Number(entry.value) || 0;
    const percentage = totalValue > 0 ? ((val / totalValue) * 100).toFixed(1) : "0.0";
    const color = entry.payload?.fill || entry.color || "#7C3AED";

    return (
      <div className="bg-[#0A0C14]/95 backdrop-blur-3xl border border-white/10 p-5 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden min-w-[200px] select-none z-50">
        {/* Boutique Grain Texture */}
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: color, color }}
              />
              <span className="text-[0.6rem] font-mono font-bold text-gray-300 uppercase tracking-[0.2em]">
                {entry.name}
              </span>
            </div>
            <span className="text-[0.45rem] font-mono font-bold text-voro-primary/80 tracking-widest uppercase">
              0xPIE_TELEMETRY
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif italic font-medium text-white tracking-tight">
                {val.toLocaleString()}
              </span>
              <span className="text-[0.6rem] font-mono text-gray-400 uppercase tracking-widest">
                {unit}
              </span>
            </div>
            <span className="text-xs font-mono font-black text-voro-primary tracking-wider bg-voro-primary/10 px-2 py-0.5 rounded-md border border-voro-primary/20">
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = "CustomTooltip";

/**
 * ⚡ REFINEMENT: Luxury Neural Distribution Specimen (PieChartComponent).
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards:
 * 1. Direct-DOM 60fps 3D volumetric rotational tilt tracking (`--mouse-x`, `--mouse-y`, `--tilt-x`, `--tilt-y`).
 * 2. Dynamic magnetic liquid light perimeter illumination mask (`radial-gradient`).
 * 3. Luminous dynamic spotlight follower lens.
 * 4. Glassmorphic center biometric summary readout lens displaying total distribution magnitude in Playfair Display italic serif hero typography paired with JetBrains Mono metadata.
 * 5. Holographic spatial coordinate telemetry overlays (`TX_...°`, `TY_...°`) and SSR-safe deterministic sub-pixel attestation hash badging (`0xPIE_..._ATTESTED`).
 * 6. W3C APG compliant keyboard accessibility focus state handling (`tabIndex={0}`, `role="region"`, static 4.0° focus tilt fallback).
 * 7. Enhanced legend specimen with percentage distribution badges and sub-pixel telemetry markers.
 */
export const PieChartComponent = memo(({
  data,
  height = 320,
  colors = DEFAULT_COLORS,
  title,
  subtitle = "Distribution Specimen",
  unit = "Units",
  showCenterReadout = true,
  className = "",
  innerRadius,
  outerRadius,
  valueKey = "value",
  nameKey = "name",
  ...props
}) => {
  const reactId = useId();
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  const filterId = useMemo(() => reactId.replace(/[^a-zA-Z0-9]/g, ''), [reactId]);

  // Generate stable system node identification and attestation markers
  const nodeId = useMemo(() => {
    const cleanId = filterId.toUpperCase();
    return `PIE_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [filterId]);

  const attestedId = useMemo(() => {
    const cleanId = filterId.toUpperCase();
    return `0xPIE_${cleanId.slice(-4).padStart(4, '0')}_ATTESTED`;
  }, [filterId]);

  const chartColors = colors || DEFAULT_COLORS;

  const totalValue = useMemo(() => {
    if (!Array.isArray(data)) return 0;
    return data.reduce((acc, curr) => acc + (Number(curr[valueKey]) || 0), 0);
  }, [data, valueKey]);

  // Radii calculation
  const calculatedInnerRadius = innerRadius !== undefined ? innerRadius : height * 0.26;
  const calculatedOuterRadius = outerRadius !== undefined ? outerRadius : height * 0.38;

  // 60fps Direct-DOM 3D Volumetric Tilt Handler
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt calculation (clamped to max 12 degrees for luxury restraint)
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

  const accessibleLabel = title
    ? `${title} distribution chart. Total: ${totalValue.toLocaleString()} ${unit}`
    : `Distribution chart specimen ${nodeId}. Total: ${totalValue.toLocaleString()} ${unit}`;

  return (
    <div
      ref={containerRef}
      role="region"
      tabIndex={0}
      aria-label={accessibleLabel}
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
        relative w-full rounded-[2.5rem] bg-[#0A0C14]/90 border border-white/5 p-6 md:p-8
        shadow-[0_50px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)]
        backdrop-blur-3xl overflow-hidden group/pie outline-none
        focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/10 select-none
        ${className}
      `}
    >
      {/* Precision Grid & Grain Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/pie:opacity-[0.06] group-focus-visible/pie:opacity-[0.06] transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      </div>

      {/* Dynamic Liquid Light Perimeter Illumination Mask */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/pie:opacity-100 group-focus-visible/pie:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Dynamic Luminous Spotlight Lens */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/pie:opacity-100 group-focus-visible/pie:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 45%)`,
          transform: 'translateZ(20px)'
        }}
      />

      {/* Holographic Spatial Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/pie:opacity-100 group-focus-visible/pie:opacity-100 transition-all duration-500 z-30"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Sub-pixel System Attestation Hash Badge */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-8 pointer-events-none opacity-20 group-hover/pie:opacity-40 transition-opacity duration-700 font-mono text-[0.38rem] font-black text-white/30 tracking-[0.25em] uppercase z-30"
        style={{ transform: 'translateZ(40px)' }}
      >
        {attestedId}
      </div>

      {/* Optional Editorial Header Section */}
      {title && (
        <div className="relative z-20 mb-6 space-y-1" style={{ transform: 'translateZ(50px)' }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
            <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.35em] text-voro-primary">
              {subtitle}
            </span>
          </div>
          <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight">
            {title}
          </h3>
        </div>
      )}

      {/* Chart Canvas Enclave */}
      <div className="relative w-full z-10 flex flex-col items-center justify-center" style={{ transform: 'translateZ(40px)' }}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart {...props}>
            <defs>
              {chartColors.map((color, idx) => (
                <React.Fragment key={idx}>
                  <linearGradient id={`grad-pie-${idx}-${filterId}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                  </linearGradient>
                  <filter id={`glow-pie-${idx}-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </React.Fragment>
              ))}
            </defs>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={calculatedInnerRadius}
              outerRadius={calculatedOuterRadius}
              paddingAngle={6}
              dataKey={valueKey}
              nameKey={nameKey}
              stroke="none"
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {Array.isArray(data) && data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#grad-pie-${index % chartColors.length}-${filterId})`}
                  style={{ filter: `url(#glow-pie-${index % chartColors.length}-${filterId})` }}
                  className="hover:opacity-80 transition-opacity duration-500 cursor-pointer outline-none"
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip totalValue={totalValue} unit={unit} />} />

            <Legend
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-6 pt-4 border-t border-white/5">
                  {payload && payload.map((entry, index) => {
                    const itemVal = Array.isArray(data) && data[index] ? Number(data[index][valueKey]) || 0 : 0;
                    const itemPct = totalValue > 0 ? ((itemVal / totalValue) * 100).toFixed(1) : "0.0";
                    const color = chartColors[index % chartColors.length];

                    return (
                      <div key={index} className="flex items-center gap-2.5 group/legend cursor-pointer">
                        <div
                          className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] group-hover/legend:scale-125 transition-transform duration-300"
                          style={{ backgroundColor: color, color }}
                        />
                        <span className="text-[0.6rem] font-mono font-bold text-gray-400 group-hover/legend:text-white uppercase tracking-[0.15em] transition-colors duration-300">
                          {entry.value}
                        </span>
                        <span className="text-[0.5rem] font-mono font-black text-voro-primary/80 bg-voro-primary/10 px-1.5 py-0.5 rounded border border-voro-primary/20">
                          {itemPct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Glassmorphic Biometric Readout Lens */}
        {showCenterReadout && calculatedInnerRadius > 0 && (
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center flex flex-col items-center justify-center rounded-full z-20"
            style={{
              width: calculatedInnerRadius * 1.7,
              height: calculatedInnerRadius * 1.7,
              transform: 'translate(-50%, -50%) translateZ(60px)'
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1 h-1 rounded-full bg-voro-primary animate-pulse shadow-[0_0_6px_rgba(124,58,237,0.8)]" />
              <span className="text-[0.45rem] font-mono font-black uppercase tracking-[0.35em] text-gray-500">
                0xPIE_SYNC
              </span>
            </div>
            <span className="text-3xl sm:text-4xl font-serif italic font-medium text-white tracking-tight leading-none drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              {totalValue.toLocaleString()}
            </span>
            <span className="text-[0.55rem] font-mono font-bold text-voro-primary uppercase tracking-widest mt-1">
              {unit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

PieChartComponent.displayName = "PieChartComponent";

export default PieChartComponent;