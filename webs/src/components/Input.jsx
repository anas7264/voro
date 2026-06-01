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
    "w-full bg-transparent border-b border-white/10 px-0 py-4 text-white font-mono placeholder:font-serif placeholder:italic placeholder:text-gray-600 focus:outline-none focus:border-voro-primary transition-all duration-500",
    error && "border-red-500 focus:border-red-500",
    disabled && "opacity-30 cursor-not-allowed",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full group">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[0.6rem] font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-voro-primary transition-colors"
        >
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
        <span id={errorId} className="text-[0.6rem] font-bold text-red-500 mt-2 block uppercase tracking-widest">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
