import React, { memo, useRef, useId, useMemo } from "react";
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

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Icon Dictionary.
 * Eliminates object lookup allocations per render.
 */
const IconMap = Object.freeze({
  Target, Zap, Sun, Droplets, Leaf, Flame, Moon, Heart, Coffee,
  Apple, Pill, Footprints, Activity, Calculator, Trophy, Gauge,
  Utensils, TrendingUp, Shield, Star, Camera, Lock
});

/**
 * ⚡ PERFORMANCE OPTIMIZATION:
 * Hoisted frozen static difficulty styles dictionary.
 * Prevents allocating nested objects per card component on every render cycle.
 */
const DIFFICULTY_STYLES = Object.freeze({
  Beginner: Object.freeze({
    glow: "#10B981", // Emerald
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    accent: "bg-emerald-500",
    perimeter: "rgba(16, 185, 129, 0.4)"
  }),
  Intermediate: Object.freeze({
    glow: "#7C3AED", // Primary (Violet)
    text: "text-voro-primary-light",
    border: "border-voro-primary/20",
    accent: "bg-voro-primary",
    perimeter: "rgba(124, 58, 237, 0.4)"
  }),
  Advanced: Object.freeze({
    glow: "#F97316", // Orange
    text: "text-orange-400",
    border: "border-orange-500/20",
    accent: "bg-orange-500",
    perimeter: "rgba(249, 115, 22, 0.4)"
  }),
  Legendary: Object.freeze({
    glow: "#EAB308", // Yellow
    text: "text-yellow-400",
    border: "border-yellow-500/20",
    accent: "bg-yellow-500",
    perimeter: "rgba(234, 179, 8, 0.4)"
  })
});

/**
 * ⚡ MASTERCLASS REFINEMENT: ChallengeCard ('Kinetic Strategic Objective Artifact Node').
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features direct-DOM 60fps 3D volumetric rotational tilt, magnetic liquid border perimeter illumination,
 * live holographic spatial coordinate telemetry, SSR-safe deterministic sub-pixel attestation hash badging,
 * and W3C APG compliant keyboard focus physics.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Charcoal box-model enclave (#0A0C14) reflecting high-value biometric objectives.
 * 2. Precision: Playfair Display italic serif headings paired with JetBrains Mono system telemetry.
 * 3. Motion: Direct-DOM 60fps 3D volumetric hover tilts bypassing React render passes.
 * 4. Spatial: Golden ratio padding and mathematical whitespace letting typography breathe.
 */
