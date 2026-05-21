import React from "react";

export const Spinner = ({ size = "md", color = "primary", message, className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const colors = {
    primary: "border-primary",
    secondary: "border-secondary",
    white: "border-white"
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div
        className={`${sizes[size]} ${colors[color]} border-4 border-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-gray-300 text-sm">{message}</p>}
    </div>
  );
};

export default Spinner;
