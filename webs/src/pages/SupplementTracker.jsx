import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react';
import { Plus, Trash2, Pill, Calendar, Activity, Zap, ShieldAlert, BadgeCheck, Leaf, Search, Filter, AlertTriangle, Sparkles } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { supplements } from '@/data/supplements';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters & pre-processed static data structures.
 * Eliminates heap allocations and redundant computations per render cycle.
 */
const EMPTY_ARRAY = Object.freeze([]);
const selectSupplements = (s) => (Array.isArray(s) ? s : EMPTY_ARRAY);

const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const PRE_PROCESSED_SUPPLEMENTS = Object.freeze(
  supplements.map(s => ({
    ...s,
    _nameLower: s.name.toLowerCase(),
    _categoryLower: s.category.toLowerCase(),
    _descriptionLower: (s.description || '').toLowerCase()
  }))
);

const STABLE_CATEGORIES = Object.freeze([
  'All',
  'Protein',
  'Strength',
  'Pre-Workout',
  'Amino Acids',
  'Vitamins',
  'Minerals',
  'Adaptogen',
  'Nootropic',
  'Fat Loss',
  'Joint Health',
  'Recovery',
  'Hydration',
  'Sleep'
]);

const DIAGNOSTIC_MESSAGES = Object.freeze([
  "Attuning bio-availability parameters...",
  "Aligning molecular composition pathways...",
  "Calibrating active-ingredient receptor buffers...",
  "Establishing endocrine homeostasis targets...",
  "Verifying compound synergy markers...",
  "Registering exogenous integration protocols...",
  "Optimizing gastrointestinal absorption curves...",
  "Synchronizing cellular telemetry metadata..."
]);

const TICKS_60 = Object.freeze(
  Array.from({ length: 60 }, (_, i) => (
    <rect
      key={i}
      x="127.5"
      y="12"
      width="1.5"
      height={i % 5 === 0 ? "10" : "4"}
      fill={i % 5 === 0 ? "rgba(124, 58, 237, 0.5)" : "rgba(255, 255, 255, 0.1)"}
      transform={`rotate(${i * 6}, 128, 128)`}
    />
  ))
);

/**
 * ⚡ REFINEMENT: CatalogItem component.
 * Features 60fps direct-DOM 3D volumetric hover tilt tracking (--tilt-x, --tilt-y),
 * live spatial coordinate telemetry, and APG-compliant static focus tilt.
 */
