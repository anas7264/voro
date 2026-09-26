import React, { memo, useId, useRef, useMemo, useCallback } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Fallbacks.
 * Zero object allocations during component render passes.
 */
const DEFAULT_MARGIN = Object.freeze({ top: 30, right: 30, bottom: 20, left: 30 });
const DEFAULT_TICK_ANGLE = Object.freeze({
  fill: "#9CA3AF",
  fontSize: 10,
  fontFamily: 'JetBrains Mono, monospace',
  fontWeight: 700,
  letterSpacing: '0.15em'
});
const DEFAULT_CURSOR = Object.freeze({ stroke: 'rgba(255, 255, 255, 0.08)', strokeWidth: 1 });

const CustomTooltip = memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0C14]/95 backdrop-blur-3xl border border-white/10 p-5 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden min-w-[200px] select-none z-50">
        {/* Boutique Grain Texture */}
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-2">
            <span className="text-[0.65rem] font-mono font-bold text-gray-300 uppercase tracking-[0.2em]">
              {label}
            </span>
            <span className="text-[0.45rem] font-mono font-bold text-voro-primary/80 tracking-widest uppercase">
              0xRADAR_TELEMETRY
            </span>
          </div>

          {payload.map((entry, index) => {
            const color = entry.color || entry.stroke || "#7C3AED";
            return (
              <div key={index} className="flex flex-col gap-1 pt-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: color, color }}
                    />
                    <span className="text-[0.55rem] font-mono text-gray-400 uppercase tracking-[0.15em]">
                      {entry.name || 'Capability Specimen'}
                    </span>
                  </div>
                  <span className="text-3xl font-serif italic font-medium text-white tracking-tight">
                    {entry.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = "CustomTooltip";

/**
 * ⚡ REFINEMENT: Luxury Neural Capability Specimen (RadarChartComponent).
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards:
 * 1. Direct-DOM 60fps 3D volumetric rotational tilt tracking (`--mouse-x`, `--mouse-y`, `--tilt-x`, `--tilt-y`).
 * 2. Dynamic magnetic liquid light perimeter illumination mask (`radial-gradient`).
 * 3. Luminous dynamic spotlight follower lens.
 * 4. Holographic spatial coordinate telemetry overlays (`TX_...°`, `TY_...°`) and SSR-safe deterministic sub-pixel attestation hash badging (`0xRADAR_..._ATTESTED`).
 * 5. W3C APG compliant keyboard accessibility focus state handling (`tabIndex={0}`, `role="region"`, static 4.0° focus tilt fallback).
 * 6. Elevated SVG radar filters with multi-layered blur glows and dynamic multi-stop linear gradients.
 * 7. Optional title & subtitle header layout with luxury typography (Playfair Display italic serif hero figures paired with JetBrains Mono metadata).
 */
export const RadarChartComponent = memo(({
  data,
  dataKey,
  name = "Capability",
  fill = "#7C3AED",
  title,
  subtitle = "Neural Capability Matrix",
  height = 360,
  strokeWidth = 2,
  margin = DEFAULT_MARGIN,
  className = "",
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
    return `RADAR_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [filterId]);

  const attestedId = useMemo(() => {
    const cleanId = filterId.toUpperCase();
    return `0xRADAR_${cleanId.slice(-4).padStart(4, '0')}_ATTESTED`;
  }, [filterId]);

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
    ? `${title} radar capability specimen`
    : `Radar capability matrix specimen ${nodeId}`;

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
        backdrop-blur-3xl overflow-hidden group/radar outline-none
        focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/10 select-none
        ${className}
      `}
    >
      {/* Precision Grid & Grain Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/radar:opacity-[0.06] group-focus-visible/radar:opacity-[0.06] transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      </div>

      {/* Dynamic Liquid Light Perimeter Illumination Mask */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/radar:opacity-100 group-focus-visible/radar:opacity-100 transition-opacity duration-700 pointer-events-none"
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
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/radar:opacity-100 group-focus-visible/radar:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 45%)`,
          transform: 'translateZ(20px)'
        }}
      />

      {/* Holographic Spatial Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/radar:opacity-100 group-focus-visible/radar:opacity-100 transition-all duration-500 z-30"
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
        className="absolute bottom-4 left-8 pointer-events-none opacity-20 group-hover/radar:opacity-40 transition-opacity duration-700 font-mono text-[0.38rem] font-black text-white/30 tracking-[0.25em] uppercase z-30"
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
          <RadarChart
            data={data}
            margin={margin}
            {...props}
          >
            <defs>
              <linearGradient id={`radar-grad-${filterId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fill} stopOpacity={0.5} />
                <stop offset="50%" stopColor={fill} stopOpacity={0.25} />
                <stop offset="100%" stopColor={fill} stopOpacity={0.05} />
              </linearGradient>

              <filter id={`radar-glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <PolarGrid
              stroke="rgba(255, 255, 255, 0.08)"
              strokeDasharray="3 3"
            />

            <PolarAngleAxis
              dataKey="subject"
              tick={DEFAULT_TICK_ANGLE}
            />

            <PolarRadiusAxis
              angle={30}
              domain={[0, 'auto']}
              axisLine={false}
              tick={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={DEFAULT_CURSOR}
            />

            <Radar
              name={name}
              dataKey={dataKey}
              stroke={fill}
              strokeWidth={strokeWidth}
              fill={`url(#radar-grad-${filterId})`}
              fillOpacity={0.65}
              animationDuration={1500}
              animationEasing="ease-out"
              activeDot={{
                r: 6,
                fill: fill,
                stroke: "#080B14",
                strokeWidth: 2,
                filter: `url(#radar-glow-${filterId})`
              }}
              style={{ filter: `url(#radar-glow-${filterId})` }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

RadarChartComponent.displayName = "RadarChartComponent";

export default RadarChartComponent;
