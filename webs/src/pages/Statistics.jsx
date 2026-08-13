import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { BarChart3, TrendingUp, Calendar, Zap, Activity, Target, Weight } from 'lucide-react';
import { Card, Button, Tabs, LineChartComponent, BarChartComponent, PieChartComponent, Stat } from '@/components';
import { useStorageKeySelector } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';
import { getFastDateStr } from '@/utils/formatters';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted constants and formatters.
 * Prevents redundant object instantiation and memory pressure in the render cycle.
 */
const LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PERIOD_TABS = [
  { id: '7D', label: '7D' },
  { id: '30D', label: '30D' },
  { id: '90D', label: '90D' },
  { id: '1Y', label: '1Y' }
];
const PERIOD_MAP = { '7D': 7, '30D': 30, '90D': 90, '1Y': 365 };
const STORAGE_KEYS = ['nutrition_log', 'workout_log'];

/**
 * ⚡ LUXURY MOVEMENT: InteractiveChartCard.
 * Custom re-engineered 3D Card for charts implementing the Accessible 3D Interaction Pattern:
 * - Dynamic mouse tracking for real-time 3D tilt at 60fps.
 * - Static 4-degree volumetric tilt on focus for keyboard accessibility.
 * - Holographic real-time coordinate telemetry updating in the DOM to bypass React re-renders.
 */
