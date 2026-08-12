import React, { useEffect, useMemo, useRef, useState, useCallback, useId } from 'react';
import { Zap, TrendingUp, Activity, Award, Target as TargetIcon, ShieldAlert, Cpu, RefreshCw, Layers, Compass, ChevronRight } from 'lucide-react';
import { Card, Button, LineChartComponent, RadarChartComponent, Stat } from '@/components';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted fallback data.
 * Ensures referential stability and prevents redundant object instantiation.
 */
const DEFAULT_PERFORMANCE = {
  avgVolume: 18500,
  maxBench: 140,
  maxSquat: 180,
  maxDeadlift: 200,
  bodyweight: 80,
};

// Cinematic Loading Sequence Messages
const CALIBRATION_STEPS = [
  "INITIALIZING NEUROMUSCULAR SYNC...",
  "EXTRACTING MYO-ELECTRIC READOUTS...",
  "COMPUTING FORCE VELOCITY VECTORS...",
  "STAMPING ALLOSEMATIC DENSITY...",
  "NOMINAL STATUS INTEGRATED"
];

/**
 * ⚡ LUXURY REFINEMENT: SpecimenForceCard Component
 * Features high-performance direct-DOM 3D volumetric hover tilts (up to 15 degrees),
 * real-time coordinate telemetry overlays, static 4-degree focus tilts, focus halos,
 * and liquid border perimeter glows matching the theme.
 */
