import React, { memo, useRef, useState } from "react";

/**
 * ⚡ REFINEMENT: Luxury Forge-standard Card component.
 * Features ultra-high-fidelity glassmorphism, 3D volumetric tilt,
 * magnetic mouse tracking, and industrial telemetry markers.
 * 'premium' variant implements Surgical Reactivity via direct DOM manipulation
 * for "Liquid Border Intelligence" and "Internal Parallax Displacement".
 */
const Card = memo(({
  children,
  className = "",
  hover = false,
  variant = "glass",
  nodeId = "CARD_01",
  ...props
}) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    // Internal Parallax Displacement (inverse movement for depth)
    const gridX = (x / rect.width - 0.5) * -15;
    const gridY = (y / rect.height - 0.5) * -15;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
    containerRef.current.style.setProperty('--grid-x', `${gridX}px`);
    containerRef.current.style.setProperty('--grid-y', `${gridY}px`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const variants = {
    glass: "bg-[#0A0C14]/80 backdrop-blur-2xl border-white/5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.05)]",
    solid: "bg-[#0A0C14] border-white/5 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)]",
    flat: "bg-[#020408] border-white/[0.03] shadow-none",
    premium: "bg-[#0A0C14]/60 backdrop-blur-3xl border-white/[0.03] shadow-[0_100px_160px_-40px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(255,255,255,0.05)]"
  };

  const classes = [
    "relative border rounded-[2.5rem] p-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden group/card",
    variants[variant] || variants.glass,
    hover && variant !== 'premium' && "hover:border-white/10 hover:-translate-y-2 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] cursor-pointer",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (containerRef.current) {
          containerRef.current.style.setProperty('--grid-x', '0px');
          containerRef.current.style.setProperty('--grid-y', '0px');
        }
      }}
      className={classes}
      style={variant === 'premium' ? {
        transform: isHovered
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      } : {}}
      {...props}
    >
      {/* 🛰️ Liquid Border Intelligence: Reactive perimeter illumination */}
      {variant === 'premium' && (
        <div
          className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            padding: '1px',
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.3), transparent 80%)`,
            WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* Volumetric Internal Layers: Displacement Parallax */}
      {variant !== 'flat' && (
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: isHovered
              ? 'translate3d(var(--grid-x, 0px), var(--grid-y, 0px), 0)'
              : 'translate3d(0, 0, 0)',
            transition: isHovered ? 'none' : 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
          <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent" />
        </div>
      )}

      {variant === 'premium' && (
        <>
           {/* Kinetic Sweep */}
           <div className="kinetic-sweep opacity-20 group-hover/card:opacity-40 transition-opacity duration-1000" />

           {/* Luminous Lens */}
           <div
              className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.05), transparent 45%)`,
                transform: 'translateZ(20px)'
              }}
            />

            {/* Coordinate Telemetry Overlay */}
            <div
              className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-all duration-500"
              style={{ transform: 'translateZ(80px)' }}
            >
              <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
                <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
                <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
                <span className="text-white/20">[{nodeId}]</span>
              </div>
            </div>
        </>
      )}

      <div className="relative z-10" style={variant === 'premium' ? { transform: 'translateZ(50px)' } : {}}>
        {children}
      </div>
    </div>
  );
});

Card.displayName = "Card";

export default Card;
