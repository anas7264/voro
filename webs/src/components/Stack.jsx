import React from "react";

export const Stack = ({ children, direction = "vertical", gap = 4, align = "start", justify = "start", className = "", ...props }) => {
  const directionClass = direction === "vertical" ? "flex flex-col" : "flex flex-row";

  const gapClass = {
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8"
  }[gap];

  const alignClass = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch"
  }[align];

  const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around"
  }[justify];

  return (
    <div className={`${directionClass} ${gapClass} ${alignClass} ${justifyClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Stack;
