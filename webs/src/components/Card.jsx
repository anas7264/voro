import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Memoized Card component to prevent unnecessary re-renders.
 * Since this is a core layout component used extensively in dashboards and lists,
 * memoization helps avoid redundant reconciliation when parent state updates.
 */
export const Card = memo(({ children, className = "", hover = false, ...props }) => {
  const classes = [
    "bg-[#0A0C14] border border-white/5 rounded-sm p-8 transition-all duration-500 ease-in-out",
    hover && "hover:border-voro-primary/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
