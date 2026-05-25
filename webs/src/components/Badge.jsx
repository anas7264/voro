import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Memoized Badge component to prevent unnecessary re-renders.
 * Small UI elements like badges are often used in lists and can contribute to
 * cumulative render time if not memoized.
 */
export const Badge = memo(({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-black",
    danger: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    gray: "bg-gray-500 text-white"
  };

  const classes = [
    "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold",
    variants[variant],
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;
