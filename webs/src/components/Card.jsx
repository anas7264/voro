import React, { memo } from "react";

/**
 * ⚡ OPTIMIZATION: Memoized Card component to prevent unnecessary re-renders.
 * Since this is a core layout component used extensively in dashboards and lists,
 * memoization helps avoid redundant reconciliation when parent state updates.
 */
export const Card = memo(({ children, className = "", hover = false, ...props }) => {
  const classes = [
    "bg-card border border-border rounded-lg p-4 shadow-sm",
    hover && "hover:shadow-md transition-shadow duration-200 cursor-pointer",
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
