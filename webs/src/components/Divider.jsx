import React, { memo } from "react";

/**
 * ⚡ REFINEMENT: Luxury Neural Stratum Divider.
 * Re-engineered with the Forge design system: industrial telemetry markers,
 * kinetic signal nodes, and high-fidelity charcoal gradients.
 *
 * DESIGN PHILOSOPHY:
 * 1. Precision: JetBrains Mono for system labels and technical markers.
 * 2. Motion: Kinetic status indicator pulses suggesting active system monitoring.
 * 3. Atmosphere: Subtle grain texture and 'liquid light' gradient transitions.
 * 4. Spatial: Mathematical alignment of technical metadata nodes.
 */
export const Divider = memo(({ label, className = "" }) => {
  return (
    <div
      className={`relative flex items-center gap-8 my-12 group/divider ${className}`}
      role="separator"
    >
      {/* Lead Conduit: High-fidelity charcoal gradient */}
      <div className="relative flex-1 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-voro-primary/40" />
        <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-10 group-hover/divider:opacity-30 transition-opacity duration-1000" />
      </div>

      {label ? (
        <div className="flex items-center gap-5">
          {/* Kinetic Signal Node (Left) */}
          <div className="relative flex h-1.5 w-1.5">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></div>
            <div className="relative inline-flex rounded-full h-1.5 w-1.5 bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.6)]"></div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-white/90 group-hover/divider:text-voro-primary transition-colors duration-500">
              {label}
            </span>
          </div>

          {/* Kinetic Signal Node (Right) */}
          <div className="relative flex h-1.5 w-1.5">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-20"></div>
            <div className="relative inline-flex rounded-full h-1.5 w-1.5 bg-voro-primary/40 shadow-[0_0_8px_rgba(124,58,237,0.3)]"></div>
          </div>
        </div>
      ) : (
        <div className="relative flex items-center justify-center w-12">
            <div className="w-1.5 h-1.5 rounded-full bg-voro-primary/20 group-hover/divider:bg-voro-primary/60 transition-colors duration-700" />
            <div className="absolute inset-0 bg-voro-primary/5 blur-md opacity-0 group-hover/divider:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Trailing Conduit: High-fidelity charcoal gradient */}
      <div className="relative flex-1 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-voro-primary/40 via-white/[0.05] to-transparent" />
        <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-10 group-hover/divider:opacity-30 transition-opacity duration-1000" />
      </div>

      {/* Boutique Metadata Markers (Industrial Detail) - Minimalist approach */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2 opacity-[0.03] group-hover/divider:opacity-10 transition-opacity duration-700 pointer-events-none">
        <span className="text-[0.4rem] font-mono font-black tracking-widest uppercase">Stratum_Node</span>
        <span className="text-[0.4rem] font-mono font-black tracking-widest uppercase">Verified</span>
      </div>
    </div>
  );
});

Divider.displayName = "Divider";

export default Divider;
