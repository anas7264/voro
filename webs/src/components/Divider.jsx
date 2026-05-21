import React from "react";

export const Divider = ({ label, className = "" }) => {
  return (
    <div className={`flex items-center gap-4 my-4 ${className}`}>
      <div className="flex-1 h-px bg-border" />
      {label && <span className="text-gray-400 text-sm">{label}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
};

export default Divider;
