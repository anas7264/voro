import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const AreaChartComponent = ({
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
  // Normalize to array
  const series = dataKeys
    ? dataKeys
    : [{ key: dataKey, name: name || dataKey, color: color || fill }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} {...props}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
        <XAxis dataKey={xDataKey} stroke="#4B5563" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
        <YAxis stroke="#4B5563" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#0D1424", border: "1px solid #1E2D45", borderRadius: "8px" }}
          labelStyle={{ color: "#E5E7EB" }}
          itemStyle={{ color: "#9CA3AF" }}
        />
        {series.length > 1 && <Legend />}
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            fill={`url(#grad-${s.key})`}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
