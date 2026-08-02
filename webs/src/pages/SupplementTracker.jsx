import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react';
import { Plus, Trash2, Pill, Calendar, Activity, Zap, ShieldAlert, BadgeCheck, Leaf, Search, Filter, AlertTriangle } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { supplements } from '@/data/supplements';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters & pre-processed datasets.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in loops
 * and eliminates repeated lowercasing of search strings on every keystroke.
 */
const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const PRE_PROCESSED_SUPPLEMENTS = supplements.map(s => ({
  ...s,
  _nameLower: s.name.toLowerCase(),
  _categoryLower: s.category.toLowerCase(),
  _descriptionLower: (s.description || '').toLowerCase()
}));

const STABLE_CATEGORIES = [
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
];

const DIAGNOSTIC_MESSAGES = [
  "Attuning bio-availability parameters...",
  "Aligning molecular composition pathways...",
  "Calibrating active-ingredient receptor buffers...",
  "Establishing endocrine homeostasis targets...",
  "Verifying compound synergy markers...",
  "Registering exogenous integration protocols...",
  "Optimizing gastrointestinal absorption curves...",
  "Synchronizing cellular telemetry metadata..."
];

/**
 * ⚡ REFINEMENT: CatalogItem component.
 * Implements direct DOM custom property manipulation for 60fps performance
 * and a static focus tilt pattern for high keyboard accessibility.
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

    // Volumetric Tilt (max 15 degrees)
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
      className="relative p-8 rounded-[2rem] bg-gradient-to-b from-[#0A0C14]/90 to-black/95 border border-white/5 hover:border-voro-primary/30 transition-all text-left group flex flex-col justify-between h-56 focus-visible:ring-2 focus-visible:ring-voro-primary outline-none overflow-hidden"
    >
      {/* Interactive liquid backglow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(180px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.1), transparent 80%)`,
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
        <p className="text-[0.55rem] font-mono font-bold text-voro-primary tracking-[0.3em] uppercase">{supp.category}</p>
        <h4 className="text-xl font-serif italic text-white font-medium group-hover:text-voro-primary transition-colors leading-tight">{supp.name}</h4>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-light">{supp.description}</p>
      </div>

      <div className="flex justify-between items-center w-full border-t border-white/5 pt-4 z-10" style={{ transform: 'translateZ(20px)' }}>
        <span className="text-[0.65rem] font-mono font-bold text-gray-400">
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

const SupplementTracker = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to the relevant 'supplements' key. This ensures the component
   * only re-renders when the supplement protocol is modified.
   */
  const userSupplements = useStorageKey('supplements') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  const [showForm, setShowForm] = useState(false);
  const [confirmingRemoveId, setConfirmingRemoveId] = useState(null);

  // Focus state map to handle static 3D tilt for keyboard accessibility
  const [focusedCardId, setFocusedCardId] = useState(null);

  // Interactive apothecary filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cinematic 'Synthesis Protocol Alignment' simulated diagnostic state
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

  // Reset confirmation state after timeout
  useEffect(() => {
    if (confirmingRemoveId) {
      const timer = setTimeout(() => setConfirmingRemoveId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingRemoveId]);

  // Synthesis diagnostic loops
  useEffect(() => {
    if (isSynthesizing) {
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

  const handleAddSupplement = (supplement) => {
    setSynthesizingSupp(supplement);
    setIsSynthesizing(true);
    setDiagnosticIndex(0);
    setShowForm(false);
  };

  const handleRemove = async (id) => {
    if (confirmingRemoveId === id) {
      const updated = userSupplements.filter(s => s.id !== id);
      await setItem('supplements', updated);
      addNotification('Supplement removed from protocol.', 'info');
      setConfirmingRemoveId(null);
    } else {
      setConfirmingRemoveId(id);
    }
  };

  // Pre-lowercase filter mapping
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

  const ticks = useMemo(() => Array.from({ length: 60 }).map((_, i) => (
    <rect
      key={i}
      x="127.5"
      y="12"
      width="1.5"
      height={i % 5 === 0 ? "10" : "4"}
      fill={i % 5 === 0 ? "rgba(124, 58, 237, 0.4)" : "rgba(255, 255, 255, 0.1)"}
      transform={`rotate(${i * 6}, 128, 128)`}
    />
  )), []);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-hidden bg-boutique-grain">

      {/* Cinematic Custom Embedded Styles */}
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

      {/* Cinematic Ambient Backglows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-voro-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-voro-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Cinematic 'Synthesis Protocol Alignment' simulated diagnostic loading overlay */}
      {isSynthesizing && synthesizingSupp && (
        <div className="fixed inset-0 bg-[#020408]/95 backdrop-blur-3xl z-50 flex flex-col items-center justify-center animate-fade-in pointer-events-auto">
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Concentric rotating rings */}
            <div className="absolute inset-[-20px] rounded-full border border-dashed border-voro-primary/20 animate-orbit-clockwise pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-dashed border-voro-secondary/20 animate-orbit-counter pointer-events-none" />

            {/* Luminous Core */}
            <div className="absolute inset-4 rounded-full bg-voro-primary/5 blur-3xl animate-pulse" />

            {/* SVG circle and ticks */}
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
              {ticks}
            </svg>

            {/* Central Core Text Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-6">
              <span className="text-[0.55rem] font-mono font-bold tracking-[0.4em] text-voro-primary uppercase mb-2">Synthesis Sync</span>
              <p className="text-xl font-serif italic text-white font-medium mb-1 truncate max-w-[200px]">{synthesizingSupp.name}</p>
              <span className="text-[0.6rem] font-mono font-semibold text-gray-500 uppercase tracking-widest mt-2">ALIGNED</span>
            </div>
          </div>

          {/* Diagnostics Display Terminal */}
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
                // reset filters
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
            {/* Catalog header, search and filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
              <div>
                <h3 className="text-2xl font-serif italic text-white font-bold">Bioactive Formulations</h3>
                <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest mt-1">Select an exogenous compound to initiate cellular protocol</p>
              </div>

              {/* Dynamic Search Box */}
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

            {/* Interactive Luxury Category Selection Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/5 overflow-x-auto scrollbar-none">
              {STABLE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[0.55rem] font-black uppercase tracking-[0.2em] transition-all border ${
                    selectedCategory === cat
                      ? 'bg-voro-primary text-white border-voro-primary shadow-lg shadow-voro-primary/20'
                      : 'bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/10 hover:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Apothecary Catalog Grid */}
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
            {userSupplements.map(supp => {
              const isCardFocused = focusedCardId === supp.id;
              const displayDosage = supp.servingSize
                ? `${supp.servingSize} ${supp.servingSizeUnit || ''}`
                : `${supp.dosageMin}–${supp.dosageMax} ${supp.dosageUnit || ''}`;

              return (
                <Card
                  key={supp.id}
                  variant="premium"
                  nodeId={`SUPP_0x${supp.id?.toString().slice(-4).toUpperCase()}`}
                  className={`group relative p-10 hover:border-white/15 transition-all duration-700 h-[480px] flex flex-col justify-between`}
                  tabIndex="0"
                  onFocus={() => setFocusedCardId(supp.id)}
                  onBlur={() => setFocusedCardId(null)}
                  style={{
                    transform: isCardFocused
                      ? 'perspective(1200px) rotateX(4deg) rotateY(-4deg) translateY(-4px)'
                      : undefined,
                    transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {/* Card Editorial Header */}
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em]">
                          {supp.category?.toUpperCase() || 'BIOACTIVE'}
                        </p>
                        <h3 className="text-3xl font-serif italic font-medium text-white tracking-[-0.02em] leading-tight">
                          {supp.name}
                        </h3>
                      </div>

                      {/* Double confirmation delete layout */}
                      <button
                        onClick={() => handleRemove(supp.id)}
                        aria-label={confirmingRemoveId === supp.id ? `Confirm removal of ${supp.name}` : `Remove ${supp.name} from protocol`}
                        className={`p-3 rounded-2xl transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-red-500 border relative ${
                          confirmingRemoveId === supp.id
                            ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse opacity-100'
                            : 'text-gray-600 hover:text-red-400 hover:bg-red-400/10 border-white/5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
                        }`}
                      >
                        {confirmingRemoveId === supp.id ? <ShieldAlert size={16} /> : <Trash2 size={16} />}
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 font-medium leading-relaxed italic line-clamp-2">
                      "{supp.description || 'No detailed pharmacological synthesis available for this specific exogenous compound.'}"
                    </p>
                  </div>

                  {/* Molecular Bio-Availability Grid */}
                  <div className="my-8 space-y-6 border-y border-white/5 py-6">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Dosage details */}
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-voro-primary">
                          <Activity size={14} />
                        </div>
                        <div>
                          <p className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Bio-Dose</p>
                          <p className="text-xs font-mono font-bold text-white uppercase mt-0.5">{displayDosage}</p>
                        </div>
                      </div>

                      {/* Timeline / Initiation */}
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-voro-primary">
                          <Calendar size={14} />
                        </div>
                        <div>
                          <p className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Initiated</p>
                          <p className="text-xs font-mono font-bold text-white uppercase mt-0.5">
                            {fullDateFormatter.format(new Date(supp.startDate))}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Benefits visualization */}
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

                  {/* Aesthetic and Dietary Tags Footer */}
                  <div className="flex items-center justify-between border-t border-white/[0.02] pt-4">
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
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-40 text-center border border-dashed border-white/5 rounded-[3rem] bg-[#0A0C14]/20 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white opacity-[0.01] group-hover:opacity-[0.03] transition-opacity duration-1000" />
            <div className="w-24 h-24 bg-white/[0.01] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform duration-700">
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
