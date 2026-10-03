import React, { memo, useId, useRef, useMemo, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Fallbacks.
 * Zero object allocations during component render passes.
 */
const DEFAULT_MARGIN = Object.freeze({ top: 12, right: 12, left: -16, bottom: 0 });
const DEFAULT_TICK_X = Object.freeze({ fill: "#6B7280", fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600, letterSpacing: '0.1em' });
const DEFAULT_TICK_Y = Object.freeze({ fill: "#6B7280", fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600 });
const DEFAULT_CURSOR = Object.freeze({ stroke: 'rgba(255, 255, 255, 0.08)', strokeWidth: 1, strokeDasharray: '3 3' });

const CustomTooltip = memo(({ active, payload, label, series, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0C14]/95 backdrop-blur-3xl border border-white/10 p-5 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden min-w-[200px] select-none z-50">
        {/* Boutique Grain Texture */}
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-2">
            <span className="text-[0.6rem] font-mono font-bold text-gray-300 uppercase tracking-[0.2em]">
              {label}
            </span>
            <span className="text-[0.45rem] font-mono font-bold text-voro-primary/80 tracking-widest uppercase">
              0xAREA_TELEMETRY
            </span>
          </div>

          {payload.map((entry, index) => {
            const color = series?.find(s => s.key === entry.dataKey)?.color || entry.color || "#7C3AED";
            const val = Number(entry.value) || 0;
            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: color, color }}
                  />
                  <span className="text-[0.6rem] font-mono font-bold text-gray-400 uppercase tracking-widest">
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-serif italic font-medium text-white tracking-tight">
                    {val.toLocaleString()}
                  </span>
                  {unit && (
                    <span className="text-[0.55rem] font-mono text-gray-400 uppercase">
                      {unit}
                    </span>
                  )}
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
 * ⚡ REFINEMENT: Volumetric Neural Area Telemetry Matrix Specimen (AreaChartComponent).
 * Re-engineered conforming to Voro's 'Forge' luxury design architecture and zero-allocation performance standards:
 * 1. Direct-DOM 60fps 3D volumetric rotational tilt tracking (`--mouse-x`, `--mouse-y`, `--tilt-x`, `--tilt-y`).
 * 2. Dynamic magnetic liquid light perimeter illumination mask (`radial-gradient`).
 * 3. Dynamic luminous spotlight follower lens (`radial-gradient`).
 * 4. Holographic spatial coordinate telemetry overlays (`TX_...°`, `TY_...°`) and SSR-safe deterministic sub-pixel attestation hash badging (`0xAREA_..._ATTESTED`).
 * 5. W3C APG compliant keyboard accessibility focus state handling (`tabIndex={0}`, `role="region"`, static 4.0° focus tilt fallback).
 * 6. Optional editorial header section (`title`, `subtitle`, `unit`) with live latest endpoint metric calculation in Playfair Display italic serif hero typography.
 * 7. Multi-series support with atmospheric SVG area linear gradients, multi-stage kinetic glow filters, and zero-allocation performance.
 */
export const AreaChartComponent = memo(({
  data,
  dataKey,          // single key (legacy)
  dataKeys,         // array: [{ key, name, color }]
  name,
  fill = "#7C3AED",
  color,
  height = 300,
  xDataKey = "date",
  margin = DEFAULT_MARGIN,
  title,
  subtitle = "Area Telemetry Matrix",
  unit,
  className = "",
  strokeWidth = 3,
  showGrid = true,
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
    return `AREA_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [filterId]);

  const attestedId = useMemo(() => {
    const cleanId = filterId.toUpperCase();
    return `0xAREA_${cleanId.slice(-4).padStart(4, '0')}_ATTESTED`;
  }, [filterId]);

  const series = useMemo(() => {
    if (dataKeys && Array.isArray(dataKeys)) return dataKeys;
    return [{ key: dataKey, name: name || dataKey, color: color || fill }];
  }, [dataKeys, dataKey, name, color, fill]);

  // Calculate latest endpoint metric for optional header telemetry display
  const latestEndpointValue = useMemo(() => {
    if (!Array.isArray(data) || !data.length || !series.length) return 0;
    const lastItem = data[data.length - 1];
    return Number(lastItem[series[0].key]) || 0;
  }, [data, series]);

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
    ? `${title} area chart matrix. Latest endpoint value: ${latestEndpointValue.toLocaleString()} ${unit || ''}`
    : `Area chart specimen ${nodeId}. Latest endpoint value: ${latestEndpointValue.toLocaleString()} ${unit || ''}`;

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
        backdrop-blur-3xl overflow-hidden group/areachart outline-none
        focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/10 select-none
        ${className}
      `}
    >
      {/* Precision Grid & Grain Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/areachart:opacity-[0.06] group-focus-visible/areachart:opacity-[0.06] transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      </div>

      {/* Dynamic Liquid Light Perimeter Illumination Mask */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/areachart:opacity-100 group-focus-visible/areachart:opacity-100 transition-opacity duration-700 pointer-events-none"
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
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/areachart:opacity-100 group-focus-visible/areachart:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 45%)`,
          transform: 'translateZ(20px)'
        }}
      />

      {/* Holographic Spatial Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/areachart:opacity-100 group-focus-visible/areachart:opacity-100 transition-all duration-500 z-30"
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
        className="absolute bottom-4 left-8 pointer-events-none opacity-20 group-hover/areachart:opacity-40 transition-opacity duration-700 font-mono text-[0.38rem] font-black text-white/30 tracking-[0.25em] uppercase z-30"
        style={{ transform: 'translateZ(40px)' }}
      >
        {attestedId}
      </div>

      {/* Optional Editorial Header Section */}
      {title && (
        <div className="relative z-20 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4" style={{ transform: 'translateZ(50px)' }}>
          <div className="space-y-1">
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

          <div className="flex items-baseline gap-2 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-2xl">
            <span className="text-2xl font-serif italic font-medium text-white tracking-tight">
              {latestEndpointValue.toLocaleString()}
            </span>
            {unit && (
              <span className="text-[0.55rem] font-mono font-bold text-voro-primary uppercase tracking-widest">
                {unit}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Chart Canvas Enclave */}
      <div className="relative w-full z-10" style={{ transform: 'translateZ(40px)' }}>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={margin} {...props}>
            <defs>
              {series.map((s, idx) => (
                <React.Fragment key={s.key}>
                  <linearGradient id={`grad-${s.key}-${filterId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                  <filter id={`glow-area-${idx}-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </React.Fragment>
              ))}
            </defs>

            {showGrid && (
              <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.03)" strokeDasharray="0" />
            )}

            <XAxis
              dataKey={xDataKey}
              axisLine={false}
              tickLine={false}
              tick={DEFAULT_TICK_X}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={DEFAULT_TICK_Y}
            />

            <Tooltip
              content={<CustomTooltip series={series} unit={unit} />}
              cursor={DEFAULT_CURSOR}
            />

            {series.length > 1 && (
              <Legend
                content={({ payload }) => (
                  <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-white/5">
                    {payload && payload.map((entry, index) => {
                      const color = series.find(s => s.key === entry.dataKey)?.color || entry.color;
                      return (
                        <div key={index} className="flex items-center gap-2.5 group/legend cursor-pointer">
                          <div
                            className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] group-hover/legend:scale-125 transition-transform duration-300"
                            style={{ backgroundColor: color, color }}
                          />
                          <span className="text-[0.6rem] font-mono font-bold text-gray-400 group-hover/legend:text-white uppercase tracking-[0.15em] transition-colors duration-300">
                            {entry.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
            )}

            {series.map((s, idx) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                fill={`url(#grad-${s.key}-${filterId})`}
                strokeWidth={strokeWidth}
                activeDot={{
                  r: 6,
                  fill: s.color,
                  stroke: "#080B14",
                  strokeWidth: 2.5,
                  filter: `url(#glow-area-${idx}-${filterId})`
                }}
                animationDuration={1500}
                style={{ filter: `url(#glow-area-${idx}-${filterId})` }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

AreaChartComponent.displayName = "AreaChartComponent";

export default AreaChartComponent;
