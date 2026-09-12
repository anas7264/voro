import React, { memo, useId } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Fallbacks.
 * Zero object allocations during component render passes.
 */
const DEFAULT_MARGIN = Object.freeze({ top: 10, right: 10, left: -20, bottom: 0 });
const DEFAULT_TICK_X = Object.freeze({ fill: "#4B5563", fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 500 });
const DEFAULT_TICK_Y = Object.freeze({ fill: "#4B5563", fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 500 });
const DEFAULT_CURSOR = Object.freeze({ fill: 'rgba(255, 255, 255, 0.03)' });

const CustomTooltip = memo(({ active, payload, label, series }) => {
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
              0xBAR_TELEMETRY
            </span>
          </div>

          {payload.map((entry, index) => {
            const color = series?.find(s => s.key === entry.dataKey)?.color || entry.color;
            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: color, color: color }}
                  />
                  <span className="text-[0.6rem] font-mono font-bold text-gray-400 uppercase tracking-widest">
                    {entry.name}
                  </span>
                </div>
                <span className="text-2xl font-serif italic font-medium text-white tracking-tight">
                  {entry.value}
                </span>
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
 * ⚡ REFINEMENT: Luxury Neural Bar Matrix (BarChartComponent).
 * Re-engineered with the Forge design system: atmospheric gradients,
 * kinetic glow filters, and high-fidelity editorial typography.
 */
export const BarChartComponent = memo(({
  data,
  dataKey,
  dataKeys,         // array: [{ key, name, color }]
  name,
  fill,
  color = "#7C3AED",
  height = 300,
  xDataKey = "date",
  referenceValue,
  margin = DEFAULT_MARGIN,
  ...props
}) => {
  const filterId = useId().replace(/:/g, '');
  const series = dataKeys
    ? dataKeys
    : [{ key: dataKey, name: name || dataKey, color: fill || color }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={margin} {...props}>
        <defs>
          {series.map((s, idx) => (
            <React.Fragment key={s.key}>
              <linearGradient id={`grad-bar-${idx}-${filterId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.2} />
              </linearGradient>
              <filter id={`glow-bar-${idx}-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </React.Fragment>
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.03)" strokeDasharray="0" />
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
          content={<CustomTooltip series={series} />}
          cursor={DEFAULT_CURSOR}
        />
        {series.length > 1 && (
          <Legend
            content={({ payload }) => (
              <div className="flex justify-center gap-6 mt-6">
                {payload.map((entry, index) => {
                  const color = series.find(s => s.key === entry.dataKey)?.color || entry.color;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[0.6rem] font-mono text-gray-500 uppercase tracking-[0.2em]">
                        {entry.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          />
        )}
        {referenceValue && (
          <ReferenceLine y={referenceValue} stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.5} />
        )}
        {series.map((s, idx) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            fill={`url(#grad-bar-${idx}-${filterId})`}
            name={s.name}
            radius={[6, 6, 0, 0]}
            animationDuration={1500}
            style={{ filter: `url(#glow-bar-${idx}-${filterId})` }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
});

BarChartComponent.displayName = "BarChartComponent";

export default BarChartComponent;
