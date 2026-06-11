import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Refined luxury Badge component – 'Status Node'.
 * Transitioned from flat UI to technical glassmorphism. Features thin borders,
 * JetBrains Mono typography, and pulsing micro-dot indicators.
 */
export const Badge = memo(({
  children,
  variant = "primary",
  color, // Support both 'variant' and 'color' props
  className = "",
  dot = false,
  pulse = false,
  ...props
}) => {
  const activeVariant = color || variant;

  const variants = {
    primary: "text-voro-primary border-voro-primary/20 bg-voro-primary/5",
    secondary: "text-voro-secondary border-voro-secondary/20 bg-voro-secondary/5",
    success: "text-voro-secondary border-voro-secondary/20 bg-voro-secondary/5",
    warning: "text-voro-accent border-voro-accent/20 bg-voro-accent/5",
    danger: "text-voro-danger border-voro-danger/20 bg-voro-danger/5",
    info: "text-voro-info border-voro-info/20 bg-voro-info/5",
    accent: "text-voro-accent border-voro-accent/20 bg-voro-accent/5",
    gray: "text-gray-500 border-white/10 bg-white/[0.02]"
  };

  const dotColors = {
    primary: "bg-voro-primary",
    secondary: "bg-voro-secondary",
    success: "bg-voro-secondary",
    warning: "bg-voro-accent",
    danger: "bg-voro-danger",
    info: "bg-voro-info",
    accent: "bg-voro-accent",
    gray: "bg-gray-700"
  };

  const classes = [
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.6rem] font-mono font-bold uppercase tracking-[0.15em] border backdrop-blur-md transition-all duration-300",
    variants[activeVariant] || variants.primary,
    className
  ]
    .filter(Boolean)
    .join(" ");

  const dotClass = dotColors[activeVariant] || dotColors.primary;

  return (
    <span className={classes} {...props}>
      {(dot || pulse) && (
        <div className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotClass}`}></span>
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotClass}`}></span>
        </div>
      )}
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;
