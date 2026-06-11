import React, { useId } from "react";
import { Check } from "lucide-react";

export const Checkbox = ({ checked = false, onChange, label, disabled = false, className = "", ...props }) => {
  const id = useId();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center transition-transform active:scale-95">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer absolute opacity-0 w-6 h-6 cursor-pointer z-10 disabled:cursor-not-allowed"
          {...props}
        />
        <div
          className={`
            w-6 h-6 rounded-lg border-2 transition-all duration-500 flex items-center justify-center
            peer-focus-visible:ring-2 peer-focus-visible:ring-voro-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface
            ${checked
              ? "bg-voro-primary border-voro-primary shadow-lg shadow-voro-primary/30 rotate-[360deg]"
              : "border-white/10 bg-white/5 peer-hover:border-voro-primary/50"
            }
            ${disabled && "opacity-30"}
          `}
          aria-hidden="true"
        >
          {checked && <Check size={14} strokeWidth={4} className="text-white animate-scale-in" />}
        </div>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={`text-[0.65rem] font-black uppercase tracking-widest select-none transition-colors ${checked ? 'text-white' : 'text-gray-500'} ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
