import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Trophy } from 'lucide-react';
import { AchievementCard } from '@/components/AchievementCard';
import { achievements } from '@/data/achievements';
import { useStorageKeySelector } from '@/hooks/useStorage';

const EMPTY_ARRAY = Object.freeze([]);

const selectEarnedAchievements = (data) => (Array.isArray(data?.achievements) ? data.achievements : EMPTY_ARRAY);
const selectLevel = (data) => (typeof data?.level === 'number' ? data.level : 1);
const selectTotalXP = (data) => (typeof data?.totalXP === 'number' ? data.totalXP : 0);

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted categories set.
 * Prevents calling map, instantiating a Set, and reconstructing the array on mount or re-render.
 */
const CATEGORIES = [...new Set(achievements.map(a => a.category))];

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted Achievement Grouping Map.
 * Groups static achievements by category at module load time to completely
 * avoid O(C * N) array filtrations on every render.
 */
const ACHIEVEMENTS_BY_CATEGORY = achievements.reduce((acc, achievement) => {
  if (!acc[achievement.category]) acc[achievement.category] = [];
  acc[achievement.category].push(achievement);
  return acc;
}, {});

const Achievements = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Granular Reactivity via useStorageKeySelector.
   * Subscribes independently to earned achievements, level, and XP slices
   * to eliminate re-renders when other fields in 'gamification' update.
   */
  const earned = useStorageKeySelector('gamification', selectEarnedAchievements);
  const level = useStorageKeySelector('gamification', selectLevel);
  const xp = useStorageKeySelector('gamification', selectTotalXP);

  const heroRef = useRef(null);
  const heroTiltXRef = useRef(null);
  const heroTiltYRef = useRef(null);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isHeroFocused, setIsHeroFocused] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Achievement Matrix';
  }, []);

  const earnedIds = useMemo(() => new Set(earned), [earned]);

  const xpToNextLevel = useMemo(() => {
    const currentLevelXP = level * 1000; // Simplified logic for UI
    return currentLevelXP - (xp % currentLevelXP);
  }, [level, xp]);

  const progressPercentage = useMemo(() => {
    const currentLevelXP = level * 1000;
    return ((xp % currentLevelXP) / currentLevelXP) * 100;
  }, [level, xp]);

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Max 8 degrees tilt for a premium, heavy kinetic feel
    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    heroRef.current.style.setProperty('--mouse-x', `${x}px`);
    heroRef.current.style.setProperty('--mouse-y', `${y}px`);
    heroRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    heroRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (heroTiltXRef.current) heroTiltXRef.current.innerText = tiltX.toFixed(1);
    if (heroTiltYRef.current) heroTiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleHeroMouseLeave = () => {
    setIsHeroHovered(false);
    if (!heroRef.current) return;
    heroRef.current.style.setProperty('--tilt-x', '0deg');
    heroRef.current.style.setProperty('--tilt-y', '0deg');
    if (heroTiltXRef.current) heroTiltXRef.current.innerText = "0.0";
    if (heroTiltYRef.current) heroTiltYRef.current.innerText = "0.0";
  };

  const handleHeroFocus = () => {
    setIsHeroFocused(true);
    if (heroRef.current) {
      heroRef.current.style.setProperty('--tilt-x', '4deg');
      heroRef.current.style.setProperty('--tilt-y', '-4deg');
      if (heroTiltXRef.current) heroTiltXRef.current.innerText = "4.0";
      if (heroTiltYRef.current) heroTiltYRef.current.innerText = "-4.0";
    }
  };

  const handleHeroBlur = () => {
    setIsHeroFocused(false);
    handleHeroMouseLeave();
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Ambient Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Trophy size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Evolution Milestones</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Artifact <span className="text-voro-primary not-italic font-bold">Matrix</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-60">
              Documenting the kinetics of your biological ascension
            </p>
          </div>

          <div className="flex gap-4">
             <div className="px-8 py-4 bg-[#0A0C14] border border-white/5 rounded-2xl shadow-xl flex items-center gap-6">
                <div className="text-right border-r border-white/5 pr-6">
                  <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Completion</p>
                  <p className="text-xl font-mono font-bold text-white">{Math.round((earned.length / achievements.length) * 100)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Unlocked</p>
                  <p className="text-xl font-mono font-bold text-voro-primary">{earned.length}<span className="text-gray-700 mx-1">/</span>{achievements.length}</p>
                </div>
             </div>
          </div>
        </header>

        {/* Ascension Biometric Core & Chrono-Spectral Progression Conduit */}
        <section
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseEnter={() => setIsHeroHovered(true)}
          onMouseLeave={handleHeroMouseLeave}
          onFocus={handleHeroFocus}
          onBlur={handleHeroBlur}
          tabIndex={0}
          role="region"
          aria-label="Ascension Biometric Core and Chrono-Spectral Progression Conduit"
          style={{
            transform: (isHeroHovered || isHeroFocused)
              ? 'perspective(2000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
              : 'perspective(2000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
            transition: isHeroHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            transformStyle: 'preserve-3d'
          }}
          className="relative overflow-hidden rounded-[3rem] bg-[#0A0C14] border border-white/5 p-12 md:p-16 mb-20 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)] hover:border-white/10 group/hero bg-boutique-grain cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#080B14]"
        >
          {/* Luminous dynamic background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-voro-primary/5 rounded-full blur-[130px] -mr-48 -mt-48 group-hover/hero:bg-voro-primary/10 transition-colors duration-1000 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-voro-secondary/5 rounded-full blur-[110px] -ml-36 -mb-36 pointer-events-none" />

          {/* Dynamic light lens */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(1000px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.06), transparent 45%)`,
            }}
          />

          <div className="kinetic-sweep opacity-20 group-hover/hero:opacity-40 transition-opacity duration-1000" />

          {/* Coordinate Telemetry Overlay */}
          <div className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/hero:opacity-100 group-focus-visible/hero:opacity-100 transition-all duration-500 z-20">
            <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
              <span>TX_<span ref={heroTiltXRef}>0.0</span>°</span>
              <span>TY_<span ref={heroTiltYRef}>0.0</span>°</span>
              <span className="text-white/10">[BIOMETRIC_CORE_V3]</span>
            </div>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-center" style={{ transformStyle: 'preserve-3d' }}>
            {/* Level Orb Section */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-10 lg:pb-0 lg:pr-16" style={{ transform: 'translateZ(100px)' }}>
              <div className="relative">
                <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center bg-black/45 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05)] relative z-10">
                  <div className="absolute inset-0 opacity-[0.03] bg-scanline pointer-events-none rounded-full" />
                  <div className="text-center relative z-10">
                    <p className="text-[0.55rem] font-black text-gray-500 uppercase tracking-[0.4em] mb-1.5">Ascension Level</p>
                    <p className="text-8xl font-serif italic font-black text-white leading-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{level}</p>
                  </div>
                </div>

                {/* Double Concentric Counter-Rotating Telemetry Orbits */}
                {/* Clockwise Orbit */}
                <div className="absolute inset-[-12px] rounded-full border border-dashed border-voro-primary/35 animate-orbit-clockwise pointer-events-none" />
                <div className="absolute inset-[-12px] rounded-full border border-white/5 pointer-events-none" />
                {/* Counter-Clockwise Orbit */}
                <div className="absolute inset-[-24px] rounded-full border border-dotted border-voro-secondary/30 animate-orbit-counter pointer-events-none" />
                {/* Static Outer Lens Ring */}
                <div className="absolute inset-[-36px] rounded-full border border-white/[0.02] pointer-events-none" />
              </div>
            </div>

            {/* XP and Timeline Progress Conduit Section */}
            <div className="lg:col-span-8 space-y-12" style={{ transform: 'translateZ(60px)' }}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-6 bg-voro-primary" />
                    <h3 className="text-[0.65rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em]">Ascension progress timeline</h3>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-7xl font-serif italic font-medium tracking-tight text-white">
                      {xp.toLocaleString()}
                    </span>
                    <span className="text-lg font-mono font-bold text-gray-500 tracking-tight">/ {(level * 1000).toLocaleString()} <span className="text-[0.6rem] font-sans font-black text-gray-600 uppercase tracking-widest ml-1">XP</span></span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-[0.6rem] font-mono font-black text-voro-secondary uppercase tracking-[0.2em]">Synthesis Required</p>
                  <p className="text-2xl font-serif italic font-bold text-white">
                    {xpToNextLevel.toLocaleString()}{' '}
                    <span className="text-[0.65rem] not-italic font-sans font-black text-gray-500 uppercase ml-1.5 tracking-widest">
                      XP
                    </span>
                  </p>
                </div>
              </div>

              {/* Chrono-Spectral Progression Conduit */}
              <div className="space-y-3">
                <div className="relative h-5 w-full bg-white/[0.02] rounded-full overflow-hidden p-1 border border-white/5 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                  {/* Progress fill using composite-layer scaleX transform */}
                  <div
                    className="absolute inset-y-1 left-1 rounded-full bg-gradient-to-r from-voro-primary to-voro-accent shadow-[0_0_20px_rgba(124,58,237,0.5)] origin-left transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      width: 'calc(100% - 8px)',
                      transform: `scaleX(${progressPercentage / 100})`
                    }}
                  >
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-25" />
                    {/* Glowing lead edge */}
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent blur-sm" />
                  </div>

                  {/* Micro Grid Overlay inside bar */}
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-grid-white" />
                </div>

                {/* Tactical Tick Notches (Golden Ratio segments / Telemetry intervals) */}
                <div className="flex justify-between px-3 text-[0.45rem] font-mono font-black text-gray-600 uppercase tracking-[0.2em] select-none">
                  <div className="flex flex-col items-center">
                    <span>[ 0.0 ]</span>
                    <span className="h-1 w-px bg-gray-800 mt-1" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span>[ 2.5 ]</span>
                    <span className="h-1 w-px bg-gray-800 mt-1" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span>[ 5.0 ]</span>
                    <span className="h-1 w-px bg-gray-800 mt-1" />
                  </div>
                  <div className="flex flex-col items-center flex-1 text-center justify-center self-center text-voro-primary opacity-60">
                    <span>INTEGRITY SECURE // NODE_L_0{level}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>[ 7.5 ]</span>
                    <span className="h-1 w-px bg-gray-800 mt-1" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span>[ 10.0 ]</span>
                    <span className="h-1 w-px bg-gray-800 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categorized Matrix Display */}
        <div className="space-y-24">
          {CATEGORIES.map(category => (
            <section key={category} className="space-y-10">
              <div className="items-center gap-6 hidden md:flex">
                <h2 className="text-[0.7rem] font-black uppercase tracking-[0.5em] text-gray-500 whitespace-nowrap">
                  {category}
                </h2>
                <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {(ACHIEVEMENTS_BY_CATEGORY[category] || [])
                  .map(achievement => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      unlocked={earnedIds.has(achievement.id)}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