const SpecimenForceCard = React.memo(({ label, value, unit, icon: Icon, color, bg, glowColor, nodeId }) => {
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
    const tiltX = (0.5 - (y / rect.height)) * -30; // Inverse to match exact cursor pressure tilt

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
      // Accessible static tilt (4 degrees) on keyboard focus
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
      aria-label={`${label} Specimen Force vector: ${value} ${unit}. Code: ${nodeId}`}
      style={{
        transform: interactionActive
          ? 'perspective(1500px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1500px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative p-10 rounded-[2.5rem] bg-[#0A0C14]/80 border border-white/5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/10 hover:shadow-[0_50px_100px_rgba(0,0,0,0.8)] focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none group/node flex flex-col justify-between min-h-[220px]"
    >
      {/* Precision Grid & Boutique Grain Architecture */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/node:opacity-5 transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens backing */}
        <div
          className="absolute inset-0 opacity-0 group-hover/node:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${glowColor} 10%, transparent), transparent 60%)`,
          }}
        />
      </div>

      {/* Holographic Coordinate Telemetry */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/node:opacity-100 group-focus-within:opacity-100 transition-all duration-500 z-30"
        style={{ transform: 'translateZ(90px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>T_X <span ref={tiltXRef}>0.0</span>°</span>
          <span>T_Y <span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Atmospheric Glowing Backplate */}
      <div
        className="absolute inset-0 opacity-0 group-hover/node:opacity-[0.1] transition-opacity duration-1000 blur-3xl -z-10"
        style={{ backgroundColor: glowColor, transform: 'translateZ(-10px)' }}
      />

      {/* Specimen Holder with Luxurious Icon */}
      <div className="relative z-10 flex items-start justify-between" style={{ transform: 'translateZ(40px)' }}>
        <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-lg border border-white/5 group-hover/node:scale-110 transition-transform duration-700`}>
          <Icon size={22} className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
        </div>
        <div className="text-right">
          <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.2em] block mb-1">CAP_VECTOR</span>
          <span className="text-xs font-mono font-bold text-gray-400 block tracking-widest">{nodeId}</span>
        </div>
      </div>

      {/* Title & Value Metrics */}
      <div className="relative z-10 mt-8 space-y-2" style={{ transform: 'translateZ(50px)' }}>
        <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] block">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-serif italic font-bold text-white tracking-tighter leading-none group-hover/node:text-voro-primary transition-colors duration-500">
            {value}
          </span>
          <span className="text-[0.65rem] font-mono font-bold text-gray-600 uppercase tracking-widest">
            {unit}
          </span>
        </div>
      </div>

      {/* 🛰️ Liquid Border Intelligence: Reactive perimeter illumination */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/node:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${glowColor} 40%, transparent), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
    </div>
  );
});

SpecimenForceCard.displayName = "SpecimenForceCard";

const PerformanceMetrics = () => {
  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to 'voro_performance' data to prevent redundant re-renders
   * when unrelated storage keys change.
   */
  const performanceData = useStorageKey('voro_performance');
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const pageId = useId();

  // Cinematic alignment load cycle
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [calibrationStep, setCalibrationStep] = useState(0);

  // Volume Trajectory & Capability Matrix Tilt Tracker
  const volCardRef = useRef(null);
  const capCardRef = useRef(null);
  const volTx = useRef(null);
  const volTy = useRef(null);
  const capTx = useRef(null);
  const capTy = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Performance Capabilities';

    // 2.5 second simulated loading overlay
    let stepTimer;
    const runCalibration = () => {
      stepTimer = setInterval(() => {
        setCalibrationStep(prev => {
          if (prev < CALIBRATION_STEPS.length - 1) {
            return prev + 1;
          } else {
            clearInterval(stepTimer);
            setTimeout(() => {
              setIsCalibrating(false);
            }, 500);
            return prev;
          }
        });
      }, 500);
    };

    runCalibration();
    return () => clearInterval(stepTimer);
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation using useMemo.
   * Eliminates the initial mount-time double-render cycle and ensures
   * reactivity to StorageContext updates without manual load calls.
   */
  const metrics = useMemo(() => {
    return performanceData || DEFAULT_PERFORMANCE;
  }, [performanceData]);

  const forceSpecimens = useMemo(() => [
    { label: 'Absolute Bench Press', value: metrics.maxBench, unit: 'kg', icon: Award, bg: 'bg-violet-500/10', color: 'text-violet-500', glowColor: '#7C3AED', nodeId: 'SPEC_BP' },
    { label: 'Somatic Squat Load', value: metrics.maxSquat, unit: 'kg', icon: TrendingUp, bg: 'bg-emerald-500/10', color: 'text-emerald-500', glowColor: '#10B981', nodeId: 'SPEC_SQ' },
    { label: 'Absolute Deadlift Output', value: metrics.maxDeadlift, unit: 'kg', icon: Activity, bg: 'bg-amber-500/10', color: 'text-amber-500', glowColor: '#F59E0B', nodeId: 'SPEC_DL' },
  ], [metrics]);

  const radarData = useMemo(() => [
    { subject: 'Bench', A: metrics.maxBench, fullMark: 200 },
    { subject: 'Squat', A: metrics.maxSquat, fullMark: 300 },
    { subject: 'Deadlift', A: metrics.maxDeadlift, fullMark: 350 },
    { subject: 'Press', A: Math.round(metrics.maxBench * 0.65), fullMark: 120 },
    { subject: 'Row', A: Math.round(metrics.maxBench * 0.9), fullMark: 180 },
  ], [metrics]);

  const volumeData = useMemo(() => [
    { date: 'Week 1', volume: 16000 },
    { date: 'Week 2', volume: 17200 },
    { date: 'Week 3', volume: 18100 },
    { date: 'Week 4', volume: 18500 },
  ], []);

  const wilksScore = useMemo(() =>
    Math.round((metrics.maxBench + metrics.maxSquat + metrics.maxDeadlift) / 3),
  [metrics]);

  const handleUpdate = async () => {
    // Interactive sandbox update
    const randomShift = (Math.random() * 5).toFixed(1);
    const updated = {
      ...metrics,
      maxBench: metrics.maxBench + parseFloat(randomShift),
      maxSquat: metrics.maxSquat + parseFloat(randomShift),
      maxDeadlift: metrics.maxDeadlift + parseFloat(randomShift),
    };
    await setItem('voro_performance', updated);
    addNotification(`Adaptive force thresholds successfully synchronized. +${randomShift}kg shift recorded.`, 'success');
  };

  // Volumetric mouse moves for Chart Decks
  const handleVolMouseMove = (e) => {
    if (!volCardRef.current) return;
    const rect = volCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    volCardRef.current.style.setProperty('--mouse-x', `${x}px`);
    volCardRef.current.style.setProperty('--mouse-y', `${y}px`);
    volCardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    volCardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (volTx.current) volTx.current.innerText = tiltX.toFixed(1);
    if (volTy.current) volTy.current.innerText = tiltY.toFixed(1);
  };

  const handleCapMouseMove = (e) => {
    if (!capCardRef.current) return;
    const rect = capCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    capCardRef.current.style.setProperty('--mouse-x', `${x}px`);
    capCardRef.current.style.setProperty('--mouse-y', `${y}px`);
    capCardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    capCardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (capTx.current) capTx.current.innerText = tiltX.toFixed(1);
    if (capTy.current) capTy.current.innerText = tiltY.toFixed(1);
  };

  const handleChartMouseLeave = (ref) => {
    if (ref.current) {
      ref.current.style.setProperty('--tilt-x', '0deg');
      ref.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-32 relative overflow-hidden">
      {/* Cinematic Alignment Loading overlay */}
      {isCalibrating && (
        <div className="fixed inset-0 bg-[#020408] z-50 flex flex-col items-center justify-center p-6 animate-fade-in select-none">
          <div className="relative w-44 h-44 mb-12 flex items-center justify-center">
            {/* Rotating concentric orbital rings */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-voro-primary/30 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-3 rounded-full border border-dashed border-voro-secondary/20 animate-[spin_6s_linear_infinite_reverse]" />
            <div className="absolute inset-6 rounded-full border-2 border-dotted border-white/10 animate-[spin_14s_linear_infinite]" />
            <div className="w-24 h-24 rounded-full bg-[#0A0C14]/90 border border-white/5 flex items-center justify-center shadow-2xl">
              <RefreshCw size={36} className="text-voro-primary animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute inset-[-10px] rounded-full bg-voro-primary/5 blur-xl animate-pulse" />
          </div>

          <div className="space-y-3 text-center">
            <h3 className="text-xs font-mono font-black text-voro-primary uppercase tracking-[0.4em] animate-pulse">NEUROMUSCULAR ALIGNMENT ACTIVE</h3>
            <p className="text-sm font-mono text-gray-500 uppercase tracking-widest leading-none h-4">
              {CALIBRATION_STEPS[calibrationStep]}
            </p>
          </div>

          {/* Interactive telemetry diagnostics ticks */}
          <div className="absolute bottom-10 left-10 right-10 flex justify-between font-mono text-[0.5rem] text-gray-700 tracking-[0.2em]">
            <span>SYSTEM_NODE: 0xP_M_04</span>
            <span>DIAGNOSTIC: SUCCESS</span>
          </div>
        </div>
      )}

      {/* Premium Ambient Background Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.015]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-16 md:py-24">
        {/* Editorial Boutique Header */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4 text-voro-primary">
              <Compass size={18} className="animate-[spin_6s_linear_infinite]" />
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.50em] opacity-90">
                Absolute Kinetic Matrix // SYSTEM_ACTIVE
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-tighter leading-[0.9]">
              Kinetic <span className="text-gradient not-italic font-bold">Capabilities</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-80 leading-relaxed max-w-xl">
              AN INTERACTIVE TELEMETRY ENCLAVE EVALUATING NEUROMUSCULAR RECONSTRUCTION AND ALLOSEMATIC CAPACITY PROFILE.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Button
              onClick={handleUpdate}
              className="px-10 py-6 shadow-xl shadow-voro-primary/20 !rounded-full text-[0.65rem] font-mono font-bold tracking-[0.2em] uppercase"
            >
              <RefreshCw size={14} className="mr-3 animate-spin" style={{ animationDuration: '4s' }} />
              Recalibrate Thresholds
            </Button>
          </div>
        </header>

        {/* 3 Specimen Force Cards & Wilks Score Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {forceSpecimens.map((spec, idx) => (
            <div key={spec.nodeId} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <SpecimenForceCard
                label={spec.label}
                value={spec.value}
                unit={spec.unit}
                icon={spec.icon}
                bg={spec.bg}
                color={spec.color}
                glowColor={spec.glowColor}
                nodeId={spec.nodeId}
              />
            </div>
          ))}

          {/* Wilks Index Composite Card */}
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <SpecimenForceCard
              label="Neuromuscular Wilks Index"
              value={wilksScore}
              unit="pts"
              icon={Zap}
              bg="bg-amber-500/10"
              color="text-amber-500"
              glowColor="#F59E0B"
              nodeId="SPEC_WI"
            />
          </div>
        </section>

        {/* Visual Charts Comparison Matrix */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
          {/* Re-engineered Volume Trajectory Interactive Deck */}
          <div
            ref={volCardRef}
            onMouseMove={handleVolMouseMove}
            onMouseLeave={() => handleChartMouseLeave(volCardRef)}
            style={{
              transform: 'perspective(1500px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="lg:col-span-8 p-10 md:p-12 bg-[#0A0C14]/80 border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group/vol cursor-pointer"
          >
            {/* Laser reflection overlay */}
            <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
            <div className="absolute inset-0 bg-boutique-grain opacity-[0.015] pointer-events-none" />
            <div
              className="absolute inset-0 opacity-0 group-hover/vol:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.05), transparent 45%)`,
                transform: 'translateZ(20px)'
              }}
            />

            {/* Coordinate Telemetry */}
            <div
              className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/vol:opacity-100 transition-all duration-500 z-30"
              style={{ transform: 'translateZ(60px)' }}
            >
              <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
                <span>T_X <span ref={volTx}>0.0</span>°</span>
                <span>T_Y <span ref={volTy}>0.0</span>°</span>
                <span className="text-white/20">[CHART_VOL]</span>
              </div>
            </div>

            <div className="relative" style={{ transform: 'translateZ(50px)' }}>
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                  <span className="text-[0.6rem] font-mono font-black text-voro-primary uppercase tracking-[0.3em] block">CHRONO_VOLUME</span>
                  <h3 className="text-2xl font-serif italic font-bold text-white tracking-tight">Kinetic Volume Trajectory</h3>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-gray-500 group-hover/vol:text-white transition-colors duration-500">
                  <TrendingUp size={18} />
                </div>
              </div>

              <div className="h-[360px] w-full relative">
                <LineChartComponent
                  data={volumeData}
                  dataKey="volume"
                  name="Volume (kg)"
                  color="#7C3AED"
                  height={360}
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>

          {/* Interactive Capability Matrix Chart Deck */}
          <div
            ref={capCardRef}
            onMouseMove={handleCapMouseMove}
            onMouseLeave={() => handleChartMouseLeave(capCardRef)}
            style={{
              transform: 'perspective(1500px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="lg:col-span-4 p-10 md:p-12 bg-[#0A0C14]/80 border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group/cap cursor-pointer"
          >
            <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
            <div className="absolute inset-0 bg-boutique-grain opacity-[0.015] pointer-events-none" />
            <div
              className="absolute inset-0 opacity-0 group-hover/cap:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.05), transparent 45%)`,
                transform: 'translateZ(20px)'
              }}
            />

            {/* Coordinate Telemetry */}
            <div
              className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/cap:opacity-100 transition-all duration-500 z-30"
              style={{ transform: 'translateZ(60px)' }}
            >
              <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-secondary/60 tracking-[0.2em] space-y-0.5">
                <span>T_X <span ref={capTx}>0.0</span>°</span>
                <span>T_Y <span ref={capTy}>0.0</span>°</span>
                <span className="text-white/20">[CHART_RADAR]</span>
              </div>
            </div>

            <div className="relative" style={{ transform: 'translateZ(50px)' }}>
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                  <span className="text-[0.6rem] font-mono font-black text-voro-secondary uppercase tracking-[0.3em] block">CAPABILITY_VECT</span>
                  <h3 className="text-2xl font-serif italic font-bold text-white tracking-tight">Neuromuscular Spectrum</h3>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-gray-500 group-hover/cap:text-white transition-colors duration-500">
                  <TargetIcon size={18} />
                </div>
              </div>

              <div className="h-[360px] w-full relative">
                <RadarChartComponent
                  data={radarData}
                  dataKey="A"
                  name="Force"
                  fill="#10B981"
                  height={360}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Somatic Calibration Overview & Objective Nodes */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Somatic Status Summary Cell */}
          <div className="lg:col-span-4 flex">
            <Card variant="premium" nodeId="SOM_CELL" className="p-10 flex flex-col justify-between items-start w-full">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Cpu size={14} className="text-voro-secondary" />
                  <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">SOMATIC_PROF_01</span>
                </div>
                <h4 className="text-2xl font-serif italic font-bold text-white tracking-tight">Somatic Calibration</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  Continuous calibration logs available biological mass thresholds. High physical density requires steady micro-nutrient synchronization.
                </p>
              </div>

              <div className="space-y-6 w-full pt-10 mt-10 border-t border-white/5">
                <div>
                  <span className="text-[0.55rem] font-mono font-black text-gray-600 uppercase tracking-widest block mb-1">Baseline Somatic Mass</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif italic font-bold text-white">{metrics.bodyweight}</span>
                    <span className="text-xs font-mono font-bold text-gray-600 uppercase tracking-widest">kg</span>
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-voro-primary hover:text-white border border-white/5 rounded-2xl transition-all duration-500 group/prof text-left outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
                >
                  <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.25em]">Sync Biological Mass</span>
                  <ChevronRight size={14} className="text-gray-600 group-hover/prof:text-white transition-all group-hover/prof:translate-x-1.5" />
                </button>
              </div>
            </Card>
          </div>

          {/* Upgraded Dynamic Objective Cards */}
          <div className="lg:col-span-8 flex">
            <Card variant="premium" nodeId="OBJ_TRACK" className="p-10 flex flex-col justify-between w-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-10">
                <div className="space-y-1">
                  <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] block">PHYSIOLOGICAL_TARGETS</span>
                  <h4 className="text-2xl font-serif italic font-bold text-white tracking-tight">Kinetic Benchmarks</h4>
                </div>
                <div className="px-3.5 py-1.5 bg-voro-primary/10 border border-voro-primary/20 text-voro-primary font-mono text-[0.55rem] font-black rounded-lg uppercase tracking-widest">
                  Adaptation Objectives
                </div>
              </div>

              {/* High-end GPU accelerated scale progress elements */}
              <div className="space-y-12">
                {/* Objective Bench Press */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">Neuromuscular Bench target // 150 kg</span>
                    <span className="text-xl font-mono font-bold text-white">{((metrics.maxBench / 150) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="relative h-2 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden p-0.5 backdrop-blur-sm shadow-inner">
                    <div
                      className="h-full rounded-full bg-voro-primary transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                      style={{ transform: `scaleX(${Math.min(metrics.maxBench / 150, 1)})` }}
                    >
                      <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-20" />
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent blur-sm" />
                    </div>
                  </div>
                </div>

                {/* Objective Squat Load */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">Somatic Squat target // 200 kg</span>
                    <span className="text-xl font-mono font-bold text-white">{((metrics.maxSquat / 200) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="relative h-2 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden p-0.5 backdrop-blur-sm shadow-inner">
                    <div
                      className="h-full rounded-full bg-voro-secondary transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                      style={{ transform: `scaleX(${Math.min(metrics.maxSquat / 200, 1)})` }}
                    >
                      <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-20" />
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent blur-sm" />
                    </div>
                  </div>
                </div>

                {/* Objective Deadlift */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">Absolute Deadlift target // 240 kg</span>
                    <span className="text-xl font-mono font-bold text-white">{((metrics.maxDeadlift / 240) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="relative h-2 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden p-0.5 backdrop-blur-sm shadow-inner">
                    <div
                      className="h-full rounded-full bg-voro-accent transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                      style={{ transform: `scaleX(${Math.min(metrics.maxDeadlift / 240, 1)})` }}
                    >
                      <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-20" />
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent blur-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 mt-10 text-center select-none pointer-events-none">
                <span className="text-[0.5rem] font-mono text-gray-700 uppercase tracking-[0.3em]">CONTINUOUS ADAPTATION OVERLOAD TIMELINE SYSTEM ACTIVE</span>
              </div>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PerformanceMetrics;
