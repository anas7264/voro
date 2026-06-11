import React, { useId, memo } from "react";

/**
 * ⚡ OPTIMIZATION: Memoized Toggle component.
 */
export const Toggle = memo(({ enabled = false, onChange, label, className = "", ...props }) => {
  const labelId = useId();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-labelledby={label ? labelId : undefined}
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-7 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-95 ${
          enabled ? "bg-primary" : "bg-gray-600"
        }`}
        {...props}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      {label && (
        <span id={labelId} className="text-white cursor-pointer" onClick={() => onChange(!enabled)}>
          {label}
        </span>
      )}
    </div>
  );
});

Toggle.displayName = "Toggle";

export default Toggle;
