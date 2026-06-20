import React, { useId, memo } from "react";

/**
 * ⚡ OPTIMIZATION: Memoized Textarea component.
 * Updated to 'Forge' aesthetic with monospaced metadata and industrial styling.
 */
export const Textarea = memo(({
  id,
  placeholder = "",
  value,
  onChange,
  disabled = false,
  error = false,
  label,
  rows = 4,
  className = "",
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;

  const classes = [
    "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:font-serif placeholder:italic placeholder:text-gray-600 focus:outline-none focus:border-voro-primary/50 focus-visible:ring-2 focus-visible:ring-voro-primary/20 transition-all duration-500 resize-vertical",
    error && "border-red-500/50 focus:border-red-500 focus-visible:ring-red-500/20",
    disabled && "opacity-30 cursor-not-allowed bg-white/5",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full group">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-voro-primary transition-colors mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={classes}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-xs font-bold text-red-500 mt-2 block uppercase tracking-widest">
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
