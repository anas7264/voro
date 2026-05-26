import React, { useId } from "react";
import { Check } from "lucide-react";

export const Checkbox = ({ checked = false, onChange, label, disabled = false, className = "", ...props }) => {
  const id = useId();

  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer absolute opacity-0 w-5 h-5 cursor-pointer z-10 disabled:cursor-not-allowed"
        />
        <div
          className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface ${
            checked
              ? "bg-primary border-primary"
              : "border-border peer-hover:border-primary"
          } ${disabled && "opacity-50"}`}
          aria-hidden="true"
        >
          {checked && <Check size={16} className="text-white" />}
        </div>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={`text-white select-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
