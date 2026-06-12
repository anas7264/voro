import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Refined luxury Badge component re-engineered as a 'Status Node'.
 * Utilizing glassmorphism, thin architectural borders, and JetBrains Mono typography
 * to maintain a high-end industrial boutique aesthetic.
 */
export const Badge = memo(({
  children,
  variant = "voro-primary",
  dot = false,
  className = "",
  ...props
}) => {
  const variants = {
    'voro-primary': "bg-voro-primary/10 text-voro-primary border-voro-primary/20",
    'voro-secondary': "bg-voro-secondary/10 text-voro-secondary border-voro-secondary/20",
    'voro-accent': "bg-voro-accent/10 text-voro-accent border-voro-accent/20",
    'voro-danger': "bg-voro-danger/10 text-voro-danger border-voro-danger/20",
    'voro-info': "bg-voro-info/10 text-voro-info border-voro-info/20",
    // Compatibility fallbacks
    'primary': "bg-voro-primary/10 text-voro-primary border-voro-primary/20",
    'secondary': "bg-voro-secondary/10 text-voro-secondary border-voro-secondary/20",
    'success': "bg-voro-secondary/10 text-voro-secondary border-voro-secondary/20",
    'warning': "bg-voro-accent/10 text-voro-accent border-voro-accent/20",
    'danger': "bg-voro-danger/10 text-voro-danger border-voro-danger/20",
    'gray': "bg-white/5 text-gray-400 border-white/10"
  };

  const dotColors = {
    'voro-primary': "bg-voro-primary shadow-[0_0_8px_#7C3AED]",
    'voro-secondary': "bg-voro-secondary shadow-[0_0_8px_#10B981]",
    'voro-accent': "bg-voro-accent shadow-[0_0_8px_#F59E0B]",
    'voro-danger': "bg-voro-danger shadow-[0_0_8px_#EF4444]",
    'voro-info': "bg-voro-info shadow-[0_0_8px_#3B82F6]",
    'primary': "bg-voro-primary shadow-[0_0_8px_#7C3AED]",
    'secondary': "bg-voro-secondary shadow-[0_0_8px_#10B981]",
    'success': "bg-voro-secondary shadow-[0_0_8px_#10B981]",
    'warning': "bg-voro-accent shadow-[0_0_8px_#F59E0B]",
    'danger': "bg-voro-danger shadow-[0_0_8px_#EF4444]",
    'gray': "bg-gray-500 shadow-[0_0_8px_rgba(156,163,175,0.5)]"
  };

  const classes = [
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.6rem] font-mono font-black uppercase tracking-[0.2em] backdrop-blur-md border transition-all duration-300",
    variants[variant] || variants['voro-primary'],
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant] || dotColors['voro-primary']}`}></span>
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant] || dotColors['voro-primary']}`}></span>
        </span>
      )}
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;
