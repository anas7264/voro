import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Memoized Button component to prevent unnecessary re-renders.
 * As a high-frequency UI element, memoization ensures that buttons don't re-render
 * during parent state changes unless their specific props (like isLoading or children) change.
 */
export const Button = memo(({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  fullWidth = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-4 font-black uppercase tracking-[0.3em] transition-all duration-500 focus:outline-none relative overflow-hidden group";

  const variants = {
    primary: "bg-white text-black hover:scale-105 active:scale-95",
    secondary: "bg-transparent border border-white/10 text-white hover:border-voro-primary",
    outline: "border border-white text-white hover:bg-white hover:text-black",
    ghost: "text-gray-500 hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  const sizes = {
    sm: "px-4 py-2 text-[8px]",
    md: "px-8 py-5 text-[10px]",
    lg: "px-10 py-6 text-[12px]",
    xl: "px-12 py-8 text-[14px]"
  };

  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    (disabled || isLoading) && "opacity-50 cursor-not-allowed",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classes}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
