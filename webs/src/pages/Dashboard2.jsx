import React, { useEffect, memo, useRef, useState, useId, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Dumbbell, TrendingDown, ArrowRight, Activity, Zap, Shield, Sparkles } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Progress from '@/components/Progress';
import Header from '@/components/Header';

/**
 * ⚡ PERFORMANCE & DESIGN OPTIMIZATION: Hoisted & Frozen Static Config Datasets
 * Zero heap allocations per component render cycle.
 */
const MATRIX_CONFIGS = Object.freeze([
  {
    id: 'MATRIX_01',
    nodeHash: '0xMX_NTR_01',
    label: 'Nutritional Audit',
    value: '1,850',
    unit: 'kcal logged',
    subtext: 'Target Ceiling: 2,200 kcal',
    icon: BarChart3,
    color: 'voro-info',
    badgeText: 'NOMINAL',
    borderColor: 'hover:border-voro-info/30',
    iconBg: 'bg-voro-info/10 text-voro-info shadow-voro-info/20'
  },
  {
    id: 'MATRIX_02',
    nodeHash: '0xMX_KNT_02',
    label: 'Kinetic Stimulus',
    value: '45',
    unit: 'Min Depth',
    subtext: 'Archetype: Upper Body Push',
    icon: Dumbbell,
    color: 'voro-secondary',
    badgeText: 'ACTIVE',
    borderColor: 'hover:border-voro-secondary/30',
    iconBg: 'bg-voro-secondary/10 text-voro-secondary shadow-voro-secondary/20'
  },
  {
    id: 'MATRIX_03',
    nodeHash: '0xMX_BMT_03',
    label: 'Biological Trajectory',
    value: '↓ 2.5',
    unit: 'kg Mass',
    subtext: 'Temporal Frame: 30D Matrix',
    icon: TrendingDown,
    color: 'voro-primary',
    badgeText: 'OPTIMAL',
    borderColor: 'hover:border-voro-primary/30',
    iconBg: 'bg-voro-primary/10 text-voro-primary shadow-voro-primary/20'
  }
]);

const COMMAND_CONFIGS = Object.freeze([
  {
    code: '01',
    label: 'Log Nutritional Intake',
    path: '/nutrition/diary',
    tag: 'EXPRESS_LOG'
  },
  {
    code: '02',
    label: 'Archive Movement Pattern',
    path: '/workout/log',
    tag: 'KINETIC_REC'
  },
  {
    code: '03',
    label: 'Examine Biometric Logs',
    path: '/body/metrics',
    tag: 'BIOM_AUDIT'
  }
]);

const GOAL_CONFIGS = Object.freeze([
  {
    label: 'Energy Balance',
    value: 1850,
    max: 2200,
    color: 'info',
    unit: 'kcal'
  },
  {
    label: 'Protein Density',
    value: 148,
    max: 160,
    color: 'secondary',
    unit: 'g'
  },
  {
    label: 'Cellular Hydration',
    value: 1300,
    max: 2000,
    color: 'info',
    unit: 'ml'
  }
]);

/**
 * ⚡ LUXURY REFINEMENT: Volumetric 3D Matrix Node Card
 * Direct-DOM 60fps tilt tracking, holographic coordinate telemetry, sub-pixel node hash,
 * and W3C APG compliant static 4-degree keyboard focus tilts.
 */
