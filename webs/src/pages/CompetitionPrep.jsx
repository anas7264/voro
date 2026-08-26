import React, { useEffect, useState, useMemo, useRef, memo, useId } from 'react';
import { Calendar, Trophy, Clock, CheckCircle2, Zap, Target, TrendingDown, Sparkles, ShieldAlert, Cpu, Activity, Compass } from 'lucide-react';
import { Card, Button, Divider, DatePicker } from '@/components';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { isDateInFuture } from '@/utils/validators';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters & static datasets.
 * Prevents redundant object instantiation of Intl.DateTimeFormat & static arrays in loops.
 */
const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

const DEFAULT_COMP_DATA = Object.freeze({
  date: null,
  phase: 'Preparation',
  protocols: [],
  checklist: []
});

const selectCompData = (val) => val || DEFAULT_COMP_DATA;

const CHECKLIST_ITEMS = Object.freeze([
  'Synthesize light energy source 3h prior',
  'Execute neural warm-up protocol',
  'Perform cognitive visualization matrix',
  'Ensure optimal hydration saturation'
]);

const PROTOCOLS_LIST = Object.freeze([
  { title: 'Volume Reduction Matrix', desc: 'Surgically attenuate sets by 40% while maintaining absolute intensity.', icon: TrendingDown, color: 'text-voro-primary' },
  { title: 'Carbohydrate Saturation', desc: 'Initiate complex glucose loading 72h prior to event manifest.', icon: Zap, color: 'text-voro-accent' },
  { title: 'Sodium & Fluid Modulation', desc: 'Strategic mineral titration to optimize subcutaneous definition.', icon: Target, color: 'text-voro-secondary' }
]);

/**
 * ⚡ SUBCOMPONENT: ChronoTicker
 * Active sub-second countdown clock ticker rendering Hours, Minutes, and Seconds.
 * Bypasses full parent reconciliation by being an encapsulated state-driven node.
 */
const ChronoTicker = memo(({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateTicker = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div className="flex gap-4 items-center justify-center font-mono text-xl md:text-2xl font-bold tracking-widest text-voro-primary/90 mt-6 bg-white/[0.02] border border-white/5 py-3 px-6 rounded-2xl select-none">
      <div className="text-center">
        <span className="text-white block text-2xl md:text-3xl tracking-tight leading-none">{pad(timeLeft.hours)}</span>
        <span className="text-[0.45rem] font-black text-gray-500 uppercase tracking-[0.2em]">HRS</span>
      </div>
      <span className="text-voro-primary/40 animate-pulse">:</span>
      <div className="text-center">
        <span className="text-white block text-2xl md:text-3xl tracking-tight leading-none">{pad(timeLeft.minutes)}</span>
        <span className="text-[0.45rem] font-black text-gray-500 uppercase tracking-[0.2em]">MIN</span>
      </div>
      <span className="text-voro-primary/40 animate-pulse">:</span>
      <div className="text-center">
        <span className="text-white block text-2xl md:text-3xl tracking-tight leading-none">{pad(timeLeft.seconds)}</span>
        <span className="text-[0.45rem] font-black text-gray-500 uppercase tracking-[0.2em]">SEC</span>
      </div>
    </div>
  );
});

ChronoTicker.displayName = "ChronoTicker";

/**
 * ⚡ SUBCOMPONENT: ProtocolCard
 * Implements 60fps direct-DOM 3D Volumetric Hover Tilts,
 * dynamic luminous lens spotlighting, reactive liquid border illumination,
 * static 4-degree keyboard focus tilts, and ARIA polite live announcements.
 */
