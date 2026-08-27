import React, { useId, memo, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Neural Selection Matrix (Select).
 * Re-engineered with the Voro 'Forge' design system: high-fidelity charcoal architecture,
 * zero-allocation direct-DOM volumetric 3D tilt tracking, holographic coordinate telemetry,
 * dynamic liquid border lighting, and W3C APG compliant focus states.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Box-model architecture suggests a secure logical decision port.
 * 2. Precision: JetBrains Mono for system markers and technical telemetry.
 * 3. Motion: Direct-DOM 60fps volumetric tilt and kinetic laser indicators.
 * 4. Spatial: Mathematical alignment of technical metadata nodes with luxury gallery aesthetics.
 */
export const Select = memo(({
  id,
  options = [],
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  label,
  className = "",
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;

  const containerRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Generate a stable system ID for the selection node
  const nodeId = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `SEL_${cleanId.slice(0, 3).toUpperCase()}`;
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

  const handleFocus = () => {
    setIsFocused(true);
    if (!containerRef.current) return;

    // W3C APG compliant static 4-degree focus tilt
    containerRef.current.style.setProperty('--tilt-x', '4deg');
    containerRef.current.style.setProperty('--tilt-y', '-4deg');
    if (txRef.current) txRef.current.innerText = "4.0";
    if (tyRef.current) tyRef.current.innerText = "-4.0";
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!containerRef.current) return;

    if (!isHovered) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div className={`w-full group/select-container ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500 group-focus-within/select-container:text-voro-primary transition-colors cursor-pointer"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Holographic Telemetry & System Node ID */}
        <div className="flex items-center gap-3 font-mono text-[0.45rem] font-bold text-gray-600 uppercase tracking-widest">
          <span className="opacity-0 group-hover/select-container:opacity-100 group-focus-within/select-container:opacity-100 transition-opacity duration-500 text-voro-primary/80">
            TX_<span ref={txRef}>0.0</span>° TY_<span ref={tyRef}>0.0</span>°
          </span>
          <span className="text-gray-500 opacity-60 group-focus-within/select-container:opacity-100 transition-opacity duration-500">
            0x{nodeId}
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
            ? "border-red-500/40 bg-red-500/[0.02] shadow-[0_10px_30px_rgba(239,68,68,0.1)]"
            : "border-white/5 bg-[#0A0C14] group-hover/select-container:border-white/20 group-hover/select-container:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-focus-within/select-container:border-voro-primary/50 group-focus-within/select-container:bg-voro-primary/[0.02] group-focus-within/select-container:shadow-[0_20px_50px_rgba(124,58,237,0.2)]"
          }
          ${disabled ? "opacity-30 cursor-not-allowed" : "active:scale-[0.99]"}
        `}>
          {/* Boutique Grid & Grain Texture */}
          <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/select-container:opacity-[0.03] group-focus-within/select-container:opacity-[0.03] transition-opacity duration-1000 pointer-events-none" />
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />

          {/* Liquid Radial Light Spot (Direct DOM Follower) */}
          <div
            className="absolute inset-0 opacity-0 group-hover/select-container:opacity-100 group-focus-within/select-container:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: isHovered
                ? `radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124,58,237,0.12), transparent 70%)`
                : `radial-gradient(150px circle at 50% 50%, rgba(124,58,237,0.12), transparent 70%)`
            }}
          />

          {/* Liquid Light Laser: Active edge indicator */}
          <div className={`
            absolute left-0 top-1/4 bottom-1/4 w-[2.5px] bg-voro-primary rounded-r-full
            transition-all duration-500 origin-center
            shadow-[0_0_15px_rgba(124,58,237,0.9)]
            ${error ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.9)]" : ""}
            scale-y-0 group-focus-within/select-container:scale-y-100 group-hover/select-container:scale-y-75
          `} />

          <select
            id={selectId}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            className={`
              w-full bg-transparent px-6 py-5 text-white font-mono text-sm tracking-widest
              focus:outline-none transition-all duration-500 appearance-none cursor-pointer
              ${disabled ? "cursor-not-allowed" : ""}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[#0A0C14] text-white">
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Chevron Indicator with Kinetic Hover Animation */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover/select-container:text-white group-focus-within/select-container:text-voro-primary group-hover/select-container:translate-y-[-40%] transition-all duration-500">
            <ChevronDown size={18} />
          </div>

          {/* Sub-pixel Hash Badge (Industrial Detail) */}
          <div className="absolute top-0 right-0 p-1.5 opacity-[0.04] group-hover/select-container:opacity-20 transition-opacity duration-500 pointer-events-none">
            <div className="font-mono text-[0.4rem] font-black leading-none select-none tracking-tighter">
              [0xSEL_VAULT]
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

Select.displayName = "Select";

export default Select;
