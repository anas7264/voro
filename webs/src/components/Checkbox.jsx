import React, { useId, memo, useMemo } from "react";
import { Check } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Neural Binary Node (Checkbox).
 * Re-engineered with the Forge design system: high-fidelity charcoal palette,
 * kinetic scale transitions, and a luminous 'Biological' pulse when active.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Box-model architecture suggests a secure logical toggle.
 * 2. Precision: JetBrains Mono for system markers and status text.
 * 3. Motion: Kinetic state transitions with a luminous focus aura.
 * 4. Atmosphere: Glassmorphic background with boutique grain texture.
 */
export const Checkbox = memo(({
  checked = false,
  onChange,
  label,
  error = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const generatedId = useId();
  const inputId = props.id || generatedId;
  const errorId = `${inputId}-error`;

  // Generate a stable system ID for the binary node
  const nodeId = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `BIN_${cleanId.slice(0, 3).toUpperCase()}`;
  }, [generatedId]);

  return (
    <div className={`group/checkbox-container w-full ${className}`}>
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center transition-all active:scale-90">
          <input
            type="checkbox"
            id={inputId}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="peer absolute opacity-0 w-8 h-8 cursor-pointer z-10 disabled:cursor-not-allowed"
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />

          {/* Architectural Box: High-end charcoal node */}
          <div
            className={`
              w-8 h-8 rounded-xl border transition-all duration-500 flex items-center justify-center relative overflow-hidden
              peer-focus-visible:ring-2 peer-focus-visible:ring-voro-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#080B14]
              ${checked
                ? "bg-voro-primary border-voro-primary shadow-[0_0_20px_rgba(124,58,237,0.4)] rotate-[360deg]"
                : "border-white/5 bg-white/[0.02] peer-hover:border-white/10"
              }
              ${error ? "border-red-500/40 bg-red-500/[0.02]" : ""}
              ${disabled ? "opacity-30" : ""}
            `}
            aria-hidden="true"
          >
            {/* Boutique Grain Texture */}
            <div className="absolute inset-0 bg-boutique-grain opacity-[0.05] pointer-events-none" />

            {/* Kinetic Signal */}
            {checked && (
              <Check
                size={16}
                strokeWidth={4}
                className="text-white animate-fade-in relative z-10"
              />
            )}

            {/* Internal Shimmer Pulse (Active state) */}
            {checked && (
              <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-20" />
            )}
          </div>

          {/* Liquid Light Indicator: Subtle focus glow */}
          <div className={`
            absolute -inset-2 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none
            bg-voro-primary/5 blur-xl peer-focus:opacity-100 peer-hover:opacity-60
            ${error ? "bg-red-500/10" : ""}
          `} />
        </div>

        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              htmlFor={inputId}
              className={`
                text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] select-none transition-colors duration-500 cursor-pointer
                ${checked ? "text-white" : "text-gray-500 group-hover/checkbox-container:text-gray-300"}
                ${disabled ? "opacity-30 cursor-not-allowed" : ""}
              `}
            >
              {label}
            </label>
          )}
          <span className="text-[0.45rem] font-mono font-bold text-gray-700 uppercase tracking-widest opacity-0 group-focus-within/checkbox-container:opacity-100 transition-opacity duration-500">
             {nodeId} // {checked ? 'TRUE' : 'FALSE'}
          </span>
        </div>
      </div>

      {/* Error Manifestation */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${error ? "max-h-10 opacity-100 mt-3 ml-12" : "max-h-0 opacity-0"}
      `}>
        <span id={errorId} className="flex items-center gap-2 text-[0.6rem] font-mono font-black text-red-500 uppercase tracking-widest">
          <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
          {error}
        </span>
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
