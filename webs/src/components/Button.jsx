import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

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
    disabled && "opacity-50 cursor-not-allowed",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClick} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
