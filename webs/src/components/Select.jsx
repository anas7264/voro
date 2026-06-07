import React, { useId, memo } from "react";
import { ChevronDown } from "lucide-react";

/**
 * ⚡ OPTIMIZATION: Memoized Select component.
 */
export const Select = memo(({
  id,
  options = [],
  value,
  onChange,
  disabled = false,
  label,
  error = false,
  className = "",
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;

  const classes = [
    "w-full px-3 py-2 border rounded-lg bg-surface text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 appearance-none",
    error && "border-red-500 focus:ring-red-500",
    !error && "border-border",
    disabled && "opacity-50 cursor-not-allowed bg-gray-600",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium mb-1 text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={classes}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
      </div>
      {error && (
        <span id={errorId} className="text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