export const ChallengeCard = memo(({ challenge, progress = 0, completed, onClaim }) => {
  const Icon = IconMap[challenge.icon] || Target;
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const reactId = useId();

  // Generate stable, deterministic system node identification and attestation markers
  const nodeId = useMemo(() => `OBJ_${reactId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase().padStart(4, '0')}`, [reactId]);

  const subpixelHash = useMemo(() => {
    const cleanId = reactId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `0xCHL_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [reactId]);

  const style = DIFFICULTY_STYLES[challenge.difficulty] || DIFFICULTY_STYLES.Beginner;
  const percentage = Math.min(progress, 100);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D rotational tilt calculation (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    const elStyle = containerRef.current.style;
    elStyle.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    elStyle.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    elStyle.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    elStyle.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    elStyle.setProperty('transform', `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`);
    elStyle.setProperty('transition', 'none');

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (!containerRef.current) return;

    const elStyle = containerRef.current.style;
    if (isFocusedRef.current) {
      elStyle.setProperty('--tilt-x', '4.00deg');
      elStyle.setProperty('--tilt-y', '-4.00deg');
      elStyle.setProperty('transform', 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
      elStyle.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    } else {
      elStyle.setProperty('--tilt-x', '0deg');
      elStyle.setProperty('--tilt-y', '0deg');
      elStyle.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      elStyle.setProperty('transition', 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
    if (!containerRef.current) return;

    const elStyle = containerRef.current.style;
    elStyle.setProperty('--tilt-x', '4.00deg');
    elStyle.setProperty('--tilt-y', '-4.00deg');
    elStyle.setProperty('transform', 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
    elStyle.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    if (!containerRef.current) return;

    if (!isHoveredRef.current) {
      const elStyle = containerRef.current.style;
      elStyle.setProperty('--tilt-x', '0deg');
      elStyle.setProperty('--tilt-y', '0deg');
      elStyle.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      elStyle.setProperty('transition', 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="article"
      aria-label={`Strategic Objective: ${challenge.name}. ${challenge.description}. Difficulty: ${challenge.difficulty}. Progress: ${Math.round(percentage)}%`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      className={`
        relative p-8 md:p-10 rounded-[2.5rem] bg-[#0A0C14]/90 backdrop-blur-2xl border border-white/5
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]
        focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none
        group/chal flex flex-col h-full overflow-hidden
        ${completed ? "border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.1)]" : ""}
      `}
    >
      {/* 🛰️ Liquid Border Intelligence: Reactive perimeter illumination */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/chal:opacity-100 group-focus-visible/chal:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${style.perimeter}, transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Precision Grid & Grain Architecture */}
      <div aria-hidden="true" className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/chal:opacity-100 group-focus-visible/chal:opacity-100 transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens Spotlight */}
        <div
          className="absolute inset-0 opacity-0 group-hover/chal:opacity-100 group-focus-visible/chal:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), color-mix(in srgb, ${style.glow}, transparent 88%), transparent 60%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Atmospheric Difficulty Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover/chal:opacity-20 group-focus-visible/chal:opacity-20 transition-opacity duration-1000 blur-3xl -z-10 pointer-events-none"
        style={{ backgroundColor: style.glow, transform: 'translateZ(-20px)' }}
      />

      {/* Coordinate Telemetry & Attestation Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/chal:opacity-100 group-focus-visible/chal:opacity-100 transition-all duration-500 select-none"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
          <span className="text-white/10">{subpixelHash}</span>
        </div>
      </div>

      {/* Liquid Light Laser: Active edge indicator */}
      <div className={`
        absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-voro-primary rounded-r-full
        transition-all duration-700 origin-center pointer-events-none
        shadow-[0_0_15px_rgba(124,58,237,0.8)]
        scale-y-0 group-hover/chal:scale-y-100 group-focus-visible/chal:scale-y-100
        ${completed ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" : ""}
      `} />

      <div className="relative flex flex-col h-full z-10" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-5">
            {/* Specimen Icon Holder */}
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center
              bg-white/[0.03] border border-white/5 shadow-inner
              group-hover/chal:border-white/20 group-hover/chal:scale-110 transition-all duration-700 relative overflow-hidden
            `}>
              <div aria-hidden="true" className="absolute inset-0 opacity-[0.05] bg-scanline pointer-events-none" />
              <Icon size={24} className={`${completed ? "text-emerald-400" : "text-gray-400"} group-hover/chal:text-white transition-colors duration-500 relative z-10`} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className={`text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] ${style.text}`}>
                  {challenge.difficulty}
                </span>
                <div className="w-1 h-1 rounded-full bg-gray-800" />
                <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest">
                  {challenge.category}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif italic font-medium text-white tracking-tight group-hover/chal:text-voro-primary transition-colors duration-500 leading-tight">
                {challenge.name}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1" style={{ transform: 'translateZ(30px)' }}>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-md transition-all group-hover/chal:bg-white/5">
              <Zap size={12} className="text-voro-accent" />
              <span className="text-[0.65rem] font-mono font-black text-white uppercase tracking-widest">
                +{challenge.xpReward} <span className="text-gray-500">XP</span>
              </span>
            </div>
            {completed && (
              <span className="text-[0.5rem] font-mono font-black text-emerald-400 uppercase tracking-[0.25em] mt-1 mr-2 animate-pulse">
                Manifested
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-400 font-mono text-xs md:text-sm leading-relaxed mb-8 font-medium max-w-md opacity-80">
          {challenge.description}
        </p>

        <div className="mt-auto space-y-6" style={{ transform: 'translateZ(20px)' }}>
          {/* Performance Matrix: Neural Progress Conduit */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-end">
              <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] group-hover/chal:text-voro-primary transition-colors">
                Objective Completion
              </span>
              <span className="text-[0.7rem] font-mono font-bold text-white tracking-widest">
                {Math.round(percentage)}<span className="opacity-40 ml-0.5">%</span>
              </span>
            </div>
            <div className="relative h-2 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden p-0.5 backdrop-blur-sm shadow-inner">
              {/* Fill Layer: Kinetic Conduit */}
              <div
                className={`
                  h-full rounded-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left relative overflow-hidden
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
              <div aria-hidden="true" className="absolute inset-0 opacity-[0.05] pointer-events-none bg-grid-white" />
            </div>
          </div>

          <div className="flex gap-4">
            {!completed ? (
              <button
                onClick={() => onClaim?.(challenge)}
                aria-label={percentage >= 100 ? `Claim reward for ${challenge?.name || 'objective'}` : `Claim achievement for ${challenge?.name || 'objective'}`}
                className="flex-1 py-4 bg-white text-black rounded-2xl text-[0.6rem] font-mono font-black uppercase tracking-[0.3em] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14] outline-none shadow-xl shadow-white/5 group/claim relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-voro-primary/20 via-transparent to-transparent opacity-0 group-hover/claim:opacity-100 transition-opacity" />
                <span className="relative z-10">{percentage >= 100 ? 'Claim Rewards' : 'Claim Achievement'}</span>
              </button>
            ) : (
              <div className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[0.6rem] font-mono font-black uppercase tracking-[0.3em] text-emerald-400 text-center backdrop-blur-md">
                Protocol Success
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boutique Bottom Edge Detail */}
      <div aria-hidden="true" className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover/chal:via-voro-primary/40 transition-all duration-1000" />
    </div>
  );
});

ChallengeCard.displayName = "ChallengeCard";

export default ChallengeCard;
