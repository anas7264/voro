import React, { memo, useRef, useState, useId, useMemo } from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Kinetic Neural Notification Specimen.
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features 60fps direct-DOM 3D volumetric hover tilt tracking, live spatial coordinate telemetry,
 * SSR-safe deterministic attestation node badging, liquid perimeter lighting, and W3C APG focus physics.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display italic serif headings for editorial prestige and commanding weight.
 * 2. Precision: JetBrains Mono metadata for technical system attestation and live coordinate telemetry.
 * 3. Motion: Direct-DOM 60fps 3D volumetric hover tilts bypassing React render passes.
 * 4. Atmosphere: Heavy charcoal architecture (#0A0C14), liquid perimeter illumination, and type-specific backglows.
 */

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted and frozen static dictionaries.
 * Eliminates heap allocations and garbage collection overhead on every render cycle.
 */
const ICONS = Object.freeze({
  error: <AlertCircle size={20} className="text-red-400 flex-shrink-0" />,
  success: <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />,
  warning: <AlertTriangle size={20} className="text-amber-400 flex-shrink-0" />,
  info: <Info size={20} className="text-voro-primary flex-shrink-0" />,
  danger: <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
});

const VARIANTS = Object.freeze({
  error: "border-red-500/20 bg-[#0A0C14]/90 text-red-400 shadow-[0_30px_70px_rgba(239,68,68,0.15)]",
  success: "border-emerald-500/20 bg-[#0A0C14]/90 text-emerald-400 shadow-[0_30px_70px_rgba(16,185,129,0.15)]",
  warning: "border-amber-500/20 bg-[#0A0C14]/90 text-amber-400 shadow-[0_30px_70px_rgba(245,158,11,0.15)]",
  info: "border-voro-primary/20 bg-[#0A0C14]/90 text-voro-primary shadow-[0_30px_70px_rgba(124,58,237,0.15)]",
  danger: "border-red-500/20 bg-[#0A0C14]/90 text-red-400 shadow-[0_30px_70px_rgba(239,68,68,0.15)]"
});

const STATUS_GLOW = Object.freeze({
  error: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]",
  success: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]",
  warning: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]",
  info: "bg-voro-primary shadow-[0_0_12px_rgba(124,58,237,0.8)]",
  danger: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
});

const ATMOSPHERIC_GLOW = Object.freeze({
  error: "rgba(239, 68, 68, 0.12)",
  success: "rgba(16, 185, 129, 0.12)",
  warning: "rgba(245, 158, 11, 0.12)",
  info: "rgba(124, 58, 237, 0.12)",
  danger: "rgba(239, 68, 68, 0.12)"
});

const PERIMETER_GLOW = Object.freeze({
  error: "rgba(239, 68, 68, 0.35)",
  success: "rgba(16, 185, 129, 0.35)",
  warning: "rgba(245, 158, 11, 0.35)",
  info: "rgba(124, 58, 237, 0.35)",
  danger: "rgba(239, 68, 68, 0.35)"
});