const CatalogItem = memo(({ supp, onAdd }) => {
  const cardRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 15;
    const tiltX = (0.5 - (y / rect.height)) * 15;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '4deg');
      cardRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const displayDosage = supp.servingSize
    ? `${supp.servingSize} ${supp.servingSizeUnit || ''}`
    : `${supp.dosageMin}–${supp.dosageMax} ${supp.dosageUnit || ''}`;

  const nodeId = `CATALOG_0x${supp.id?.toString().slice(-4).toUpperCase()}`;

  return (
    <button
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={() => onAdd(supp)}
      style={{
        transform: isFocused
          ? 'perspective(1200px) rotateX(4deg) rotateY(-4deg) translateY(-4px)'
          : 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
        transition: isFocused ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative p-8 rounded-[2rem] bg-gradient-to-b from-[#0A0C14]/90 to-black/95 border border-white/5 hover:border-voro-primary/30 transition-all text-left group flex flex-col justify-between h-60 focus-visible:ring-2 focus-visible:ring-voro-primary outline-none overflow-hidden shadow-xl hover:shadow-2xl"
    >
      {/* Interactive liquid backglow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(180px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.12), transparent 80%)`,
          transform: 'translateZ(10px)'
        }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.01] pointer-events-none" />

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(40px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={txRef}>0.0</span>°</span>
          <span>TY_<span ref={tyRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="space-y-3 z-10" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between">
          <p className="text-[0.55rem] font-mono font-bold text-voro-primary tracking-[0.3em] uppercase">{supp.category}</p>
          <span className="text-[0.45rem] font-mono text-gray-600 uppercase tracking-widest">0xFORM_{supp.id}</span>
        </div>
        <h4 className="text-xl font-serif italic text-white font-medium group-hover:text-voro-primary transition-colors leading-tight">{supp.name}</h4>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-light">{supp.description}</p>
      </div>

      <div className="flex justify-between items-center w-full border-t border-white/5 pt-4 z-10" style={{ transform: 'translateZ(20px)' }}>
        <span className="text-[0.65rem] font-mono font-bold text-gray-300">
          DOSE // {displayDosage}
        </span>
        {supp.studyBacked && (
          <span className="text-[0.5rem] font-mono font-black text-voro-secondary bg-voro-secondary/10 border border-voro-secondary/20 px-2 py-0.5 rounded uppercase tracking-wider">
            Study Backed
          </span>
        )}
      </div>
    </button>
  );
});

CatalogItem.displayName = 'CatalogItem';

/**
 * ⚡ REFINEMENT: ActiveProtocolCard Component.
 * Implements Voro's elite 'Forge' luxury system aesthetic with 60fps direct-DOM tracking,
 * 3-second self-canceling double-confirmation guard ('PURGE?'), and static keyboard focus tilt.
 */
const ActiveProtocolCard = memo(({ supp, index, onRemove }) => {
  const cardRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const purgeTimerRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  useEffect(() => {
    return () => {
      if (purgeTimerRef.current) {
        clearTimeout(purgeTimerRef.current);
      }
    };
  }, []);

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

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '4deg');
      cardRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
    }
    if (isPurging) {
      setIsPurging(false);
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
    }
  };

  const handlePurgeClick = (e) => {
    e.stopPropagation();
    if (isPurging) {
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
      onRemove(supp.id);
    } else {
      setIsPurging(true);
      purgeTimerRef.current = setTimeout(() => {
        setIsPurging(false);
      }, 3000);
    }
  };

  const displayDosage = supp.servingSize
    ? `${supp.servingSize} ${supp.servingSizeUnit || ''}`
    : `${supp.dosageMin}–${supp.dosageMax} ${supp.dosageUnit || ''}`;

  const formattedStartDate = useMemo(() => {
    try {
      return fullDateFormatter.format(new Date(supp.startDate));
    } catch {
      return 'ACTIVE';
    }
  }, [supp.startDate]);

  const nodeId = `SUPP_0x${supp.id?.toString().slice(-4).toUpperCase()}`;
  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (cardRef.current) {
          cardRef.current.style.setProperty('--tilt-x', '0deg');
          cardRef.current.style.setProperty('--tilt-y', '0deg');
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="article"
      aria-label={`${supp.name}. Category: ${supp.category || 'Bioactive'}. Status: Protocol Active.`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        animationDelay: `${index * 50}ms`
      }}
      className="group relative p-10 rounded-[2.5rem] bg-[#0A0C14] border border-white/5 hover:border-voro-primary/30 transition-all duration-700 h-[480px] flex flex-col justify-between shadow-2xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] overflow-hidden"
    >
      {/* Precision Grid & Luminous Lens Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.015]" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 60%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/50 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={txRef}>0.0</span>°</span>
          <span>TY_<span ref={tyRef}>0.0</span>°</span>
          <span className="text-white/10">[{nodeId}]</span>
        </div>
      </div>

      {/* Card Editorial Header */}
      <div className="space-y-6 relative z-10" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em]">
              {supp.category?.toUpperCase() || 'BIOACTIVE'}
            </p>
            <h3 className="text-3xl font-serif italic font-medium text-white tracking-[-0.02em] leading-tight">
              {supp.name}
            </h3>
          </div>

          {/* Defensive Purge Controller */}
          <button
            onClick={handlePurgeClick}
            aria-label={isPurging ? `CONFIRM PURGE FOR ${supp.name}` : `Request decommission of ${supp.name}`}
            className={`p-3.5 rounded-2xl transition-all duration-500 border ${
              isPurging
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/20'
                : 'bg-white/[0.01] border-white/5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/10'
            } outline-none focus-visible:ring-2 focus-visible:ring-red-500`}
          >
            {isPurging ? (
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="animate-pulse" />
                <span className="text-[0.55rem] font-mono font-black tracking-widest">PURGE?</span>
              </div>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 font-medium leading-relaxed italic line-clamp-2">
          "{supp.description || 'No detailed pharmacological synthesis available for this specific exogenous compound.'}"
        </p>
      </div>

      {/* Bio-Availability Grid */}
      <div className="my-8 space-y-6 border-y border-white/5 py-6 relative z-10" style={{ transform: 'translateZ(25px)' }}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-voro-primary">
              <Activity size={14} />
            </div>
            <div>
              <p className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Bio-Dose</p>
              <p className="text-xs font-mono font-bold text-white uppercase mt-0.5">{displayDosage}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-voro-primary">
              <Calendar size={14} />
            </div>
            <div>
              <p className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Initiated</p>
              <p className="text-xs font-mono font-bold text-white uppercase mt-0.5">
                {formattedStartDate}
              </p>
            </div>
          </div>
        </div>

        {supp.benefits && supp.benefits.length > 0 && (
          <div className="space-y-2">
            <p className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Bioactive Benefits</p>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
              {supp.benefits.slice(0, 3).map((benefit, idx) => (
                <span
                  key={idx}
                  className="text-[0.55rem] font-mono font-medium text-gray-400 bg-white/[0.02] border border-white/[0.04] px-2 py-0.5 rounded-md uppercase tracking-wider"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tags Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.02] pt-4 relative z-10" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex gap-2">
          {supp.studyBacked && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-voro-secondary/10 border border-voro-secondary/20 rounded-lg text-voro-secondary">
              <BadgeCheck size={12} />
              <span className="text-[0.55rem] font-mono font-black uppercase tracking-wider">Clinically Proven</span>
            </div>
          )}
          {supp.vegan && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <Leaf size={11} />
              <span className="text-[0.55rem] font-mono font-black uppercase tracking-wider">Vegan</span>
            </div>
          )}
        </div>

        {!supp.studyBacked && !supp.vegan && (
          <span className="text-[0.45rem] font-mono text-gray-600 uppercase tracking-widest">
            APOTHECARY PROTOCOL V1.0
          </span>
        )}
      </div>
    </div>
  );
});

ActiveProtocolCard.displayName = 'ActiveProtocolCard';

const SupplementTracker = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity via selector hook.
   */
  const userSupplements = useStorageKeySelector('supplements', selectSupplements);

  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  const [showForm, setShowForm] = useState(false);

  // Interactive filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Diagnostic synthesis state
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizingSupp, setSynthesizingSupp] = useState(null);
  const [diagnosticIndex, setDiagnosticIndex] = useState(0);

  const activeSupplementsRef = useRef(userSupplements);

  useEffect(() => {
    document.title = 'VORO | Supplement Tracker';
  }, []);

  useEffect(() => {
    activeSupplementsRef.current = userSupplements;
  }, [userSupplements]);

  // Diagnostic sequence loop with test bypass hook
  useEffect(() => {
    if (isSynthesizing && synthesizingSupp) {
      const isTestBypass = typeof window !== 'undefined' && (
        window.__VORO_TEST_BYPASS__ ||
        localStorage.getItem('voro_test_mode') === 'true'
      );

      if (isTestBypass) {
        const runBypass = async () => {
          const updated = [...activeSupplementsRef.current, {
            ...synthesizingSupp,
            id: Date.now(),
            startDate: new Date().toISOString(),
            adherence: [],
          }];
          await setItem('supplements', updated);
          setIsSynthesizing(false);
          setSynthesizingSupp(null);
          addNotification(`${synthesizingSupp.name} integrated into active protocol.`, 'success');
        };
        runBypass();
        return;
      }

      const diagInterval = setInterval(() => {
        setDiagnosticIndex(prev => (prev + 1) % DIAGNOSTIC_MESSAGES.length);
      }, 300);

      const completionTimer = setTimeout(async () => {
        const updated = [...activeSupplementsRef.current, {
          ...synthesizingSupp,
          id: Date.now(),
          startDate: new Date().toISOString(),
          adherence: [],
        }];
        await setItem('supplements', updated);
        setIsSynthesizing(false);
        setSynthesizingSupp(null);
        addNotification(`${synthesizingSupp.name} integrated into active protocol.`, 'success');
      }, 2500);

      return () => {
        clearInterval(diagInterval);
        clearTimeout(completionTimer);
      };
    }
  }, [isSynthesizing, synthesizingSupp, setItem, addNotification]);

  const handleAddSupplement = useCallback((supplement) => {
    setSynthesizingSupp(supplement);
    setIsSynthesizing(true);
    setDiagnosticIndex(0);
    setShowForm(false);
  }, []);

  const handleRemove = useCallback(async (id) => {
    const updated = activeSupplementsRef.current.filter(s => s.id !== id);
    await setItem('supplements', updated);
    addNotification('Supplement removed from protocol.', 'info');
  }, [setItem, addNotification]);

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const cat = selectedCategory;

    return PRE_PROCESSED_SUPPLEMENTS.filter(supp => {
      const matchesCategory = cat === 'All' || supp.category === cat;
      const matchesSearch = !q ||
        supp._nameLower.includes(q) ||
        supp._categoryLower.includes(q) ||
        supp._descriptionLower.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-hidden bg-boutique-grain">
      {/* Dynamic sweep animation styles */}
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes synthesis-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes synthesis-progress-draw {
          0% { stroke-dashoffset: 678; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-orbit-clockwise {
          animation: orbit-cw 20s linear infinite;
        }
        .animate-orbit-counter {
          animation: orbit-ccw 15s linear infinite;
        }
        .animate-synthesis-progress {
          animation: synthesis-progress-draw 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-synthesis-line {
          animation: synthesis-line 1.5s infinite linear;
        }
      `}</style>

      {/* Ambient Lighting Layers */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-voro-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-voro-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Synthesis Diagnostic Protocol Overlay */}
      {isSynthesizing && synthesizingSupp && (
        <div className="fixed inset-0 bg-[#020408]/95 backdrop-blur-3xl z-50 flex flex-col items-center justify-center animate-fade-in pointer-events-auto">
          <div className="relative w-80 h-80 flex items-center justify-center">
            <div className="absolute inset-[-20px] rounded-full border border-dashed border-voro-primary/20 animate-orbit-clockwise pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-dashed border-voro-secondary/20 animate-orbit-counter pointer-events-none" />
            <div className="absolute inset-4 rounded-full bg-voro-primary/5 blur-3xl animate-pulse" />

            <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 256 256">
              <circle
                cx="128"
                cy="128"
                r="108"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="108"
                stroke="url(#synthesis-grad)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="678"
                strokeDashoffset="678"
                className="animate-synthesis-progress"
              />
              <defs>
                <linearGradient id="synthesis-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              {TICKS_60}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-6">
              <span className="text-[0.55rem] font-mono font-bold tracking-[0.4em] text-voro-primary uppercase mb-2">Synthesis Sync</span>
              <p className="text-xl font-serif italic text-white font-medium mb-1 truncate max-w-[200px]">{synthesizingSupp.name}</p>
              <span className="text-[0.6rem] font-mono font-semibold text-gray-500 uppercase tracking-widest mt-2">ALIGNED</span>
            </div>
          </div>

          <div className="mt-12 text-center max-w-md px-6">
            <p className="text-xs font-mono text-voro-secondary tracking-[0.2em] uppercase mb-4 animate-pulse">
              {DIAGNOSTIC_MESSAGES[diagnosticIndex]}
            </p>
            <div className="w-48 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-voro-primary to-voro-secondary animate-synthesis-line" />
            </div>
            <p className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-[0.3em] mt-6">
              DO NOT TERMINATE CYCLE // SECURE PROVENANCE ATTUNEMENT ACTIVE
            </p>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* 'Forge' Editorial Header System */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Pill size={16} className="animate-pulse" />
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.6em] text-voro-primary">
                Exogenous Catalyst Apothecary
              </span>
              <span className="text-[0.5rem] font-mono font-black text-white/30 px-2 py-0.5 rounded border border-white/5 bg-white/[0.02]">
                0xCATALYST_NODE_v4.2
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-[-0.03em] leading-none">
              Chemical <span className="text-gradient not-italic font-black">Optimization</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.6rem] uppercase tracking-[0.4em]">
              Molecular integration & bioactive cellular protocol matrix
            </p>
          </div>

          <Button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setSelectedCategory('All');
                setSearchQuery('');
              }
            }}
            className="flex items-center gap-3 px-8 py-5 shadow-2xl shadow-voro-primary/10 rounded-full !bg-white !text-black hover:scale-105 active:scale-95 transition-all duration-500"
          >
            <Plus size={16} />
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-black">
              {showForm ? 'Close Apothecary' : 'Integrate Compound'}
            </span>
          </Button>
        </header>

        {showForm && (
          <Card
            variant="premium"
            nodeId="FORM_APOTH"
            className="p-12 mb-16 bg-gradient-to-b from-[#0A0C14] to-black border-voro-primary/20 animate-slide-up"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
              <div>
                <h3 className="text-2xl font-serif italic text-white font-bold">Bioactive Formulations</h3>
                <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest mt-1">Select an exogenous compound to initiate cellular protocol</p>
              </div>

              <div className="relative w-full md:w-80 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-voro-primary transition-colors">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Query molecular library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#020408]/60 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-mono tracking-wider focus:outline-none focus:border-voro-primary focus:ring-1 focus:ring-voro-primary transition-all placeholder:text-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/5 overflow-x-auto scrollbar-none">
              {STABLE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-4 py-2 rounded-full text-[0.55rem] font-black uppercase tracking-[0.2em] transition-all border focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none ${
                    selectedCategory === cat
                      ? 'bg-voro-primary text-white border-voro-primary shadow-lg shadow-voro-primary/20'
                      : 'bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/10 hover:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredCatalog.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCatalog.map(supp => (
                  <CatalogItem
                    key={supp.id}
                    supp={supp}
                    onAdd={handleAddSupplement}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <AlertTriangle size={32} className="mx-auto text-gray-600 mb-4 animate-bounce" />
                <h4 className="text-lg font-serif italic text-white mb-1">No Compounds Found</h4>
                <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest">Adjust your filters or query to locate bioactive matching specimens</p>
              </div>
            )}
          </Card>
        )}

        {userSupplements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userSupplements.map((supp, index) => (
              <ActiveProtocolCard
                key={supp.id}
                supp={supp}
                index={index}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border border-dashed border-white/5 rounded-[3rem] bg-[#0A0C14]/20 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white opacity-[0.01] group-hover:opacity-[0.03] transition-opacity duration-1000" />
            <div className="w-24 h-24 bg-[#0A0C14] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform duration-700">
              <Zap size={36} className="text-gray-700 group-hover:text-voro-primary transition-colors duration-500" />
            </div>
            <h3 className="text-3xl font-serif italic font-bold text-white mb-2">Molecular Void</h3>
            <p className="text-[0.65rem] font-mono text-gray-500 uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed mt-4">
              No exogenous compounds currently integrated. Begin your biochemical optimization sequence.
            </p>
            <div className="mt-10">
              <Button
                onClick={() => setShowForm(true)}
                className="px-10 py-5 rounded-full font-mono text-xs font-black uppercase tracking-widest shadow-xl shadow-voro-primary/5"
              >
                Open Apothecary Catalog
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplementTracker;
