import React, { useEffect, useState, useMemo, useRef, useCallback, memo, useId } from 'react';
import { Play, Pause, RotateCcw, Clock, Zap, Target, Activity, ShieldCheck, Flame, ShieldAlert, Sparkles, Brain, RefreshCw } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PROTOCOL OPTIONS: Hoisted metadata.
 * Module-level frozen constants for elite performance and zero-allocation.
 */
const WINDOW_OPTIONS = Object.freeze([
  { id: '16:8', label: '16:8 Intermittent', desc: 'Optimal Intermittent Efficiency & Growth Hormone boost', fastHours: 16, breakHours: 8 },
  { id: '18:6', label: '18:6 Advanced', desc: 'Enhanced Autophagy Sequence & cellular recycling', fastHours: 18, breakHours: 6 },
  { id: '20:4', label: '20:4 Warrior', desc: 'Decongested eating phase & heightened lipid oxidation', fastHours: 20, breakHours: 4 },
  { id: '23:1', label: '23:1 OMAD', desc: 'One Meal A Day peak therapeutic performance', fastHours: 23, breakHours: 1 },
]);

/**
 * ⚡ REFINEMENT: MetabolicChronometer re-engineered as an elite luxury standard instrument.
 * Architected to the 'Forge' luxury standard with 3D volumetric transforms,
 * magnetic mouse tracking, holographic telemetry, and multi-layered parallax depth.
 * Implements 'Surgical Reactivity' via direct DOM manipulation for 60fps performance.
 */
