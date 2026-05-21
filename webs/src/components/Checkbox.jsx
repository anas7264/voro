import React from "react";
import { Check } from "lucide-react";

export const Checkbox = ({ checked = false, onChange, label, disabled = false, className = "", ...props }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
          checked
            ? "bg-primary border-primary"
            : "border-border hover:border-primary"
        } ${disabled && "opacity-50 cursor-not-allowed"}`}
      >
        {checked && <Check size={16} className="text-white" />}
      </button>
      {label && <label className="text-white cursor-pointer">{label}</label>}
    </div>
  );
};

export default Checkbox;
