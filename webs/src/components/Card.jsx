import React, { memo } from "react";

export const Card = memo(({ children, className = "", hover = false, ...props }) => {
  const classes = [
    "bg-[#0A0C14] border border-white/5 rounded-[2rem] p-8 shadow-2xl shadow-black/20 backdrop-blur-md",
    hover && "hover:border-white/10 hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer",
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
