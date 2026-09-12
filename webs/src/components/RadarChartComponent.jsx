import React, { memo, useId } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Fallbacks.
 * Zero object allocations during component render passes.
 */
const DEFAULT_MARGIN = Object.freeze({ top: 20, right: 30, bottom: 20, left: 30 });
const DEFAULT_TICK_ANGLE = Object.freeze({
  fill: "#4B5563",
  fontSize: 10,
  fontFamily: 'JetBrains Mono',
  fontWeight: 800,
  letterSpacing: '0.15em'
});
const DEFAULT_CURSOR = Object.freeze({ stroke: 'rgba(255, 255, 255, 0.05)', strokeWidth: 1 });

const CustomTooltip = memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0C14]/95 backdrop-blur-3xl border border-white/10 p-5 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden min-w-[180px]">
        {/* Boutique Grain Texture */}
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-2">
            <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">
              {label}
            </span>
            <span className="text-[0.45rem] font-mono font-bold text-voro-primary/80 tracking-widest uppercase">
              0xRADAR_TELEMETRY
            </span>
          </div>

          {payload.map((entry, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-serif italic font-medium text-white tracking-tighter">
                  {entry.value}
                </span>
                <span className="text-[0.6rem] font-mono text-voro-primary font-bold uppercase tracking-widest">
                  {entry.unit || 'Units'}
                </span>
              </div>
              <span className="text-[0.5rem] font-mono text-gray-600 uppercase tracking-[0.2em]">
                {entry.name} Specimen
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = "CustomTooltip";

/**
 * ⚡ REFINEMENT: Luxury Neural Capability Specimen (RadarChart).
 * Re-engineered to the 'Forge' luxury standard: volumetric donut architecture,
 * atmospheric linear gradients, kinetic glow filters, and bespoke glassmorphism.
 */
export const RadarChartComponent = memo(({
  data,
  dataKey,
  name,
  fill = "#7C3AED",
  height = 400,
  strokeWidth = 2,
  margin = DEFAULT_MARGIN,
  ...props
}) => {
  const id = useId().replace(/:/g, '');

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart
        data={data}
        margin={margin}
        {...props}
      >
        <defs>
          <linearGradient id={`radar-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fill} stopOpacity={0.4} />
            <stop offset="95%" stopColor={fill} stopOpacity={0.1} />
          </linearGradient>
          <filter id={`radar-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <PolarGrid
          stroke="rgba(255, 255, 255, 0.05)"
          strokeDasharray="4 4"
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
          fill={`url(#radar-grad-${id})`}
          fillOpacity={0.6}
          animationDuration={1500}
          activeDot={{
            r: 5,
            fill: fill,
            stroke: "#080B14",
            strokeWidth: 2,
            filter: `url(#radar-glow-${id})`
          }}
          style={{ filter: `url(#radar-glow-${id})` }}
        />

        {/* Tactical System Marker Overlay */}
        <text
          x="50%"
          y="10"
          textAnchor="middle"
          className="text-[0.45rem] font-mono font-black fill-white/10 uppercase tracking-[0.5em] pointer-events-none"
        >
          Neural_Capability_Specimen_v1.0
        </text>
      </RadarChart>
    </ResponsiveContainer>
  );
});

RadarChartComponent.displayName = "RadarChartComponent";

export default RadarChartComponent;
