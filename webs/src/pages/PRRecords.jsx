import React, { useEffect, useMemo, useRef, useState, useId } from 'react';
import { Trophy, Zap, Shield, Cpu, Activity, TrendingUp, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { useStorageKey } from '@/hooks/useStorage';
import { exercises } from '@/data/exercises';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in loops.
 */
const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static exercise metadata map.
 * Prevents O(N) reduction of the exercises data on every render.
 */
const EXERCISE_METADATA_MAP = exercises.reduce((acc, e) => {
  acc[e.id] = {
    name: e.name,
    category: e.category,
    equipment: e.equipment,
    difficulty: e.difficulty
  };
  return acc;
}, {});

/**
 * ⚡ REFINEMENT: Bespoke Apex Force Telemetry Node.
 * Conforms to the 'Forge' luxury standard with 3D volumetric transforms,
 * magnetic mouse tracking, and real-time One-Rep Max calculation.
 */
const ApexPRCard = ({ item, nodeId }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Derive peak estimated 1RM using Epley's Formula
  const estimated1RM = useMemo(() => {
    if (!item.records || item.records.length === 0) return 0;
    // Find the max estimated 1RM across all records
    return Math.max(...item.records.map(r => {
      const w = parseFloat(r.weight) || 0;
      const reps = parseInt(r.reps) || 1;
      if (reps === 1) return w;
      return w * (1 + reps / 30);
    }));
  }, [item.records]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 15 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 30;
    const tiltX = (0.5 - (y / rect.height)) * 30;

    // Internal dynamic style updates
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
      // 4-degree static tilt on focus for accessibility compliance
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
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
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="article"
      aria-label={`Personal Records for ${item.exerciseName}. Category: ${item.category}. Estimated One-Rep Max is ${estimated1RM.toFixed(1)} kilograms.`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-6px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative bg-[#0A0C14] border border-white/5 rounded-[3rem] p-10 overflow-hidden group/card cursor-pointer transition-all duration-700 hover:border-white/20 hover:shadow-[0_80px_160px_rgba(0,0,0,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]"
    >
      {/* Precision Grid & Boutique Grain Overlay */}
      <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/card:opacity-[0.03] transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.1), transparent 50%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Atmospheric Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-[0.04] transition-opacity duration-1000 blur-3xl -z-10 bg-voro-primary"
        style={{ transform: 'translateZ(-20px)' }}
      />

      <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
        {/* Card Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-voro-primary">
                {item.category}
              </span>
              <div className="h-px w-4 bg-voro-primary/30" />
              <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-gray-600">
                {item.equipment}
              </span>
            </div>
            <h3 className="text-3xl font-serif italic font-medium text-white tracking-tight group-hover/card:text-voro-primary transition-colors duration-500">
              {item.exerciseName}
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-600 group-hover/card:text-voro-primary group-hover/card:bg-voro-primary/5 group-hover/card:border-voro-primary/10 transition-all duration-700">
            <Trophy size={20} />
          </div>
        </div>

        {/* Real-time 1RM Estimate & Stats Telemetry */}
        <div className="grid grid-cols-2 gap-6 mb-8 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
          <div>
            <span className="text-[0.5rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 block mb-1">Estimated 1RM</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-serif italic font-bold text-voro-primary">
                {estimated1RM.toFixed(1)}
              </span>
              <span className="text-[0.6rem] font-mono text-gray-600 font-bold uppercase tracking-widest">kg</span>
            </div>
          </div>
          <div>
            <span className="text-[0.5rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 block mb-1">Adaptation Level</span>
            <span className="text-sm font-mono font-bold text-gray-300 uppercase tracking-wider block mt-1">
              {item.difficulty || "Advanced"}
            </span>
          </div>
        </div>

        {/* PR History List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-gray-600 mb-2">
            <Sparkles size={12} className="text-voro-accent" />
            <span>Telemetry Manifest</span>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar">
            {item.records.map((record, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${
                  idx === 0
                    ? 'bg-voro-primary/[0.03] border-voro-primary/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.02)]'
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}
              >
                <div>
                  <div className="text-lg font-mono font-bold text-white flex items-center gap-1">
                    <span>{record.weight}</span>
                    <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">kg</span>
                    <span className="mx-2 text-gray-800 text-xs">×</span>
                    <span>{record.reps}</span>
                    <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">reps</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em] mt-2">
                    <Calendar size={10} className="text-gray-700" />
                    <span>{fullDateFormatter.format(new Date(record.date))}</span>
                  </div>
                </div>

                {idx === 0 && (
                  <Badge variant="voro-accent" dot className="px-3 py-1.5 text-[0.55rem] tracking-[0.15em] uppercase font-bold">
                    APEX
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Bottom Edge Accent */}
      <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover/card:via-voro-primary/30 transition-all duration-1000" />
    </div>
  );
};

const PRRecords = () => {
  const prHistory = useStorageKey('pr_history');
  const pageId = useId();

  useEffect(() => {
    document.title = 'VORO | Absolute Force Telemetry Vault';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data synthesis using useMemo.
   * Eliminates the mount-time double-render cycle and ensures
   * reactivity to storage changes without secondary state management.
   */
  const prs = useMemo(() => {
    const data = prHistory || {};

    return Object.entries(data).map(([exerciseId, records]) => {
      const meta = EXERCISE_METADATA_MAP[exerciseId] || {};
      return {
        exerciseId,
        exerciseName: meta.name || 'Unknown Pattern',
        category: meta.category || 'General',
        equipment: meta.equipment || 'Standard',
        difficulty: meta.difficulty || 'Advanced',
        /* ⚡ PERFORMANCE OPTIMIZATION: Raw Relational Sort Optimization.
           Utilizes raw string relational comparison to avoid both dynamic Date
           allocation and localeCompare engine overhead. Safe-guarded with falls. */
        records: Array.isArray(records) ? [...records].sort((a, b) => {
          const dA = a.date || '';
          const dB = b.date || '';
          return dA < dB ? 1 : dA > dB ? -1 : 0;
        }) : [],
      };
    }).filter(pr => pr.records.length > 0);
  }, [prHistory]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-24 selection:bg-voro-primary/30 relative overflow-hidden">
      {/* Interactive Ambient Backglows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-16 md:py-24">
        {/* Bespoke Header Grid */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.50em] opacity-90">
                Absolute Peak Force Enclave // PR_REGISTRY
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-tighter leading-[0.9]">
              Personal <span className="text-gradient not-italic font-bold">Records</span>
            </h1>

            <p className="text-gray-500 font-sans text-sm md:text-base leading-relaxed max-w-lg">
              A secure cryptographic vault cataloging absolute neuromuscular adaptations and kinetic achievements.
            </p>
          </div>

          {/* Telemetry Counter Box */}
          <div className="p-8 rounded-[2rem] bg-[#0A0C14] border border-white/5 flex items-center gap-6 shadow-2xl">
            <div className="p-4 rounded-xl bg-voro-primary/10 text-voro-primary">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Apex Vectors</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif italic font-bold text-white leading-none">{prs.length}</span>
                <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest font-black">active</span>
              </div>
            </div>
          </div>
        </header>

        {prs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {prs.map((item, idx) => {
              const uniqueNodeId = `PR_NODE_${pageId.replace(/:/g, '')}_${idx}`;
              return (
                <div key={item.exerciseId} className="animate-slide-up" style={{ animationDelay: `${idx * 80}ms` }}>
                  <ApexPRCard item={item} nodeId={uniqueNodeId} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[4rem] bg-[#0A0C14]/40 backdrop-blur-md">
            <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trophy size={40} className="text-gray-700 animate-pulse" />
            </div>
            <h3 className="text-2xl font-serif italic font-medium text-white mb-3">Performance Void</h3>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
              No peak force output records detected. Complete or log a new training session to register an evolution.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRRecords;