const ProtocolCard = memo(({ title, desc, icon: Icon, color, nodeId, index }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 15 degrees)
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
    setAnnouncement(`Protocol Card: ${title}. ${desc}. Currently focused.`);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setAnnouncement('');
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <>
      {announcement && (
        <div className="sr-only" aria-live="polite">
          {announcement}
        </div>
      )}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex="0"
        role="article"
        aria-label={`Protocol Card: ${title}. ${desc}`}
        style={{
          transform: interactionActive
            ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
            : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d'
        }}
        className="relative bg-[#0A0C14] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden group cursor-pointer transition-all duration-700 hover:border-voro-primary/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]"
      >
        {/* Precision Grid & Grain Architecture */}
        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

          {/* Dynamic Luminous Lens Spotlight */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.12), transparent 70%)`,
              transform: 'translateZ(20px)'
            }}
          />
        </div>

        {/* Reactive Liquid Perimeter Lighting */}
        <div
          className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            padding: '1px',
            background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.4), transparent 80%)`,
            WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Coordinate Telemetry Overlay */}
        <div
          className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 z-30"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
            <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
            <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
            <span className="text-white/20">[{nodeId}]</span>
          </div>
        </div>

        <div className="flex gap-8 relative z-10" style={{ transform: 'translateZ(40px)' }}>
          <div className={`mt-1 p-4 rounded-2xl bg-white/[0.02] border border-white/5 ${color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <Icon size={24} />
          </div>
          <div className="space-y-3 flex-1">
            <h4 className="text-2xl font-serif italic font-bold text-white tracking-tight group-hover:text-voro-primary transition-colors duration-500">{title}</h4>
            <p className="text-base text-gray-500 leading-relaxed font-medium tracking-tight">{desc}</p>
          </div>
        </div>

        <div className="absolute bottom-4 right-6 pointer-events-none font-mono text-[0.45rem] font-black text-white/10 uppercase tracking-[0.2em] group-hover:text-voro-primary/30 transition-colors select-none">
          CTRL_SYS // 0x0{index + 1}
        </div>
      </div>
    </>
  );
});

ProtocolCard.displayName = "ProtocolCard";

/**
 * ⚡ SUBCOMPONENT: ChronoChecklistButton
 * Glassmorphic interactive checkbox conforming to luxury tactile guidelines.
 */
const ChronoChecklistButton = memo(({ item, isChecked, onToggle, index }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <button
      onClick={() => onToggle(index)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`w-full flex items-center justify-between group/item text-left p-6 rounded-2xl border transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/85 ${
        isChecked
          ? 'bg-voro-secondary/[0.01] border-voro-secondary/20'
          : 'bg-white/[0.01] border-white/5 hover:border-white/10'
      }`}
      style={isFocused ? {
        transform: 'perspective(1200px) rotateX(2deg) rotateY(-2deg) translateY(-2px)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      } : undefined}
    >
      <div className="flex items-center gap-6">
        <div className={`
          w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-700 relative overflow-hidden
          ${isChecked
            ? 'bg-voro-secondary border-voro-secondary shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            : 'bg-white/5 border-white/10 group-hover/item:border-voro-secondary/50'}
        `}>
          {isChecked && <CheckCircle2 size={16} className="text-black relative z-10" />}
          <div className={`absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent transition-opacity duration-500 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        <span className={`
          text-lg font-medium tracking-tight transition-all duration-700
          ${isChecked ? 'text-gray-600 line-through' : 'text-gray-200 group-hover/item:text-white'}
        `}>
          {item}
        </span>
      </div>
      <div className={`
        w-2.5 h-2.5 rounded-full transition-all duration-700
        ${isChecked ? 'bg-voro-secondary scale-125 opacity-100' : 'bg-white/5 opacity-0 group-hover/item:opacity-100'}
      `} />
    </button>
  );
});

ChronoChecklistButton.displayName = "ChronoChecklistButton";

/**
 * ⚡ SUBCOMPONENT: ChronosNode
 * The primary countdown and protocol telemetry control board.
 * Refactored with 60fps 3D volumetric hover tilt tracking, coordinate telemetry,
 * and static 4-degree keyboard focus tilts.
 */
