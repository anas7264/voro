import React from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer } from "recharts";

export const RadarChartComponent = ({ data, dataKey, name, fill = "#7C3AED", height = 300, ...props }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} {...props}>
        <PolarGrid stroke="#2A3A52" />
        <PolarAngleAxis stroke="#9CA3AF" />
        <PolarRadiusAxis stroke="#9CA3AF" />
        <Radar name={name} dataKey={dataKey} stroke={fill} fill={fill} fillOpacity={0.6} />
        <Legend />
        <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #2A3A52" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChartComponent;