export const Alert = memo(({ type = "info", title, message, onClose, className = "" }) => {
  const generatedId = useId();
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // SSR-safe deterministic subpixel attestation hash
  const subpixelHash = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `0xALT_${cleanId.padEnd(4, '0').slice(0, 4).toUpperCase()}`;
  }, [generatedId]);

  const currentVariant = VARIANTS[type] || VARIANTS.info;
  const currentGlow = STATUS_GLOW[type] || STATUS_GLOW.info;
  const currentAtmosphere = ATMOSPHERIC_GLOW[type] || ATMOSPHERIC_GLOW.info;
  const currentPerimeter = PERIMETER_GLOW[type] || PERIMETER_GLOW.info;
  const currentIcon = ICONS[type] || ICONS.info;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D rotational tilt calculation (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(2);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(2);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!containerRef.current) return;

    if (isFocused) {
      // Revert to static 4-degree focus tilt on keyboard focus
      containerRef.current.style.setProperty('--tilt-x', '4.00deg');
      containerRef.current.style.setProperty('--tilt-y', '-4.00deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.00";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.00";
    } else {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!containerRef.current) return;

    // Static 4-degree tilt physics for W3C APG keyboard accessibility
    containerRef.current.style.setProperty('--tilt-x', '4.00deg');
    containerRef.current.style.setProperty('--tilt-y', '-4.00deg');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.00";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.00";
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!containerRef.current && !isHovered) return;

    if (!isHovered && containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;
  const messageId = message ? `${generatedId}-msg` : undefined;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="alert"
      aria-atomic="true"
      aria-describedby={messageId}
      style={{
        transform: interactionActive
          ? `perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        group relative overflow-hidden rounded-3xl p-6 md:p-7
        backdrop-blur-3xl border ${currentVariant}
        outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408]
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]
        ${className}
      `}
    >
      {/* Precision Micro-Grid & Boutique Grain Texture */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.05] group-focus-visible:opacity-[0.05] transition-opacity duration-700" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.03]" />

        {/* Dynamic Luminous Lens Spotlight Follower */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-700"
          style={{
            background: isHovered
              ? `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${currentAtmosphere}, transparent 70%)`
              : `radial-gradient(400px circle at 50% 50%, ${currentAtmosphere}, transparent 70%)`,
          }}
        />
      </div>

      {/* Dynamic Liquid Light Perimeter Illumination */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${currentPerimeter}, transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="relative z-10 flex items-start gap-5" style={{ transform: 'translateZ(20px)' }}>
        {/* Kinetic Status Pulse Node */}
        <div className="relative flex-shrink-0 mt-1" style={{ transform: 'translateZ(30px)' }}>
          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            {currentIcon}
          </div>
          <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${currentGlow} animate-pulse`} />
          <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${currentGlow} animate-ping opacity-40`} />
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Metadata Line */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.4em] text-white/50 group-hover:text-white/80 transition-colors">
                {type.toUpperCase()}_LOG
              </span>
              <div className="h-px w-6 bg-current opacity-20" />
              <span className="text-[0.45rem] font-mono font-bold text-voro-primary/80 uppercase tracking-widest hidden sm:inline">
                [{subpixelHash}]
              </span>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Holographic Coordinate Telemetry Overlay */}
              <div
                aria-hidden="true"
                className="hidden sm:flex items-center gap-2 font-mono text-[0.45rem] font-bold text-white/30 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500 tracking-widest"
              >
                <span>TX_<span ref={tiltXRef}>0.00</span>°</span>
                <span>TY_<span ref={tiltYRef}>0.00</span>°</span>
              </div>

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300 outline-none focus-visible:ring-1 focus-visible:ring-current group/btn"
                  aria-label={
                    typeof title === "string" && title
                      ? `Dismiss ${title}`
                      : typeof message === "string" && message
                      ? `Dismiss ${message}`
                      : "Dismiss notification"
                  }
                >
                  <X size={14} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                </button>
              )}
            </div>
          </div>

          {/* Title & Body Text */}
          <div className="space-y-1">
            {title && (
              <h4 className="text-lg md:text-xl font-serif italic font-medium text-white tracking-tight leading-snug">
                {title}
              </h4>
            )}
            {message && (
              <p id={messageId} className="text-xs md:text-sm font-mono font-medium text-gray-300 leading-relaxed tracking-tight max-w-xl">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Atmospheric Background Watermark Node */}
      <div
        aria-hidden="true"
        className="absolute bottom-2 right-4 pointer-events-none opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 font-mono text-[3rem] font-black leading-none select-none"
        style={{ transform: 'translateZ(10px)' }}
      >
        {type.charAt(0).toUpperCase()}
      </div>

      {/* Liquid Light Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-700" />
    </div>
  );
});

Alert.displayName = "Alert";

export default Alert;
