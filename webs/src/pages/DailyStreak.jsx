import React, { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react';
import { Calendar, RotateCcw, Zap, Target, Flame, Droplets, Moon, ShieldAlert, Check, Activity, Sparkles } from 'lucide-react';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { BarChartComponent } from '@/components';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static dataset with Object.freeze.
 * Eliminates heap allocations and ensures zero-allocation referential stability.
 */
const DEFAULT_STREAKS = Object.freeze({
  trainingDays: 15,
  nutritionLogging: 8,
  waterIntake: 12,
  sleepGoal: 6,
});

const WEEKLY_MATRIX_TEMPLATE = Object.freeze([
  { date: 'Mon', completed: 4 },
  { date: 'Tue', completed: 3 },
  { date: 'Wed', completed: 4 },
  { date: 'Thu', completed: 4 },
  { date: 'Fri', completed: 4 },
  { date: 'Sat', completed: 2 },
  { date: 'Sun', completed: 4 },
]);

const STREAK_METRICS_CONFIG = Object.freeze([
  { key: 'trainingDays', name: 'Kinetic Stimulus', icon: Flame, goal: 30, color: 'text-orange-500', bg: 'bg-orange-500/10', glowColor: '#F97316', nodeId: '0xSTRK_KNT' },
  { key: 'nutritionLogging', name: 'Nutritional Audit', icon: Zap, goal: 30, color: 'text-violet-500', bg: 'bg-violet-500/10', glowColor: '#8B5CF6', nodeId: '0xSTRK_NTR' },
  { key: 'waterIntake', name: 'Aqueous Matrix', icon: Droplets, goal: 30, color: 'text-blue-500', bg: 'bg-blue-500/10', glowColor: '#3B82F6', nodeId: '0xSTRK_AQU' },
  { key: 'sleepGoal', name: 'Somnolescent Recovery', icon: Moon, goal: 30, color: 'text-emerald-500', bg: 'bg-emerald-500/10', glowColor: '#10B981', nodeId: '0xSTRK_SOM' },
]);

/**
 * ⚡ LUXURY MOVEMENT: KineticMomentumNode.
 * Re-engineered conforming to Voro's 'Forge' design system standards.
 * Features 60fps direct-DOM volumetric 3D tilt tracking, holographic coordinate telemetry,
 * liquid border intelligence, and APG-compliant static 4-degree keyboard focus tilts.
 */
const KineticMomentumNode = memo(({ streak, current, goal, icon: Icon, color, bg, glowColor, nodeId }) => {
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

    // Volumetric 3D tilt calculation (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

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
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const percent = Math.min((current / goal) * 100, 100);
  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (containerRef.current) {
          containerRef.current.style.setProperty('--tilt-x', '0deg');
          containerRef.current.style.setProperty('--tilt-y', '0deg');
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      role="group"
      aria-label={`${streak} streak progress: ${current} out of ${goal} days. ${Math.round(percent)}% completion rate.`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative p-10 rounded-[2.5rem] bg-[#0A0C14]/90 border border-white/5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/10 hover:shadow-[0_60px_120px_rgba(0,0,0,0.85)] focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none group/node flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/node:opacity-10 group-focus-visible/node:opacity-10 transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover/node:opacity-100 group-focus-visible/node:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${glowColor}, transparent 92%), transparent 60%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* 🛰️ Liquid Border Intelligence */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/node:opacity-100 group-focus-visible/node:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${glowColor}, transparent 50%), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Atmospheric Glowing Backplate */}
      <div
        className="absolute inset-0 opacity-0 group-hover/node:opacity-[0.12] group-focus-visible/node:opacity-[0.12] transition-opacity duration-1000 blur-3xl -z-10"
        style={{ backgroundColor: glowColor, transform: 'translateZ(-10px)' }}
      />

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/node:opacity-100 group-focus-visible/node:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative flex flex-col h-full z-10" style={{ transform: 'translateZ(40px)' }}>
        {/* Specimen Holder with Luxurious Icon */}
        <div className={`w-20 h-20 rounded-[2rem] ${bg} ${color} flex items-center justify-center mb-8 shadow-2xl shadow-black/20 group-hover/node:scale-110 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden border border-white/5`}>
          <div className="absolute inset-0 bg-scanline opacity-[0.04] pointer-events-none" />
          <Icon size={28} className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
        </div>

        {/* Name and Metadata */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-4 bg-white/10" />
          <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] group-hover/node:text-gray-400 transition-colors">
            {streak}
          </span>
        </div>

        {/* The Streak Magnitude */}
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-5xl font-serif italic font-bold text-white tracking-tighter leading-none group-hover/node:text-voro-primary transition-colors">
            {current}
          </span>
          <span className="text-[0.6rem] font-mono font-bold text-gray-600 uppercase tracking-widest">
            Days
          </span>
        </div>

        {/* Circular and linear progress system */}
        <div className="space-y-4 mt-auto">
          <div className="flex justify-between items-center px-1">
            <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest">Target Adherence</span>
            <span className="text-[0.65rem] font-mono font-bold text-white">{Math.round(percent)}%</span>
          </div>
          <div className="w-full bg-white/[0.02] rounded-full h-1.5 p-0.5 border border-white/5 overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              style={{
                width: `${percent}%`,
                backgroundColor: glowColor
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

KineticMomentumNode.displayName = "KineticMomentumNode";

/**
 * ⚡ CINEMATIC ALIGNMENT OVERLAY
 * Displays counter-rotating orbital rings, pulsing core telemetry, and real-time synchronicity recalculation.
 * Includes Playwright test bypass hook (`window.__VORO_TEST_BYPASS__` / `voro_test_mode`).
 */
const KineticStreakAlignmentOverlay = memo(({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    // E2E Test Bypass Hook
    if (typeof window !== 'undefined' && (window.__VORO_TEST_BYPASS__ || window.voro_test_mode)) {
      setStep(2);
      const timer = setTimeout(() => {
        onComplete();
        onClose();
      }, 50);
      return () => clearTimeout(timer);
    }

    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1800);
    const t3 = setTimeout(() => {
      onComplete();
      onClose();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, onClose, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020408]/90 backdrop-blur-2xl animate-fade-in p-6">
      <div className="relative flex flex-col items-center justify-center max-w-md w-full text-center space-y-8 p-12 rounded-[3rem] bg-[#0A0C14] border border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Counter-rotating orbital rings */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-voro-primary/40 animate-orbit-clockwise" />
          <div className="absolute inset-3 rounded-full border border-dashed border-voro-secondary/30 animate-orbit-counter" />
          <div className="w-16 h-16 rounded-2xl bg-voro-primary/20 border border-voro-primary/40 flex items-center justify-center text-voro-primary animate-pulse shadow-[0_0_30px_rgba(124,58,237,0.5)]">
            <Activity size={32} />
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.5em] text-voro-primary block">
            SYNCHRONICITY_ALIGNMENT // v4.2
          </span>
          <h3 className="text-3xl font-serif italic font-medium text-white tracking-tight">
            {step === 0 && "Recalibrating Biometric Vectors..."}
            {step === 1 && "Verifying Temporal Synchronicity..."}
            {step === 2 && "Adherence Matrix Standardized"}
          </h3>
          <p className="text-[0.65rem] font-mono text-gray-500 uppercase tracking-widest">
            {step === 0 && "0x1A_VECTOR_POLLING"}
            {step === 1 && "0x2B_TEMPORAL_AUDIT"}
            {step === 2 && "0x3C_SYNCHRONOUS_ESTABLISHED"}
          </p>
        </div>

        <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-voro-primary to-voro-secondary transition-all duration-700"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
});

KineticStreakAlignmentOverlay.displayName = "KineticStreakAlignmentOverlay";

const DailyStreak = () => {
  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity.
   * Replaced useStorageKey with useStorageKeySelector for granular reactivity.
   */
  const streaks = useStorageKeySelector(
    'voro_streaks',
    useCallback((data) => data || DEFAULT_STREAKS, [])
  );

  const { updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  const containerRef = useRef(null);
  const chartTiltXRef = useRef(null);
  const chartTiltYRef = useRef(null);
  const [chartHovered, setChartHovered] = useState(false);
  const [chartFocused, setChartFocused] = useState(false);

  // Alignment overlay modal state
  const [isAligning, setIsAligning] = useState(false);

  // Double-Confirmation Purge Mechanism
  const [purgeActive, setPurgeActive] = useState(false);
  const [purgeCountdown, setPurgeCountdown] = useState(3);
  const purgeTimerRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Daily Streak';
    return () => {
      if (purgeTimerRef.current) clearInterval(purgeTimerRef.current);
    };
  }, []);

  const chartData = useMemo(() => WEEKLY_MATRIX_TEMPLATE, []);

  const streakGoals = useMemo(() => {
    return STREAK_METRICS_CONFIG.map(config => ({
      ...config,
      current: streaks[config.key] ?? DEFAULT_STREAKS[config.key] ?? 0
    }));
  }, [streaks]);

  const handleChartMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (chartTiltXRef.current) chartTiltXRef.current.innerText = tiltX.toFixed(1);
    if (chartTiltYRef.current) chartTiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleChartFocus = () => {
    setChartFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (chartTiltXRef.current) chartTiltXRef.current.innerText = "4.0";
      if (chartTiltYRef.current) chartTiltYRef.current.innerText = "-4.0";
    }
  };

  const handleChartBlur = () => {
    setChartFocused(false);
  };

  const totalActiveStreakDays = useMemo(() => {
    return (streaks.trainingDays || 0) + (streaks.nutritionLogging || 0) + (streaks.waterIntake || 0) + (streaks.sleepGoal || 0);
  }, [streaks]);

  const handleResetTrigger = useCallback(() => {
    if (purgeActive) {
      if (purgeTimerRef.current) clearInterval(purgeTimerRef.current);
      setPurgeActive(false);
      setPurgeCountdown(3);

      updateItem('voro_streaks', {
        trainingDays: 0,
        nutritionLogging: 0,
        waterIntake: 0,
        sleepGoal: 0,
      });
      addNotification('Synchronicity matrix reset completed.', 'info');
    } else {
      setPurgeActive(true);
      setPurgeCountdown(3);

      let count = 3;
      purgeTimerRef.current = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          if (purgeTimerRef.current) clearInterval(purgeTimerRef.current);
          setPurgeActive(false);
          setPurgeCountdown(3);
        } else {
          setPurgeCountdown(count);
        }
      }, 1000);
    }
  }, [purgeActive, updateItem, addNotification]);

  const handleAlignmentComplete = useCallback(() => {
    addNotification('Behavioral synchronicity vector re-aligned.', 'success');
  }, [addNotification]);

  const dynamicChartInteraction = chartHovered || chartFocused;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24 relative overflow-hidden">
      {/* Editorial Ambient background depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[130px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">

        {/* Luxury Status Header Section */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 group/header">
          <div className="space-y-6 max-w-3xl">
            {/* Active Neural Pulse Eyebrow */}
            <div className="flex items-center gap-4 text-orange-500">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]"></span>
              </div>
              <span className="text-[0.7rem] font-mono font-black uppercase tracking-[0.6em]">
                Momentum Matrix // System Attestation
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-[4.5rem] md:text-[6.5rem] font-serif italic font-medium tracking-[-0.04em] text-white leading-[0.9] mb-2">
                Consistency <span className="text-gradient not-italic font-black">Streaks</span>
              </h1>
              <p className="text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-70 leading-relaxed max-w-xl">
                A high-fidelity analysis of behavioral synchronicity and biological adherence parameters.
              </p>
            </div>

            {/* Architectural Datum Line */}
            <div className="flex items-center gap-6 pt-2">
              <div className="h-px w-24 bg-gradient-to-r from-orange-500 to-transparent opacity-40 group-hover/header:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <p className="text-gray-600 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-50 whitespace-nowrap">Node Ref: 0xSTRK_MTX_v4</p>
            </div>
          </div>

          {/* Luminous Core Status Display */}
          <div className="flex gap-4">
            <div className="px-8 py-5 bg-[#0A0C14] border border-white/5 rounded-2xl shadow-xl flex items-center gap-6 relative overflow-hidden group/top-stat">
              <div className="absolute inset-0 bg-boutique-grain opacity-[0.01]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover/top-stat:bg-orange-500/10 transition-colors" />
              <div className="text-right border-r border-white/5 pr-6">
                <p className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Matrix Adherence</p>
                <p className="text-2xl font-mono font-bold text-white">{totalActiveStreakDays} <span className="text-[0.6rem] text-gray-600">days</span></p>
              </div>
              <div className="text-right">
                <p className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.2em] mb-1">State Efficiency</p>
                <p className="text-2xl font-mono font-bold text-orange-500">Nominal</p>
              </div>
            </div>
          </div>
        </header>

        {/* Kinetic Momentum Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {streakGoals.map(streak => (
            <KineticMomentumNode
              key={streak.name}
              streak={streak.name}
              current={streak.current}
              goal={streak.goal}
              icon={streak.icon}
              color={streak.color}
              bg={streak.bg}
              glowColor={streak.glowColor}
              nodeId={streak.nodeId}
            />
          ))}
        </div>

        {/* Complex Analysis & Interaction Matrix Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">

          {/* Re-engineered Weekly Completion Matrix (Interactive 3D Card) */}
          <div
            ref={containerRef}
            onMouseMove={handleChartMouseMove}
            onMouseEnter={() => setChartHovered(true)}
            onMouseLeave={() => setChartHovered(false)}
            onFocus={handleChartFocus}
            onBlur={handleChartBlur}
            tabIndex="0"
            role="region"
            aria-label="Weekly Completion Matrix Chart"
            style={{
              transform: dynamicChartInteraction
                ? 'perspective(1500px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
                : 'perspective(1500px) rotateX(0deg) rotateY(0deg) translateY(0px)',
              transition: chartHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transformStyle: 'preserve-3d'
            }}
            className="lg:col-span-8 p-12 md:p-16 bg-[#0A0C14]/90 border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group/chart cursor-pointer focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none"
          >
            {/* Precision Grid & Grain Overlay */}
            <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/chart:opacity-15 group-focus-visible/chart:opacity-15 transition-opacity duration-1000" />
              <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

              {/* Dynamic Mouse Luminous Lens */}
              <div
                className="absolute inset-0 opacity-0 group-hover/chart:opacity-100 group-focus-visible/chart:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 45%)`,
                  transform: 'translateZ(20px)'
                }}
              />
            </div>

            {/* Ambient Background Aura */}
            <div className="absolute -right-32 -top-32 w-96 h-96 bg-voro-primary/5 rounded-full blur-[120px] group-hover/chart:bg-voro-primary/10 transition-colors duration-1000" />

            {/* Coordinate Telemetry Overlay */}
            <div
              className="absolute top-8 right-12 pointer-events-none opacity-0 group-hover/chart:opacity-100 group-focus-visible/chart:opacity-100 transition-all duration-500"
              style={{ transform: 'translateZ(80px)' }}
            >
              <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
                <span>TX_<span ref={chartTiltXRef}>0.0</span>°</span>
                <span>TY_<span ref={chartTiltYRef}>0.0</span>°</span>
                <span className="text-white/20">[NODE_W_COMP]</span>
              </div>
            </div>

            <div className="relative" style={{ transform: 'translateZ(50px)' }}>
              <div className="flex items-center justify-between mb-16">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-px w-6 bg-voro-primary" />
                    <h3 className="text-[0.65rem] font-mono font-black text-gray-600 uppercase tracking-[0.3em]">Adherence Timelines</h3>
                  </div>
                  <p className="text-3xl font-serif italic font-bold text-white tracking-tight">
                    Weekly <span className="text-gradient not-italic font-black">Completion</span> Matrix
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-600 group-hover/chart:text-white transition-colors duration-700">
                  <Calendar size={18} />
                </div>
              </div>

              <div className="h-[360px] w-full relative">
                <BarChartComponent
                  data={chartData}
                  dataKey="completed"
                  xDataKey="date"
                  color="#7C3AED"
                  height={360}
                />
              </div>
            </div>
          </div>

          {/* Interactive Core Action Panel */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* Evolution Threshold Panel */}
            <button
              onClick={() => setIsAligning(true)}
              className="flex-1 p-12 bg-[#0A0C14] border border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-center items-center text-center group/threshold cursor-pointer hover:border-voro-primary/30 transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
            >
              <div className="absolute inset-0 bg-boutique-grain opacity-[0.01]" />
              <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none scale-90 group-hover/threshold:scale-100 transition-transform duration-[1.5s]">
                 <Target size={220} className="text-voro-primary" />
              </div>

              <div className="relative space-y-6 z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-voro-accent/10 border border-voro-accent/20 flex items-center justify-center text-voro-accent mx-auto drop-shadow-glow group-hover/threshold:scale-110 transition-transform duration-700">
                  <Zap className="w-8 h-8 fill-current" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif italic font-bold text-white leading-none">Evolution Threshold</h3>
                  <p className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] max-w-[220px] mx-auto leading-relaxed">
                    Tap to trigger vector re-alignment
                  </p>
                </div>
              </div>
            </button>

            {/* Upgraded Tactile Magnetic Reset Action with Double Confirmation */}
            <button
              onClick={handleResetTrigger}
              style={{ transformStyle: 'preserve-3d' }}
              className={`w-full flex items-center justify-center gap-4 py-8 rounded-[2.5rem] text-[0.7rem] font-mono font-black uppercase tracking-[0.4em] transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none group/reset overflow-hidden relative ${
                purgeActive
                  ? 'bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                  : 'bg-white text-black shadow-[0_40px_80px_rgba(255,255,255,0.1)]'
              }`}
            >
              {!purgeActive && <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-10" />}

              <div className="relative z-10 flex items-center gap-4">
                {purgeActive ? (
                  <>
                    <ShieldAlert size={18} className="animate-bounce" />
                    <span>PURGE IN {purgeCountdown}S? (TAP TO CONFIRM)</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={16} className="transition-transform group-hover/reset:rotate-180 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <span>Reset Synchronicity</span>
                  </>
                )}
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Alignment Overlay Modal */}
      <KineticStreakAlignmentOverlay
        isOpen={isAligning}
        onClose={() => setIsAligning(false)}
        onComplete={handleAlignmentComplete}
      />
    </div>
  );
};

export default DailyStreak;
