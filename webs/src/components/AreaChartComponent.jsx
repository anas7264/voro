import React, { memo, useId } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Fallbacks.
 * Zero object allocations during component render passes.
 */
const DEFAULT_MARGIN = Object.freeze({ top: 12, right: 12, left: -20, bottom: 0 });
const DEFAULT_TICK_X = Object.freeze({ fill: "#4B5563", fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600, letterSpacing: '0.1em' });
const DEFAULT_TICK_Y = Object.freeze({ fill: "#4B5563", fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600 });
const DEFAULT_CURSOR = Object.freeze({ stroke: 'rgba(255, 255, 255, 0.08)', strokeWidth: 1, strokeDasharray: '3 3' });

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
              0xAREA_TELEMETRY
            </span>
          </div>

          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                  style={{ backgroundColor: entry.color, color: entry.color }}
                />
                <span className="text-[0.6rem] font-mono font-bold text-gray-400 uppercase tracking-widest">
                  {entry.name}
                </span>
              </div>
              <span className="text-2xl font-serif italic font-medium text-white tracking-tight">
                {entry.value}
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
 * ⚡ REFINEMENT: Volumetric Neural Area Telemetry Node (AreaChartComponent).
 * Re-engineered to Voro's 'Forge' luxury architecture with multi-stop area linear gradients,
 * multi-stage SVG glow filters, glassmorphic tooltip specimens, and zero-allocation performance.
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
  ...props
}) => {
  const filterId = useId().replace(/:/g, '');
  const series = dataKeys
    ? dataKeys
    : [{ key: dataKey, name: name || dataKey, color: color || fill }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={margin} {...props}>
        <defs>
          {series.map((s) => (
            <React.Fragment key={s.key}>
              <linearGradient id={`grad-${s.key}-${filterId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
              <filter id={`glow-${s.key}-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
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
          content={<CustomTooltip />}
          cursor={DEFAULT_CURSOR}
        />

        {series.length > 1 && (
          <Legend
            content={({ payload }) => (
              <div className="flex justify-center gap-8 mt-6">
                {payload.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: entry.color, color: entry.color }}
                    />
                    <span className="text-[0.6rem] font-mono font-bold text-gray-400 uppercase tracking-[0.2em]">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          />
        )}

        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            fill={`url(#grad-${s.key}-${filterId})`}
            strokeWidth={3}
            activeDot={{
              r: 5,
              fill: s.color,
              stroke: "#080B14",
              strokeWidth: 2.5,
              filter: `url(#glow-${s.key}-${filterId})`
            }}
            animationDuration={1500}
            style={{ filter: `url(#glow-${s.key}-${filterId})` }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
});

AreaChartComponent.displayName = "AreaChartComponent";

export default AreaChartComponent;
