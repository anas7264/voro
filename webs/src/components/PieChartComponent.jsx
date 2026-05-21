import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export const PieChartComponent = ({ data, height = 300, colors, ...props }) => {
  const defaultColors = ["#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"];
  const chartColors = colors || defaultColors;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart {...props}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #2A3A52" }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
