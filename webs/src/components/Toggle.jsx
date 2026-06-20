import React, { useId, memo } from "react";

/**
 * ⚡ REFINEMENT: Refined luxury Toggle component ('Neural Switch Node').
 * Architected with the Forge design system: high-contrast industrial aesthetic,
 * kinetic sliding physics, and a luminous status pulse.
 *
 * DESIGN PHILOSOPHY:
 * 1. Aesthetic: Deep charcoal (#0A0C14) with translucent borders.
 * 2. Motion: Fluid 'Kinetic Sliding' effect using spring-like transitions.
 * 3. Feedback: Luminous secondary glow when active, suggesting "powered" state.
 * 4. Hierarchy: Monospaced uppercase labels for technical precision.
 */
export const Toggle = memo(({ enabled = false, onChange, label, className = "", ...props }) => {
  const labelId = useId();

  return (
    <div className={`flex items-center justify-between gap-6 group/toggle ${className}`}>
      {label && (
        <span
          id={labelId}
          className="text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 group-hover/toggle:text-gray-300 transition-colors cursor-pointer"
          onClick={() => onChange(!enabled)}
        >
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-labelledby={label ? labelId : undefined}
        onClick={() => onChange(!enabled)}
        className={`
          relative w-14 h-8 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B14]
          active:scale-90 border border-white/5 overflow-hidden
          ${enabled ? "bg-voro-primary/20 border-voro-primary/30 shadow-[0_0_20px_rgba(124,58,237,0.2)]" : "bg-[#0A0C14] hover:border-white/10 shadow-inner"}
        `}
        {...props}
      >
        {/* Luminous Glow Layer (Enabled State) */}
        <div className={`
          absolute inset-0 transition-opacity duration-500
          bg-gradient-to-r from-voro-primary/20 to-voro-primary/10
          ${enabled ? "opacity-100" : "opacity-0"}
        `} />

        {/* Kinetic Handle */}
        <div
          className={`
            absolute top-1 w-6 h-6 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            flex items-center justify-center shadow-xl
            ${enabled
              ? "left-7 bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              : "left-1 bg-gray-700 group-hover/toggle:bg-gray-600"
            }
          `}
        >
          {/* Internal Detail: Center Dot */}
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${enabled ? "bg-voro-primary" : "bg-black/40"}`} />
        </div>
      </button>
    </div>
  );
});

Toggle.displayName = "Toggle";

export default Toggle;
