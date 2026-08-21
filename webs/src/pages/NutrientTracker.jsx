import React, { useEffect, useState, useMemo, useCallback, useRef, memo, useId } from 'react';
import { Plus, Trash2, Heart, Target, Activity, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button, Card, Tag, Input, Modal } from '@/components';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static nutrient metadata with Object.freeze.
 */
const NUTRIENTS = Object.freeze([
  { id: 'vitamin_d', name: 'Vitamin D', unit: 'IU', dailyGoal: 2000, warning: 'Essential for immune homeostasis & skeletal synthesis.', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.2)' },
  { id: 'iron', name: 'Iron', unit: 'mg', dailyGoal: 18, warning: 'Critical catalyst for erythrocyte structure & systemic oxygen flux.', color: '#EF4444', glow: 'rgba(239, 68, 68, 0.2)' },
  { id: 'magnesium', name: 'Magnesium', unit: 'mg', dailyGoal: 420, warning: 'Required for neuromuscular homeostasis & energetic substrate assembly.', color: '#7C3AED', glow: 'rgba(124, 58, 237, 0.2)' },
  { id: 'zinc', name: 'Zinc', unit: 'mg', dailyGoal: 11, warning: 'Essential trace element for cellular replication & genetic transcription.', color: '#10B981', glow: 'rgba(16, 185, 129, 0.2)' },
  { id: 'b12', name: 'Vitamin B12', unit: 'mcg', dailyGoal: 2.4, warning: 'Fundamental for axonal insulation & mitochondrial ATP production.', color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.2)' },
  { id: 'omega3', name: 'Omega-3', unit: 'g', dailyGoal: 1.1, warning: 'Anti-inflammatory structural lipid supporting cerebral integrity.', color: '#EC4899', glow: 'rgba(236, 72, 153, 0.2)' },
]);

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted module-scoped SVG ticks.
 * Completely eliminates heap allocations of 60 SVG rect elements on component renders.
 */
const TICKS = Object.freeze(Array.from({ length: 60 }).map((_, i) => (
  <rect
    key={i}
    x="127.5"
    y="12"
    width="1"
    height={i % 5 === 0 ? "10" : "4"}
    fill={i % 5 === 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}
    transform={`rotate(${i * 6}, 128, 128)`}
  />
)));

/**
 * ⚡ LUXURY REFINEMENT: NutrientCard Subcomponent
 * Implements direct DOM mouse-tracking coordinate tilts to bypass React re-renders.
 * Supports Accessible 3D Interaction Pattern (static 4-degree focus tilt).
 */
const NutrientCard = memo(({ nutrient, isSelected, onClick }) => {
  const containerRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const reactId = useId();

  const nodeId = useMemo(() => `NTR_${reactId.replace(/:/g, '').slice(0, 4).toUpperCase()}`, [reactId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 15 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 15;
    const tiltX = (0.5 - (y / rect.height)) * 15;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
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
    <button
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      style={{
        transform: interactionActive
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`group relative p-8 rounded-[2rem] bg-white/[0.01] border transition-all duration-700 text-left overflow-hidden outline-none h-full flex flex-col justify-between ${
        isSelected
          ? 'border-white/20 bg-white/[0.02] shadow-[0_20px_40px_rgba(0,0,0,0.6)]'
          : 'border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
      }`}
    >
      {/* Dynamic Luminous Lens synced with nutrient color */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(250px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${nutrient.glow}, transparent 50%)`,
        }}
      />

      {/* Dynamic Border Glow for Active Selection */}
      {isSelected && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 15px -3px ${nutrient.color}25, 0 10px 25px -10px ${nutrient.color}30`
          }}
        />
      )}

      {/* Precision Telemetry Overlay */}
      <div className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-2 font-mono text-[0.45rem] font-bold text-gray-600 tracking-widest">
          <span>X_<span ref={txRef}>0.0</span></span>
          <span>Y_<span ref={tyRef}>0.0</span></span>
          <span>[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10 w-full" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between mb-8">
          <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500">
            {nutrient.unit} Marker
          </span>
          {isSelected && (
            <div className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ backgroundColor: nutrient.color, color: nutrient.color }} />
          )}
        </div>

        <div className="flex items-end justify-between">
          <h4 className="text-xl font-serif italic font-medium text-white tracking-tight leading-tight group-hover:text-voro-primary transition-colors">
            {nutrient.name}
          </h4>
          <span className="text-[0.65rem] font-mono text-gray-600 uppercase tracking-widest bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-full group-hover:border-white/10 transition-colors">
            {nutrient.dailyGoal}
          </span>
        </div>
      </div>
    </button>
  );
});

