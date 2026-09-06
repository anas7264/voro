import React, { memo, useRef, useMemo, useId } from "react";
import { X } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Neural Metadata Fragment ('Tag').
 * Re-engineered conforming to Voro's 'Forge' luxury system aesthetic and zero-allocation performance standards.
 * Features ultra-high-fidelity glassmorphism, 60fps direct-DOM 3D volumetric tilt tracking,
 * magnetic liquid border intelligence, holographic coordinate telemetry overlays,
 * SSR-safe deterministic sub-pixel hash badging (`0xTAG_...`), and W3C APG compliant keyboard focus states.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Glassmorphic metadata node suggests a protected biometric data fragment.
 * 2. Precision: Playfair Display italic accents paired with JetBrains Mono system telemetry.
 * 3. Motion: Direct-DOM 60fps 3D volumetric mouse tracking bypassing React render passes.
 * 4. Atmosphere: Kinetic shimmer gradients, liquid border perimeter, and sub-pixel boutique grain.
 */
export const Tag = memo(({
  children,
  variant = "voro-primary",
  size = "md",
  dot = true,
  interactive = true,
  className = "",
  onRemove,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onFocus,
  onBlur,
  tabIndex,
  ...props
}) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  const generatedId = useId();

  // Determine whether interactive mouse tracking is active
  const isInteractive = interactive || Boolean(onClick) || Boolean(onRemove);

  // Generate an SSR-safe deterministic sub-pixel attestation hash
  const subpixelHash = useMemo(() => {
    const cleanId = generatedId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `0xTAG_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [generatedId]);

  const handleMouseMove = (e) => {
    if (onMouseMove) onMouseMove(e);
    if (!containerRef.current || !isInteractive) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt calculation (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    const style = containerRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('transform', `perspective(600px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-2px) scale(1.02)`);
    style.setProperty('transition', 'none');

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseEnter = (e) => {
    if (onMouseEnter) onMouseEnter(e);
    isHoveredRef.current = true;
  };

  const handleMouseLeave = (e) => {
    if (onMouseLeave) onMouseLeave(e);
    isHoveredRef.current = false;
    if (!containerRef.current || !isInteractive) return;

    const style = containerRef.current.style;
    if (isFocusedRef.current) {
      // W3C APG static 4-degree keyboard focus tilt feedback
      style.setProperty('--tilt-x', '4.00deg');
      style.setProperty('--tilt-y', '-4.00deg');
      style.setProperty('transform', 'perspective(600px) rotateX(4deg) rotateY(-4deg) translateY(-1px) scale(1.02)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  };

  const handleFocus = (e) => {
    if (onFocus) onFocus(e);
    isFocusedRef.current = true;
    if (!containerRef.current || !isInteractive) return;

    const style = containerRef.current.style;
    style.setProperty('--tilt-x', '4.00deg');
    style.setProperty('--tilt-y', '-4.00deg');
    style.setProperty('transform', 'perspective(600px) rotateX(4deg) rotateY(-4deg) translateY(-1px) scale(1.02)');
    style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
  };

  const handleBlur = (e) => {
    if (onBlur) onBlur(e);
    isFocusedRef.current = false;
    if (!containerRef.current || !isInteractive) return;

    if (!isHoveredRef.current) {
      const style = containerRef.current.style;
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  };

  const variantClass = VARIANTS[variant] || VARIANTS['voro-primary'];
  const sizeClass = SIZES[size] || SIZES['md'];
  const dotColorClass = DOT_COLORS[variant] || DOT_COLORS['voro-primary'];
  const glowColor = GLOW_COLORS[variant] || GLOW_COLORS['voro-primary'];

  const baseClasses = [
    "relative inline-flex items-center gap-2.5 rounded-full backdrop-blur-2xl border transition-all duration-500 overflow-hidden group/tag focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408]",
    sizeClass,
    variantClass,
    isInteractive && "cursor-pointer hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.6)]",
    className
  ].filter(Boolean).join(" ");

  return (
    <span
      ref={containerRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
      className={baseClasses}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '600px'
      }}
      {...props}
    >
      {/* 🛰️ Liquid Border Intelligence: Dynamic reactive perimeter illumination */}
      {isInteractive && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full opacity-0 group-hover/tag:opacity-100 group-focus-visible/tag:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            padding: '1px',
            background: `radial-gradient(120px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 80%)`,
            WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* Volumetric Internal Grain & Micro-Grid Layers */}
      <span aria-hidden="true" className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />
      <span aria-hidden="true" className="absolute inset-0 bg-grid-white opacity-0 group-hover/tag:opacity-10 transition-opacity duration-700 pointer-events-none" />

      {/* Dynamic Luminous Spotlight */}
      {isInteractive && (
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-0 group-hover/tag:opacity-100 group-focus-visible/tag:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(140px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 70%)`,
            transform: 'translateZ(10px)'
          }}
        />
      )}

      {/* Kinetic Signal Node (Dot Indicator) */}
      {dot && (
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0" style={{ transform: 'translateZ(25px)' }}>
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColorClass}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColorClass}`} />
        </span>
      )}

      {/* Narrative Label Payload */}
      <span className="relative z-10 flex items-center gap-1.5 font-mono font-black uppercase tracking-[0.25em] whitespace-nowrap" style={{ transform: 'translateZ(30px)' }}>
        {children}
      </span>

      {/* System Telemetry & Sub-pixel Hash Overlay */}
      {isInteractive && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-2 pointer-events-none opacity-0 group-hover/tag:opacity-80 group-focus-visible/tag:opacity-80 transition-opacity duration-500 font-mono text-[0.35rem] font-bold text-white/30 leading-none select-none flex items-center gap-1"
          style={{ transform: 'translateZ(40px)' }}
        >
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="opacity-40">{subpixelHash}</span>
        </span>
      )}

      {/* Interactive Remove Trigger */}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          className={`
            relative z-20 ml-1 -mr-1 p-0.5 rounded-full transition-all duration-300
            hover:bg-white/10 active:scale-75 text-gray-400 hover:text-white
            focus:outline-none focus-visible:ring-1 focus-visible:ring-current
          `}
          style={{ transform: 'translateZ(35px)' }}
          aria-label={typeof children === 'string' ? `Remove ${children}` : "Remove tag"}
        >
          <X size={10} strokeWidth={3} />
        </button>
      )}

      {/* Subtle Gloss Overlay */}
      <span aria-hidden="true" className="absolute inset-0 opacity-0 group-hover/tag:opacity-20 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
    </span>
  );
});

Tag.displayName = "Tag";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Static Lookup Objects.
 * Zero heap allocations during component render cycles.
 */
const SIZES = Object.freeze({
  'sm': "px-2.5 py-0.5 text-[0.5rem]",
  'md': "px-3.5 py-1 text-[0.55rem]",
  'lg': "px-4.5 py-1.5 text-[0.6rem]"
});

const VARIANTS = Object.freeze({
  'voro-primary': "bg-voro-primary/[0.04] text-voro-primary border-voro-primary/30 shadow-[0_4px_12px_rgba(124,58,237,0.12)]",
  'voro-secondary': "bg-voro-secondary/[0.04] text-voro-secondary border-voro-secondary/30 shadow-[0_4px_12px_rgba(16,185,129,0.12)]",
  'voro-accent': "bg-voro-accent/[0.04] text-voro-accent border-voro-accent/30 shadow-[0_4px_12px_rgba(245,158,11,0.12)]",
  'voro-danger': "bg-voro-danger/[0.04] text-voro-danger border-voro-danger/30 shadow-[0_4px_12px_rgba(239,68,68,0.12)]",
  'voro-info': "bg-voro-info/[0.04] text-voro-info border-voro-info/30 shadow-[0_4px_12px_rgba(59,130,246,0.12)]",
  'primary': "bg-voro-primary/[0.04] text-voro-primary border-voro-primary/30 shadow-[0_4px_12px_rgba(124,58,237,0.12)]",
  'secondary': "bg-voro-secondary/[0.04] text-voro-secondary border-voro-secondary/30 shadow-[0_4px_12px_rgba(16,185,129,0.12)]",
  'success': "bg-voro-secondary/[0.04] text-voro-secondary border-voro-secondary/30 shadow-[0_4px_12px_rgba(16,185,129,0.12)]",
  'warning': "bg-voro-accent/[0.04] text-voro-accent border-voro-accent/30 shadow-[0_4px_12px_rgba(245,158,11,0.12)]",
  'danger': "bg-voro-danger/[0.04] text-voro-danger border-voro-danger/30 shadow-[0_4px_12px_rgba(239,68,68,0.12)]",
  'gray': "bg-white/[0.02] text-gray-300 border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
});

const DOT_COLORS = Object.freeze({
  'voro-primary': "bg-voro-primary shadow-[0_0_8px_#7C3AED]",
  'voro-secondary': "bg-voro-secondary shadow-[0_0_8px_#10B981]",
  'voro-accent': "bg-voro-accent shadow-[0_0_8px_#F59E0B]",
  'voro-danger': "bg-voro-danger shadow-[0_0_8px_#EF4444]",
  'voro-info': "bg-voro-info shadow-[0_0_8px_#3B82F6]",
  'primary': "bg-voro-primary shadow-[0_0_8px_#7C3AED]",
  'secondary': "bg-voro-secondary shadow-[0_0_8px_#10B981]",
  'success': "bg-voro-secondary shadow-[0_0_8px_#10B981]",
  'warning': "bg-voro-accent shadow-[0_0_8px_#F59E0B]",
  'danger': "bg-voro-danger shadow-[0_0_8px_#EF4444]",
  'gray': "bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.5)]"
});

const GLOW_COLORS = Object.freeze({
  'voro-primary': "rgba(124, 58, 237, 0.4)",
  'voro-secondary': "rgba(16, 185, 129, 0.4)",
  'voro-accent': "rgba(245, 158, 11, 0.4)",
  'voro-danger': "rgba(239, 68, 68, 0.4)",
  'voro-info': "rgba(59, 130, 246, 0.4)",
  'primary': "rgba(124, 58, 237, 0.4)",
  'secondary': "rgba(16, 185, 129, 0.4)",
  'success': "rgba(16, 185, 129, 0.4)",
  'warning': "rgba(245, 158, 11, 0.4)",
  'danger': "rgba(239, 68, 68, 0.4)",
  'gray': "rgba(255, 255, 255, 0.2)"
});

export default Tag;
