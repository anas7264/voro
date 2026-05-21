import React from "react";

export const Progress = ({ value = 0, max = 100, color = "primary", className = "", label }) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500"
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <div className="flex justify-between mb-1 text-sm"><span className="text-gray-300">{label}</span><span className="text-gray-400">{Math.round(percentage)}%</span></div>}
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-border">
        <div
          className={`h-full ${colors[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;
