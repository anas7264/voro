import React, { useEffect, useState, useMemo, useCallback, useRef, memo } from 'react';
import { Activity, Target, Zap, Shield, Sparkles, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { ChallengeCard } from '@/components/ChallengeCard';
import Tabs from '@/components/Tabs';
import { challenges } from '@/data/challenges';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted Challenge Grouping Map.
 * Pre-computes challenge lists by category at module initialization.
 */
const CHALLENGES_BY_CATEGORY = Object.freeze(challenges.reduce((acc, challenge) => {
  if (!acc[challenge.category]) acc[challenge.category] = [];
  acc[challenge.category].push(challenge);
  return acc;
}, {}));

const DAILY_CHALLENGES = Object.freeze(CHALLENGES_BY_CATEGORY['Daily'] || []);
const WEEKLY_CHALLENGES = Object.freeze(CHALLENGES_BY_CATEGORY['Weekly'] || []);
const MONTHLY_CHALLENGES = Object.freeze(CHALLENGES_BY_CATEGORY['Monthly'] || []);

const EMPTY_COMPLETED = Object.freeze({});
const selectCompletedChallenges = (gamification) => (gamification && gamification.completedChallenges) || EMPTY_COMPLETED;

/**
 * ⚡ LUXURY COMPONENT: TelemetryCard
 * High-performance 3D volumetric status tile featuring direct DOM tilt tracking,
 * holographic coordinate telemetry, ambient backglows, and boutique grain layers.
 */
const TelemetryCard = memo(({ label, value, unit, icon: Icon, color, nodeId }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

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
      role="group"
      aria-label={`${label}: ${value} ${unit || ''}`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative p-8 rounded-[2.5rem] bg-[#0A0C14] border border-white/5 shadow-2xl overflow-hidden group/top-stat focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none flex items-center gap-6 cursor-pointer"
    >
      {/* Precision Grid & Grain Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/top-stat:opacity-15 transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover/top-stat:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 60%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover/top-stat:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Icon Holder */}
      <div className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-500 group-hover/top-stat:text-voro-primary group-hover/top-stat:bg-voro-primary/10 group-hover/top-stat:scale-110 transition-all duration-700 relative z-10`} style={{ transform: 'translateZ(30px)' }}>
        <Icon size={22} className={color || 'text-voro-primary'} />
      </div>

      <div className="relative z-10 space-y-1" style={{ transform: 'translateZ(40px)' }}>
        <p className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] group-hover/top-stat:text-gray-400 transition-colors">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-serif italic font-bold text-white tracking-tight group-hover/top-stat:text-voro-primary transition-colors">
            {value}
          </span>
          {unit && (
            <span className="text-[0.6rem] font-mono font-bold text-gray-600 uppercase tracking-widest">
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

TelemetryCard.displayName = "TelemetryCard";

/**
 * ⚡ REFINEMENT: Challenges page re-engineered into the "Strategic Objective Synthesis Enclave".
 * Features bespoke luxury spatial architecture, 3D volumetric cards, liquid border intelligence,
 * and high-contrast ARIA accessibility conformance.
 */
const Challenges = () => {
  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity via useStorageKeySelector.
   * Subscribe strictly to 'gamification.completedChallenges' to isolate re-renders
   * and avoid re-rendering Challenges when unrelated gamification data (e.g. XP/streaks) updates.
   */
  const completed = useStorageKeySelector('gamification', selectCompletedChallenges);
  const { updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    document.title = 'VORO | Strategic Objective Synthesis Enclave';
  }, []);

  const handleClaimReward = useCallback((challenge) => {
    const updated = { ...completed, [challenge.id]: true };

    updateItem('gamification', (prev) => {
      const current = prev || {};
      return {
        ...current,
        completedChallenges: updated,
        xp: (current.xp || 0) + challenge.xpReward
      };
    });
    addNotification(`${challenge.name} Manifested. +${challenge.xpReward} XP Synthesized.`, 'success');
  }, [completed, updateItem, addNotification]);

  const completedCount = useMemo(() => Object.keys(completed).length, [completed]);
  const totalCount = challenges.length;
  const successRate = useMemo(() => Math.round((completedCount / totalCount) * 100), [completedCount, totalCount]);

  const tabList = useMemo(() => [
    {
      id: 'daily',
      label: 'Daily Cycles',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" role="region" aria-label="Daily Cycles Objectives Grid">
          {DAILY_CHALLENGES.map(c => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              completed={completed[c.id]}
              onClaim={() => handleClaimReward(c)}
              progress={completed[c.id] ? 100 : c.progress}
            />
          ))}
        </div>
      )
    },
    {
      id: 'weekly',
      label: 'Weekly Rhythms',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" role="region" aria-label="Weekly Rhythms Objectives Grid">
          {WEEKLY_CHALLENGES.map(c => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              completed={completed[c.id]}
              onClaim={() => handleClaimReward(c)}
              progress={completed[c.id] ? 100 : c.progress}
            />
          ))}
        </div>
      )
    },
    {
      id: 'monthly',
      label: 'Monthly Evolution',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" role="region" aria-label="Monthly Evolution Objectives Grid">
          {MONTHLY_CHALLENGES.map(c => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              completed={completed[c.id]}
              onClaim={() => handleClaimReward(c)}
              progress={completed[c.id] ? 100 : c.progress}
            />
          ))}
        </div>
      )
    }
  ], [completed]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-24 relative overflow-hidden selection:bg-voro-primary/30">
      {/* Precision Ambient Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20 z-10">

        {/* Editorial Boutique Header (Golden Ratio Whitespace) */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 group/header">
          <div className="space-y-6 max-w-3xl">
            {/* Active Neural Telemetry Eyebrow */}
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.5em] text-gray-400">
                Strategic Matrix // Operational Protocol
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-[4rem] md:text-[6rem] font-serif italic font-medium tracking-[-0.04em] text-white leading-[0.9]">
                Strategic <span className="text-voro-primary not-italic font-black">Matrix</span>
              </h1>
              <p className="text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-70 leading-relaxed max-w-xl">
                High-precision biological objectives and operational targets designed to catalyze metabolic adaptation.
              </p>
            </div>

            {/* Architectural Datum Line */}
            <div className="flex items-center gap-6 pt-2">
              <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent opacity-40 group-hover/header:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <p className="text-gray-600 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-50 whitespace-nowrap">Node Ref: 0xOBJ_MATRIX</p>
            </div>
          </div>

          {/* Luminous Core Status Telemetry Displays */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
            <TelemetryCard
              label="Manifestation Rate"
              value={`${successRate}%`}
              icon={TrendingUp}
              nodeId="TELE_01"
            />
            <TelemetryCard
              label="Completed Objectives"
              value={`${completedCount}/${totalCount}`}
              icon={CheckCircle2}
              color="text-emerald-400"
              nodeId="TELE_02"
            />
          </div>
        </header>

        {/* Tabbed Objective Categories */}
        <section className="space-y-8" aria-label="Strategic Objectives Section">
          <Tabs
            tabs={tabList}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="w-full"
          />
        </section>

      </div>
    </div>
  );
};

export default Challenges;