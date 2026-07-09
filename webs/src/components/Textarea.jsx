import React, { useId, memo, useMemo } from "react";

/**
 * ⚡ REFINEMENT: Luxury Neural Textstream Node (Textarea).
 * Re-engineered with the Forge design system: high-fidelity charcoal architecture,
 * kinetic focus aura, and industrial system telemetry.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Box-model architecture suggests a high-capacity data stream.
 * 2. Precision: JetBrains Mono for system markers and user input.
 * 3. Motion: Kinetic focus state with a luminous 'liquid light' laser indicator.
 * 4. Atmosphere: Glassmorphic background with boutique grain texture.
 */
export const Textarea = memo(({
  id,
  placeholder = "",
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  label,
  maxLength,
  rows = 4,
  className = "",
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;

  // Generate a stable system ID for the textstream node
  const nodeId = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `TXT_${cleanId.slice(0, 3).toUpperCase()}`;
  }, [generatedId]);

  const currentLength = (value || "").toString().length;
  const isAtLimit = maxLength && currentLength >= maxLength;

  return (
    <div className={`w-full group/textarea-container ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500 group-focus-within/textarea-container:text-voro-primary transition-colors cursor-pointer"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <span
          aria-live="polite"
          aria-atomic="true"
          className="text-[0.45rem] font-mono font-bold text-gray-700 uppercase tracking-widest opacity-0 group-focus-within/textarea-container:opacity-100 transition-opacity duration-500"
        >
          {nodeId} // STREAM_ACTIVE
          {maxLength && (
            <span className={isAtLimit ? "text-red-500" : ""}>
              {" "}// {currentLength}/{maxLength}
            </span>
          )}
        </span>
      </div>

      <div className="relative">
        {/* Architectural Framing: High-end charcoal box */}
        <div className={`
          relative overflow-hidden rounded-[1.25rem] border transition-all duration-500
          ${error
            ? "border-red-500/40 bg-red-500/[0.02]"
            : "border-white/5 bg-white/[0.02] group-hover/textarea-container:border-white/10 group-focus-within/textarea-container:border-voro-primary/40 group-focus-within/textarea-container:bg-voro-primary/[0.01]"
          }
          ${disabled ? "opacity-30 cursor-not-allowed" : ""}
        `}>
          {/* Boutique Grain Texture */}
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />

          {/* Liquid Light Laser: Active edge indicator */}
          <div className={`
            absolute left-0 top-8 bottom-8 w-[2px] bg-voro-primary rounded-r-full
            transition-all duration-500 origin-center
            shadow-[0_0_15px_rgba(124,58,237,0.8)]
            ${error ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : ""}
            scale-y-0 group-focus-within/textarea-container:scale-y-100
          `} />

          {/* Kinetic Focus Aura: Radial gradient follows focus state */}
          <div className={`
            absolute inset-0 pointer-events-none opacity-0 group-focus-within/textarea-container:opacity-100 transition-opacity duration-700
            bg-[radial-gradient(circle_at_2%_20%,rgba(124,58,237,0.08),transparent_40%)]
            ${error ? "bg-[radial-gradient(circle_at_2%_20%,rgba(239,68,68,0.08),transparent_40%)]" : ""}
          `} />

          <textarea
            id={textareaId}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            rows={rows}
            className={`
              w-full bg-transparent px-6 py-5 text-white font-mono text-sm
              placeholder:font-serif placeholder:italic placeholder:text-gray-700
              focus:outline-none transition-all duration-500 resize-vertical
              ${disabled ? "cursor-not-allowed" : ""}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />

          {/* Corner System Marker (Industrial Detail) */}
          <div className="absolute top-0 right-0 p-1.5 opacity-[0.03] pointer-events-none">
            <div className="font-mono text-[0.4rem] font-black leading-none select-none">
              [T_STREAM]
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

Textarea.displayName = "Textarea";

export default Textarea;