NutrientCard.displayName = "NutrientCard";

/**
 * ⚡ LUXURY REFINEMENT: ConcentricVisualizer Subcomponent
 * High-end kinetic progress visualizer featuring rotating dashed concentric orbits,
 * zero-allocation static SVG ticks, and ambient glowing backplates.
 */
const ConcentricVisualizer = memo(({ nutrient, percentage, total, deficit }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const reactId = useId();

  const nodeId = useMemo(() => `VIS_${reactId.replace(/:/g, '').slice(0, 4).toUpperCase()}`, [reactId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 15;
    const tiltX = (0.5 - (y / rect.height)) * 15;

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
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className="relative w-full h-full p-12 bg-[#0A0C14] border border-white/5 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-white/20 select-none bg-boutique-grain"
    >
      {/* Deep Ambient Backglow synced with active nutrient color */}
      <div
        className="absolute inset-[-40px] rounded-full blur-[100px] opacity-15 transition-all duration-1000 animate-pulse-slow pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${nutrient.color} 0%, transparent 75%)`,
          transform: 'translateZ(-10px)'
        }}
      />

      {/* Dashed outer kinetic orbit */}
      <div
        className="absolute inset-[30px] rounded-full border border-dashed border-white/5 pointer-events-none animate-orbit-clockwise opacity-40 group-hover:opacity-100 transition-opacity duration-1000"
        style={{ transform: 'translateZ(-5px)' }}
      />

      {/* Reverse rotating inner kinetic orbit */}
      <div
        className="absolute inset-[50px] rounded-full border border-dashed border-white/[0.03] pointer-events-none animate-orbit-counter opacity-30 group-hover:opacity-80 transition-opacity duration-1000"
        style={{ transform: 'translateZ(-2px)' }}
      />

      {/* Orbiting Beacon Dot */}
      <div
        className="absolute inset-[30px] rounded-full pointer-events-none animate-orbit-clockwise"
        style={{ transform: 'translateZ(10px)' }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full shadow-[0_0_15px_currentColor] transition-colors"
          style={{ backgroundColor: nutrient.color, color: nutrient.color }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full" style={{ transform: 'translateZ(40px)' }}>
        <div className="space-y-4 text-center">
          <span className="text-[0.65rem] font-mono font-medium text-gray-500 uppercase tracking-[0.4em]">Target Capacity</span>
          <div className="flex flex-col items-center">
            <span className="text-7xl md:text-8xl font-serif italic font-medium text-white leading-none tracking-tighter">
              {nutrient.dailyGoal}
            </span>
            <span className="text-[0.55rem] font-mono font-black text-gray-600 uppercase tracking-[0.4em] mt-3">
              {nutrient.unit} REQUIRED
            </span>
          </div>
        </div>

        {/* Central SVG Telemetry dial */}
        <div className="relative h-64 w-64 my-10" style={{ transform: 'translateZ(50px)' }}>
          <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 256 256">
            <defs>
              <linearGradient id="visualizer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={nutrient.color} />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>

            {TICKS}

            <circle
              cx="128"
              cy="128"
              r="100"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="100"
              stroke="url(#visualizer-grad)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 100}`}
              strokeDashoffset={`${2 * Math.PI * 100 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ filter: `drop-shadow(0 0 15px ${nutrient.color}45)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-serif italic font-bold text-white tracking-tight">{percentage}%</span>
            <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">METABOLIZED</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-10 w-full pt-6 border-t border-white/5">
          <div className="text-center">
            <p className="text-white font-mono font-bold text-lg tracking-tight">{total.toLocaleString()}</p>
            <p className="text-[0.55rem] font-mono font-black text-gray-600 uppercase tracking-widest mt-1">TOTAL INTAKE</p>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="text-center">
            <p className="text-white font-mono font-bold text-lg tracking-tight">{deficit.toLocaleString()}</p>
            <p className="text-[0.55rem] font-mono font-black text-gray-600 uppercase tracking-widest mt-1">DEFICIT STATE</p>
          </div>
        </div>
      </div>

      {/* Holographic Coordinate Telemetry */}
      <div
        className="absolute top-10 right-14 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold tracking-[0.2em] space-y-0.5" style={{ color: nutrient.color }}>
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>
    </div >
  );
});

ConcentricVisualizer.displayName = "ConcentricVisualizer";

const DEFAULT_TRACKER = Object.freeze({});

const NutrientTracker = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Storage Reactivity.
   * Replaced useStorageKey with useStorageKeySelector for granular reactivity.
   */
  const tracker = useStorageKeySelector(
    'nutrient_tracker',
    useCallback((data) => data || DEFAULT_TRACKER, [])
  );

  const { updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  const [selectedNutrientId, setSelectedNutrientId] = useState('vitamin_d');
  const [showLogModal, setShowLogModal] = useState(false);
  const [logValue, setLogValue] = useState('');

  // Defensive Double-Confirmation Purge Mechanism
  const [purgeActive, setPurgeActive] = useState(false);
  const [purgeCountdown, setPurgeCountdown] = useState(3);
  const purgeTimerRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Micronutrient Synthesis';
    return () => {
      if (purgeTimerRef.current) clearInterval(purgeTimerRef.current);
    };
  }, []);

  const currentNutrient = useMemo(() =>
    NUTRIENTS.find(n => n.id === selectedNutrientId)
  , [selectedNutrientId]);

  const currentStatus = useMemo(() =>
    tracker[selectedNutrientId] || { intake: 0, fromFood: 0 }
  , [tracker, selectedNutrientId]);

  const total = useMemo(() => {
    return (currentStatus.intake || 0) + (currentStatus.fromFood || 0);
  }, [currentStatus]);

  const deficit = useMemo(() => {
    return Math.max(0, currentNutrient.dailyGoal - total);
  }, [currentNutrient.dailyGoal, total]);

  const percentage = useMemo(() => {
    return Math.min(Math.round((total / currentNutrient.dailyGoal) * 100), 100);
  }, [total, currentNutrient.dailyGoal]);

  const handleLogIntake = useCallback(async () => {
    const val = parseFloat(logValue);
    if (isNaN(val) || val <= 0) {
      addNotification('Please enter a valid magnitude', 'error');
      return;
    }

    const updatedStatus = {
      ...currentStatus,
      intake: (currentStatus.intake || 0) + val
    };

    await updateItem('nutrient_tracker', {
      [selectedNutrientId]: updatedStatus
    });

    setLogValue('');
    setShowLogModal(false);
    addNotification(`${currentNutrient.name} molecular synthesis committed.`, 'success');
  }, [logValue, currentStatus, selectedNutrientId, currentNutrient, updateItem, addNotification]);

  const handleResetTrigger = useCallback(async (id) => {
    const targetNutrient = NUTRIENTS.find(n => n.id === id);
    if (purgeActive) {
      if (purgeTimerRef.current) clearInterval(purgeTimerRef.current);
      setPurgeActive(false);
      setPurgeCountdown(3);

      await updateItem('nutrient_tracker', {
        [id]: { intake: 0, fromFood: 0 }
      });
      addNotification(`${targetNutrient.name} synthesis database purged.`, 'info');
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

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Heart size={18} className="animate-pulse" />
              <span className="text-xs font-mono font-medium uppercase tracking-[0.4em] text-gray-500">Micronutrient Matrix</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-[1.1]">
              Nutritional <span className="text-voro-primary not-italic font-bold">Optimization</span>
            </h1>
            <p className="text-gray-500 font-mono font-medium tracking-[0.3em] text-[0.65rem] uppercase opacity-60">
              Interactive physiological catalyst repository and bio-synthesis calibration terminal.
            </p>
          </div>

          <div className="flex gap-4">
            <Tag variant="voro-secondary" nodeId="BIO_01">Bio_Sync_Active</Tag>
            <Tag variant="voro-accent" nodeId="NL_01">Neural_Link</Tag>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* LEFT COLUMN: SELECTORS AND BIOMETRICS */}
          <div className="lg:col-span-8 space-y-16">
            <Card variant="premium" nodeId="CON_N1" className="p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none font-mono text-[0.4rem] font-black">
                [SELECTOR_CON_N1]
              </div>

              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-voro-primary/10 text-voro-primary rounded-xl border border-voro-primary/20">
                  <Target size={20} />
                </div>
                <div>
                  <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500 block mb-1">
                    PHYSIOLOGICAL DRIVERS
                  </span>
                  <h2 className="text-xl font-serif italic text-white font-bold">
                    Select Catalyst Profile
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {NUTRIENTS.map(nutrient => (
                  <NutrientCard
                    key={nutrient.id}
                    nutrient={nutrient}
                    isSelected={selectedNutrientId === nutrient.id}
                    onClick={() => setSelectedNutrientId(nutrient.id)}
                  />
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Detailed Sub-allocation panel */}
              <Card variant="premium" nodeId="CNS_X1" className="p-10 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-voro-primary" />
                    <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500">Molecular Allocation</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Supp level */}
                  <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-xs font-bold text-gray-400">Exogenous Supplementation</span>
                      <span className="text-sm font-mono font-bold text-white">{currentStatus.intake || 0} {currentNutrient.unit}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-voro-primary/80 transition-all duration-1000"
                        style={{ width: `${Math.min(100, ((currentStatus.intake || 0) / currentNutrient.dailyGoal) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-wide block">Direct molecular capsule synthesis</span>
                  </div>

                  {/* Food level */}
                  <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-xs font-bold text-gray-400">Biological Food Absorption</span>
                      <span className="text-sm font-mono font-bold text-white">{currentStatus.fromFood || 0} {currentNutrient.unit}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-voro-secondary/80 transition-all duration-1000"
                        style={{ width: `${Math.min(100, ((currentStatus.fromFood || 0) / currentNutrient.dailyGoal) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-wide block">Passive whole-food digestion path</span>
                  </div>
                </div>
              </Card>

              {/* Clinical Insight & Actions Card */}
              <Card
                variant="premium"
                nodeId="INS_Y1"
                className="p-10 flex flex-col justify-between"
                style={{
                  boxShadow: `inset 0 0 30px -5px ${currentNutrient.color}10`
                }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck size={18} className="text-voro-secondary" />
                    <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-voro-secondary">CLINICAL DIRECTIVE</span>
                  </div>
                  <p className="text-2xl font-serif italic text-white leading-snug tracking-tight">
                    "{currentNutrient.warning}"
                  </p>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex gap-4">
                  <Button
                    onClick={() => setShowLogModal(true)}
                    className="flex-1 py-5 !rounded-2xl shadow-xl shadow-voro-primary/20 text-[0.65rem] font-black uppercase tracking-[0.25em]"
                  >
                    <Plus size={16} className="mr-2" />
                    Log Intake
                  </Button>
                  <button
                    onClick={() => handleResetTrigger(selectedNutrientId)}
                    className={`p-5 rounded-2xl border transition-all duration-500 font-mono text-[0.65rem] tracking-[0.2em] uppercase font-black outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                      purgeActive
                        ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                        : 'bg-white/[0.01] border-white/5 text-gray-500 hover:border-red-500/35 hover:text-red-400'
                    }`}
                  >
                    {purgeActive ? (
                      <span className="flex items-center gap-2">
                        <ShieldAlert size={14} className="animate-bounce" />
                        {purgeCountdown}
                      </span>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </Card>
            </div>
          </div>

          {/* RIGHT COLUMN: CENTRAL KINETIC PROGRESS DIAL */}
          <div className="lg:col-span-4 h-full">
            <ConcentricVisualizer
              nutrient={currentNutrient}
              percentage={percentage}
              total={total}
              deficit={deficit}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Catalyst Molecular Synthesis"
      >
        <div className="space-y-12 p-2">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none font-mono text-[0.4rem] font-black">
              [MOD_X1]
            </div>
            <p className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] mb-3">BIO-SYNTHESIS ACTIVE</p>
            <h3 className="text-3xl font-serif italic font-bold text-white">{currentNutrient.name}</h3>
          </div>

          <div className="space-y-4">
            <label className="text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 ml-1">
              INTAKE MAGNITUDE ({currentNutrient.unit})
            </label>
            <Input
              type="number"
              placeholder={`Enter magnitude in ${currentNutrient.unit}...`}
              value={logValue}
              onChange={(e) => setLogValue(e.target.value)}
              autoFocus
              className="!bg-[#0A0C14] border-white/10 italic font-serif text-xl p-6"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowLogModal(false)}
              className="flex-1 py-4 !rounded-2xl"
            >
              Abort
            </Button>
            <Button
              onClick={handleLogIntake}
              disabled={!logValue || parseFloat(logValue) <= 0}
              className="flex-[2] py-4 !rounded-2xl"
            >
              Synchronize Synthesis
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NutrientTracker;
