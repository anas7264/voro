import React, { memo, useRef, useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";

/**
 * ⚡ REFINEMENT: AchievementCard re-engineered as a "Luxury Neural Artifact".
 * Architected to the 'Forge' luxury standard with 3D spatial transforms,
 * magnetic mouse tracking, and industrial telemetry markers.
 *
 * DESIGN PHILOSOPHY:
 * 1. Aesthetic: High-fidelity charcoal architecture with rarity-based atmospheric glows.
 * 2. Typography: Playfair Display for artifact names; JetBrains Mono for telemetry.
 * 3. Motion: Volumetric 3D tilt and 'Luminous Aura' reactive lens.
 * 4. Precision: Surgical Reactivity via direct DOM manipulation for 60fps performance.
 */
export const AchievementCard = memo(({ achievement, unlocked }) => {
  const Icon = LucideIcons[achievement.icon] || LucideIcons.Trophy;
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !unlocked) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const nodeId = useMemo(() => `ACH_NODE_${Math.floor(Math.random() * 0x1000).toString(16).toUpperCase().padStart(3, '0')}`, []);

  const rarityStyles = {
    Common: {
      glow: "#3B82F6", // Blue
      text: "text-blue-400",
      border: "border-blue-500/20",
      accent: "bg-blue-500"
    },
    Uncommon: {
      glow: "#10B981", // Green
      text: "text-green-400",
      border: "border-green-500/20",
      accent: "bg-green-500"
    },
    Rare: {
      glow: "#8B5CF6", // Purple
      text: "text-purple-400",
      border: "border-purple-500/20",
      accent: "bg-purple-500"
    },
    Epic: {
      glow: "#F97316", // Orange
      text: "text-orange-400",
      border: "border-orange-500/20",
      accent: "bg-orange-500"
    },
    Legendary: {
      glow: "#EAB308", // Yellow
      text: "text-yellow-400",
      border: "border-yellow-500/20",
      accent: "bg-yellow-500"
    }
  };

  const style = rarityStyles[achievement.rarity] || rarityStyles.Common;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered && unlocked
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative p-10 rounded-[2.5rem] bg-[#0A0C14] border border-white/5
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/20 hover:shadow-[0_60px_120px_rgba(0,0,0,0.8)]
        group/ach flex flex-col items-center text-center
        ${!unlocked ? "opacity-30 grayscale cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/ach:opacity-100 transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens (Mouse Tracking) */}
        {unlocked && (
          <div
            className="absolute inset-0 opacity-0 group-hover/ach:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${style.glow}, transparent 90%), transparent 50%)`,
              transform: 'translateZ(20px)'
            }}
          />
        )}
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/ach:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Atmospheric Rarity Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover/ach:opacity-20 transition-opacity duration-1000 blur-3xl -z-10"
        style={{ backgroundColor: style.glow, transform: 'translateZ(-20px)' }}
      />

      <div className="relative flex flex-col items-center" style={{ transform: 'translateZ(40px)' }}>
        {/* Icon Specimen Holder */}
        <div className={`
          relative w-24 h-24 mb-10 rounded-[2rem] flex items-center justify-center
          bg-white/[0.02] border border-white/5 overflow-hidden
          group-hover/ach:border-white/20 group-hover/ach:scale-110 transition-all duration-700
          shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.4)]
        `}>
          <div className="absolute inset-0 opacity-[0.05] bg-scanline pointer-events-none" />
          <Icon
            size={36}
            className={`
              ${unlocked ? style.text : "text-gray-700"}
              transition-all duration-700
              ${unlocked ? "filter drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" : ""}
            `}
          />

          {/* Kinetic Corner Detail */}
          <div className={`absolute top-0 right-0 w-6 h-6 translate-x-3 -translate-y-3 rotate-45 ${style.accent} opacity-20`} />
        </div>

        {/* Narrative & Identification */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center justify-center gap-3">
             <div className="h-px w-4 bg-white/5" />
             <p className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em]">
               {achievement.category}
             </p>
             <div className="h-px w-4 bg-white/5" />
          </div>

          <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight group-hover/ach:text-white transition-colors duration-500">
            {achievement.name}
          </h3>

          <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto font-medium opacity-80">
            {achievement.description}
          </p>
        </div>

        {/* Artifact Metadata */}
        <div className="flex items-center gap-3" style={{ transform: 'translateZ(20px)' }}>
          <div className="px-5 py-2 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md transition-all group-hover/ach:bg-white/5 group-hover/ach:border-white/10">
            <span className="text-[0.6rem] font-mono font-bold text-voro-primary uppercase tracking-[0.2em]">
              +{achievement.xpReward} <span className="opacity-40">XP</span>
            </span>
          </div>
          <div className={`px-5 py-2 rounded-full bg-white/[0.02] border ${style.border} backdrop-blur-md transition-all group-hover/ach:bg-white/5`}>
            <span className={`text-[0.6rem] font-mono font-bold ${style.text} uppercase tracking-[0.2em]`}>
              {achievement.rarity}
            </span>
          </div>
        </div>
      </div>

      {/* Lock Overlay for Restricted Access */}
      {!unlocked && (
        <div className="absolute top-8 right-8 p-3 bg-[#0A0C14] border border-white/10 rounded-2xl text-gray-700 shadow-2xl">
          <LucideIcons.Lock size={14} />
        </div>
      )}

      {/* Boutique Bottom Edge Detail */}
      <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover/ach:via-voro-primary/40 transition-all duration-1000" />
    </div>
  );
});

AchievementCard.displayName = "AchievementCard";

export default AchievementCard;
