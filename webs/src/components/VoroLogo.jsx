import React, { memo } from 'react';

/**
 * ⚡ REFINEMENT: Luxury Neural Brand Signature (VoroLogo).
 * Re-engineered to the 'Forge' luxury standard: multi-layered kinetic rings,
 * asynchronous rotation speeds, glassmorphic center, and Playfair Display
 * editorial typography.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display serif for the brand mark suggests heritage and prestige.
 * 2. Motion: Asynchronous concentric rotations (spin-slow vs spin-reverse) suggest
 *    complex, live neural processing.
 * 3. Spatial: Unified branding option (withText) for cross-app consistency.
 * 4. Atmosphere: Luminous primary glow and sub-pixel architectural details.
 */
const VoroLogo = memo(({ size = 80, withText = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {/* Neural Synthesis Core */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {/* Outer Kinetic Ring: Slow Orbit with Signal Node */}
        <div className="absolute inset-0 rounded-full border border-voro-primary/10 animate-[spin-slow_12s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
        </div>

        {/* Middle Kinetic Ring: Reverse Orbit with Industrial Dash */}
        <div
          className="absolute inset-[12%] rounded-full border border-voro-primary/20 animate-[spin-reverse_8s_linear_infinite]"
          style={{ borderStyle: 'dashed', borderWidth: '1px', borderDasharray: '4 8' }}
        />

        {/* Inner Glassmorphic Core */}
        <div className="absolute inset-[25%] rounded-full bg-voro-primary/10 backdrop-blur-md border border-voro-primary/40 shadow-[0_0_30px_rgba(124,58,237,0.3)] flex items-center justify-center overflow-hidden">
          {/* Luminous Glow Node */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />

          {/* Editorial Brand Mark */}
          <span
            className="text-white font-serif italic font-bold relative z-10 leading-none select-none"
            style={{ fontSize: size * 0.35 }}
          >
            V
          </span>
        </div>

        {/* Ambient Pulsing Aura */}
        <div className="absolute -inset-1 bg-voro-primary/20 blur-xl rounded-full animate-pulse pointer-events-none" />
      </div>

      {/* Unified Brand Typography */}
      {withText && (
        <div className="flex flex-col animate-fade-in">
          <span className="text-white font-serif italic font-medium text-2xl md:text-3xl tracking-tighter leading-none">
            Voro
          </span>
          <span className="text-[0.55rem] font-mono text-voro-primary uppercase tracking-[0.4em] mt-1.5 opacity-80">
            Evolution OS
          </span>
        </div>
      )}
    </div>
  );
});

VoroLogo.displayName = 'VoroLogo';

export default VoroLogo;
