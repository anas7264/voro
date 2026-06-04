import React, { memo } from "react";
import {
  Target,
  Zap,
  Sun,
  Droplets,
  Leaf,
  Flame,
  Moon,
  Heart,
  Coffee,
  Apple,
  Pill,
  Footprints,
  Activity,
  Calculator,
  Trophy,
  Gauge,
  Utensils,
  TrendingUp,
  Shield,
  Star,
  Camera,
  Lock
} from "lucide-react";

const IconMap = {
  Target, Zap, Sun, Droplets, Leaf, Flame, Moon, Heart, Coffee,
  Apple, Pill, Footprints, Activity, Calculator, Trophy, Gauge,
  Utensils, TrendingUp, Shield, Star, Camera, Lock
};

/**
 * ⚡ REFINEMENT: ChallengeCard transformed into a "Strategic Objective Artifact".
 * Features difficulty-based atmospheric glows, glassmorphic data nodes,
 * and high-end typographic contrast.
 */
export const ChallengeCard = memo(({ challenge, progress = 0, completed, onClaim }) => {
  const Icon = IconMap[challenge.icon] || Target;

  const difficultyStyles = {
    Beginner: {
      glow: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      accent: "bg-emerald-500"
    },
    Intermediate: {
      glow: "bg-voro-primary/10",
      text: "text-voro-primary-light",
      border: "border-voro-primary/20",
      accent: "bg-voro-primary"
    },
    Advanced: {
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

  const style = difficultyStyles[challenge.difficulty] || difficultyStyles.Beginner;
  const percentage = Math.min(progress, 100);

  return (
    <div className={`
      group relative p-8 rounded-[2.5rem] bg-[#0A0C14] border border-white/5
      transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
      hover:border-white/10 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)]
      ${completed ? "border-emerald-500/30 bg-emerald-500/[0.02]" : ""}
    `}>
      {/* Atmosphere Layer */}
      <div className={`
        absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100
        transition-opacity duration-1000 blur-3xl -z-10
        ${style.glow}
      `} />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-5">
            {/* Specimen Icon Holder */}
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center
              bg-white/[0.03] border border-white/5 shadow-inner
              group-hover:border-white/20 transition-all duration-500
            `}>
              <Icon size={24} className={`${completed ? "text-emerald-400" : "text-gray-400"} group-hover:text-white transition-colors duration-500`} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className={`text-[0.55rem] font-black uppercase tracking-[0.3em] ${style.text}`}>
                  {challenge.difficulty}
                </span>
                <div className="w-1 h-1 rounded-full bg-gray-800" />
                <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest">
                  {challenge.category}
                </span>
              </div>
              <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight">
                {challenge.name}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-md">
              <Zap size={12} className="text-voro-accent" />
              <span className="text-[0.65rem] font-mono font-black text-white uppercase tracking-widest">
                +{challenge.xpReward} <span className="text-gray-600">XP</span>
              </span>
            </div>
            {completed && (
              <span className="text-[0.5rem] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1 mr-2">
                Manifested
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-10 font-medium max-w-md">
          {challenge.description}
        </p>

        <div className="mt-auto space-y-8">
          {/* Performance Matrix (Progress) */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em]">Objective Completion</span>
              <span className="text-[0.7rem] font-mono font-bold text-white tracking-widest">{Math.round(percentage)}%</span>
            </div>
            <div className="relative h-2 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left ${completed ? 'bg-emerald-500' : style.accent}`}
                style={{ transform: `scaleX(${percentage / 100})` }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            {!completed ? (
              <button
                onClick={onClaim}
                className="flex-1 py-4 bg-white text-black rounded-2xl text-[0.6rem] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5"
              >
                {percentage >= 100 ? 'Claim Rewards' : 'Claim Achievement'}
              </button>
            ) : (
              <div className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[0.6rem] font-black uppercase tracking-[0.3em] text-emerald-500 text-center">
                Protocol Success
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ChallengeCard.displayName = "ChallengeCard";

export default ChallengeCard;
