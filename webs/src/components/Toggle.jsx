import React from "react";

export const Toggle = ({ enabled = false, onChange, label, className = "", ...props }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`} {...props}>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
          enabled ? "bg-primary" : "bg-gray-600"
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      {label && <span className="text-white">{label}</span>}
    </div>
  );
};

export default Toggle;
