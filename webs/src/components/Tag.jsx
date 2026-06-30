import React, { memo, useId, useMemo } from "react";
import { X } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Neural Metadata Fragment (Tag).
 * Re-engineered with the Forge design system: high-fidelity charcoal architecture,
 * kinetic status pulses, and industrial system telemetry.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Glassmorphic node suggests a protected data fragment.
 * 2. Precision: JetBrains Mono for system markers and content.
 * 3. Motion: Kinetic hover state with a luminous 'liquid light' pulse.
 * 4. Atmosphere: Ultra-low opacity backgrounds with deep backdrop blurs.
 */
export const Tag = memo(({
  children,
  variant = "voro-primary",
  className = "",
  onRemove,
  ...props
}) => {
  const generatedId = useId();

  // Generate a stable system ID for the metadata fragment
  const nodeId = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `T_0x${cleanId.slice(0, 3).toUpperCase()}`;
  }, [generatedId]);

  const variants = {
    'voro-primary': "text-voro-primary border-voro-primary/20 bg-voro-primary/[0.03]",
    'voro-secondary': "text-voro-secondary border-voro-secondary/20 bg-voro-secondary/[0.03]",
    'voro-accent': "text-voro-accent border-voro-accent/20 bg-voro-accent/[0.03]",
    'voro-danger': "text-voro-danger border-voro-danger/20 bg-voro-danger/[0.03]",
    'primary': "text-voro-primary border-voro-primary/20 bg-voro-primary/[0.03]",
    'secondary': "text-voro-secondary border-voro-secondary/20 bg-voro-secondary/[0.03]",
    'gray': "text-gray-400 border-white/10 bg-white/[0.02]"
  };

  const currentVariant = variants[variant] || variants['voro-primary'];

  return (
    <div
      className={`
        relative inline-flex items-center gap-3 px-4 py-1.5 rounded-full
        backdrop-blur-md border transition-all duration-500 group/tag
        ${currentVariant}
        ${className}
      `}
      {...props}
    >
      {/* Liquid Light Pulse: Active indicator */}
      <div className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-20"></div>
        <div className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current opacity-40 shadow-[0_0_8px_currentColor]"></div>
      </div>

      {/* Narrative Payload */}
      <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.25em] whitespace-nowrap">
        {children}
      </span>

      {/* System Telemetry Marker */}
      <span className="text-[0.4rem] font-mono font-bold text-gray-700 uppercase tracking-widest opacity-0 group-hover/tag:opacity-100 transition-opacity duration-500">
        [{nodeId}]
      </span>

      {onRemove && (
        <button
          onClick={onRemove}
          className={`
            ml-1 -mr-1 p-1 rounded-full transition-all duration-500
            hover:bg-white/10 active:scale-75 text-gray-600 hover:text-white
            focus:outline-none focus-visible:ring-1 focus-visible:ring-current
          `}
          aria-label={`Remove ${children}`}
        >
          <X size={10} strokeWidth={3} />
        </button>
      )}

      {/* Boutique Grain Texture Overlay */}
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none rounded-full" />
    </div>
  );
});

Tag.displayName = "Tag";

export default Tag;
