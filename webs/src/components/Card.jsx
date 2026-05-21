import React from "react";

export const Card = ({ children, className = "", hover = false, ...props }) => {
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
};

export default Card;
