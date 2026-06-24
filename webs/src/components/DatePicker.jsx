import React, { useId, useMemo, memo } from "react";
import { Calendar } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Neural Date Picker Node.
 * Re-engineered with the Forge design system: high-fidelity charcoal architecture,
 * kinetic focus aura, and industrial system telemetry.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Box-model architecture suggests a secure data entry port.
 * 2. Precision: JetBrains Mono for system markers and temporal data.
 * 3. Motion: Kinetic focus state with a luminous 'liquid light' laser indicator.
 * 4. Atmosphere: Glassmorphic background with boutique grain texture.
 */
export const DatePicker = memo(({
  id,
  value,
  onChange,
  label,
  error = false,
  className = "",
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  // Generate a stable system ID for the date node
  const nodeId = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `DT_${cleanId.slice(0, 3).toUpperCase()}`;
  }, [generatedId]);

  return (
    <div className={`w-full group/date-container ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500 group-focus-within/date-container:text-voro-primary transition-colors cursor-pointer"
          >
            {label}
          </label>
        )}
        <span className="text-[0.45rem] font-mono font-bold text-gray-700 uppercase tracking-widest opacity-0 group-focus-within/date-container:opacity-100 transition-opacity duration-500">
          {nodeId} // TEMPORAL_INPUT
        </span>
      </div>

      <div className="relative">
        {/* Architectural Framing: High-end charcoal box */}
        <div className={`
          relative overflow-hidden rounded-[1.25rem] border transition-all duration-500
          ${error
            ? "border-red-500/40 bg-red-500/[0.02]"
            : "border-white/5 bg-white/[0.02] group-hover/date-container:border-white/10 group-focus-within/date-container:border-voro-primary/40 group-focus-within/date-container:bg-voro-primary/[0.01]"
          }
        `}>
          {/* Boutique Grain Texture */}
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />

          {/* Liquid Light Laser: Active edge indicator */}
          <div className={`
            absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-voro-primary rounded-r-full
            transition-all duration-500 origin-center
            shadow-[0_0_15px_rgba(124,58,237,0.8)]
            ${error ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : ""}
            scale-y-0 group-focus-within/date-container:scale-y-100
          `} />

          {/* Kinetic Focus Aura: Radial gradient follows focus state */}
          <div className={`
            absolute inset-0 pointer-events-none opacity-0 group-focus-within/date-container:opacity-100 transition-opacity duration-700
            bg-[radial-gradient(circle_at_2%_50%,rgba(124,58,237,0.08),transparent_40%)]
            ${error ? "bg-[radial-gradient(circle_at_2%_50%,rgba(239,68,68,0.08),transparent_40%)]" : ""}
          `} />

          <div className="relative flex items-center">
            <input
              id={inputId}
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`
                w-full bg-transparent px-6 py-5 text-white font-mono text-sm
                focus:outline-none transition-all duration-500
                [color-scheme:dark]
              `}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              {...props}
            />
            <Calendar
              className="absolute right-6 text-gray-500 group-focus-within/date-container:text-voro-primary transition-colors duration-500 pointer-events-none"
              size={18}
            />
          </div>

          {/* Corner System Marker (Industrial Detail) */}
          <div className="absolute top-0 right-0 p-1.5 opacity-[0.03] pointer-events-none">
            <div className="font-mono text-[0.4rem] font-black leading-none select-none">
              [T_STAMP]
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
