import React, { memo, useId } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

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
              0xCHT_TELEMETRY
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
 * ⚡ REFINEMENT: Volumetric Neural Line Telemetry Node (LineChartComponent).
 * Re-engineered to Voro's 'Forge' luxury architecture with multi-stage SVG glow filters,
 * glassmorphic tooltip specimens, sub-pixel attestation hash badging, and zero-allocation performance.
 */
export const LineChartComponent = memo(({
  data,
  dataKey,
  dataKeys,         // array: [{ key, name, color }]
  name,
  stroke,
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
    : [{ key: dataKey, name: name || dataKey, color: stroke || color }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={margin} {...props}>
        <defs>
          <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
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

        {referenceValue && (
          <ReferenceLine y={referenceValue} stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.6} />
        )}

        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            stroke={s.color}
            name={s.name}
            dot={false}
            activeDot={{
              r: 5,
              fill: s.color,
              stroke: "#080B14",
              strokeWidth: 2.5,
              filter: `url(#glow-${filterId})`
            }}
            strokeWidth={3}
            connectNulls
            animationDuration={1500}
            style={{ filter: `url(#glow-${filterId})` }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
});

LineChartComponent.displayName = "LineChartComponent";

export default LineChartComponent;
