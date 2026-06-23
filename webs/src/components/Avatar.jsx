import React, { memo, useMemo, useId } from "react";

/**
 * ⚡ REFINEMENT: Luxury Neural Identity Node (Avatar).
 * Re-engineered as a high-fidelity biometric specimen featuring
 * multi-layered glassmorphism, kinetic pulse indicators, and system telemetry.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Architectural framing suggests a protected biological asset.
 * 2. Precision: JetBrains Mono metadata for technical system context.
 * 3. Motion: Kinetic status indicator pulses suggesting live bio-sync.
 * 4. Atmosphere: Ultra-low opacity backgrounds with deep backdrop blurs.
 */
export const Avatar = memo(({
  src,
  alt = "Subject Specimen",
  size = "md",
  status = "online",
  className = "",
  id,
  ...props
}) => {
  const generatedId = useId();
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-24 h-24",
    "specimen-xl": "w-48 h-48",
  };

  const statusColors = {
    online: "bg-voro-secondary shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    idle: "bg-voro-accent shadow-[0_0_10px_rgba(245,158,11,0.5)]",
    offline: "bg-gray-600",
    syncing: "bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]"
  };

  // Generate a stable system ID for the specimen using useId to be SSR safe
  const specimenId = useMemo(() => {
    if (id) return id;
    const cleanId = generatedId.replace(/:/g, '');
    return `ID_${cleanId.slice(0, 4).toUpperCase()}`;
  }, [id, generatedId]);

  const currentSize = sizes[size] || sizes.md;
  const currentStatusColor = statusColors[status] || statusColors.online;

  // Determine if we should show luxury framing based on size (opt-in via large sizes)
  const isLuxury = size.includes('specimen') || size === '2xl' || size === 'xl';

  if (!isLuxury) {
    return (
      <div className={`relative inline-block ${className}`} {...props}>
        <div className={`relative ${currentSize} rounded-full overflow-hidden border border-white/10 shadow-sm`}>
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center font-serif italic text-white/20">V</div>
          )}
        </div>
        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#080B14] ${currentStatusColor}`} />
      </div>
    );
  }

  return (
    <div className={`relative group inline-block ${className}`} {...props}>
      {/* Specimen Frame: High-End Architectural Border */}
      <div className={`
        relative ${currentSize} rounded-[2rem] overflow-hidden p-1.5
        bg-white/[0.03] border border-white/5 backdrop-blur-xl
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        group-hover:border-white/20 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]
        group-hover:-translate-y-2 group-hover:scale-[1.02]
      `}>
        {/* Kinetic Light Sweep */}
        <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-20 pointer-events-none" />

        {/* Biological Specimen Image */}
        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-700">
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out scale-110 group-hover:scale-100"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.01] flex items-center justify-center">
               <span className="font-serif italic text-4xl text-white/10 group-hover:text-voro-primary/40 transition-colors duration-700">V</span>
            </div>
          )}

          {/* Precision Scanline Effect */}
          <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none" />
        </div>

        {/* Internal Luminous Lens */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1),transparent)]" />
      </div>

      {/* Kinetic Status Node */}
      <div className="absolute -bottom-2 -right-2 p-2 bg-[#0A0C14] rounded-full border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-110">
        <div className="relative flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${currentStatusColor}`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${currentStatusColor}`}></span>
        </div>
      </div>

      {/* System Telemetry Overlay: Node Identification */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
        <span className="text-[0.45rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
          {specimenId}_SPECIMEN
        </span>
      </div>

      {/* Boutique Shadow Depth */}
      <div className={`absolute inset-4 rounded-[2rem] bg-voro-primary/5 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;