const MetabolicChronometer = memo(({ progress, hours, minutes, seconds, isActive }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const reactId = useId();

  const nodeId = useMemo(() => `CHRONO_NODE_${reactId.replace(/:/g, '').slice(0, 4)}`, [reactId]);

  // Dynamic shift colors representing different levels of biological fasting progression
  const metabolicState = useMemo(() => {
    if (progress < 25) {
      return {
        name: "Glycogen Depletion",
        color: "text-amber-500",
        glow: "from-amber-500/25 via-amber-600/10 to-transparent",
        glowColor: "rgba(245, 158, 11, 0.25)",
        border: "border-amber-500/20",
        indicator: "bg-amber-500",
        textGlow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]",
        gradientId: "grad-glycogen",
        colors: ["#F59E0B", "#D97706"]
      };
    } else if (progress < 50) {
      return {
        name: "Lipid Oxidation",
        color: "text-emerald-400",
        glow: "from-emerald-400/25 via-emerald-500/10 to-transparent",
        glowColor: "rgba(52, 211, 153, 0.25)",
        border: "border-emerald-500/20",
        indicator: "bg-emerald-400",
        textGlow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]",
        gradientId: "grad-lipid",
        colors: ["#34D399", "#059669"]
      };
    } else if (progress < 75) {
      return {
        name: "Autophagy Sequence",
        color: "text-indigo-400",
        glow: "from-indigo-400/25 via-indigo-500/10 to-transparent",
        glowColor: "rgba(129, 140, 248, 0.25)",
        border: "border-indigo-500/20",
        indicator: "bg-indigo-400",
        textGlow: "shadow-[0_0_15px_rgba(99,102,241,0.5)]",
        gradientId: "grad-autophagy",
        colors: ["#818CF8", "#4F46E5"]
      };
    } else {
      return {
        name: "Deep Ketosis",
        color: "text-cyan-400",
        glow: "from-cyan-400/30 via-cyan-500/15 to-transparent",
        glowColor: "rgba(34, 211, 238, 0.3)",
        border: "border-cyan-500/20",
        indicator: "bg-cyan-400",
        textGlow: "shadow-[0_0_20px_rgba(6,182,212,0.6)]",
        gradientId: "grad-ketosis",
        colors: ["#22D3EE", "#0891B2"]
      };
    }
  }, [progress]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 24 degrees)
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

  const ticks = useMemo(() => Array.from({ length: 60 }).map((_, i) => (
    <rect
      key={i}
      x="127.5"
      y="12"
      width="1"
      height={i % 5 === 0 ? "10" : "4"}
      fill={i % 5 === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}
      transform={`rotate(${i * 6}, 128, 128)`}
      className="transition-all duration-700"
    />
  )), []);

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
      aria-label={`Metabolic Chronometer. Phase: ${metabolicState.name}. Phase progress: ${Math.round(progress)}%. Time: ${hours} hours, ${minutes} minutes, ${seconds} seconds.`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative w-80 h-80 mx-auto group outline-none rounded-full cursor-pointer
        focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
      `}
    >
      {/* Outer Glow Ring - Dynamic Color Shift & Ambient Auroral Backglow */}
      <div
        className={`absolute inset-[-15px] rounded-full transition-all duration-[1500ms] blur-3xl opacity-30 ${isActive ? 'animate-pulse-slow' : 'opacity-10 bg-white/5'}`}
        style={{
          background: `radial-gradient(circle, ${metabolicState.glowColor} 0%, transparent 70%)`,
          transform: 'translateZ(-20px)'
        }}
      />

      {/* Kinetic Outer Concentric Ring - Orbiting ticks */}
      <div
        className="absolute inset-[-12px] rounded-full border border-dashed border-white/5 pointer-events-none animate-orbit-clockwise opacity-40 group-hover:opacity-100 transition-opacity duration-1000"
        style={{ transform: 'translateZ(-10px)' }}
      />

      {/* Kinetic Inner Concentric Ring - Reverse Orbiting Telemetry */}
      <div
        className="absolute inset-[10px] rounded-full border border-dashed border-white/[0.03] pointer-events-none animate-orbit-counter opacity-30 group-hover:opacity-80 transition-opacity duration-1000"
        style={{ transform: 'translateZ(-5px)' }}
      />

      {/* Orbiting Tech Beacon (LED dot circling the dial) */}
      <div
        className="absolute inset-[-12px] rounded-full pointer-events-none animate-orbit-clockwise"
        style={{ transform: 'translateZ(10px)' }}
      >
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-colors duration-1000 shadow-[0_0_10px_currentColor] ${metabolicState.color}`}
        />
      </div>

      {/* Background Glass Plate */}
      <div
        className="absolute inset-0 rounded-full bg-[#0A0C14]/75 backdrop-blur-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05)]"
        style={{ transform: 'translateZ(0px)' }}
      />

      {/* Precision Grid & Grain Overlay */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none" style={{ transform: 'translateZ(5px)' }}>
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-15 transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.03]" />

        {/* Dynamic Luminous Lens with Shifting Phase Palette */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-700"
          style={{
            background: isHovered
              ? `radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${metabolicState.glowColor}, transparent 80%)`
              : `radial-gradient(150px circle at 50% 50%, ${metabolicState.glowColor}, transparent 80%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Holographic Coordinate Telemetry */}
      <div
        className="absolute top-10 right-14 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold tracking-[0.2em] space-y-0.5">
          <span className={metabolicState.color}>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span className={metabolicState.color}>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Metabolic Aura (Radial Pulse matching current biological phase) */}
      <div
        className={`absolute inset-10 rounded-full transition-all duration-[1500ms] ease-in-out ${
          isActive
            ? `bg-gradient-radial ${metabolicState.glow} animate-pulse-slow opacity-100`
            : "opacity-0"
        }`}
        style={{ transform: 'translateZ(15px)' }}
      />

      {/* Clock Dial & SVG Elements (Mid Z-depth) */}
      <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(35px)' }}>
        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 256 256">
          <defs>
            <linearGradient id={metabolicState.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={metabolicState.colors[0]} />
              <stop offset="100%" stopColor={metabolicState.colors[1]} />
            </linearGradient>
            <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Static Precision Ticks */}
          {ticks}

          {/* Track Ring */}
          <circle
            cx="128"
            cy="128"
            r="108"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            fill="none"
          />

          {/* Active Progress Ring - Multi-colored gradient based on state */}
          <circle
            cx="128"
            cy="128"
            r="108"
            stroke={`url(#${metabolicState.gradientId})`}
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 108}`}
            strokeDashoffset={`${2 * Math.PI * 108 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            filter="url(#ring-glow)"
          />
        </svg>
      </div>

      {/* Central Time Core (Highest Z-depth) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none" style={{ transform: 'translateZ(70px)' }}>
        <p className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-[0.4em] mb-1">Metabolic Phase</p>
        <p className={`text-[0.65rem] font-serif italic tracking-[0.1em] font-medium transition-colors duration-1000 mb-3 ${metabolicState.color}`}>
          {metabolicState.name}
        </p>

        <div className="flex items-baseline gap-1">
          <div className="text-6xl font-serif italic font-medium text-white tracking-tighter">
            {String(hours).padStart(2, '0')}
          </div>
          <div className="text-4xl font-serif italic font-light text-white/20">:</div>
          <div className="text-6xl font-serif italic font-medium text-white tracking-tighter">
            {String(minutes).padStart(2, '0')}
          </div>
          <div className="ml-2 w-8 text-xl font-mono font-bold tabular-nums transition-colors duration-1000" style={{ color: metabolicState.colors[0] }}>
            {String(seconds).padStart(2, '0')}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
           <div className={`w-1.5 h-1.5 rounded-full transition-all duration-1000 ${isActive ? `${metabolicState.indicator} animate-pulse` : 'bg-gray-700'}`} />
           <span className="text-[0.55rem] font-black text-gray-400 uppercase tracking-[0.3em]">
             {Math.round(progress)}% Optimized
           </span>
        </div>
      </div>
    </div>
  );
});

MetabolicChronometer.displayName = 'MetabolicChronometer';

/**
 * ⚡ SUBCOMPONENT: Custom Luxury Window Card
 * Tactile glassmorphic selector button matching the "Forge" standard.
 */
const WindowCard = memo(({ option, isSelected, onClick }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt
    const tiltY = ((x / rect.width) - 0.5) * 12;
    const tiltX = (0.5 - (y / rect.height)) * 12;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cardRef.current) {
      // 4-degree static tilt on focus
      cardRef.current.style.setProperty('--tilt-x', '4deg');
      cardRef.current.style.setProperty('--tilt-y', '-4deg');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <button
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      aria-pressed={isSelected}
      style={{
        transform: interactionActive
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-3px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative p-6 rounded-[2rem] border text-left outline-none transition-all duration-500 overflow-hidden w-full group
        focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        ${isSelected
          ? 'bg-[#0D121F]/80 border-voro-primary/30 shadow-[0_20px_45px_rgba(124,58,237,0.12)]'
          : 'bg-[#0A0C14]/30 border-white/[0.03] hover:border-white/10 hover:bg-[#0A0C14]/50'
        }
      `}
    >
      <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

      {/* Luminous laser spot */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(120px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 80%)`
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[0.55rem] font-black uppercase tracking-[0.3em] text-gray-500">
            Window Configuration
          </span>
          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.8)] animate-pulse' : 'bg-gray-800'}`} />
        </div>

        <div>
          <h4 className="text-xl font-serif italic font-medium tracking-tight text-white group-hover:text-voro-primary transition-colors">
            {option.label}
          </h4>
          <p className="text-[0.65rem] font-mono text-gray-500 tracking-wider uppercase mt-2 leading-relaxed">
            {option.desc}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[0.6rem] font-mono text-gray-500">
          <span className="flex items-center gap-1"><Flame size={10} className="text-voro-accent" /> Deprivation: <strong className="text-white">{option.fastHours}h</strong></span>
          <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-voro-secondary" /> Synthesis: <strong className="text-white">{option.breakHours}h</strong></span>
        </div>
      </div>
    </button>
  );
});
WindowCard.displayName = 'WindowCard';

/**
 * ⚡ SUBCOMPONENT: Biomarker Dashboard Diagnostic Cell
 * Direct DOM hover transforms and high-fidelity simulated biomeasures.
 */
const DiagnosticCell = memo(({ title, value, unit, progress, description, icon: Icon, color, glow }) => {
  const cellRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 12;
    const tiltX = (0.5 - (y / rect.height)) * 12;

    cellRef.current.style.setProperty('--mouse-x', `${x}px`);
    cellRef.current.style.setProperty('--mouse-y', `${y}px`);
    cellRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cellRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cellRef.current) {
      cellRef.current.style.setProperty('--tilt-x', '4deg');
      cellRef.current.style.setProperty('--tilt-y', '-4deg');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cellRef.current) {
      cellRef.current.style.setProperty('--tilt-x', '0deg');
      cellRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={cellRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      style={{
        transform: interactionActive
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative p-6 rounded-[2rem] bg-[#0A0C14] border border-white/5 overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408]"
    >
      <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glow}, transparent 80%)`
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[0.55rem] font-black uppercase tracking-[0.3em] text-gray-500">
            {title}
          </span>
          <div className={`p-1.5 rounded-lg bg-white/[0.02] border border-white/5 ${color}`}>
            <Icon size={14} />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-serif italic font-bold text-white tracking-tight">
              {value}
            </span>
            <span className="text-[0.65rem] font-mono text-gray-500 uppercase tracking-widest">
              {unit}
            </span>
          </div>
          <p className="text-[0.6rem] font-medium text-gray-400 mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Cinematic progress bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-[0.5rem] font-mono text-gray-600 uppercase tracking-widest">
            <span>Saturation</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.02] border border-white/5 rounded-full overflow-hidden p-0.5 relative">
            <div
              className={`h-full rounded-full transition-transform duration-1000 origin-left`}
              style={{
                transform: `scaleX(${progress / 100})`,
                backgroundColor: glow || '#7C3AED',
                boxShadow: `0 0 10px ${glow}`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
DiagnosticCell.displayName = 'DiagnosticCell';

const FastingTracker = () => {
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to the 'fasting' key.
   */
  const fastingData = useStorageKeySelector(
    'fasting',
    useCallback((data) => data || { window: '16:8', started: null, status: 'idle' }, []),
  );

  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isInitiating, setIsInitiating] = useState(false);
  const [alignmentStep, setAlignmentStep] = useState(0);

  // Safety Confirmation Reset states
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(3.0);
  const countdownTimerRef = useRef(null);

  const timerRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Fasting Tracker';
  }, []);

  const windowStr = fastingData?.window || '16:8';
  const activeWindow = useMemo(() => {
    return WINDOW_OPTIONS.find(opt => opt.id === windowStr) || WINDOW_OPTIONS[0];
  }, [windowStr]);

  const totalSeconds = activeWindow.fastHours * 3600;

  useEffect(() => {
    if (fastingData.started && fastingData.status === 'active') {
      const start = new Date(fastingData.started).getTime();
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      setElapsed(diff);
      setIsPaused(false);
    } else {
      setElapsed(0);
      setIsPaused(true);
    }
  }, [fastingData]);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  // Clean up all timers on unmount to prevent leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  // Handle simulated alignment status logs
  useEffect(() => {
    if (isInitiating) {
      const interval = setInterval(() => {
        setAlignmentStep(s => {
          if (s >= 4) {
            clearInterval(interval);
            return s;
          }
          return s + 1;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setAlignmentStep(0);
    }
  }, [isInitiating]);

  const handleStart = async () => {
    setIsInitiating(true);

    // Simulate cinematic alignment sequence
    setTimeout(async () => {
      const now = new Date().toISOString();
      await setItem('fasting', { ...fastingData, started: now, status: 'active' });
      setIsInitiating(false);
      addNotification('Metabolic transition initiated. Autophagy sequence started.', 'success');
    }, 2500);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = async () => {
    await setItem('fasting', { ...fastingData, started: null, status: 'idle' });
    setElapsed(0);
    setIsPaused(true);
    addNotification('Fasting cycle reset and metadata archived.', 'info');
  };

  // Protective sequence reset handler
  const initiateResetSequence = () => {
    if (confirmReset) {
      handleReset();
      cancelResetSequence();
    } else {
      setConfirmReset(true);
      setResetCountdown(3.0);

      const start = Date.now();
      countdownTimerRef.current = setInterval(() => {
        const remaining = Math.max(0, 3.0 - (Date.now() - start) / 1000);
        setResetCountdown(remaining);
        if (remaining <= 0) {
          cancelResetSequence();
        }
      }, 50);
    }
  };

  const cancelResetSequence = () => {
    setConfirmReset(false);
    setResetCountdown(3.0);
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  const handleWindowChange = async (optionId) => {
    await setItem('fasting', { ...fastingData, window: optionId });
    addNotification(`Deprivation window switched to ${optionId}.`, 'success');
  };

  const progress = Math.min((elapsed / totalSeconds) * 100, 100);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  // Live Simulated Metabolic Bio-measures
  const simulatedMeasures = useMemo(() => {
    const hoursElapsed = elapsed / 3600;

    // Liver glycogen depletion
    const glycogenVal = Math.max(0, 100 - (hoursElapsed / 12) * 100);

    // Autophagy Index (starts at 12 hours)
    let autophagyVal = 0;
    if (hoursElapsed > 12) {
      autophagyVal = Math.min(100, ((hoursElapsed - 12) / 12) * 100);
    }

    // Fat Oxidation rate (scales up to 95%)
    const fatVal = Math.min(95, 5 + (hoursElapsed / 14) * 90);

    // Growth hormone multiplier
    const hghVal = (1.0 + Math.min(4.0, (hoursElapsed / 24) * 4)).toFixed(1);

    return {
      glycogen: { val: glycogenVal.toFixed(0), progress: 100 - glycogenVal, desc: glycogenVal > 0 ? "Glycogen depletion in progress" : "Hepatic glycogen fully exhausted" },
      autophagy: { val: autophagyVal.toFixed(0), progress: autophagyVal, desc: hoursElapsed < 12 ? "Cellular cleanup dormant (requires 12h)" : "Active autophagic cellular recycling" },
      fat: { val: fatVal.toFixed(0), progress: fatVal, desc: "Shifting substrate dominance to lipids" },
      hgh: { val: hghVal, progress: Math.min(100, (parseFloat(hghVal) / 5) * 100), desc: "Growth hormone production maximized" }
    };
  }, [elapsed]);

  const alignmentLogs = [
    "MEASURING HEPATIC GLYCOGEN STORES...",
    "CALIBRATING CORE KINETIC SWITCHES...",
    "ATTESTING SECURE CDDSA DATABASE HANDSHAKE...",
    "NUTRITIONAL SHIELD DEPLOYED...",
    "METABOLIC BIOMARKER MATRIX SYNCED // READY"
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30">
      {/* Ambient background architectural lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-10 py-20">
        <header className="mb-20">
          <div className="flex items-center gap-4 text-voro-primary mb-4">
            <div className="p-2 bg-voro-primary/10 rounded-lg">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-500">Temporal Deprivation Matrix</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
            Metabolic <span className="text-voro-primary not-italic font-bold">Fasting</span>
          </h1>
          <p className="text-gray-600 font-mono text-[0.65rem] uppercase tracking-[0.3em] mt-4 max-w-xl leading-relaxed">
            Optimizing cellular longevity through controlled nutritional cycles and metabolic switching protocols.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            {/* Cinematic Calibration Sequence Loading State */}
            {isInitiating ? (
              <Card className="p-16 flex flex-col items-center justify-center min-h-[460px] bg-gradient-to-b from-[#0D121F]/60 to-[#020408]/60 border-voro-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-scanline opacity-[0.04] pointer-events-none" />
                <div className="absolute inset-0 bg-grid-white opacity-5 pointer-events-none" />

                {/* Rotating concentric calibration loading indicator */}
                <div className="relative mb-12">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-voro-primary/20 animate-[spin_10s_linear_infinite_reverse] flex items-center justify-center" />
                  <div className="absolute inset-2 rounded-full border-2 border-dashed border-voro-secondary/40 animate-[spin_6s_linear_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center text-voro-primary">
                    <RefreshCw size={24} className="animate-spin" />
                  </div>
                </div>

                <div className="space-y-4 text-center max-w-md">
                  <h3 className="text-lg font-serif italic font-medium text-white tracking-tight">
                    Aligning Metabolic Sequence...
                  </h3>
                  <div className="font-mono text-[0.6rem] text-voro-primary font-bold tracking-[0.25em] space-y-1">
                    {alignmentLogs.slice(0, alignmentStep + 1).map((log, i) => (
                      <p key={i} className="animate-fade-in opacity-80">
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-16 flex flex-col items-center justify-center bg-gradient-to-b from-[#0D121F]/40 to-[#020408]/40 border-white/5 relative overflow-hidden group">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-white/[0.03] rounded-tl-[2rem]" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-white/[0.03] rounded-br-[2rem]" />

                <MetabolicChronometer
                  progress={progress}
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  isActive={!isPaused && fastingData.status === 'active'}
                />

                <div className="mt-16 flex gap-6 w-full max-w-md relative z-20">
                  {!fastingData.started || fastingData.status === 'idle' ? (
                    <Button
                      onClick={handleStart}
                      className="flex-1 py-8 shadow-2xl shadow-voro-primary/20 text-lg tracking-widest font-bold"
                    >
                      <Play size={20} className="mr-3 fill-current" />
                      INITIATE PROTOCOL
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handlePause}
                        variant="secondary"
                        className="flex-1 py-8 text-sm tracking-[0.2em] font-bold border-white/10"
                      >
                        {isPaused ? <Play size={18} className="mr-3 fill-current" /> : <Pause size={18} className="mr-3 fill-current" />}
                        {isPaused ? 'RESUME SEQUENCE' : 'PAUSE TEMPORALITY'}
                      </Button>

                      {/* Double Confirmation Protective sequence reset button */}
                      <button
                        onClick={initiateResetSequence}
                        aria-label={confirmReset ? `Confirm cycle purge. Countdown ${resetCountdown.toFixed(1)} seconds.` : "Reset metabolic cycle"}
                        className={`p-6 rounded-[1.5rem] border outline-none transition-all duration-500 flex items-center justify-center gap-2 ${
                          confirmReset
                            ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                            : 'bg-white/[0.03] border-white/5 text-gray-500 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-voro-primary/50'
                        }`}
                      >
                        {confirmReset ? (
                          <>
                            <ShieldAlert size={20} className="animate-pulse" />
                            <span className="font-mono text-xs font-bold leading-none tracking-widest">{resetCountdown.toFixed(1)}s</span>
                          </>
                        ) : (
                          <RotateCcw size={20} />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </Card>
            )}

            {/* Overhauled window selection: Grid organization Organism */}
            <section className="bg-[#0A0C14] border border-white/5 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-voro-primary/5 rounded-2xl">
                  <Target size={20} className="text-voro-primary" />
                </div>
                <div>
                  <h3 className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-gray-500 mb-1">Window Protocol</h3>
                  <p className="text-sm font-mono text-gray-400 tracking-widest uppercase">Select Metabolic Configuration</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {WINDOW_OPTIONS.map(option => (
                  <WindowCard
                    key={option.id}
                    option={option}
                    isSelected={fastingData.window === option.id}
                    onClick={() => handleWindowChange(option.id)}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-10">
            {/* Dynamic Simulated Clinical Diagnostics Panel */}
            <Card className="p-12 bg-gradient-to-br from-[#0D121F]/40 to-[#020408]/20 border-white/10 flex flex-col justify-between min-h-[360px]">
              <div className="flex items-center justify-between mb-12">
                <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.5em]">Metabolic Diagnostic Core</p>
                <ShieldCheck size={16} className="text-voro-secondary opacity-50" />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <DiagnosticCell
                  title="Hepatic Glycogen"
                  value={simulatedMeasures.glycogen.val}
                  unit="%"
                  progress={simulatedMeasures.glycogen.progress}
                  description={simulatedMeasures.glycogen.desc}
                  icon={Activity}
                  color="text-amber-500"
                  glow="rgba(245,158,11,0.06)"
                />

                <DiagnosticCell
                  title="Autophagy Index"
                  value={simulatedMeasures.autophagy.val}
                  unit="%"
                  progress={simulatedMeasures.autophagy.progress}
                  description={simulatedMeasures.autophagy.desc}
                  icon={Brain}
                  color="text-indigo-400"
                  glow="rgba(129,140,248,0.06)"
                />

                <DiagnosticCell
                  title="Lipid Oxidation"
                  value={simulatedMeasures.fat.val}
                  unit="%"
                  progress={simulatedMeasures.fat.progress}
                  description={simulatedMeasures.fat.desc}
                  icon={Flame}
                  color="text-emerald-400"
                  glow="rgba(16,185,129,0.06)"
                />

                <DiagnosticCell
                  title="HGH Multiplier"
                  value={simulatedMeasures.hgh.val}
                  unit="x"
                  progress={simulatedMeasures.hgh.progress}
                  description={simulatedMeasures.hgh.desc}
                  icon={Sparkles}
                  color="text-cyan-400"
                  glow="rgba(6,182,212,0.06)"
                />
              </div>

              <div className="mt-12 flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <Flame size={14} className="text-orange-500" />
                <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest leading-relaxed">
                  Fuel source shifting to <span className="text-white">lipid oxidation</span>
                </p>
              </div>
            </Card>

            {/* Phase Insight Card */}
            <Card className="p-12 border-dashed border-white/10 bg-transparent flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                <h4 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400">Biological Insight</h4>
              </div>

              <p className="text-lg font-serif italic text-gray-300 leading-relaxed indent-8">
                {progress < 25 ? "Initial glucose depletion. Insulin levels beginning to stabilize, signaling the shift to endogenous energy utilization." :
                 progress < 50 ? "Liver glycogen stores decreasing. Fatty acid mobilization increasing as the system enters early metabolic transition." :
                 progress < 75 ? "Metabolic switch to ketosis imminent. Autophagy processes accelerating, prioritizing cellular component recycling." :
                 "Deep ketosis achieved. Growth hormone levels optimized for cellular repair and neuro-protective factor synthesis."}
              </p>

              <div className="mt-auto pt-8 border-t border-white/5">
                 <p className="text-[0.5rem] font-mono text-gray-600 uppercase tracking-[0.4em]">Chronological metabolic analysis — VORO V1.0</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastingTracker;
