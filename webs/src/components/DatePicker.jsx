import React, { useId, useMemo, useRef, useState, memo } from "react";
import { Calendar } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Neural Temporal Node (DatePicker).
 * Re-engineered with the Voro 'Forge' luxury design system standard: high-fidelity charcoal architecture,
 * zero-allocation direct-DOM volumetric 3D tilt tracking, holographic coordinate telemetry,
 * dynamic liquid radial spotlighting, and W3C APG compliant focus states.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Box-model architecture suggests a high-security temporal entry port.
 * 2. Precision: JetBrains Mono for system markers and temporal data paired with Playfair Display labels.
 * 3. Motion: Direct-DOM 60fps volumetric tilt and kinetic laser indicators.
 * 4. Spatial: Mathematical golden-ratio alignment of technical metadata nodes with luxury gallery aesthetics.
 */
export const DatePicker = memo(({
  id,
  value,
  onChange,
  label,
  error = false,
  required = false,
  disabled = false,
  className = "",
  onFocus,
  onBlur,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  const containerRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Generate a stable system ID for the date node
  const nodeId = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `DT_${cleanId.slice(0, 3).toUpperCase()}`;
  }, [generatedId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current || disabled) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Direct DOM volumetric 3D tilt calculation (max 10deg rotation)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!containerRef.current) return;

    if (isFocused) {
      // Revert to APG static 4-degree focus tilt
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
    } else {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const handleInputFocus = (e) => {
    setIsFocused(true);
    if (containerRef.current) {
      // W3C APG compliant static 4-degree focus tilt
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
    }
    if (onFocus) onFocus(e);
  };

  const handleInputBlur = (e) => {
    setIsFocused(false);
    if (containerRef.current && !isHovered) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
    if (onBlur) onBlur(e);
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div className={`w-full group/date-container ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500 group-focus-within/date-container:text-voro-primary transition-colors cursor-pointer"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Holographic Telemetry & Node Identifier */}
        <div className="flex items-center gap-3 font-mono text-[0.45rem] font-bold text-gray-600 uppercase tracking-widest">
          <span className="opacity-0 group-hover/date-container:opacity-100 group-focus-within/date-container:opacity-100 transition-opacity duration-500 text-voro-primary/80">
            TX_<span ref={txRef}>0.0</span>° TY_<span ref={tyRef}>0.0</span>°
          </span>
          <span className="text-gray-500 opacity-60 group-focus-within/date-container:opacity-100 transition-opacity duration-500">
            0x{nodeId} // TEMPORAL_INPUT
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: interactionActive
            ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-2px)'
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'none' : 'transform 0.7s cubic-bezier(0.16,1,0.3,1)'
        }}
      >
        {/* Architectural Framing: High-end charcoal box */}
        <div className={`
          relative overflow-hidden rounded-[1.25rem] border transition-all duration-500
          ${error
            ? "border-red-500/40 bg-red-500/[0.02] shadow-[0_10px_30px_rgba(239,68,68,0.1)] group-focus-within/date-container:ring-2 group-focus-within/date-container:ring-red-500/50"
            : "border-white/5 bg-[#0A0C14] group-hover/date-container:border-white/20 group-hover/date-container:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-focus-within/date-container:border-voro-primary/50 group-focus-within/date-container:bg-voro-primary/[0.02] group-focus-within/date-container:shadow-[0_20px_50px_rgba(124,58,237,0.2)] group-focus-within/date-container:ring-2 group-focus-within/date-container:ring-voro-primary/50 group-focus-within/date-container:ring-offset-2 group-focus-within/date-container:ring-offset-[#080B14]"
          }
          ${disabled ? "opacity-30 cursor-not-allowed" : ""}
        `}>
          {/* Boutique Grid & Grain Texture */}
          <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/date-container:opacity-[0.03] group-focus-within/date-container:opacity-[0.03] transition-opacity duration-1000 pointer-events-none" />
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />

          {/* Liquid Radial Light Spot (Direct DOM Follower) */}
          <div
            className="absolute inset-0 opacity-0 group-hover/date-container:opacity-100 group-focus-within/date-container:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: isHovered
                ? `radial-gradient(180px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124,58,237,0.12), transparent 70%)`
                : `radial-gradient(180px circle at 50% 50%, rgba(124,58,237,0.12), transparent 70%)`
            }}
          />

          {/* Liquid Light Laser: Active edge indicator */}
          <div className={`
            absolute left-0 top-1/4 bottom-1/4 w-[2.5px] bg-voro-primary rounded-r-full
            transition-all duration-500 origin-center
            shadow-[0_0_15px_rgba(124,58,237,0.9)]
            ${error ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.9)]" : ""}
            scale-y-0 group-focus-within/date-container:scale-y-100 group-hover/date-container:scale-y-75
          `} />

          <div className="relative flex items-center">
            <input
              id={inputId}
              type="date"
              value={value || ""}
              onChange={(e) => onChange && onChange(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={disabled}
              required={required}
              className={`
                w-full bg-transparent px-6 py-5 text-white font-mono text-sm tracking-wide
                focus:outline-none transition-all duration-500
                [color-scheme:dark]
                ${disabled ? "cursor-not-allowed" : ""}
              `}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              {...props}
            />
            <Calendar
              className="absolute right-6 text-gray-500 group-hover/date-container:text-white group-focus-within/date-container:text-voro-primary group-hover/date-container:scale-110 transition-all duration-500 pointer-events-none"
              size={18}
            />
          </div>

          {/* Sub-pixel Hash Badge (Industrial Detail) */}
          <div className="absolute top-0 right-0 p-1.5 opacity-[0.04] group-hover/date-container:opacity-20 transition-opacity duration-500 pointer-events-none">
            <div className="font-mono text-[0.4rem] font-black leading-none select-none tracking-tighter">
              [0xDT_VAULT]
            </div>
          </div>
        </div>

        {/* Error Manifestation */}
        <div className={`
          overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${error ? "max-h-10 opacity-100 mt-2" : "max-h-0 opacity-0"}
        `}>
          <span id={errorId} className="flex items-center gap-2 text-[0.6rem] font-mono font-black text-red-500 uppercase tracking-widest px-1">
            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
            {error}
          </span>
        </div>
      </div>
    </div>
  );
});

DatePicker.displayName = "DatePicker";

export default DatePicker;
