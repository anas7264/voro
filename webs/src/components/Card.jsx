import React, { memo, useRef, useState } from "react";

/**
 * ⚡ REFINEMENT: Luxury Forge-standard Card component.
 * Features ultra-high-fidelity glassmorphism, 3D volumetric tilt,
 * magnetic mouse tracking, and industrial telemetry markers.
 * 'premium' variant implements Surgical Reactivity via direct DOM manipulation.
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
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (variant !== 'premium' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    // Internal Parallax Displacement: Background grid moves inversely to tilt
    containerRef.current.style.setProperty('--grid-x', `${tiltY * -0.5}px`);
    containerRef.current.style.setProperty('--grid-y', `${tiltX * 0.5}px`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    if (variant !== 'premium') return;
    setIsFocused(true);
    if (containerRef.current) {
      // Static 4-degree tilt for focus feedback
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      containerRef.current.style.setProperty('--grid-x', '2px');
      containerRef.current.style.setProperty('--grid-y', '2px');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const variants = {
    glass: "bg-[#0A0C14]/80 backdrop-blur-2xl border-white/5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.05)]",
    solid: "bg-[#0A0C14] border-white/5 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)]",
    flat: "bg-[#020408] border-white/[0.03] shadow-none",
    premium: "bg-[#0A0C14]/60 backdrop-blur-3xl border-white/5 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)]"
  };

  const classes = [
    "relative border rounded-[2.5rem] p-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden group/card outline-none",
    variants[variant] || variants.glass,
    hover && variant !== 'premium' && "hover:border-white/10 hover:-translate-y-2 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] cursor-pointer",
    variant === 'premium' && "focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#080B14]",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={variant === 'premium' ? 0 : -1}
      className={classes}
      style={variant === 'premium' ? {
        transform: interactionActive
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      } : {}}
      {...props}
    >
      {/* Precision Grain & Light Effect */}
      {variant !== 'flat' && (
        <>
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent pointer-events-none" />
        </>
      )}

      {variant === 'premium' && (
        <>
           {/* Internal Parallax Displacement: Moving grid layer */}
           <div
             className="absolute inset-0 bg-grid-white opacity-0 group-hover/card:opacity-[0.15] group-focus-visible/card:opacity-[0.15] transition-opacity duration-1000 pointer-events-none"
             style={{
               transform: 'translate3d(var(--grid-x, 0), var(--grid-y, 0), 10px)',
             }}
           />

           {/* Liquid Border Intelligence: Perimeter-following reactive glow */}
           <div
             className="absolute -inset-[1px] rounded-[2.5rem] opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 transition-opacity duration-700 pointer-events-none"
             style={{
               background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.4), transparent 80%)`,
               maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
               maskClip: 'content-box, border-box',
               maskComposite: 'exclude',
               WebkitMaskComposite: 'xor',
               padding: '1px',
             }}
           />

           {/* Kinetic Sweep */}
           <div className="kinetic-sweep opacity-20 group-hover/card:opacity-40 transition-opacity duration-1000" />

           {/* Luminous Lens */}
           <div
              className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: isHovered
                  ? `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.05), transparent 40%)`
                  : `radial-gradient(600px circle at 50% 50%, rgba(124, 58, 237, 0.05), transparent 40%)`,
                transform: 'translateZ(20px)'
              }}
            />

            {/* Coordinate Telemetry Overlay */}
            <div
              className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 transition-all duration-500"
              style={{ transform: 'translateZ(60px)' }}
            >
              <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
                <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
                <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
                <span className="text-white/20">[{nodeId}]</span>
              </div>
            </div>
        </>
      )}

      <div className="relative z-10" style={variant === 'premium' ? { transform: 'translateZ(40px)' } : {}}>
        {children}
      </div>
    </div>
  );
});

Card.displayName = "Card";

export default Card;
