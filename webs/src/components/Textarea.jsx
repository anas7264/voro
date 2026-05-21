import React from "react";

export const Textarea = ({
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
  const classes = [
    "w-full px-3 py-2 border rounded-lg bg-surface text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-vertical",
    error && "border-red-500 focus:ring-red-500",
    !error && "border-border",
    disabled && "opacity-50 cursor-not-allowed bg-gray-600",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1 text-gray-300">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={classes}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Textarea;
