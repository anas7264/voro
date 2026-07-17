import React, { memo, useRef, useState, useId, useMemo } from "react";
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
 * Architected to the 'Forge' luxury standard with 3D spatial transforms,
 * magnetic mouse tracking, and industrial telemetry markers.
 *
 * DESIGN PHILOSOPHY:
 * 1. Aesthetic: High-fidelity charcoal architecture with difficulty-based atmospheric glows.
 * 2. Typography: Playfair Display for objective names; JetBrains Mono for telemetry.
 * 3. Motion: Volumetric 3D tilt and 'Luminous Aura' reactive lens.
 * 4. Precision: Surgical Reactivity via direct DOM manipulation for 60fps performance.
 */
export const ChallengeCard = memo(({ challenge, progress = 0, completed, onClaim }) => {
  const Icon = IconMap[challenge.icon] || Target;
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const reactId = useId();

  // Generate a stable system ID for the node using useId for SSR safety
  const nodeId = useMemo(() => `OBJ_NODE_${reactId.replace(/:/g, '').slice(0, 4)}`, [reactId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      // Provide a subtle static tilt for keyboard focus feedback
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const difficultyStyles = {
    Beginner: {
      glow: "#10B981", // Emerald
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      accent: "bg-emerald-500"
    },
    Intermediate: {
      glow: "#7C3AED", // Primary (Violet)
      text: "text-voro-primary-light",
      border: "border-voro-primary/20",
      accent: "bg-voro-primary"
    },
    Advanced: {
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

  const style = difficultyStyles[challenge.difficulty] || difficultyStyles.Beginner;
  const percentage = Math.min(progress, 100);
  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      role="article"
      aria-label={`Strategic Objective: ${challenge.name}. ${challenge.description}. Difficulty: ${challenge.difficulty}. Progress: ${Math.round(percentage)}%`}
      style={{
        transform: interactionActive
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative p-8 rounded-[2.5rem] bg-[#0A0C14] border border-white/5
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]
        focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#080B14] outline-none
        group/chal flex flex-col h-full
        ${completed ? "border-emerald-500/30" : ""}
      `}
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/chal:opacity-100 group-focus-visible/chal:opacity-100 transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens (Mouse Tracking or Focus) */}
        <div
          className="absolute inset-0 opacity-0 group-hover/chal:opacity-100 group-focus-visible/chal:opacity-100 transition-opacity duration-700"
          style={{
            background: isHovered
              ? `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${style.glow}, transparent 90%), transparent 50%)`
              : `radial-gradient(400px circle at 50% 50%, color-mix(in srgb, ${style.glow}, transparent 90%), transparent 50%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Atmospheric Difficulty Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover/chal:opacity-20 group-focus-visible/chal:opacity-20 transition-opacity duration-1000 blur-3xl -z-10"
        style={{ backgroundColor: style.glow, transform: 'translateZ(-20px)' }}
      />

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/chal:opacity-100 group-focus-visible/chal:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}></span>°</span>
          <span>TY_<span ref={tiltYRef}></span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Liquid Light Laser: Active edge indicator */}
      <div className={`
        absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-voro-primary rounded-r-full
        transition-all duration-700 origin-center
        shadow-[0_0_15px_rgba(124,58,237,0.8)]
        scale-y-0 group-hover/chal:scale-y-100 group-focus-visible/chal:scale-y-100
        ${completed ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" : ""}
      `} />

      <div className="relative flex flex-col h-full z-10" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-5">
            {/* Specimen Icon Holder */}
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center
              bg-white/[0.03] border border-white/5 shadow-inner
              group-hover/chal:border-white/20 group-hover/chal:scale-110 transition-all duration-700
            `}>
              <div className="absolute inset-0 opacity-[0.05] bg-scanline pointer-events-none" />
              <Icon size={24} className={`${completed ? "text-emerald-400" : "text-gray-400"} group-hover/chal:text-white transition-colors duration-500`} />
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
              <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight group-hover/chal:text-voro-primary transition-colors duration-500">
                {challenge.name}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1" style={{ transform: 'translateZ(30px)' }}>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-md transition-all group-hover/chal:bg-white/5">
              <Zap size={12} className="text-voro-accent" />
              <span className="text-[0.65rem] font-mono font-black text-white uppercase tracking-widest">
                +{challenge.xpReward} <span className="text-gray-600">XP</span>
              </span>
            </div>
            {completed && (
              <span className="text-[0.5rem] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1 mr-2 animate-pulse">
                Manifested
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-10 font-medium max-w-md opacity-80">
          {challenge.description}
        </p>

        <div className="mt-auto space-y-8" style={{ transform: 'translateZ(20px)' }}>
          {/* Performance Matrix: Neural Progress Conduit */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] group-hover/chal:text-voro-primary transition-colors">Objective Completion</span>
              <span className="text-[0.7rem] font-mono font-bold text-white tracking-widest">
                {Math.round(percentage)}<span className="opacity-40 ml-0.5">%</span>
              </span>
            </div>
            <div className="relative h-2 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden p-0.5 backdrop-blur-sm shadow-inner">
              {/* Fill Layer: Kinetic Conduit */}
              <div
                className={`
                  h-full rounded-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left
                  ${completed ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : `${style.accent} shadow-[0_0_15px_rgba(124,58,237,0.4)]`}
                `}
                style={{ transform: `scaleX(${percentage / 100})` }}
              >
                {/* Internal Shimmer Pulse */}
                <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-20" />

                {/* Luminous Lead Edge */}
                <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent blur-sm" />
              </div>
              {/* Tactical Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-grid-white" />
            </div>
          </div>

          <div className="flex gap-4">
            {!completed ? (
              <button
                onClick={onClaim}
                className="flex-1 py-4 bg-white text-black rounded-2xl text-[0.6rem] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-[0.98] shadow-xl shadow-white/5 group/claim relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-voro-primary/20 via-transparent to-transparent opacity-0 group-hover/claim:opacity-100 transition-opacity" />
                <span className="relative z-10">{percentage >= 100 ? 'Claim Rewards' : 'Claim Achievement'}</span>
              </button>
            ) : (
              <div className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[0.6rem] font-black uppercase tracking-[0.3em] text-emerald-500 text-center backdrop-blur-md">
                Protocol Success
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boutique Bottom Edge Detail */}
      <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover/chal:via-voro-primary/40 transition-all duration-1000" />
    </div>
  );
});

ChallengeCard.displayName = "ChallengeCard";

export default ChallengeCard;
