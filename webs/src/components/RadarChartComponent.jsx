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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0C14]/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Boutique Grain Texture */}
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />

        <div className="relative z-10">
          <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-voro-primary animate-pulse" />
            {label}
          </p>
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
};

/**
 * ⚡ REFINEMENT: Luxury Neural Capability Specimen (RadarChart).
 * Re-engineered to the 'Forge' luxury standard: volumetric donut architecture,
 * atmospheric linear gradients, kinetic glow filters, and bespoke glassmorphism.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display serif for primary data suggests prestige.
 * 2. Precision: JetBrains Mono for industrial telemetry markers.
 * 3. Motion: Kinetic glow filters and 1500ms draw animation.
 * 4. Atmosphere: Luminous, low-opacity polar grids for a "biological artifact" feel.
 */
export const RadarChartComponent = memo(({
  data,
  dataKey,
  name,
  fill = "#7C3AED",
  height = 400,
  strokeWidth = 2,
  ...props
}) => {
  const id = useId().replace(/:/g, '');

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
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
          tick={{
            fill: "#4B5563",
            fontSize: 10,
            fontFamily: 'JetBrains Mono',
            fontWeight: 800,
            letterSpacing: '0.15em'
          }}
        />

        <PolarRadiusAxis
          angle={30}
          domain={[0, 'auto']}
          axisLine={false}
          tick={false}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: 'rgba(255, 255, 255, 0.05)', strokeWidth: 1 }}
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
