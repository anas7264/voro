import React, { memo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

/**
 * ⚡ OPTIMIZATION: Memoized BarChartComponent to prevent unnecessary re-renders.
 * Recharts components can be expensive to re-calculate and re-draw. Memoization
 * ensures the chart only updates when data or core configuration changes.
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
  ...props
}) => {
  const series = dataKeys
    ? dataKeys
    : [{ key: dataKey, name: name || dataKey, color: fill || color }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} {...props}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
        <XAxis
          dataKey={xDataKey}
          stroke="#4B5563"
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
        />
        <YAxis stroke="#4B5563" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#0D1424", border: "1px solid #1E2D45", borderRadius: "8px" }}
          labelStyle={{ color: "#E5E7EB" }}
          itemStyle={{ color: "#9CA3AF" }}
        />
        {series.length > 1 && <Legend />}
        {referenceValue && (
          <ReferenceLine y={referenceValue} stroke="#EF4444" strokeDasharray="4 4" />
        )}
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            fill={s.color}
            name={s.name}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
});

BarChartComponent.displayName = "BarChartComponent";

export default BarChartComponent;
