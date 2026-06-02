import React, { memo, useId } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0C14]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[0.6rem] font-mono text-gray-500 uppercase tracking-[0.2em] mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-baseline gap-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-2xl font-serif italic font-medium text-white tracking-tight">
              {entry.value}
            </span>
            <span className="text-[0.6rem] font-mono text-gray-400 uppercase tracking-widest">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * ⚡ OPTIMIZATION: Memoized LineChartComponent to prevent unnecessary re-renders.
 * Refined to luxury boutique standards with glassmorphic tooltips and kinetic glow.
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
  ...props
}) => {
  const filterId = useId().replace(/:/g, '');
  const series = dataKeys
    ? dataKeys
    : [{ key: dataKey, name: name || dataKey, color: stroke || color }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} {...props}>
        <defs>
          <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.03)" strokeDasharray="0" />
        <XAxis
          dataKey={xDataKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#4B5563", fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 500 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#4B5563", fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 500 }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: 'rgba(255, 255, 255, 0.05)', strokeWidth: 1 }}
        />
        {series.length > 1 && (
          <Legend
            content={({ payload }) => (
              <div className="flex justify-center gap-6 mt-6">
                {payload.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-[0.6rem] font-mono text-gray-500 uppercase tracking-[0.2em]">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          />
        )}
        {referenceValue && (
          <ReferenceLine y={referenceValue} stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.5} />
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
              r: 4,
              fill: s.color,
              stroke: "#080B14",
              strokeWidth: 2,
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
