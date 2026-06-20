import React, { memo } from "react";

export const Card = memo(({
  children,
  className = "",
  hover = false,
  variant = "glass",
  ...props
}) => {
  const variants = {
    glass: "bg-[#0A0C14]/80 backdrop-blur-2xl border-white/5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.05)]",
    solid: "bg-[#0A0C14] border-white/5 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)]",
    flat: "bg-[#020408] border-white/[0.03] shadow-none"
  };

  const classes = [
    "relative border rounded-[2.5rem] p-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
    variants[variant] || variants.glass,
    hover && "hover:border-white/10 hover:-translate-y-2 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] cursor-pointer",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {/* Precision Grain & Light Effect */}
      {variant !== 'flat' && (
        <>
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent pointer-events-none" />
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

Card.displayName = "Card";

export default Card;
