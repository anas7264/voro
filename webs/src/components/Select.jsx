import React, { useId, memo } from "react";
import { ChevronDown } from "lucide-react";

/**
 * ⚡ OPTIMIZATION: Refined Select component.
 * Improved with kinetic tactile feedback, accessible focus states,
 * and high-contrast monospaced typography while maintaining readability.
 */
export const Select = memo(({
  id,
  options = [],
  value,
  onChange,
  disabled = false,
  label,
  error = false,
  required = false,
  className = "",
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;

  const classes = [
    "w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-mono text-sm tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-all duration-500 appearance-none cursor-pointer",
    error && "border-red-500 focus-visible:ring-red-500",
    disabled && "opacity-30 cursor-not-allowed",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full group">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-voro-primary transition-colors mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative transition-transform active:scale-[0.98]">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={classes}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#0A0C14] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-voro-primary transition-colors duration-500"
          size={16}
        />
      </div>
      {error && (
        <span id={errorId} className="text-xs font-bold text-red-500 mt-2 block uppercase tracking-widest">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
