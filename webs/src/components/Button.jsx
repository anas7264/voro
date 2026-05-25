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
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-primary text-white hover:opacity-90 focus:ring-primary",
    secondary: "bg-secondary text-white hover:opacity-90 focus:ring-secondary",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary hover:bg-opacity-10",
    danger: "bg-red-500 text-white hover:opacity-90 focus:ring-red-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
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
