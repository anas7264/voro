import React, { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react';
import { Calendar, RotateCcw, Zap, Target, Flame, Droplets, Moon } from 'lucide-react';
import { useStorageKey } from '@/hooks/useStorage';
import { BarChartComponent } from '@/components';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted fallback data.
 * Ensures referential stability and prevents redundant object instantiation.
 */
const DEFAULT_STREAKS = {
  trainingDays: 15,
  nutritionLogging: 8,
  waterIntake: 12,
  sleepGoal: 6,
};

/**
 * ⚡ LUXURY MOVEMENT: KineticMomentumNode.
 * Re-engineered to the 'Forge' luxury standard with volumetric 3D transforms,
 * magnetic mouse/focus tracking, holographic coordinate telemetry, and bespoke rarity glows.
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

  const percent = Math.min((current / goal) * 100, 100);
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
      aria-label={`${streak} streak progress: ${current} out of ${goal} days. ${Math.round(percent)}% completion rate.`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative p-10 rounded-[2.5rem] bg-[#0A0C14]/80 border border-white/5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/10 hover:shadow-[0_60px_120px_rgba(0,0,0,0.8)] focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none group/node flex flex-col cursor-pointer"
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
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative flex flex-col h-full" style={{ transform: 'translateZ(40px)' }}>
        {/* Specimen Holder with Luxurious Icon */}
        <div className={`w-20 h-20 rounded-[2rem] ${bg} ${color} flex items-center justify-center mb-8 shadow-2xl shadow-black/20 group-hover/node:scale-115 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden border border-white/5`}>
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
            {/* Lead-edge active laser effect */}
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

const DailyStreak = () => {
  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to 'voro_streaks' data to prevent redundant re-renders
   * when unrelated storage keys change.
   */
  const streaksData = useStorageKey('voro_streaks');

  const containerRef = useRef(null);
  const chartTiltXRef = useRef(null);
  const chartTiltYRef = useRef(null);
  const [chartHovered, setChartHovered] = useState(false);
  const [chartFocused, setChartFocused] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Daily Streak';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation using useMemo.
   * Eliminates the initial mount-time double-render cycle and ensures
   * reactivity to StorageContext updates without manual load calls.
   */
  const streaks = useMemo(() => {
    return streaksData || DEFAULT_STREAKS;
  }, [streaksData]);

  const chartData = useMemo(() => [
    { date: 'Mon', completed: 4 },
    { date: 'Tue', completed: 3 },
    { date: 'Wed', completed: 4 },
    { date: 'Thu', completed: 4 },
    { date: 'Fri', completed: 4 },
    { date: 'Sat', completed: 2 },
    { date: 'Sun', completed: 4 },
  ], []);

  const streakGoals = useMemo(() => [
    { name: 'Training', current: streaks.trainingDays, icon: Flame, goal: 30, color: 'text-orange-500', bg: 'bg-orange-500/10', glowColor: '#F97316', nodeId: 'STRK_01' },
    { name: 'Nutrition Logging', current: streaks.nutritionLogging, icon: Zap, goal: 30, color: 'text-violet-500', bg: 'bg-violet-500/10', glowColor: '#8B5CF6', nodeId: 'STRK_02' },
    { name: 'Water Intake', current: streaks.waterIntake, icon: Droplets, goal: 30, color: 'text-blue-500', bg: 'bg-blue-500/10', glowColor: '#3B82F6', nodeId: 'STRK_03' },
    { name: 'Sleep Goal', current: streaks.sleepGoal, icon: Moon, goal: 30, color: 'text-emerald-500', bg: 'bg-emerald-500/10', glowColor: '#10B981', nodeId: 'STRK_04' },
  ], [streaks]);

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

  const dynamicChartInteraction = chartHovered || chartFocused;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24 relative overflow-hidden">
      {/* Editorial Ambient background depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[130px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">

        {/* Luxury Status Header Section (Golden Ratio White Space) */}
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
              <p className="text-gray-600 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-50 whitespace-nowrap">Node Ref: 0xSTRK_SYS</p>
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
            className="lg:col-span-8 p-12 md:p-16 bg-[#0A0C14]/80 border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group/chart cursor-pointer focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none"
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
            <div className="flex-1 p-12 bg-[#0A0C14] border border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-center items-center text-center group/threshold">
              <div className="absolute inset-0 bg-boutique-grain opacity-[0.01]" />
              <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none scale-90 group-hover/threshold:scale-100 transition-transform duration-[1.5s]">
                 <Target size={220} className="text-voro-primary" />
              </div>

              <div className="relative space-y-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-voro-accent/10 border border-voro-accent/20 flex items-center justify-center text-voro-accent mx-auto drop-shadow-glow group-hover/threshold:scale-110 transition-transform duration-700">
                  <Zap className="w-8 h-8 fill-current" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif italic font-bold text-white leading-none">Evolution Threshold</h3>
                  <p className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] max-w-[200px] mx-auto leading-relaxed">
                    3 more active cycles required to establish permanent cellular adaptation
                  </p>
                </div>
              </div>
            </div>

            {/* Upgraded Tactile Magnetic Reset Action */}
            <button
              onClick={() => {
                // Tactical confirmation simulation/reset notification
                alert("Synchronicity matrix verification sequence triggered.");
              }}
              style={{ transformStyle: 'preserve-3d' }}
              className="w-full flex items-center justify-center gap-4 py-8 rounded-[2.5rem] bg-white text-black text-[0.7rem] font-mono font-black uppercase tracking-[0.4em] transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_40px_80px_rgba(255,255,255,0.15)] active:shadow-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none group/reset overflow-hidden relative"
            >
              {/* Shimmer Lead Effect */}
              <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-10" />

              <div className="relative z-10 flex items-center gap-4">
                <RotateCcw size={16} className="transition-transform group-hover/reset:rotate-180 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span>Reset Synchronicity</span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DailyStreak;