const KineticMatrixCard = memo(({ item }) => {
  const cardRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const IconComponent = item.icon;

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
      if (tiltXRef.current) tiltXRef.current.innerText = '4.0';
      if (tiltYRef.current) tiltYRef.current.innerText = '-4.0';
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cardRef.current && !isHovered) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (cardRef.current && !isFocused) {
          cardRef.current.style.setProperty('--tilt-x', '0deg');
          cardRef.current.style.setProperty('--tilt-y', '0deg');
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative p-8 sm:p-10 rounded-[2.5rem] bg-[#0A0C14]/80 border border-white/5
        shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)]
        backdrop-blur-2xl flex flex-col justify-between overflow-hidden group/mcard
        outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${item.borderColor}
      `}
    >
      {/* Dynamic Liquid Border Perimeter Glow */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/mcard:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Internal Grain & Surface Optics */}
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/mcard:opacity-[0.03] transition-opacity duration-700 pointer-events-none" />

      {/* Holographic Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/mcard:opacity-100 group-focus-within/mcard:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(70px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/70 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{item.id}]</span>
        </div>
      </div>

      <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
        {/* Card Header Node */}
        <div className="flex items-center justify-between mb-8">
          <div className={`p-4 rounded-2xl ${item.iconBg} backdrop-blur-md transition-transform duration-500 group-hover/mcard:scale-110 shadow-lg`}>
            <IconComponent size={22} />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
            <span className="text-[0.55rem] font-mono font-black text-gray-400 uppercase tracking-[0.4em]">
              {item.badgeText}
            </span>
          </div>
        </div>

        {/* Card Metric Body */}
        <div className="space-y-2">
          <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.35em] text-gray-500 block">
            {item.label}
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-serif italic font-medium text-white tracking-tight leading-none">
              {item.value}
            </span>
            <span className="text-[0.65rem] font-mono font-bold text-gray-500 uppercase tracking-widest">
              {item.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Attestation & Subtext */}
      <div
        className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center justify-between"
        style={{ transform: 'translateZ(30px)' }}
      >
        <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-[0.2em]">
          {item.subtext}
        </span>
        <span className="text-[0.45rem] font-mono text-white/20 tracking-[0.3em] uppercase">
          {item.nodeHash}
        </span>
      </div>
    </div>
  );
});
KineticMatrixCard.displayName = "KineticMatrixCard";

/**
 * ⚡ LUXURY REFINEMENT: Kinetic Interactive Command Node Button
 */
const KineticCommandButton = memo(({ config, onNavigate }) => {
  return (
    <button
      onClick={() => onNavigate(config.path)}
      className="
        w-full group/cmd relative flex items-center justify-between p-6 sm:p-8 rounded-2xl
        bg-white/[0.02] border border-white/5 hover:border-voro-primary/40 hover:bg-voro-primary/[0.04]
        transition-all duration-500 text-left outline-none
        focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14]
      "
    >
      <div className="flex items-center gap-5">
        <span className="font-mono text-xs font-black text-voro-primary/60 group-hover/cmd:text-voro-primary transition-colors">
          [{config.code}]
        </span>
        <span className="text-sm font-serif italic font-medium text-gray-200 group-hover/cmd:text-white transition-colors">
          {config.label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-block font-mono text-[0.45rem] font-bold text-white/20 group-hover/cmd:text-voro-primary/60 tracking-[0.3em] uppercase transition-colors">
          {config.tag}
        </span>
        <div className="p-2 rounded-xl bg-white/5 group-hover/cmd:bg-voro-primary group-hover/cmd:text-white text-gray-400 transition-all duration-500 group-hover/cmd:translate-x-1">
          <ArrowRight size={16} />
        </div>
      </div>
    </button>
  );
});
KineticCommandButton.displayName = "KineticCommandButton";

const Dashboard2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'VORO | Bespoke Systems Architecture';
  }, []);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24 relative overflow-hidden">
      {/* Ambient Background Architectural Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[55%] h-[55%] bg-voro-primary/5 rounded-full blur-[160px] animate-pulse-slow" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[140px] animate-pulse-slow" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20 z-10">
        {/* Gallery Architectural Header Signature */}
        <Header
          eyebrow="System_Architecture_v2.0"
          title={<>Biological <span className="text-voro-primary not-italic font-bold">Trajectory</span></>}
          subtitle="A high-fidelity perspective on your cellular velocity, metabolic balance, and system telemetry."
          action={
            <Button
              onClick={() => navigate('/dashboard')}
              variant="secondary"
              className="!rounded-full border-white/10 hover:border-white/20"
            >
              <Zap size={16} className="text-voro-accent" aria-hidden="true" />
              <span>Standard Apex</span>
            </Button>
          }
        />

        {/* Primary Matrix 3D Telemetry Grid */}
        <section
          role="region"
          aria-label="Biological Trajectory Telemetry Grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16"
        >
          {MATRIX_CONFIGS.map((item) => (
            <KineticMatrixCard key={item.id} item={item} />
          ))}
        </section>

        {/* Architectural Express Commands & Temporal Goals Chamber */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Express Commands Panel */}
          <Card
            className="lg:col-span-6 p-8 sm:p-12 space-y-10 rounded-[3rem] bg-[#0A0C14]/90 border-white/5 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)]"
            variant="glass"
          >
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]"></span>
                </div>
                <h3 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.45em] text-white">
                  Express Commands // 0xCMD_MATRIX
                </h3>
              </div>
              <Shield size={16} className="text-voro-primary/60" />
            </div>

            <div className="space-y-4">
              {COMMAND_CONFIGS.map((cmd) => (
                <KineticCommandButton
                  key={cmd.code}
                  config={cmd}
                  onNavigate={navigate}
                />
              ))}
            </div>

            <div className="pt-4 border-t border-white/[0.03] flex items-center justify-between font-mono text-[0.45rem] text-white/20 tracking-[0.4em] uppercase">
              <span>SECURITY_LAYER_ACTIVE</span>
              <span>ATTESTED_EXPRESS_V2</span>
            </div>
          </Card>

          {/* Temporal Goals Telemetry Panel */}
          <Card
            className="lg:col-span-6 p-8 sm:p-12 space-y-10 rounded-[3rem] bg-[#0A0C14]/90 border-white/5 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)]"
            variant="glass"
          >
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-secondary opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-voro-secondary shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                </div>
                <h3 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.45em] text-white">
                  Temporal Goals // 0xTMP_GOALS
                </h3>
              </div>
              <Sparkles size={16} className="text-voro-secondary/60" />
            </div>

            <div className="space-y-8">
              {GOAL_CONFIGS.map((goal) => (
                <div key={goal.label} className="space-y-2">
                  <Progress
                    label={goal.label}
                    value={goal.value}
                    max={goal.max}
                    color={goal.color}
                  />
                  <div className="flex justify-between items-center text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest px-1">
                    <span>STATUS: {Math.round((goal.value / goal.max) * 100)}% REACHED</span>
                    <span>{goal.value} / {goal.max} {goal.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/[0.03] flex items-center justify-between font-mono text-[0.45rem] text-white/20 tracking-[0.4em] uppercase">
              <span>REALTIME_METABOLIC_SYNC</span>
              <span>0xGOAL_MATRIX_VERIFIED</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;
