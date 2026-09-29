import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Trophy, Award, Flame, Target, Layers } from 'lucide-react';
import { AchievementCard } from '@/components/AchievementCard';
import { Header } from '@/components/Header';
import { Tabs } from '@/components/Tabs';
import { Badge } from '@/components/Badge';
import { Tag } from '@/components/Tag';
import { achievements } from '@/data/achievements';
import { useStorageKeySelector } from '@/hooks/useStorage';

const EMPTY_ARRAY = Object.freeze([]);

const selectEarnedAchievements = (data) => (Array.isArray(data?.achievements) ? data.achievements : EMPTY_ARRAY);
const selectLevel = (data) => (typeof data?.level === 'number' ? data.level : 1);
const selectTotalXP = (data) => (typeof data?.totalXP === 'number' ? data.totalXP : 0);

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted categories set & grouping map.
 * Pre-computes static categories and category lookup dictionary at module load time
 * to prevent array allocations and O(C * N) filtrations on every render.
 */
const CATEGORIES = [...new Set(achievements.map(a => a.category))];

const ACHIEVEMENTS_BY_CATEGORY = achievements.reduce((acc, achievement) => {
  if (!acc[achievement.category]) acc[achievement.category] = [];
  acc[achievement.category].push(achievement);
  return acc;
}, {});

/**
 * ⚡ REFINEMENT: Luxury Evolution Matrix & Artifact Enclave (Achievements Page).
 * Re-engineered to Voro's 'Forge' luxury architectural system standard:
 * features gallery header architecture, 60fps direct-DOM volumetric hero tilt,
 * sliding glass matrix navigation tabs, double concentric counter-rotating orbital rings,
 * sub-pixel attestation badging, and W3C APG compliant keyboard accessibility.
 */
