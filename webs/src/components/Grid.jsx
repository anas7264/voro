import React from "react";

export const Grid = ({ children, columns = 3, gap = 4, responsive = true, className = "", ...props }) => {
  const gridCols = responsive
    ? {
        1: "grid-cols-1",
        2: "sm:grid-cols-2",
        3: "md:grid-cols-3",
        4: "lg:grid-cols-4"
      }[columns]
    : `grid-cols-${columns}`;

  const gapClass = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8"
  }[gap];

  return (
    <div className={`grid ${gridCols} ${gapClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Grid;
