import React, { memo, useId } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0C14]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
           <div className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
           <p className="text-[0.6rem] font-mono text-gray-500 uppercase tracking-[0.2em]">{payload[0].name}</p>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-serif italic font-medium text-white tracking-tight">
            {payload[0].value}
          </span>
          <span className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-widest">
            Units
          </span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * ⚡ REFINEMENT: Luxury Neural Distribution Specimen (PieChartComponent).
 * Re-engineered with the Forge design system: volumetric donut architecture,
 * atmospheric gradients, and kinetic glow filters.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display serif for terminal data nodes.
 * 2. Precision: JetBrains Mono for system markers and axis telemetry.
 * 3. Motion: Kinetic glow filters suggesting active data synthesis.
 * 4. Atmosphere: High-fidelity charcoal glassmorphism.
 */
export const PieChartComponent = memo(({
  data,
  height = 300,
  colors,
  ...props
}) => {
  const filterId = useId().replace(/:/g, '');
  const defaultColors = ["#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"];
  const chartColors = colors || defaultColors;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart {...props}>
        <defs>
          {chartColors.map((color, idx) => (
            <React.Fragment key={idx}>
              <linearGradient id={`grad-pie-${idx}-${filterId}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={0.3} />
              </linearGradient>
              <filter id={`glow-pie-${idx}-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </React.Fragment>
          ))}
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={height * 0.25}
          outerRadius={height * 0.35}
          paddingAngle={8}
          dataKey="value"
          stroke="none"
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#grad-pie-${index % chartColors.length}-${filterId})`}
              style={{ filter: `url(#glow-pie-${index % chartColors.length}-${filterId})` }}
              className="hover:opacity-80 transition-opacity duration-500 cursor-pointer outline-none"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          content={({ payload }) => (
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-8">
              {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  <span className="text-[0.6rem] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
});

PieChartComponent.displayName = "PieChartComponent";

export default PieChartComponent;
