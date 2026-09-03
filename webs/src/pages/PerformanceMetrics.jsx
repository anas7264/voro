import React, { useEffect, useMemo, useRef, useState, memo } from 'react';
import { Zap, TrendingUp, Activity, Scale, Dumbbell, ShieldCheck, Cpu, Target as TargetIcon } from 'lucide-react';
import { Button, LineChartComponent, RadarChartComponent, Stat } from '@/components';
import { useStorageKeySelector } from '@/hooks/useStorage';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted fallback static data structure.
 * Frozen at module load to prevent heap allocations and GC thrashing.
 */
const DEFAULT_PERFORMANCE = Object.freeze({
  avgVolume: 18500,
  maxBench: 140,
  maxSquat: 180,
  maxDeadlift: 200,
  bodyweight: 80,
});

const selectPerformanceData = (data) => data || DEFAULT_PERFORMANCE;

/**
 * ⚡ REFINEMENT: KineticCapabilityNode Component.
 * Features 3D volumetric tilt tracking, dynamic backglow spotlighting,
 * sub-pixel coordinate telemetry overlays, and W3C APG compliant focus tilt.
 */
const KineticCapabilityNode = memo(({ title, subtitle, icon: Icon, badge, children, nodeId = 'NODE_KNT' }) => {
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

    // Volumetric tilt calculation (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

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
      tabIndex={0}
      role="region"
      aria-label={`${title} capability analysis`}
      style={{
        transform: interactionActive
          ? 'perspective(1600px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-6px)'
          : 'perspective(1600px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="p-10 bg-[#0A0C14] border border-white/5 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.85)] relative overflow-hidden group/knode outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]"
    >
      {/* Precision Grid & Boutique Grain Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/knode:opacity-[0.04] transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover/knode:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 50%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Atmospheric Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover/knode:opacity-[0.05] transition-opacity duration-1000 blur-3xl -z-10 bg-voro-primary"
        style={{ transform: 'translateZ(-10px)' }}
      />

      {/* Spatial Telemetry Coordinate Overlay */}
      <div
        className="absolute top-8 right-10 pointer-events-none opacity-0 group-hover/knode:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em] block mb-1">
              {subtitle}
            </span>
            <h3 className="text-3xl font-serif italic font-medium text-white tracking-tight">
              {title}
            </h3>
          </div>
          {badge ? (
            <span className="text-[0.6rem] font-mono font-bold text-voro-primary uppercase tracking-widest bg-voro-primary/10 px-4 py-2 rounded-full border border-voro-primary/20 shadow-inner">
              {badge}
            </span>
          ) : Icon ? (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-500 group-hover/knode:text-voro-primary group-hover/knode:border-voro-primary/20 transition-all duration-500">
              <Icon size={20} />
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
KineticCapabilityNode.displayName = 'KineticCapabilityNode';

/**
 * ⚡ REFINEMENT: KineticInteractiveCard Component for status and goal modules.
 */
const KineticInteractiveCard = memo(({ children, nodeId = 'NODE_CARD' }) => {
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

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="article"
      style={{
        transform: interactionActive
          ? 'perspective(1600px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-6px)'
          : 'perspective(1600px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="p-10 bg-[#0A0C14] border border-white/5 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.85)] relative overflow-hidden group/icard outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]"
    >
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/icard:opacity-[0.03] transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        <div
          className="absolute inset-0 opacity-0 group-hover/icard:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 50%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/icard:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
        {children}
      </div>
    </div>
  );
});
KineticInteractiveCard.displayName = 'KineticInteractiveCard';

const PerformanceMetrics = () => {
  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity via Selector.
   * Subscribe strictly to 'voro_performance' data slice to isolate re-renders.
   */
  const metrics = useStorageKeySelector('voro_performance', selectPerformanceData);

  useEffect(() => {
    document.title = 'VORO | Kinetic Capabilities Enclave';
  }, []);

  const strengthMetrics = useMemo(() => [
    { lift: 'Bench Press', max: metrics.maxBench, unit: 'kg', color: 'voro-primary' },
    { lift: 'Squat', max: metrics.maxSquat, unit: 'kg', color: 'voro-secondary' },
    { lift: 'Deadlift', max: metrics.maxDeadlift, unit: 'kg', color: 'voro-accent' },
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
    { date: 'Week 4', volume: metrics.avgVolume || 18500 },
  ], [metrics.avgVolume]);

  const wilksScore = useMemo(() =>
    Math.round((metrics.maxBench + metrics.maxSquat + metrics.maxDeadlift) / 3),
  [metrics]);

  const benchTarget = 150;
  const targetProgress = Math.min(100, Math.round((metrics.maxBench / benchTarget) * 100));

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[45%] h-[45%] bg-voro-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        {/* Header Section */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 group/header border-b border-white/5 pb-16">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.50em] opacity-90">
                Absolute Performance // FORCE_TRANSDUCTION
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-[0.9]">
              Kinetic <span className="text-gradient not-italic font-bold">Capabilities</span>
            </h1>

            <p className="text-gray-500 font-sans text-sm md:text-base leading-relaxed max-w-xl">
              A high-fidelity biological analysis of absolute force production, neuromuscular adaptations, and kinetic displacement vectors.
            </p>

            <div className="flex items-center gap-6 pt-2">
              <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent opacity-40 group-hover/header:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <p className="text-gray-600 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-50 whitespace-nowrap">
                Attestation Node: 0xKNT_PERF_VAULT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-[#0A0C14] border border-white/5 shadow-2xl">
            <div className="p-4 rounded-2xl bg-voro-primary/10 text-voro-primary">
              <Cpu size={24} />
            </div>
            <div>
              <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 block mb-1">
                Neuromuscular Efficiency
              </span>
              <span className="text-2xl font-serif italic font-bold text-white">
                Nominal (100%)
              </span>
            </div>
          </div>
        </header>

        {/* Primary Force Production Telemetry Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {strengthMetrics.map((metric, idx) => (
            <Stat
              key={metric.lift}
              label={metric.lift}
              value={metric.max}
              unit={metric.unit}
              icon={Activity}
              color={metric.color}
              nodeId={`KNT_STAT_0${idx + 1}`}
            />
          ))}
          <Stat
            label="Wilks Index"
            value={wilksScore}
            icon={Zap}
            color="voro-primary"
            nodeId="KNT_STAT_WLK"
          />
        </div>

        {/* Interactive Capability Nodes Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          {/* Volume Trajectory Node */}
          <div className="lg:col-span-8">
            <KineticCapabilityNode
              title="Volume Trajectory Matrix"
              subtitle="Tonnage Shift Analysis"
              icon={TrendingUp}
              nodeId="KNT_VOL_NODE"
            >
              <div className="h-[400px] w-full pt-4">
                <LineChartComponent
                  data={volumeData}
                  dataKey="volume"
                  name="Volume (kg)"
                  color="#7C3AED"
                  height={400}
                  strokeWidth={3}
                />
              </div>
            </KineticCapabilityNode>
          </div>

          {/* Capability Spectrum Node */}
          <div className="lg:col-span-4">
            <KineticCapabilityNode
              title="Force Spectrum"
              subtitle="Neuromuscular Map"
              icon={TargetIcon}
              nodeId="KNT_RADAR_NODE"
            >
              <div className="h-[400px] w-full pt-4">
                <RadarChartComponent
                  data={radarData}
                  dataKey="A"
                  name="Force"
                  fill="#10B981"
                  height={400}
                />
              </div>
            </KineticCapabilityNode>
          </div>
        </div>

        {/* Somatic Mass & Kinetic Objectives Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          <KineticInteractiveCard nodeId="KNT_MASS_CARD">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em] block mb-1">
                  Somatic Parameter
                </span>
                <h4 className="text-3xl font-serif italic font-medium text-white tracking-tight">
                  Composition Status
                </h4>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-voro-primary">
                <Scale size={20} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                <div className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] mb-2">
                  System Reference Mass
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif italic font-bold text-white">
                    {metrics.bodyweight}
                  </span>
                  <span className="text-xs font-mono font-black text-gray-500 uppercase tracking-widest">
                    kg
                  </span>
                </div>
              </div>

              <Button className="w-full py-5 rounded-2xl bg-white text-black font-mono font-black uppercase tracking-[0.3em] text-[0.65rem] shadow-2xl hover:bg-voro-primary hover:text-white transition-all duration-500">
                Update Evolution Vector
              </Button>
            </div>
          </KineticInteractiveCard>

          <KineticInteractiveCard nodeId="KNT_GOAL_CARD">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[0.55rem] font-mono font-black text-voro-secondary uppercase tracking-[0.4em] block mb-1">
                  Adaptation Threshold
                </span>
                <h4 className="text-3xl font-serif italic font-medium text-white tracking-tight">
                  Kinetic Objectives
                </h4>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-voro-secondary">
                <Dumbbell size={20} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] block mb-1">
                      Bench Press Target
                    </span>
                    <span className="text-xl font-serif italic font-bold text-white">
                      {benchTarget} kg Target
                    </span>
                  </div>
                  <span className="text-2xl font-mono font-bold text-voro-secondary">
                    {targetProgress}%
                  </span>
                </div>

                <div className="w-full bg-white/5 rounded-full h-3 p-0.5 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-voro-primary to-voro-secondary transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    style={{ width: `${targetProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-voro-secondary/[0.03] border border-voro-secondary/10">
                <ShieldCheck size={14} className="text-voro-secondary" />
                <span className="text-[0.6rem] font-mono font-bold text-gray-400 uppercase tracking-[0.3em]">
                  Progressive Overload Protocol Active
                </span>
              </div>
            </div>
          </KineticInteractiveCard>
        </div>

        {/* Boutique Footer */}
        <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-[0.4em]">
            VORO Kinetic Capabilities Engine v4.2 // Attestation Sealed
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[0.6rem] font-mono text-voro-primary/60 uppercase tracking-[0.3em]">
              Precision Matrix: 60 FPS
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
