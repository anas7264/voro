import React, { memo } from "react";
import * as LucideIcons from "lucide-react";

/**
 * ⚡ REFINEMENT: AchievementCard transformed into a "Luxury Artifact".
 * Features multi-layered glassmorphism, dynamic rarity-based glows,
 * and high-end typographic hierarchy.
 */
export const AchievementCard = memo(({ achievement, unlocked }) => {
  const Icon = LucideIcons[achievement.icon] || LucideIcons.Trophy;

  const rarityStyles = {
    Common: {
      glow: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      accent: "bg-blue-500"
    },
    Uncommon: {
      glow: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/20",
      accent: "bg-green-500"
    },
    Rare: {
      glow: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
      accent: "bg-purple-500"
    },
    Epic: {
      glow: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/20",
      accent: "bg-orange-500"
    },
    Legendary: {
      glow: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/20",
      accent: "bg-yellow-500"
    }
  };

  const style = rarityStyles[achievement.rarity] || rarityStyles.Common;

  return (
    <div className={`
      group relative p-8 rounded-[2rem] bg-[#0A0C14] border border-white/5
      transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
      hover:border-white/10 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
      ${!unlocked ? "opacity-30 grayscale" : "opacity-100"}
    `}>
      {/* Dynamic Glow Layer */}
      <div className={`
        absolute inset-0 rounded-[2rem] ${unlocked ? "opacity-30" : "opacity-0"} group-hover:opacity-100
        transition-opacity duration-700 blur-3xl -z-10
        ${style.glow}
      `} />

      <div className="relative flex flex-col items-center text-center">
        {/* Icon Specimen Holder */}
        <div className={`
          relative w-20 h-20 mb-10 rounded-[1.5rem] flex items-center justify-center
          bg-white/[0.02] border border-white/5 overflow-hidden
          group-hover:border-white/20 transition-all duration-500
          shadow-inner
        `}>
          <div className={`absolute inset-0 opacity-5 blur-xl ${style.glow}`} />
          <Icon size={32} className={`${unlocked ? style.text : "text-gray-700"} transition-colors duration-500 ${unlocked ? "filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" : ""}`} />

          {/* Subtle Kinetic Corner */}
          <div className={`absolute top-0 right-0 w-4 h-4 translate-x-2 -translate-y-2 rotate-45 ${style.accent} opacity-20`} />
        </div>

        {/* Narrative & Identification */}
        <div className="space-y-3 mb-8">
          <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">
            {achievement.category}
          </p>
          <h3 className="text-xl font-serif italic font-medium text-white tracking-tight">
            {achievement.name}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[180px] mx-auto font-medium">
            {achievement.description}
          </p>
        </div>

        {/* Artifact Metadata */}
        <div className="flex items-center gap-2.5">
          <div className="px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <span className="text-[0.6rem] font-mono font-bold text-voro-primary uppercase tracking-[0.2em]">
              +{achievement.xpReward} <span className="opacity-50">XP</span>
            </span>
          </div>
          <div className={`px-4 py-1.5 rounded-full bg-white/[0.02] border ${style.border} backdrop-blur-sm`}>
            <span className={`text-[0.6rem] font-mono font-bold ${style.text} uppercase tracking-[0.2em]`}>
              {achievement.rarity}
            </span>
          </div>
        </div>

        {/* Lock Overlay for Restricted Access */}
        {!unlocked && (
          <div className="absolute -top-2 -right-2 p-2 bg-[#0A0C14] border border-white/5 rounded-full text-gray-700">
            <LucideIcons.Lock size={12} />
          </div>
        )}
      </div>
    </div>
  );
});

AchievementCard.displayName = "AchievementCard";

export default AchievementCard;