const Achievements = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Granular Reactivity via useStorageKeySelector.
   * Subscribes independently to earned achievements, level, and XP slices
   * to eliminate re-renders when other fields in 'gamification' update.
   */
  const earned = useStorageKeySelector('gamification', selectEarnedAchievements);
  const level = useStorageKeySelector('gamification', selectLevel);
  const xp = useStorageKeySelector('gamification', selectTotalXP);

  const [activeCategory, setActiveCategory] = useState('ALL');

  const heroRef = useRef(null);
  const heroTiltXRef = useRef(null);
  const heroTiltYRef = useRef(null);
  const isHeroHoveredRef = useRef(false);
  const isHeroFocusedRef = useRef(false);

  useEffect(() => {
    document.title = 'VORO | Artifact Matrix';
  }, []);

  const earnedIds = useMemo(() => new Set(earned), [earned]);

  const completionPercentage = useMemo(() => {
    return achievements.length > 0 ? Math.round((earned.length / achievements.length) * 100) : 0;
  }, [earned.length]);

  const { xpToNextLevel, progressPercentage } = useMemo(() => {
    const currentLevelXP = level * 1000;
    const remainder = xp % currentLevelXP;
    return {
      xpToNextLevel: currentLevelXP - remainder,
      progressPercentage: (remainder / currentLevelXP) * 100
    };
  }, [level, xp]);

  // Tab items for category navigation with live counters
  const tabItems = useMemo(() => {
    const allTab = {
      id: 'ALL',
      label: `ALL ARTIFACTS (${achievements.length})`,
      icon: <Award size={14} />
    };

    const categoryTabs = CATEGORIES.map(category => {
      const categoryAchievements = ACHIEVEMENTS_BY_CATEGORY[category] || EMPTY_ARRAY;
      const earnedCount = categoryAchievements.filter(a => earnedIds.has(a.id)).length;
      return {
        id: category,
        label: `${category.toUpperCase()} (${earnedCount}/${categoryAchievements.length})`,
        icon: category === 'Metabolic' ? <Layers size={14} /> : category === 'Kinetic' ? <Flame size={14} /> : <Target size={14} />
      };
    });

    return [allTab, ...categoryTabs];
  }, [earnedIds]);

  const handleHeroMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Max 8 degrees tilt for a heavy, luxury kinetic feel
    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    heroRef.current.style.setProperty('--mouse-x', `${x}px`);
    heroRef.current.style.setProperty('--mouse-y', `${y}px`);
    heroRef.current.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    heroRef.current.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);

    if (heroTiltXRef.current) heroTiltXRef.current.innerText = tiltX.toFixed(1);
    if (heroTiltYRef.current) heroTiltYRef.current.innerText = tiltY.toFixed(1);

    if (isHeroHoveredRef.current || isHeroFocusedRef.current) {
      heroRef.current.style.transform = 'perspective(2000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)';
      heroRef.current.style.transition = 'none';
    }
  }, []);

  const handleHeroMouseEnter = useCallback(() => {
    isHeroHoveredRef.current = true;
    if (heroRef.current) {
      heroRef.current.style.transform = 'perspective(2000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)';
      heroRef.current.style.transition = 'none';
    }
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    isHeroHoveredRef.current = false;
    if (heroRef.current) {
      heroRef.current.style.setProperty('--tilt-x', '0deg');
      heroRef.current.style.setProperty('--tilt-y', '0deg');
      if (!isHeroFocusedRef.current) {
        heroRef.current.style.transform = 'perspective(2000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      }
      heroRef.current.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    if (heroTiltXRef.current) heroTiltXRef.current.innerText = "0.0";
    if (heroTiltYRef.current) heroTiltYRef.current.innerText = "0.0";
  }, []);

  const handleHeroFocus = useCallback(() => {
    isHeroFocusedRef.current = true;
    if (heroRef.current) {
      heroRef.current.style.setProperty('--tilt-x', '4deg');
      heroRef.current.style.setProperty('--tilt-y', '-4deg');
      heroRef.current.style.transform = 'perspective(2000px) rotateX(4deg) rotateY(-4deg) translateY(-4px)';
      heroRef.current.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
      if (heroTiltXRef.current) heroTiltXRef.current.innerText = "4.0";
      if (heroTiltYRef.current) heroTiltYRef.current.innerText = "-4.0";
    }
  }, []);

  const handleHeroBlur = useCallback(() => {
    isHeroFocusedRef.current = false;
    if (heroRef.current) {
      if (!isHeroHoveredRef.current) {
        heroRef.current.style.setProperty('--tilt-x', '0deg');
        heroRef.current.style.setProperty('--tilt-y', '0deg');
        heroRef.current.style.transform = 'perspective(2000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      }
      heroRef.current.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  }, []);

  const displayedCategories = useMemo(() => {
    if (activeCategory === 'ALL') return CATEGORIES;
    return CATEGORIES.filter(cat => cat === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Ambient Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        {/* Gallery Header Architecture */}
        <Header
          eyebrow="EVOLUTION_MILESTONES"
          title={
            <>
              Artifact <span className="text-voro-primary not-italic font-bold">Matrix</span>
            </>
          }
          subtitle="Documenting the kinetics of your biological ascension and milestone achievements"
          action={
            <div className="flex items-center gap-4 bg-[#0A0C14]/90 p-4 px-6 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl">
              <div className="text-right border-r border-white/10 pr-6">
                <p className="text-[0.5rem] font-mono font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5">Completion</p>
                <Badge variant="voro-primary" size="md" dot={true}>
                  {completionPercentage}%
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-[0.5rem] font-mono font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5">Unlocked</p>
                <div className="text-sm font-mono font-bold text-white">
                  <span className="text-voro-primary">{earned.length}</span>
                  <span className="text-gray-600 mx-1">/</span>
                  <span>{achievements.length}</span>
                </div>
              </div>
            </div>
          }
        />

        {/* Ascension Biometric Core & Chrono-Spectral Progression Conduit */}
        <section
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseEnter={handleHeroMouseEnter}
          onMouseLeave={handleHeroMouseLeave}
          onFocus={handleHeroFocus}
          onBlur={handleHeroBlur}
          tabIndex={0}
          role="region"
          aria-label="Ascension Biometric Core and Chrono-Spectral Progression Conduit"
          style={{
            transformStyle: 'preserve-3d'
          }}
          className="relative overflow-hidden rounded-[3rem] bg-[#0A0C14] border border-white/5 p-12 md:p-16 mb-20 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)] hover:border-white/10 group/hero bg-boutique-grain cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#080B14] transition-all duration-1000"
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
              <span className="text-white/20">[0xASC_CORE_V3]</span>
            </div>
          </div>

          {/* Sub-pixel System Attestation Hash */}
          <div className="absolute bottom-4 left-8 pointer-events-none text-[0.4rem] font-mono font-black text-white/10 group-hover/hero:text-white/30 transition-colors duration-700 tracking-[0.25em] uppercase select-none z-20">
            0xASC_CORE_ATTESTED_MATRIX
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-center" style={{ transformStyle: 'preserve-3d' }}>
            {/* Level Orb Section */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-10 lg:pb-0 lg:pr-16" style={{ transform: 'translateZ(100px)' }}>
              <div className="relative">
                <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center bg-black/45 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05)] relative z-10">
                  <div className="absolute inset-0 opacity-[0.03] bg-scanline pointer-events-none rounded-full" />
                  <div className="text-center relative z-10">
                    <p className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-[0.4em] mb-1.5">Ascension Level</p>
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
                    <span className="text-lg font-mono font-bold text-gray-500 tracking-tight">/ {(level * 1000).toLocaleString()} <span className="text-[0.6rem] font-mono font-bold text-gray-600 uppercase tracking-widest ml-1">XP</span></span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-[0.6rem] font-mono font-black text-voro-secondary uppercase tracking-[0.2em]">Synthesis Required</p>
                  <p className="text-2xl font-serif italic font-bold text-white">
                    {xpToNextLevel.toLocaleString()}{' '}
                    <span className="text-[0.65rem] not-italic font-mono font-bold text-gray-500 uppercase ml-1.5 tracking-widest">
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

        {/* Kinetic Category Selection Tabs */}
        <div className="mb-16">
          <Tabs
            tabs={tabItems}
            activeTab={activeCategory}
            onTabChange={setActiveCategory}
          />
        </div>

        {/* Categorized Matrix Display */}
        <div className="space-y-24">
          {displayedCategories.map(category => (
            <section key={category} className="space-y-10">
              <div className="items-center gap-6 hidden md:flex">
                <div className="flex items-center gap-3">
                  <Tag variant="voro-primary" size="md" dot={true}>
                    {category}
                  </Tag>
                  <span className="text-[0.6rem] font-mono font-bold text-gray-500 uppercase tracking-[0.3em]">
                    [{(ACHIEVEMENTS_BY_CATEGORY[category] || []).length} ARTIFACTS]
                  </span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-voro-primary/30 via-white/5 to-transparent" />
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
