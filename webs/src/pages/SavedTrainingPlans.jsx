import React, { useEffect, useMemo, useState, useCallback, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Layout,
  Download,
  Calendar,
  Zap,
  Cpu,
  AlertTriangle,
  Layers,
  Compass,
  ChevronRight
} from 'lucide-react';
import Button from '@/components/Button';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { CachedDateTimeFormat } from '@/utils/formatters';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted cached formatters.
 * Bypasses re-instantiation of Intl.DateTimeFormat and dynamic Date allocations.
 */
const dateStrFormatter = new CachedDateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

/**
 * ⚡ LUXURY REFINEMENT: KineticBlueprintCard.
 * Conforms to the 'Forge' luxury standard with GPU-accelerated 60fps direct-DOM
 * volumetric 3D tilts, coordinate telemetry overlays, static 4-degree focus offsets,
 * liquid border perimeter glows, and double-confirmation defensive purge sequence.
 */
const KineticBlueprintCard = memo(({ plan, index, onDelete, onAnalyze, onExport }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [purgeState, setPurgeState] = useState(false);
  const purgeTimerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt calculation (max 12 degrees)
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
      // Accessible static 4-degree tilt on keyboard focus
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = '4.0';
      if (tiltYRef.current) tiltYRef.current.innerText = '-4.0';
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const triggerDelete = useCallback((e) => {
    e.stopPropagation();
    if (!purgeState) {
      setPurgeState(true);
      purgeTimerRef.current = setTimeout(() => {
        setPurgeState(false);
      }, 3000);
    } else {
      onDelete(plan.id);
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
      setPurgeState(false);
    }
  }, [purgeState, onDelete, plan.id]);

  useEffect(() => {
    return () => {
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
    };
  }, []);

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
      aria-label={`Kinetic Blueprint: ${plan.name}. Schedule: ${plan.days || 3} days per week. Level: ${plan.level || 'Advanced'}. Node ID: ${plan._nodeId}. ${purgeState ? 'Pending deletion confirmation.' : ''}`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-6px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative bg-[#0A0C14] border border-white/5 rounded-[3rem] p-10 overflow-hidden group cursor-pointer
        transition-all duration-700 hover:border-voro-primary/30 hover:shadow-[0_60px_120px_rgba(0,0,0,0.9)]
        focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none
        animate-slide-up flex flex-col justify-between h-full
        ${purgeState ? 'border-red-500/40 bg-red-950/10 shadow-[0_20px_50px_rgba(239,68,68,0.15)]' : ''}
      `}
    >
      {/* Precision Grid & Boutique Grain Architecture */}
      <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.04] transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(450px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.12), transparent 50%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* 🛰️ Liquid Border Perimeter Illumination */}
      <div
        className="absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.4), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{plan._nodeId}]</span>
        </div>
      </div>

      {/* Atmospheric Backglow Aura */}
      <div
        className="absolute top-0 right-0 w-36 h-36 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-voro-primary/15 transition-colors duration-1000"
        style={{ transform: 'translateZ(-10px)' }}
      />

      <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
        {/* Card Header & Purge Trigger */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-voro-primary shadow-inner group-hover:scale-110 group-hover:border-voro-primary/30 transition-all duration-500">
              <Layout size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[0.55rem] font-mono font-bold text-voro-primary uppercase tracking-[0.3em]">
                  {plan._formattedDate}
                </span>
                <span className="text-gray-700">•</span>
                <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest">
                  {plan.level || 'Advanced'}
                </span>
              </div>
              <h3 className="text-2xl font-serif italic font-bold text-white tracking-tight group-hover:text-voro-primary transition-colors duration-500">
                {plan.name}
              </h3>
            </div>
          </div>

          {/* Double-Confirmation Defensive Purge Button */}
          <button
            onClick={triggerDelete}
            aria-label={purgeState ? `Confirm deletion of blueprint: ${plan.name}` : `Delete blueprint: ${plan.name}`}
            className={`
              p-3.5 rounded-2xl transition-all duration-500 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider outline-none focus-visible:ring-2 focus-visible:ring-red-500 border
              ${purgeState
                ? 'text-red-400 bg-red-500/20 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] scale-105 opacity-100'
                : 'text-gray-600 hover:text-red-400 hover:bg-red-400/10 border-white/5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
              }
            `}
          >
            {purgeState ? (
              <>
                <AlertTriangle size={16} className="animate-bounce" />
                <span aria-live="assertive" className="text-[0.6rem] font-black">PURGE?</span>
              </>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>

        {/* Kinetic Protocol Telemetry Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white/[0.015] border border-white/5 group-hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={12} className="text-voro-secondary" />
              <p className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Frequency</p>
            </div>
            <p className="text-lg font-serif italic font-bold text-white tracking-tight">
              {plan.days || 3} <span className="text-[0.6rem] font-mono font-normal text-gray-400 uppercase not-italic">Days / Wk</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.015] border border-white/5 group-hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={12} className="text-voro-accent" />
              <p className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Target Load</p>
            </div>
            <p className="text-lg font-serif italic font-bold text-white tracking-tight">
              {plan.exercisesCount || (plan.days ? plan.days * 4 : 12)} <span className="text-[0.6rem] font-mono font-normal text-gray-400 uppercase not-italic">Exercises</span>
            </p>
          </div>
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="relative z-10 flex gap-4 pt-4 border-t border-white/5" style={{ transform: 'translateZ(50px)' }}>
        <Button
          variant="secondary"
          onClick={() => onAnalyze(plan)}
          className="flex-1 h-14 text-[0.6rem] font-black uppercase tracking-[0.25em] border-white/10 hover:border-voro-primary/40 group/btn"
        >
          <span>Analyze Protocol</span>
          <ChevronRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>

        <button
          onClick={() => onExport(plan)}
          className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
          aria-label={`Export ${plan.name} as JSON`}
        >
          <Download size={18} />
        </button>
      </div>

      {/* Boutique Bottom Edge Accent */}
      <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-voro-primary/40 transition-all duration-1000" />
    </div>
  );
});

KineticBlueprintCard.displayName = 'KineticBlueprintCard';

const SavedTrainingPlans = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to 'plans' key in local storage.
   */
  const plansData = useStorageKey('plans') || {};
  const { setItem } = useStorageMethods();

  // Simulated 2.5-second cinematic loading sequence for initial alignment
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    document.title = 'VORO | Kinetic Blueprint Vault Enclave';

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 20;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  /**
   * ⚡ OPTIMIZATION: Zero-Allocation Data Derivation.
   * Computes formatted dates, node IDs, and metrics synchronously inside useMemo.
   */
  const plans = useMemo(() => {
    const rawPlans = plansData.savedTrainingPlans || [];
    return rawPlans.map(plan => {
      let formattedDate = 'N/A';
      if (plan.createdAt) {
        try {
          formattedDate = dateStrFormatter.format(plan.createdAt);
        } catch (e) {
          // Fail-safe fallback
        }
      }

      return {
        ...plan,
        _formattedDate: formattedDate,
        _nodeId: `KINETIC_BLUEPRINT_0x${plan.id?.toString().slice(-4).toUpperCase() || 'UNKN'}`
      };
    });
  }, [plansData.savedTrainingPlans]);

  const handleDeletePlan = useCallback(async (id) => {
    const rawPlans = plansData.savedTrainingPlans || [];
    const updated = rawPlans.filter(p => p.id !== id);

    await setItem('plans', { ...plansData, savedTrainingPlans: updated });
    addNotification('Kinetic blueprint purged from enclave.', 'info');
  }, [plansData, setItem, addNotification]);

  const handleAnalyzePlan = useCallback((plan) => {
    navigate('/workout/plan', { state: { selectedPlan: plan } });
  }, [navigate]);

  const handleExportJSON = useCallback((plan) => {
    if (!plan) return;
    try {
      const jsonStr = JSON.stringify(plan, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `voro-kinetic-blueprint-${plan.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addNotification('Raw kinetic blueprint exported securely.', 'success');
    } catch (err) {
      addNotification('Secure export failed.', 'error');
    }
  }, [addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-hidden">
      {/* Cinematic Orbital Alignment Loader Sequence */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#020408] flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
            {/* Counter-rotating Orbital CSS Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-voro-primary/20 border-t-voro-primary animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-voro-secondary/20 border-b-voro-secondary animate-spin-reverse" />
            <div className="absolute inset-4 rounded-full border border-voro-accent/30 animate-pulse" />
            <Cpu size={32} className="text-voro-primary animate-pulse" />
          </div>

          <div className="text-center space-y-3 max-w-sm">
            <p className="text-[0.65rem] font-mono font-black uppercase tracking-[0.5em] text-voro-primary">
              Protocol Vault Synthesis Alignment
            </p>
            <p className="text-xs font-serif italic text-gray-400">
              Initializing kinetic neuromuscular blueprint registry... {loadingProgress}%
            </p>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full bg-voro-primary rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(124,58,237,0.8)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Premium Ambient Background Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[130px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20 z-10">
        {/* Boutique Gallery Header */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4 text-voro-primary">
              <Layers size={18} />
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.5em]">
                Neuromuscular Architecture Vault // BLUEPRINT_ENCLAVE
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-[0.9]">
              Blueprint <span className="text-gradient not-italic font-bold">Archive</span>
            </h1>

            <p className="text-gray-500 font-sans text-sm md:text-base leading-relaxed max-w-xl">
              Vault cataloging manifested kinetic training protocols, stimulus distribution sequences, and periodized training structures.
            </p>
          </div>

          <Button
            onClick={() => navigate('/workout/plan')}
            className="group h-16 px-10 shadow-2xl shadow-voro-primary/20 text-[0.7rem] font-black uppercase tracking-[0.4em] flex items-center gap-3"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
            <span>New Kinetic Blueprint</span>
          </Button>
        </header>

        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <KineticBlueprintCard
                key={plan.id}
                plan={plan}
                index={idx}
                onDelete={handleDeletePlan}
                onAnalyze={handleAnalyzePlan}
                onExport={handleExportJSON}
              />
            ))}
          </div>
        ) : (
          /* Kinetic Void Matrix Empty State */
          <div className="py-36 px-8 flex flex-col items-center justify-center text-center rounded-[3.5rem] bg-[#0A0C14]/40 border border-dashed border-white/10 backdrop-blur-md relative overflow-hidden group">
            <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-voro-primary/20 animate-spin-slow" />
              <div className="absolute inset-3 rounded-full border border-dashed border-white/10 animate-spin-reverse" />
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-700 group-hover:text-voro-primary transition-colors duration-700 shadow-inner">
                <Compass size={32} />
              </div>
            </div>

            <h3 className="text-2xl font-serif italic font-medium text-white mb-3">
              Kinetic Void Matrix Detected
            </h3>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed mb-10">
              No manifested training blueprints found in the vault enclave. Initialize your first periodized stimulus blueprint.
            </p>

            <Button
              onClick={() => navigate('/workout/plan')}
              className="px-10 h-16 shadow-xl shadow-voro-primary/10 text-[0.65rem] font-black uppercase tracking-[0.35em]"
            >
              Synthesize First Blueprint
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTrainingPlans;
