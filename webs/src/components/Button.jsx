import React, { memo, useRef, useState, useMemo } from "react";

/**
 * ⚡ OPTIMIZATION: Refined luxury Button component.
 * Architected as a 'Kinetic Power Node' featuring magnetic mouse tracking,
 * volumetric luminous lens, and Forge-standard coordinate telemetry.
 * Utilizes 'Surgical Reactivity' via direct DOM manipulation for 60fps performance.
 */
const Button = memo(({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  fullWidth = false,
  onClick,
  className = "",
  ...props
}) => {
  const buttonRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Generate a stable system ID for the node
  const nodeId = useMemo(() => `BTN_${Math.floor(Math.random() * 0x1000).toString(16).toUpperCase().padStart(3, '0')}`, []);

  const handleMouseMove = (e) => {
    if (!buttonRef.current || disabled || isLoading) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Magnetic pull calculation (max 8px translation, 10deg rotation)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const moveX = (x - centerX) * 0.15;
    const moveY = (y - centerY) * 0.15;
    const rotateY = ((x / rect.width) - 0.5) * 15;
    const rotateX = (0.5 - (y / rect.height)) * 15;

    buttonRef.current.style.setProperty('--mouse-x', `${x}px`);
    buttonRef.current.style.setProperty('--mouse-y', `${y}px`);
    buttonRef.current.style.setProperty('--move-x', `${moveX}px`);
    buttonRef.current.style.setProperty('--move-y', `${moveY}px`);
    buttonRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    buttonRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);

    if (txRef.current) txRef.current.innerText = rotateX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = rotateY.toFixed(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!buttonRef.current) return;

    buttonRef.current.style.setProperty('--move-x', '0px');
    buttonRef.current.style.setProperty('--move-y', '0px');
    buttonRef.current.style.setProperty('--rotate-x', '0deg');
    buttonRef.current.style.setProperty('--rotate-y', '0deg');
  };

  const variants = {
    primary: "bg-voro-primary text-white border border-white/10 shadow-[0_20px_50px_rgba(124,58,237,0.3)] hover:shadow-[0_40px_80px_rgba(124,58,237,0.5)]",
    secondary: "bg-[#0D1424]/80 backdrop-blur-xl text-white border border-white/5 hover:border-voro-primary/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)]",
    outline: "border border-voro-primary/50 text-voro-primary hover:bg-voro-primary hover:text-white shadow-[0_10px_30px_rgba(124,58,237,0.1)]",
    ghost: "text-voro-primary hover:bg-voro-primary/5 hover:text-white",
    danger: "bg-red-500/90 backdrop-blur-md text-white border border-white/10 shadow-[0_20px_40px_rgba(239,68,68,0.3)]"
  };

  const sizes = {
    sm: "px-5 py-2.5 text-[0.6rem]",
    md: "px-8 py-4 text-[0.65rem]",
    lg: "px-10 py-5 text-[0.75rem]",
    xl: "px-12 py-6 text-[0.85rem]"
  };

  const activeColor = variant === 'secondary' ? '#7C3AED' : variant === 'danger' ? '#EF4444' : '#7C3AED';

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center gap-3
        font-black uppercase tracking-[0.4em] rounded-2xl
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        overflow-hidden group
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${(disabled || isLoading) ? "opacity-50 cursor-not-allowed" : "active:scale-[0.97]"}
        ${className}
      `}
      style={{
        transform: isHovered
          ? 'translate3d(var(--move-x, 0), var(--move-y, 0), 0) rotateX(var(--rotate-x, 0)) rotateY(var(--rotate-y, 0))'
          : 'translate3d(0, 0, 0) rotateX(0) rotateY(0)',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      aria-busy={isLoading}
      {...props}
    >
      {/* Precision Grid & Grain */}
      <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000 pointer-events-none" />
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />

      {/* Kinetic Sweep Animation */}
      <div className="kinetic-sweep opacity-0 group-hover:opacity-20 transition-opacity duration-1000" />

      {/* Luminous Lens Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${activeColor}25, transparent 70%)`,
        }}
      />

      {/* Coordinate Telemetry Overlay */}
      <div className="absolute top-2 right-4 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500 flex gap-3 font-mono text-[0.4rem] font-bold text-white/40">
        <span>X_<span ref={txRef}>0.0</span></span>
        <span>Y_<span ref={tyRef}>0.0</span></span>
        <span className="text-voro-primary">[{nodeId}]</span>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : children}
      </div>

      {/* Gloss Reflection Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
    </button>
  );
});

Button.displayName = "Button";

export { Button };
export default Button;
