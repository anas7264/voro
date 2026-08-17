import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { Plus, Droplet, Trash2, TrendingUp, ChevronLeft, ChevronRight, Target, Zap, Waves, AlertTriangle } from 'lucide-react';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateWaterEntry } from '@/utils/validators';
import { getFastShortDate } from '@/utils/formatters';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import Card from '@/components/Card';
import LineChartComponent from '@/components/LineChartComponent';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in loops.
 */
const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric'
});

/**
 * ⚡ LUXURY REFINEMENT: Volumetric 3D HydroVessel with static 4-degree keyboard focus tilts,
 * mouse-tracking depth, active reflection lenses, holographic coordinate telemetry,
 * and clinical-grade real-time indicators.
 */
const HydroVessel = memo(({ percentage, biologicalState, nodeId = "VESSEL_NODE" }) => {
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

    // Volumetric 3D calculations (max 15 degrees tilt)
    const tiltY = ((x / rect.width) - 0.5) * 30;
    const tiltX = (0.5 - (y / rect.height)) * 30;

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
      // Accessible static tilt (4 degrees) on focus
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
      role="region"
      aria-label={`Molecular Hydration Vessel. Current volume status: ${Math.round(percentage)}%. Status: ${biologicalState}`}
      style={{
        transform: interactionActive
          ? 'perspective(1500px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale(1.02)'
          : 'perspective(1500px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative w-64 h-[26rem] mx-auto group outline-none rounded-[3.5rem] cursor-pointer"
    >
      {/* Dynamic Aura Backglow matching blue liquid theme */}
      <div
        className="absolute inset-[-12px] rounded-[3.5rem] bg-blue-500/10 opacity-30 blur-2xl group-hover:bg-blue-400/25 transition-all duration-1000"
        style={{ transform: 'translateZ(-10px)' }}
      />

      {/* Holographic Coordinate Telemetry */}
      <div
        className="absolute top-8 right-8 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 z-30"
        style={{ transform: 'translateZ(90px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-blue-400/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Outer Vessel Shadow Plate */}
      <div className="absolute inset-0 rounded-[3.5rem] bg-[#0A0C14]/90 border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.85)]" />

      {/* The Vessel Body */}
      <div
        className="relative w-full h-full rounded-[3.5rem] border-2 border-white/10 bg-[#0D121F]/40 backdrop-blur-3xl overflow-hidden shadow-2xl"
        style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
      >
        {/* Dynamic Water Body */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateY(${100 - percentage}%)`, transformStyle: 'preserve-3d' }}
        >
          {/* Surface Waves */}
          <div className="absolute top-0 left-0 w-[200%] h-20 -translate-y-[15px] pointer-events-none">
            <svg className="absolute inset-0 animate-wave-slow opacity-60" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="url(#water-grad)" />
            </svg>
            <svg className="absolute inset-0 animate-wave translate-x-[-100px]" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="url(#water-grad)" fillOpacity="0.4" />
            </svg>
          </div>

          {/* Liquid Mass */}
          <div className="absolute top-[20px] left-0 w-full h-[1000px] bg-gradient-to-b from-blue-600/50 via-blue-800/35 to-blue-950/70" />

          <svg className="hidden">
            <defs>
              <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.15), transparent 80%)`,
            transform: 'translateZ(50px)'
          }}
        />

        {/* Glass Reflection */}
        <div className="absolute top-8 left-6 w-1.5 h-3/4 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-full blur-[1px] pointer-events-none" style={{ transform: 'translateZ(60px)' }} />
        <div className="absolute top-10 left-10 w-6 h-6 bg-white/5 rounded-full blur-xl pointer-events-none" style={{ transform: 'translateZ(40px)' }} />
      </div>

      {/* Measurement Matrix (Precomputed scale lines) */}
      <div
        className="absolute left-[-54px] inset-y-12 flex flex-col justify-between items-end py-6 z-20 pointer-events-none"
        style={{ transform: 'translateZ(40px)' }}
      >
        {[2000, 1500, 1000, 500].map(val => (
          <div key={val} className="flex items-center gap-3">
             <span className="text-[0.55rem] font-mono font-semibold text-gray-500 tracking-tighter">{val}ml</span>
             <div className="w-3.5 h-[1.5px] bg-white/15" />
          </div>
        ))}
      </div>
    </div>
  );
});

HydroVessel.displayName = "HydroVessel";

/**
 * ⚡ LUXURY REFINEMENT: Micro-Interaction Catalyst Injector Button
 * Features high-end volumetric hover tilts, reactive liquid border illumination, and responsive kinetic states.
 */
const CatalystCard = memo(({ amount, onAdd }) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const isActive = isHovered || isFocused;

  return (
    <button
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={() => onAdd(amount)}
      style={{
        transform: isActive
          ? 'perspective(800px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-3px)'
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        group relative p-8 rounded-[2.25rem] bg-[#0A0C14] border border-white/5
        transition-all duration-500 text-center overflow-hidden outline-none cursor-pointer
        hover:border-blue-500/30 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
      `}
    >
      {/* 🛰️ Liquid Border Intelligence */}
      <div
        className="absolute inset-0 rounded-[2.25rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.4), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Light Lens Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(140px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.1), transparent 85%)`
        }}
      />

      <div style={{ transform: 'translateZ(30px)' }} className="relative z-10">
        <Droplet size={18} className="text-blue-500 mx-auto mb-4 group-hover:scale-125 transition-transform duration-500" />
        <p className="text-3xl font-serif italic font-medium text-white mb-1">
          {amount >= 1000 ? (amount / 1000).toFixed(1) : amount}
        </p>
        <p className="text-[0.6rem] font-mono font-bold text-gray-500 uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">
          {amount >= 1000 ? 'Liters' : 'ml'} catalyst
        </p>
      </div>
    </button>
  );
});

CatalystCard.displayName = "CatalystCard";

/**
 * ⚡ DEFENSIVE UX: Double-Confirmation Deletion Item
 * Incorporates glowing warning transition, screen-reader warnings, and self-canceling automatic reset.
 */
const HydrationHistoryItem = memo(({ log, onDelete }) => {
  const [purgeState, setPurgeState] = useState(false);
  const timerRef = useRef(null);

  const triggerDelete = () => {
    if (!purgeState) {
      setPurgeState(true);
      timerRef.current = setTimeout(() => {
        setPurgeState(false);
      }, 3000);
    } else {
      onDelete(log.id);
      if (timerRef.current) clearTimeout(timerRef.current);
      setPurgeState(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={`
        group flex items-center justify-between p-6 rounded-[1.75rem] bg-white/[0.02] border
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${purgeState
          ? 'border-red-500/40 bg-red-950/10 shadow-[0_15px_30px_rgba(239,68,68,0.15)]'
          : 'border-white/5 hover:bg-white/[0.04] hover:border-white/10'
        }
      `}
    >
      <div className="flex items-center gap-6">
        <div
          className={`
            w-2.5 h-2.5 rounded-full transition-all duration-500
            ${purgeState
              ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse'
              : 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse'
            }
          `}
        />
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-serif italic font-medium text-white tracking-tight">{log.amount}</p>
            <p className="text-[0.6rem] font-mono font-bold text-gray-600 uppercase tracking-widest">ml</p>
          </div>
          <p className="text-[0.6rem] font-mono font-bold text-gray-500 uppercase tracking-[0.2em]">{log.time}</p>
        </div>
      </div>

      <button
        onClick={triggerDelete}
        className={`
          p-3.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer
          ${purgeState
            ? 'text-red-500 bg-red-500/15 border border-red-500/30 shadow-[0_4px_12px_rgba(239,68,68,0.2)] scale-105'
            : 'text-gray-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500'
          }
        `}
        aria-label={purgeState ? `Confirm deletion of ${log.amount} milliliters entry` : `Delete hydration entry`}
      >
        {purgeState ? (
          <>
            <AlertTriangle size={14} className="animate-bounce" />
            <span aria-live="assertive">PURGE?</span>
          </>
        ) : (
          <Trash2 size={16} />
        )}
      </button>
    </div>
  );
});

HydrationHistoryItem.displayName = "HydrationHistoryItem";

const WaterTracker = () => {
  const { updateItem, getItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customAmount, setCustomAmount] = useState('');
  const dailyGoal = 2000;

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced useStorageKey with useStorageKeySelector for granular data subscription.
   * Subscribes only to the specific date being viewed and the relevant history window.
   */
  const dailyLogs = useStorageKeySelector(
    'water_log',
    useCallback((logs) => (logs || {})[date] || [], [date])
  );

  const todayTotal = useStorageKeySelector(
    'water_history',
    useCallback((history) => (history || {})[date] || 0, [date])
  );

  const waterHistory = useStorageKeySelector(
    'water_history',
    useCallback((history) => {
      return Object.entries(history || {})
        .slice(-30)
        .map(([d, amount]) => ({
          date: getFastShortDate(d),
          water: amount,
        }));
    }, [])
  );

  useEffect(() => {
    document.title = 'VORO | Hydration Flow Synthesis';
  }, []);

  const addWater = async (amount) => {
    const { valid, errors } = validateWaterEntry({ amount, date });

    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const newLog = {
      id: `${Date.now()}`,
      amount,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    /**
     * ⚡ OPTIMIZATION: Use updateItem for surgical key-level updates.
     * Reduces the complexity of reading and spreading entire log objects.
     */
    const updatedLogs = [...dailyLogs, newLog];

    const history = getItem('water_history') || {};
    const newTotal = (history[date] || 0) + amount;

    await updateItem('water_log', { [date]: updatedLogs });
    await updateItem('water_history', { [date]: newTotal });

    if (newTotal >= dailyGoal && (newTotal - amount) < dailyGoal) {
      addNotification('Hydration threshold achieved. Cellular homeostasis optimized.', 'success');
    }
  };

  const deleteLog = useCallback(async (id) => {
    const logToDelete = dailyLogs.find(l => l.id === id);
    if (!logToDelete) return;

    const updatedLogs = dailyLogs.filter(log => log.id !== id);
    const history = getItem('water_history') || {};
    const newTotal = Math.max(0, (history[date] || 0) - logToDelete.amount);

    await updateItem('water_log', { [date]: updatedLogs });
    await updateItem('water_history', { [date]: newTotal });
    addNotification('Hydration dynamic entry purged.', 'info');
  }, [dailyLogs, date, getItem, updateItem, addNotification]);

  const handleDateChange = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split('T')[0]);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const amt = parseInt(customAmount, 10);
    if (!amt || isNaN(amt) || amt <= 0 || amt > 5000) {
      addNotification('Please enter a valid volume between 1ml and 5000ml.', 'error');
      return;
    }
    addWater(amt);
    setCustomAmount('');
  };

  const percentage = Math.min((todayTotal / dailyGoal) * 100, 100);
  const formattedDate = longDateFormatter.format(new Date(date));

  // Clinical-grade real-time status indicators based on physiological water balance
  const biologicalState = useMemo(() => {
    if (percentage < 25) return 'Intracellular Hypohydration';
    if (percentage < 55) return 'Systemic Plasma Restoration';
    if (percentage < 90) return 'Functional Cellular Hydration';
    if (percentage < 100) return 'Optimal Homeostatic Equilibrium';
    return 'Full Cellular Super-Saturation';
  }, [percentage]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-blue-500/30">
      {/* Premium Ambient Background Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-12 z-10">
        <Breadcrumb
          items={[
            { label: 'System', href: '/dashboard' },
            { label: 'Metabolic Matrix', href: '/nutrition/diary' },
            { label: 'Aqueous Flow Synthesis' }
          ]}
          className="mb-12"
        />

        <Header
          eyebrow="Aqueous Flow Synthesis // Node 0x04"
          title={<>Hydration <span className="text-voro-primary not-italic font-bold">Dynamics</span></>}
          subtitle="CELLULAR HOMEOSTASIS & METABOLIC SWEEP FLUID GATEWAY"
          action={
            <div className="flex items-center gap-6 bg-[#0A0C14]/90 border border-white/5 rounded-[2.5rem] p-3 shadow-2xl backdrop-blur-3xl">
              <button
                onClick={() => handleDateChange(-1)}
                className="p-4 hover:bg-white/5 rounded-[1.75rem] text-gray-500 hover:text-white transition-all active:scale-90 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 outline-none cursor-pointer"
                aria-label="Previous chronological index"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-6 text-center min-w-[150px]">
                <p className="text-[0.55rem] font-mono font-black uppercase tracking-[0.4em] text-gray-600 mb-1">Temporal Index</p>
                <p className="text-sm font-serif italic font-bold text-white uppercase tracking-wider">{formattedDate}</p>
              </div>
              <button
                onClick={() => handleDateChange(1)}
                className="p-4 hover:bg-white/5 rounded-[1.75rem] text-gray-500 hover:text-white transition-all active:scale-90 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 outline-none cursor-pointer"
                aria-label="Next chronological index"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Hydration Volumetric Core */}
          <div className="lg:col-span-5 space-y-12">
            <div className="relative pt-6">
              <HydroVessel percentage={percentage} biologicalState={biologicalState} nodeId="VESSEL_NODE" />

              <div className="mt-12 text-center space-y-3">
                <p className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em]">Current Saturation</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-8xl font-serif italic font-medium text-white tracking-tighter leading-none">{todayTotal}</span>
                  <span className="text-sm font-mono font-semibold text-blue-500 uppercase tracking-[0.2em]">/ {dailyGoal} ml</span>
                </div>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[0.6rem] font-bold text-blue-400 uppercase tracking-[0.15em] shadow-[0_4px_12px_rgba(59,130,246,0.15)]">
                  <Waves size={14} className="animate-pulse" />
                  {Math.round(percentage)}% Aqueous Limit
                </div>
                <p className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.25em] mt-3 animate-pulse">
                  State: <span className="text-blue-400">{biologicalState}</span>
                </p>
              </div>
            </div>

            {/* Catalyst Injections (Preset volumes) */}
            <div className="space-y-4">
              <p className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Molecular Catalysts</p>
              <div className="grid grid-cols-2 gap-4">
                {[250, 500, 750, 1000].map(amt => (
                  <CatalystCard key={amt} amount={amt} onAdd={addWater} />
                ))}
              </div>
            </div>

            {/* Manual Fluid Entry Port */}
            <Card variant="premium" nodeId="CUSTOM_ENTRY" className="p-8 shadow-2xl transition-all hover:border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Plus size={18} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-white mb-0.5">Custom Volumetric Entry</h3>
                  <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest">Manual Fluid Entry Gateway</p>
                </div>
              </div>

              <form onSubmit={handleCustomSubmit} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    type="number"
                    min="1"
                    max="5000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Volume intake quantity"
                    label="Volume Magnitude (ml)"
                    className="italic font-serif"
                  />
                </div>
                <Button type="submit" size="sm" className="h-[62px] rounded-[1.25rem] px-8 flex-shrink-0 !bg-white !text-black shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98]">
                  Inject
                </Button>
              </form>
            </Card>
          </div>

          {/* History & Chronological Sequence */}
          <div className="lg:col-span-7 space-y-12">
            <Card variant="premium" nodeId="CHRONO_LOG" className="p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/[0.02] rounded-full blur-[100px] pointer-events-none" />

              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <Target size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-white mb-1">Fluid Chronology</h3>
                    <p className="text-sm font-serif italic text-gray-500 tracking-wider">Dynamic Molecular Sequence Logs</p>
                  </div>
                </div>
              </div>

              {dailyLogs.length > 0 ? (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 no-scrollbar">
                  {dailyLogs.map((log) => (
                    <HydrationHistoryItem key={log.id} log={log} onDelete={deleteLog} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center group/void">
                  <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 group-hover/void:border-blue-500/30 transition-all duration-700">
                    <Zap size={28} className="text-gray-800 group-hover/void:text-blue-500/50 transition-all duration-700" />
                  </div>
                  <p className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">Fluid Void Detected</p>
                  <p className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest mt-2">Awaiting biological molecular initialization</p>
                </div>
              )}
            </Card>

            {/* 30-Day Molecular Trend Analyzer */}
            {waterHistory.length > 1 && (
              <Card variant="premium" nodeId="SHIFT_MATRIX" className="p-10 shadow-2xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <TrendingUp size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-white mb-1">Molecular Shift Matrix</h3>
                    <p className="text-sm font-serif italic text-gray-500 tracking-wider">30D Kinetic Trend Spectrum</p>
                  </div>
                </div>
                <div className="h-[300px] w-full px-2">
                  <LineChartComponent
                    data={waterHistory}
                    dataKey="water"
                    name="Hydration"
                    color="#3B82F6"
                    height={300}
                    strokeWidth={3}
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