const ChronosNode = memo(({ daysUntilComp, targetDate, activePhase, onDeleteTrigger, isDecommissioning, decommissionCount }) => {
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
      aria-label={`Chronos Countdown Control Board. T-Minus ${daysUntilComp} days until competition target on ${targetDate}`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative bg-[#0A0C14] border border-white/5 rounded-[3rem] p-12 md:p-16 overflow-hidden shadow-2xl shadow-black/60 outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] group"
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens Spotlight */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.12), transparent 70%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-8 right-10 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 z-30"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[CHRONOS_S_01]</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-voro-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-voro-primary/15 transition-colors duration-1000 pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-20 items-center z-10" style={{ transform: 'translateZ(40px)' }}>
        <div className="lg:col-span-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-16 lg:pb-0 lg:pr-20">
          <div className="relative">
            <div className="w-72 h-72 rounded-full border border-white/5 flex items-center justify-center bg-black/40 backdrop-blur-2xl shadow-[0_0_100px_rgba(124,58,237,0.15)]">
              <div className="text-center relative z-10">
                <p className="text-[0.65rem] font-mono font-medium text-gray-500 uppercase tracking-[0.5em] mb-3 select-none">T-Minus</p>
                <p className="text-[10rem] font-serif italic font-bold text-white leading-none tracking-tighter">{daysUntilComp}</p>
                <p className="text-[0.65rem] font-black text-voro-primary uppercase tracking-[0.5em] mt-3 select-none">Days</p>
              </div>
            </div>
            {/* Kinetic Orbits - Mathematical Motion */}
            <div className="absolute inset-[-20px] rounded-full border border-dashed border-voro-primary/20 animate-[spin_30s_linear_infinite] pointer-events-none" />
            <div className="absolute inset-[-40px] rounded-full border border-dashed border-voro-secondary/10 animate-[spin_45s_linear_infinite_reverse] pointer-events-none" />
            <div className="absolute inset-[-60px] rounded-full border border-white/5 opacity-50 pointer-events-none" />
          </div>

          <ChronoTicker targetDate={targetDate} />
        </div>

        <div className="lg:col-span-7 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-[0.65rem] font-mono font-medium text-gray-600 uppercase tracking-[0.4em]">Current Phase</h3>
              <p className="text-5xl font-serif italic font-medium text-white tracking-tight">
                Peak Protocol <span className="text-voro-secondary not-italic font-sans font-black text-[0.6rem] uppercase tracking-widest ml-3 bg-voro-secondary/10 px-3 py-1.5 rounded-full border border-voro-secondary/20 inline-block align-middle">Active</span>
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-[0.65rem] font-mono font-medium text-gray-600 uppercase tracking-[0.4em]">Target Event</h3>
              <p className="text-2xl font-mono font-bold text-white tracking-[0.2em] leading-tight">
                {longDateFormatter.format(new Date(targetDate)).toUpperCase()}
              </p>
            </div>
          </div>

          <Divider className="opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-3">
                <p className="text-[0.6rem] font-mono font-medium text-gray-600 uppercase tracking-[0.3em]">Volume Attenuation</p>
                <p className="text-4xl font-serif italic font-bold text-voro-primary tracking-tighter">-40%</p>
              </div>
              <div className="space-y-3">
                <p className="text-[0.6rem] font-mono font-medium text-gray-600 uppercase tracking-[0.3em]">Metabolic Loading</p>
                <p className="text-4xl font-serif italic font-bold text-voro-accent tracking-tighter">High</p>
              </div>
            </div>

            <div className="flex justify-end pt-6 md:pt-0">
              <button
                onClick={onDeleteTrigger}
                className={`flex items-center gap-3 px-8 py-4 border rounded-2xl transition-all duration-500 font-mono text-[0.65rem] tracking-[0.2em] uppercase font-black outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                  isDecommissioning
                    ? 'bg-red-500/20 border-red-500/45 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    : 'bg-[#0F121F]/60 border-white/5 text-gray-400 hover:border-red-500/30 hover:text-red-400'
                }`}
              >
                <ShieldAlert size={14} className={isDecommissioning ? 'animate-bounce text-red-400' : ''} />
                <span>{isDecommissioning ? `PURGE IN ${decommissionCount}S?` : 'Decommission Protocol'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChronosNode.displayName = "ChronosNode";

/**
 * ⚡ SUBCOMPONENT: TemporalSingularityAlignmentDeck
 * High-end cinematic visual deck when no manifest is active.
 */
const TemporalSingularityAlignmentDeck = memo(({ onInitiateClick }) => {
  return (
    <section className="py-24 md:py-32 flex flex-col items-center justify-center text-center animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-voro-primary/5 animate-[spin_60s_linear_infinite]" />
        <div className="w-[400px] h-[400px] rounded-full border border-dashed border-voro-secondary/5 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="w-[300px] h-[300px] rounded-full border border-white/[0.02]" />
      </div>

      <div className="relative mb-16 group">
        <div className="w-56 h-56 rounded-full bg-[#0A0C14]/40 backdrop-blur-md border border-white/5 flex items-center justify-center shadow-inner group-hover:border-voro-primary/20 transition-colors duration-700">
           <Trophy size={64} className="text-gray-700 group-hover:text-voro-primary/60 group-hover:scale-110 transition-all duration-700 animate-pulse" />
        </div>
        <div className="absolute inset-[-10px] rounded-full border border-voro-primary/20 animate-pulse pointer-events-none" />
        <div className="absolute inset-[-20px] rounded-full border border-voro-primary/10 animate-pulse delay-700 pointer-events-none" />
      </div>

      <div className="max-w-2xl space-y-8 relative z-10 px-6">
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-voro-primary animate-pulse" />
          <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-voro-primary/80">Temporal Alignment Required</span>
          <Sparkles size={14} className="text-voro-primary animate-pulse" />
        </div>
        <h3 className="text-4xl md:text-6xl font-serif italic font-bold text-white tracking-tight leading-tight">
          No Manifest Scheduled
        </h3>
        <p className="text-lg text-gray-500 font-medium leading-relaxed tracking-tight max-w-lg mx-auto">
          Your biological peak requires a temporal target. Define your competition date to initiate the high-fidelity refinement protocols.
        </p>
        <div className="pt-6">
          <Button
            onClick={onInitiateClick}
            className="px-16 py-6 rounded-full shadow-2xl shadow-voro-primary/30 text-[0.7rem] font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 hover:shadow-voro-primary/40 transition-all duration-500"
          >
            Initiate Manifest Protocol
          </Button>
        </div>
      </div>
    </section>
  );
});

TemporalSingularityAlignmentDeck.displayName = "TemporalSingularityAlignmentDeck";

/**
 * ⚡ MAIN COMPONENT: CompetitionPrep
 * The ultimate 'Peak Performance Manifest & Temporal Singularity Protocol' view.
 */
const CompetitionPrep = () => {
  const primaryCompData = useStorageKeySelector('competition', selectCompData);
  const legacyCompetitionData = useStorageKeySelector('voro_comp_prep', selectCompData);
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newDate, setNewDate] = useState('');

  // Decommission safeguard states
  const [isDecommissioning, setIsDecommissioning] = useState(false);
  const [decommissionCount, setDecommissionCount] = useState(3);
  const decommissionTimerRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Peak Performance Manifest';
    return () => {
      if (decommissionTimerRef.current) {
        clearInterval(decommissionTimerRef.current);
      }
    };
  }, []);

  const compData = useMemo(() => {
    if (primaryCompData && primaryCompData.date) return primaryCompData;
    if (legacyCompetitionData && legacyCompetitionData.date) return legacyCompetitionData;
    return primaryCompData || legacyCompetitionData || DEFAULT_COMP_DATA;
  }, [primaryCompData, legacyCompetitionData]);

  const daysUntilComp = useMemo(() => {
    if (!compData.date) return null;
    const diffTime = new Date(compData.date) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [compData.date]);

  const handleSetDate = async () => {
    if (!newDate) return;
    if (!isDateInFuture(newDate)) {
      addNotification('Manifestation must be scheduled in the future.', 'error');
      return;
    }

    await setItem('competition', { ...compData, date: newDate });
    setShowDatePicker(false);
    addNotification('Competition timeline synchronized.', 'success');
  };

  const handleDecommissionTrigger = async () => {
    if (isDecommissioning) {
      clearInterval(decommissionTimerRef.current);
      setIsDecommissioning(false);
      setDecommissionCount(3);

      await setItem('competition', {
        date: null,
        phase: 'Preparation',
        protocols: [],
        checklist: []
      });
      addNotification('Peak performance manifest decommissioned.', 'info');
    } else {
      setIsDecommissioning(true);
      setDecommissionCount(3);

      let count = 3;
      decommissionTimerRef.current = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          clearInterval(decommissionTimerRef.current);
          setIsDecommissioning(false);
          setDecommissionCount(3);
        } else {
          setDecommissionCount(count);
        }
      }, 1000);
    }
  };

  const handleToggleChecklist = async (itemIndex) => {
    const updatedChecklist = [...(compData.checklist || [])];
    if (updatedChecklist.includes(itemIndex)) {
      const index = updatedChecklist.indexOf(itemIndex);
      updatedChecklist.splice(index, 1);
    } else {
      updatedChecklist.push(itemIndex);
    }
    await setItem('competition', { ...compData, checklist: updatedChecklist });
  };

  const checklistItems = CHECKLIST_ITEMS;
  const protocolsList = PROTOCOLS_LIST;

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24 relative overflow-hidden bg-boutique-grain">
      {/* Cinematic Ambient Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Trophy size={18} />
              <span className="text-[0.6rem] font-mono font-medium uppercase tracking-[0.4em]">Peak Manifest Matrix</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-[1.1]">
              Competition <span className="text-voro-primary not-italic font-bold">Manifest</span>
            </h1>
            <p className="text-gray-500 font-mono font-medium tracking-[0.3em] text-[0.65rem] uppercase opacity-60">
              Architectural preparation for biological dominance
            </p>
          </div>

          <div className="flex gap-4">
             <Button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="px-10 py-5 bg-[#0A0C14] border border-white/5 rounded-2xl shadow-2xl flex items-center gap-3 transition-all hover:border-voro-primary/30 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
              >
                <Calendar size={18} className="text-voro-primary" />
                <span className="text-[0.65rem] font-black uppercase tracking-[0.4em]">{showDatePicker ? 'Close Controller' : 'Adjust Timeline'}</span>
             </Button>
          </div>
        </header>

        {showDatePicker && (
          <section className="mb-20 animate-slide-up">
            <Card className="p-12 border-voro-primary/20 bg-voro-primary/5 backdrop-blur-3xl">
              <div className="flex flex-col md:flex-row items-end gap-8">
                <div className="flex-1">
                  <DatePicker
                    label="Temporal Target"
                    value={newDate}
                    onChange={(date) => setNewDate(date)}
                    className="bg-black/40 border-white/10"
                  />
                </div>
                <Button onClick={handleSetDate} className="px-14 h-[60px] text-[0.65rem] font-black tracking-[0.3em]">Synchronize</Button>
                <Button variant="secondary" onClick={() => setShowDatePicker(false)} className="px-10 h-[60px] text-[0.65rem] font-black tracking-[0.3em]">Abort</Button>
              </div>
            </Card>
          </section>
        )}

        {daysUntilComp !== null ? (
          <div className="space-y-24">
            {/* Chronos Node Countdown Component */}
            <ChronosNode
              daysUntilComp={daysUntilComp}
              targetDate={compData.date}
              activePhase={compData.phase}
              onDeleteTrigger={handleDecommissionTrigger}
              isDecommissioning={isDecommissioning}
              decommissionCount={decommissionCount}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Left Column: Peak Protocols Matrix */}
              <section className="lg:col-span-6 space-y-12">
                <div className="flex items-center gap-8">
                  <h2 className="text-[0.7rem] font-black uppercase tracking-[0.6em] text-gray-600 whitespace-nowrap">
                    Peak Protocols
                  </h2>
                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="space-y-8">
                  {protocolsList.map((protocol, i) => (
                    <ProtocolCard
                      key={i}
                      title={protocol.title}
                      desc={protocol.desc}
                      icon={protocol.icon}
                      color={protocol.color}
                      nodeId={`PROT_0${i + 1}`}
                      index={i}
                    />
                  ))}
                </div>
              </section>

              {/* Right Column: Final Checklist & Telemetry Panel */}
              <section className="lg:col-span-6 space-y-12">
                <div className="flex items-center gap-8">
                  <h2 className="text-[0.7rem] font-black uppercase tracking-[0.6em] text-gray-600 whitespace-nowrap">
                    Final Checklist
                  </h2>
                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <Card className="p-12 bg-gradient-to-br from-[#0A0C14] to-black border-white/5">
                  <div className="space-y-10">
                    {checklistItems.map((item, i) => (
                      <ChronoChecklistButton
                        key={i}
                        item={item}
                        isChecked={compData.checklist?.includes(i)}
                        onToggle={handleToggleChecklist}
                        index={i}
                      />
                    ))}
                  </div>
                </Card>

                <div className="p-10 rounded-[3rem] border border-dashed border-white/5 bg-white/[0.01] text-center select-none">
                  <Clock size={32} className="mx-auto mb-6 text-gray-700 opacity-50 animate-pulse" />
                  <p className="text-[0.65rem] font-mono font-medium text-gray-600 uppercase tracking-[0.4em]">All protocols optimized for peak state</p>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <TemporalSingularityAlignmentDeck onInitiateClick={() => setShowDatePicker(true)} />
        )}
      </div>
    </div>
  );
};

export default CompetitionPrep;
