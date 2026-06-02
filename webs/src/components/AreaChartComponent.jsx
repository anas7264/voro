import React, { memo, useId } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
 * ⚡ OPTIMIZATION: Memoized AreaChartComponent to prevent unnecessary re-renders.
 * Refined to luxury boutique standards with atmospheric gradients and precision typography.
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
  ...props
}) => {
  const filterId = useId().replace(/:/g, '');
  // Normalize to array
  const series = dataKeys
    ? dataKeys
    : [{ key: dataKey, name: name || dataKey, color: color || fill }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} {...props}>
        <defs>
          {series.map((s) => (
            <React.Fragment key={s.key}>
              <linearGradient id={`grad-${s.key}-${filterId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
              <filter id={`glow-${s.key}-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
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
              r: 4,
              fill: s.color,
              stroke: "#080B14",
              strokeWidth: 2,
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