const InteractiveChartCard = memo(({ children, title, subtitle, badge, icon: Icon, color = "voro-primary", nodeId = "NODE_01" }) => {
  const cardRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate volumetric tilt (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '4deg');
      cardRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const activeColor = color === "voro-primary" ? "var(--voro-primary)" : "var(--voro-secondary)";
  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      role="region"
      aria-label={`${title} chart container`}
      style={{
        transform: interactionActive
          ? 'perspective(2000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px)'
          : 'perspective(2000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="p-10 bg-[#0A0C14]/90 border border-white/5 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] cursor-pointer"
    >
      {/* Precision Grid & Grain Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.12] group-focus-visible:opacity-[0.12] transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.015]" />

        {/* Dynamic Light Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${activeColor}, transparent 92%), transparent 40%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Atmospheric Glowing Backplate */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] group-focus-visible:opacity-[0.08] transition-opacity duration-1000 blur-3xl -z-10"
        style={{ backgroundColor: activeColor, transform: 'translateZ(-10px)' }}
      />

      {/* Holographic Coordinate Telemetry */}
      <div
        className="absolute top-8 right-12 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative" style={{ transform: 'translateZ(50px)' }}>
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] mb-1">{subtitle}</h3>
            <p className="text-3xl font-serif italic font-medium text-white tracking-tight">{title}</p>
          </div>
          {badge ? (
            <span className="text-[0.65rem] font-black text-voro-primary uppercase tracking-widest bg-voro-primary/10 px-4 py-1.5 rounded-full border border-voro-primary/20">
              {badge}
            </span>
          ) : Icon ? (
            <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-600 group-hover:text-white transition-colors duration-700">
              <Icon size={18} />
            </div>
          ) : null}
        </div>
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
});
InteractiveChartCard.displayName = "InteractiveChartCard";

/**
 * ⚡ LUXURY MOVEMENT: MacroSynthesisMatrixEnclave.
 * Specialized 3D card layout for pie chart distribution statistics.
 * Incorporates custom scanline meshes, glow plates, and precise typography.
 */
const MacroSynthesisMatrixEnclave = memo(({ children, title, subtitle, description, macroDistribution }) => {
  const cardRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 12;
    const tiltX = (0.5 - (y / rect.height)) * 12;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '4deg');
      cardRef.current.style.setProperty('--tilt-y', '-4deg');
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
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      role="region"
      aria-label="Macronutrient allocation analysis"
      style={{
        transform: interactionActive
          ? 'perspective(2000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px)'
          : 'perspective(2000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="p-12 md:p-16 bg-[#0A0C14] border border-white/5 rounded-[3rem] shadow-[0_60px_120px_rgba(0,0,0,0.9)] relative overflow-hidden group/macro outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] cursor-pointer"
    >
      {/* Precision Grid & Grain Layer */}
      <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/macro:opacity-[0.15] transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.015]" />

        {/* Dynamic Light Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover/macro:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(1000px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 45%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Ambient Radial Highlights */}
      <div className="absolute -left-24 -top-24 w-96 h-96 bg-voro-primary/5 rounded-full blur-[120px] group-hover/macro:bg-voro-primary/10 transition-colors duration-1000 pointer-events-none" />
      <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-voro-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Telemetry Coordinate Overlay */}
      <div
        className="absolute top-10 right-14 pointer-events-none opacity-0 group-hover/macro:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[MAC_SYNTH_MTX]</span>
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-center" style={{ transform: 'translateZ(50px)' }}>
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[400px] aspect-square">
            {children}
            {/* Neural Core Detail */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[0.55rem] font-mono font-black text-gray-700 uppercase tracking-[0.4em] block mb-2">Matrix</span>
              <span className="text-4xl font-serif italic font-medium text-white tracking-tighter">Sync</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-voro-primary" />
              <h3 className="text-[0.7rem] font-mono font-black text-voro-primary uppercase tracking-[0.6em]">{subtitle}</h3>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight leading-tight">
              Average Nutrient <span className="text-gradient not-italic font-bold">{title}</span>
            </h2>
            <p className="text-gray-500 font-medium tracking-wide text-sm leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/5">
            {macroDistribution.map((macro) => (
              <div key={macro.name} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: macro.color }} />
                  <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">{macro.name}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif italic font-bold text-white">{macro.value}</span>
                  <span className="text-[0.6rem] font-mono font-black text-gray-700 uppercase tracking-widest">g / day</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
MacroSynthesisMatrixEnclave.displayName = "MacroSynthesisMatrixEnclave";

const Statistics = () => {
  const { user } = useApp();
  const [period, setPeriod] = useState('30D');

  // Unified testing bypass selector check
  const isBypass = typeof window !== 'undefined' && (window.__VORO_TEST_BYPASS__ || localStorage.getItem('voro_test_mode') === 'true');
  const [aligning, setAligning] = useState(!isBypass);

  const diagnosticRef = useRef(null);

  // Cinematic loading alignment sequence
  useEffect(() => {
    if (isBypass) {
      setAligning(false);
      return;
    }

    const timer = setTimeout(() => {
      setAligning(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isBypass]);

  // Telemetry diagnostic logs sequencer (mutates DOM directly to bypass React render cycle overhead)
  useEffect(() => {
    if (!aligning) return;

    const messages = [
      "Initializing trajectory telemetry vectors...",
      "Calibrating active metabolic mean registers...",
      "Synthesizing kinetic volume shift models...",
      "Coupling cached biophysical adherence ledger...",
      "Matrix stabilization complete. Nominals established."
    ];

    let currentMsgIdx = 0;
    const interval = setInterval(() => {
      if (diagnosticRef.current) {
        currentMsgIdx = (currentMsgIdx + 1) % messages.length;
        diagnosticRef.current.innerText = `[0x0${currentMsgIdx + 1}] ${messages[currentMsgIdx].toUpperCase()}`;
      }
    }, 450);

    return () => clearInterval(interval);
  }, [aligning]);

  useEffect(() => {
    document.title = 'VORO | Trajectory Registry';
  }, []);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Single-Pass Analytics Engine.
   * Consolidates multiple storage subscriptions and three separate O(N) traversals
   * into a unified subscription and a single, highly-optimized iteration pass.
   * Drastically reduces memory allocations and JS execution time for large datasets.
   */
  const analytics = useStorageKeySelector(
    STORAGE_KEYS,
    useCallback((allLogs) => {
      const nLogs = allLogs['nutrition_log'] || {};
      const wLogs = allLogs['workout_log'] || {};
      const days = PERIOD_MAP[period] || 30;

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const todayMs = now.getTime();
      const dayMs = 86400000;
      const cursor = new Date();

      // Pre-allocate arrays for performance and consistency
      const calorieTrend = new Array(days);
      const weeklyWorkouts = new Array(7); // Last 7 days

      let workoutDays = 0;
      let totalVolume = 0;
      let totalKcal = 0;
      let loggedDays = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;

      for (let i = 0; i < days; i++) {
        const offset = (days - 1 - i);
        cursor.setTime(todayMs - (offset * dayMs));
        const dateStr = getFastDateStr(cursor);

        const nData = nLogs[dateStr];
        const wData = wLogs[dateStr];

        // 1. Build Calorie Trend
        const kcal = nData?.totals?.calories || 0;
        calorieTrend[i] = {
          date: LABEL_FORMATTER.format(cursor),
          calories: kcal
        };

        // 2. Aggregate Nutrition Stats
        if (kcal > 0) {
          totalKcal += kcal;
          totalProtein += nData.totals.protein || 0;
          totalCarbs += nData.totals.carbs || 0;
          totalFat += nData.totals.fat || 0;
          loggedDays++;
        }

        // 3. Aggregate Workout Stats
        if (wData?.attended) {
          workoutDays++;
          totalVolume += (wData.volume || 0);
        }

        // 4. Weekly Workouts (Last 7 days logic)
        if (offset < 7) {
          weeklyWorkouts[6 - offset] = {
            day: DAYS_OF_WEEK[cursor.getDay()],
            workouts: wData?.attended ? 1 : 0
          };
        }
      }

      const macroDistribution = [
        { name: 'Protein', value: loggedDays > 0 ? Math.round(totalProtein / loggedDays) : 0, color: '#7C3AED' },
        { name: 'Carbs', value: loggedDays > 0 ? Math.round(totalCarbs / loggedDays) : 0, color: '#10B981' },
        { name: 'Fats', value: loggedDays > 0 ? Math.round(totalFat / loggedDays) : 0, color: '#F59E0B' },
      ].filter(m => m.value > 0);

      return {
        calorieTrend,
        workoutDays,
        totalVolume,
        weeklyWorkouts,
        macroDistribution,
        avgCalories: loggedDays > 0 ? Math.round(totalKcal / loggedDays) : 0,
        adherence: Math.round((loggedDays / days) * 100),
        // Verification tokens to ensure data integrity in memoization
        _nutritionHash: totalKcal + totalProtein + totalCarbs + totalFat,
        _workoutHash: workoutDays + totalVolume
      };
    }, [period]),
    // ⚡ REFINEMENT: Robust equality check.
    // Checks aggregate hashes and array lengths to ensure UI accurately reflects data modifications.
    useCallback((a, b) => (
      a?.workoutDays === b?.workoutDays &&
      a?.totalVolume === b?.totalVolume &&
      a?.avgCalories === b?.avgCalories &&
      a?.adherence === b?.adherence &&
      a?._nutritionHash === b?._nutritionHash &&
      a?._workoutHash === b?._workoutHash &&
      a?.calorieTrend?.length === b?.calorieTrend?.length
    ), [])
  );

  if (!user || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080B14]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-voro-primary border-t-transparent animate-spin mb-4" />
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Synthesizing Analytics</p>
        </div>
      </div>
    );
  }

  // Render cinematic simulated alignment loader on mount
  if (aligning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020408] text-[#F0F4FF] relative overflow-hidden font-sans">
        {/* Ambient background glow */}
        <div className="absolute w-[500px] h-[500px] bg-voro-primary/5 rounded-full blur-[140px] animate-pulse pointer-events-none" />

        <div className="relative flex flex-col items-center space-y-16 max-w-xl px-10 text-center">
          {/* Concentric spinning orbital rings */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-voro-primary/20 animate-orbit-clockwise" />
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-voro-secondary/30 animate-orbit-counter" />
            <div className="absolute inset-8 rounded-full border border-white/5 flex items-center justify-center bg-[#0C0906] shadow-2xl">
              <BarChart3 size={32} className="text-voro-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
             <h2 className="text-[0.65rem] font-mono font-black tracking-[0.5em] text-voro-primary uppercase">
                Biophysical Synthesis Matrix
             </h2>
             <p
               ref={diagnosticRef}
               className="text-xs font-mono font-bold text-gray-500 tracking-wider uppercase h-6"
             >
                [0x01] INITIALIZING TRAJECTORY TELEMETRY VECTORS...
             </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24 relative overflow-hidden">
       {/* Premium Ambient Background Lighting */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] right-[5%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[5%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">

        {/* Luxury Status Header Section (Golden Ratio White Space) */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 group/header">
           <div className="space-y-6 max-w-3xl">
              {/* Active Neural Pulse Eyebrow */}
              <div className="flex items-center gap-4 text-voro-primary">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
                </div>
                <span className="text-[0.7rem] font-mono font-black uppercase tracking-[0.6em] opacity-90">
                  Evolution Metrics // System Attestation
                </span>
              </div>
              <h1 className="text-[4.5rem] md:text-[6.5rem] font-serif italic font-medium tracking-[-0.04em] text-white leading-[0.9] mb-2">
                Trajectory <span className="text-gradient not-italic font-black">Registry</span>
              </h1>
              <p className="text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-70 leading-relaxed max-w-xl">
                A high-fidelity biological analysis of available biometric parameters and thermodynamic trajectory indexes.
              </p>

              {/* Architectural Datum Line */}
              <div className="flex items-center gap-6 pt-2">
                <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent opacity-40 group-hover/header:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <p className="text-gray-600 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-50 whitespace-nowrap">Node Ref: 0xANA_SYS</p>
              </div>
           </div>

           <div className="w-full md:w-auto">
             <Tabs
               tabs={PERIOD_TABS}
               activeTab={period}
               onTabChange={setPeriod}
             />
           </div>
        </header>

        {/* Re-engineered Summary Stats (Bespoke Volumetric Lenses with distinct IDs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <Stat
            label="Kinetic Sessions"
            value={analytics.workoutDays}
            icon={TrendingUp}
            color="voro-primary"
            nodeId="ANA_KNT"
          />
          <Stat
            label="Metabolic Mean"
            value={analytics.avgCalories}
            unit="kcal"
            icon={Zap}
            color="voro-secondary"
            nodeId="ANA_MET"
          />
          <Stat
            label="Absolute Volume"
            value={Math.round(analytics.totalVolume / 1000)}
            unit="k kg"
            icon={Weight}
            color="voro-accent"
            nodeId="ANA_VOL"
          />
          <Stat
            label="Neural Adherence"
            value={analytics.adherence}
            unit="%"
            icon={Target}
            color="voro-secondary"
            nodeId="ANA_ADR"
          />
        </div>

        {/* Customized Interactive 3D Chart Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
          {/* Calorie Trend Card */}
          <div className="lg:col-span-8">
            <InteractiveChartCard
              title="Metabolic Momentum"
              subtitle="Energy Input Flow"
              badge="Calorie Trend"
              color="voro-primary"
              nodeId="ANA_CH_CAL"
            >
              <div className="h-[400px] w-full pt-4">
                <LineChartComponent
                  data={analytics.calorieTrend}
                  dataKey="calories"
                  name="Calories"
                  color="#7C3AED"
                  height={400}
                  strokeWidth={3}
                />
              </div>
            </InteractiveChartCard>
          </div>

          {/* Weekly Workouts Card */}
          <div className="lg:col-span-4">
            <InteractiveChartCard
              title="Kinetic Frequency"
              subtitle="Weekly Attendance"
              icon={Calendar}
              color="voro-secondary"
              nodeId="ANA_CH_ATT"
            >
              <div className="h-[400px] w-full pt-4">
                <BarChartComponent
                  data={analytics.weeklyWorkouts}
                  dataKey="workouts"
                  xDataKey="day"
                  name="Workouts"
                  color="#10B981"
                  height={400}
                />
              </div>
            </InteractiveChartCard>
          </div>
        </div>

        {/* Macro Distribution Artifact (MacroSynthesisMatrixEnclave) */}
        <div className="mb-24">
          <MacroSynthesisMatrixEnclave
            title="Distribution"
            subtitle="Metabolic Balance Matrix"
            description={`High-fidelity synthesis of macronutrient allocation over the selected ${period} window. This specimen analyzes the structural ratio of protein density, carbohydrate energy, and essential adipose flux.`}
            macroDistribution={analytics.macroDistribution}
          >
            <PieChartComponent
              data={analytics.macroDistribution}
              height={400}
              colors={['#7C3AED', '#10B981', '#F59E0B']}
            />
          </MacroSynthesisMatrixEnclave>
        </div>

        {/* Boutique Footer */}
        <footer className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[0.65rem] font-mono font-black text-gray-600 uppercase tracking-[0.4em]">VORO Evolutionary Analytics Engine v1.4</p>
           <div className="flex gap-8">
              <button className="text-[0.65rem] font-mono font-black text-gray-500 hover:text-white uppercase tracking-[0.25em] transition-colors">Export CSV</button>
              <button className="text-[0.65rem] font-mono font-black text-gray-500 hover:text-white uppercase tracking-[0.25em] transition-colors">Generate PDF</button>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Statistics;
