import React, { useId } from "react";

export const Input = ({
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  error = false,
  label,
  className = "",
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  const classes = [
    "w-full bg-transparent border-b-2 py-6 text-2xl font-serif italic text-white placeholder:text-gray-900 focus:outline-none transition-all duration-500",
    error && "border-red-500",
    !error && "border-white/10 focus:border-voro-primary",
    disabled && "opacity-20 cursor-not-allowed",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={classes}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
