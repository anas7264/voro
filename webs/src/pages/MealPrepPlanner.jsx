import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { Calendar, Plus, Clock, Package, ShoppingCart, ChevronRight, Zap, Download, Trash2, AlertTriangle, Check } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

// Cinematic Loading Messages
const CINEMATIC_MESSAGES = [
  '[SYS_INIT] - SYNCHRONIZING PROCURABLE MASS...',
  '[CAL_BIOM] - MAPPING AMINO ACID BIOPRINTS...',
  '[OPTIM_LOG] - SYNCING AMBIENT KINETIC LOGISTICS...',
  '[ALIGN_SYNC] - TROPHIC SYNTHESIS COMPLETED'
];

// ⚡ PERFORMANCE OPTIMIZATION: Hoisted completely static datasets to module level
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DURATION_OPTIONS = ['30 mins', '1 hour', '1.5 hours', '2 hours', '3 hours'];

const DEFAULT_PREP_PLAN = [
  { id: 1, day: 'Sunday', duration: '2 hours', count: 20, recipes: ['Kinetic Chicken & Basmati', 'Atlantic Salmon & Greens', 'Turkey & Sweet Potato Flux'] },
  { id: 2, day: 'Wednesday', duration: '1 hour', count: 10, recipes: ['Egg White Frittata Matrix', 'Overnight Oats Synthesis'] }
];

const DEFAULT_PROVISIONS = [
  { item: 'Kinetic Chicken Breast', qty: '3.0 kg', checked: false },
  { item: 'Atlantic Salmon Fillet', qty: '2.0 kg', checked: true },
  { item: 'Basmati Grains (Bulk)', qty: '5.0 kg', checked: false },
  { item: 'Sweet Potato Tuber', qty: '2.5 kg', checked: false },
  { item: 'Organic Spinach Matrix', qty: '1.0 kg', checked: true },
  { item: 'Liquid Hydration (Oils)', qty: '500 ml', checked: false }
];

/**
 * ⚡ PERFORMANCE OPTIMIZATION: PrepSessionCard.
 * Memoized subcomponent. Incorporates:
 * - Decoupled focus-state tracking and static 4deg keyboard tilt accessibility.
 * - Smooth CSS variables and requestAnimationFrame-throttled hover tilts.
 * - Self-contained 3s self-canceling deletion confirmation mechanics, leaving page-level states untouched.
 */
const PrepSessionCard = React.memo(({ session, index, onDelete }) => {
  const cardRef = useRef(null);
  const teleRefX = useRef(null);
  const teleRefY = useRef(null);
  const rafRef = useRef(null);
  const purgeTimerRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  useEffect(() => {
    return () => {
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 14; // Max 14deg tilt
      const rotateX = (0.5 - (y / rect.height)) * 14;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--lens-x', `${x}px`);
      card.style.setProperty('--lens-y', `${y}px`);

      if (teleRefX.current) teleRefX.current.innerText = rotateX.toFixed(1);
      if (teleRefY.current) teleRefY.current.innerText = rotateY.toFixed(1);
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (teleRefX.current) teleRefX.current.innerText = '0.0';
    if (teleRefY.current) teleRefY.current.innerText = '0.0';
  };

  const handleFocus = () => {
    setIsFocused(true);
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = `perspective(1000px) rotateX(4deg) rotateY(-4deg) scale3d(1.02, 1.02, 1.02)`;
    if (teleRefX.current) teleRefX.current.innerText = '4.0';
    if (teleRefY.current) teleRefY.current.innerText = '-4.0';
  };

  const handleBlur = () => {
    setIsFocused(false);
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (teleRefX.current) teleRefX.current.innerText = '0.0';
    if (teleRefY.current) teleRefY.current.innerText = '0.0';

    if (isPurging) {
      setIsPurging(false);
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
    }
  };

  const handlePurgeClick = (e) => {
    e.stopPropagation();
    if (isPurging) {
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
      onDelete(session.id);
    } else {
      setIsPurging(true);
      purgeTimerRef.current = setTimeout(() => {
        setIsPurging(false);
      }, 3000);
    }
  };

  const sessionHex = `0x${session.id.toString(16).toUpperCase().slice(-4)}`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="listitem"
      aria-label={`Session on ${session.day}. Recipes: ${session.recipes.join(', ')}`}
      className="group relative p-0 overflow-hidden bg-[#0A0C14] border border-white/5 rounded-3xl transition-all duration-500 shadow-2xl hover:border-voro-primary/25 outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-black animate-slide-up"
      style={{
        animationDelay: `${index * 150}ms`,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s, box-shadow 0.5s'
      }}
    >
      {/* Volumetric Hover Luminous Lens */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(150px circle at var(--lens-x, 50%) var(--lens-y, 50%), rgba(124,58,237,0.06), transparent 75%)'
        }}
      />

      {/* High-End Telemetry Overlay */}
      <div className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover:opacity-60 group-focus:opacity-60 transition-opacity duration-300 flex gap-3 font-mono text-[0.45rem] font-bold text-white/30">
        <span>X_<span ref={teleRefX}>0.0</span>°</span>
        <span>Y_<span ref={teleRefY}>0.0</span>°</span>
        <span className="text-voro-primary">NODE_{sessionHex}</span>
      </div>

      <div className="p-10 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-voro-primary shadow-inner">
                <Calendar size={24} />
             </div>
             <div>
                <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-[0.3em]">{session.day}</span>
                <h4 className="text-2xl font-serif italic font-medium text-white tracking-tight mt-1">Session {session.id.toString().slice(-4)}</h4>
             </div>
          </div>

          {/* Double-Confirmation Safeguard Delete Button */}
          <button
            onClick={handlePurgeClick}
            className={`p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
              isPurging
                ? 'bg-red-500/10 border-red-500/30 text-red-400 font-bold scale-105 animate-pulse'
                : 'bg-white/[0.01] border-white/5 text-gray-700 hover:text-red-400 hover:bg-red-500/5'
            }`}
            aria-live="polite"
            aria-label={isPurging ? 'Confirm purge sequence' : 'Purge session'}
          >
            {isPurging ? (
              <>
                <AlertTriangle size={14} className="text-red-400 animate-pulse" />
                <span className="text-[0.55rem] font-mono tracking-widest uppercase">[PURGE?]</span>
              </>
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest mb-1">Temporal Depth</p>
            <div className="flex items-center gap-2">
               <Clock size={12} className="text-voro-secondary" />
               <span className="text-sm font-mono font-bold text-white uppercase">{session.duration}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest mb-1">Provision Count</p>
            <div className="flex items-center gap-2">
               <Zap size={12} className="text-voro-accent" />
               <span className="text-sm font-mono font-bold text-white uppercase">{session.count} Units</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 space-y-6">
        <div className="flex items-center justify-between">
           <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.2em]">Recipe Matrix</p>
           <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-widest">{session.recipes.length} Archetypes</span>
        </div>
        <div className="space-y-3">
          {session.recipes.map((recipe, rIdx) => (
            <div key={rIdx} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5 group/item hover:bg-white/[0.03] hover:border-voro-primary/20 transition-all">
               <span className="text-sm font-serif italic text-gray-300 group-hover/item:text-white transition-colors">{recipe}</span>
               <ChevronRight size={14} className="text-gray-800 group-hover/item:text-voro-primary transition-all" />
            </div>
          ))}
        </div>
        <Button variant="secondary" className="w-full h-12 mt-4 text-[0.6rem] tracking-[0.3em]">
          Review Manifest
        </Button>
      </div>
    </div>
  );
});
PrepSessionCard.displayName = 'PrepSessionCard';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: ProvisionItemCard.
 * Memoized subcomponent to eliminate re-rendering when parent input forms alter.
 */
const ProvisionItemCard = React.memo(({ item, index, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(index)}
      className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 group/prov hover:bg-white/[0.04] hover:border-voro-secondary/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-secondary text-left"
    >
      <div className="flex items-center gap-4">
        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${item.checked ? 'bg-voro-secondary border-voro-secondary shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-white/10 group-hover/prov:border-white/20'}`}>
           {item.checked && <Check size={12} className="text-white" />}
        </div>
        <span className={`text-sm font-serif italic transition-all duration-300 ${item.checked ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{item.item}</span>
      </div>
      <span className="text-[0.6rem] font-mono font-bold text-voro-secondary opacity-60">{item.qty}</span>
    </button>
  );
});
ProvisionItemCard.displayName = 'ProvisionItemCard';

const MealPrepPlanner = () => {
  const { updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  // Cinematic overlay state
  const [loading, setLoading] = useState(true);

  // Interaction states
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [confirmingPurgeProvisions, setConfirmingPurgeProvisions] = useState(false);

  // Form states for adding new session
  const [newDay, setNewDay] = useState('Sunday');
  const [newDuration, setNewDuration] = useState('2 hours');
  const [newCount, setNewCount] = useState(15);
  const [newRecipe, setNewRecipe] = useState('');
  const [tempRecipes, setTempRecipes] = useState([]);

  // ⚡ PERFORMANCE OPTIMIZATION: Granular state selectors via useStorageKeySelector
  const prepPlan = useStorageKeySelector(
    'meal_prep',
    useCallback((state) => (state || {}).plan || DEFAULT_PREP_PLAN, []),
    useCallback((a, b) => JSON.stringify(a) === JSON.stringify(b), [])
  );

  const provisions = useStorageKeySelector(
    'meal_prep',
    useCallback((state) => (state || {}).provisions || DEFAULT_PROVISIONS, []),
    useCallback((a, b) => JSON.stringify(a) === JSON.stringify(b), [])
  );

  // ⚡ OPTIMISTIC UI: Fast-path updates mapped locally to completely eliminate IndexedDB write latencies
  const [optimisticPrepPlan, setOptimisticPrepPlan] = useState(null);
  const [optimisticProvisions, setOptimisticProvisions] = useState(null);

  // Sync optimistic updates with storage when changes occur
  useEffect(() => {
    setOptimisticPrepPlan(null);
  }, [prepPlan]);

  useEffect(() => {
    setOptimisticProvisions(null);
  }, [provisions]);

  const activePrepPlan = optimisticPrepPlan || prepPlan;
  const activeProvisions = optimisticProvisions || provisions;

  const tickerRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Culinary Procurement Enclave';

    // ⚡ PERFORMANCE OPTIMIZATION: direct DOM manipulation on ticker prevents 4-5 full React renders
    let tickerIndex = 0;
    const tickerInterval = setInterval(() => {
      if (tickerIndex < CINEMATIC_MESSAGES.length - 1) {
        tickerIndex++;
        if (tickerRef.current) {
          tickerRef.current.innerText = CINEMATIC_MESSAGES[tickerIndex];
        }
      } else {
        clearInterval(tickerInterval);
      }
    }, 600);

    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearInterval(tickerInterval);
      clearTimeout(loadTimer);
    };
  }, []);

  useEffect(() => {
    if (confirmingPurgeProvisions) {
      const timer = setTimeout(() => setConfirmingPurgeProvisions(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingPurgeProvisions]);

  const toggleProvision = useCallback(async (index) => {
    // ⚡ OPTIMISTIC UI: Toggle instantly
    const updated = [...activeProvisions];
    updated[index] = { ...updated[index], checked: !updated[index].checked };
    setOptimisticProvisions(updated);

    await updateItem('meal_prep', { provisions: updated });
    addNotification('Provisions matrix synchronized', 'success');
  }, [activeProvisions, updateItem, addNotification]);

  const handleAddRecipeTemp = () => {
    if (!newRecipe.trim()) return;
    setTempRecipes(prev => [...prev, newRecipe.trim()]);
    setNewRecipe('');
  };

  const handleCreateSession = async () => {
    const recipesToUse = tempRecipes.length > 0 ? tempRecipes : [newRecipe.trim() || 'Custom Trophic Synthesis'];
    const newSession = {
      id: Date.now(),
      day: newDay,
      duration: newDuration,
      count: Number(newCount),
      recipes: recipesToUse
    };

    // ⚡ OPTIMISTIC UI: Append instantly
    const updated = [...activePrepPlan, newSession];
    setOptimisticPrepPlan(updated);

    await updateItem('meal_prep', { plan: updated });

    // Reset form
    setNewDay('Sunday');
    setNewDuration('2 hours');
    setNewCount(15);
    setNewRecipe('');
    setTempRecipes([]);
    setIsAddingSession(false);

    addNotification('Metabolic prep session registered', 'success');
  };

  const handleDeleteSession = useCallback(async (id) => {
    // ⚡ OPTIMISTIC UI: Filter instantly
    const updated = activePrepPlan.filter(s => s.id !== id);
    setOptimisticPrepPlan(updated);

    await updateItem('meal_prep', { plan: updated });
    addNotification('Prep session purged from system logs', 'error');
  }, [activePrepPlan, updateItem, addNotification]);

  const handlePurgeProvisions = async () => {
    if (confirmingPurgeProvisions) {
      // ⚡ OPTIMISTIC UI: Purge instantly
      setOptimisticProvisions([]);
      await updateItem('meal_prep', { provisions: [] });
      setConfirmingPurgeProvisions(false);
      addNotification('Provisions matrix entirely cleared', 'error');
    } else {
      setConfirmingPurgeProvisions(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 relative">
      {/* Cinematic Load Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020408] backdrop-blur-2xl transition-all duration-1000">
          <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />

          {/* Golden-Ratio Concentric Counter-Rotating Rings */}
          <div className="relative w-56 h-56 flex items-center justify-center mb-12">
            <div className="absolute inset-0 border border-dashed border-voro-primary/30 rounded-full animate-spin [animation-duration:15s]" />
            <div className="absolute w-44 h-44 border border-voro-secondary/40 rounded-full animate-spin [animation-duration:8s] [animation-direction:reverse]" />
            <div className="absolute w-32 h-32 border border-dashed border-voro-accent/20 rounded-full animate-spin [animation-duration:20s]" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0A0C14] to-voro-primary/20 border border-white/10 flex items-center justify-center shadow-2xl">
              <Package size={24} className="text-voro-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 text-center max-w-md px-6">
            <span className="text-[0.55rem] font-mono font-black text-voro-primary tracking-[0.5em] uppercase block animate-pulse">
              INTELLIGENT RE-ALIGNMENT ACTIVE
            </span>
            <div className="h-10 flex items-center justify-center">
              <p ref={tickerRef} className="text-xs font-mono text-gray-400 uppercase tracking-widest transition-opacity duration-300">
                {CINEMATIC_MESSAGES[0]}
              </p>
            </div>
            <div className="w-48 h-1 bg-white/[0.03] rounded-full mx-auto overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-voro-primary animate-kinetic-sweep" />
            </div>
          </div>
        </div>
      )}

      {/* Ambient Background Logistics */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Package size={18} className="animate-pulse" />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.4em]">Culinary Procurement Enclave</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-tight">
              Biometric <span className="text-gradient not-italic font-bold">Logistics</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-60">
              Systematic orchestration of metabolically synchronized provisions
            </p>
          </div>

          <Button
            onClick={() => setIsAddingSession(true)}
            variant="primary"
            className="group flex items-center gap-4 px-10 h-16 shadow-2xl shadow-voro-primary/20 text-[0.7rem] font-black uppercase tracking-[0.4em]"
          >
            <Plus size={18} />
            <span>Design Prep Plan</span>
          </Button>
        </header>

        {/* Dynamic Add Session Module */}
        {isAddingSession && (
          <div className="mb-16 p-10 bg-[#0A0C14] border border-voro-primary/20 rounded-3xl relative overflow-hidden animate-slide-up">
            <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <h3 className="text-2xl font-serif italic text-white mb-8">Establish New Prep Sequence</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-3">
                <label className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest">Temporal Node (Day)</label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  className="w-full bg-[#020408] border border-white/10 rounded-2xl p-4 text-white font-mono text-sm focus:border-voro-primary outline-none"
                >
                  {DAYS_OF_WEEK.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest">Prep Duration</label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full bg-[#020408] border border-white/10 rounded-2xl p-4 text-white font-mono text-sm focus:border-voro-primary outline-none"
                >
                  {DURATION_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest">Provision Units (Count)</label>
                <input
                  type="number"
                  value={newCount}
                  onChange={(e) => setNewCount(e.target.value)}
                  min="1"
                  className="w-full bg-[#020408] border border-white/10 rounded-2xl p-4 text-white font-mono text-sm focus:border-voro-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <label className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest block">Metabolic Recipe Archetypes</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newRecipe}
                  onChange={(e) => setNewRecipe(e.target.value)}
                  placeholder="e.g. Kinetic Salmon Matrix..."
                  className="flex-1 bg-[#020408] border border-white/10 rounded-2xl p-4 text-white font-serif italic text-sm focus:border-voro-primary outline-none"
                />
                <Button variant="secondary" onClick={handleAddRecipeTemp} className="h-14 px-6 text-[0.6rem]">
                  Append Recipe
                </Button>
              </div>

              {tempRecipes.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {tempRecipes.map((r, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-voro-primary/10 border border-voro-primary/20 text-[0.6rem] font-mono text-voro-primary tracking-widest uppercase">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setIsAddingSession(false)} className="px-8 h-14 text-[0.65rem]">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateSession} className="px-10 h-14 text-[0.65rem]">
                Synthesize Plan
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-12 mb-20">
          {/* Prep Schedule Modules */}
          <div className="col-span-12 lg:col-span-8 space-y-8" role="list">
            <div className="flex items-center justify-between px-4 mb-4">
               <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.4em]">Manifested Sessions</h3>
               <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-primary animate-pulse" />
                  <span className="text-[0.55rem] font-black text-voro-primary uppercase tracking-widest">Pipeline Active</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activePrepPlan.map((session, idx) => (
                <PrepSessionCard
                  key={session.id}
                  session={session}
                  index={idx}
                  onDelete={handleDeleteSession}
                />
              ))}
            </div>
          </div>

          {/* Provisions Matrix */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.4em] px-4">Provisions Matrix</h3>
            <Card className="p-10 bg-gradient-to-br from-[#0A0C14] to-black border-voro-primary/10 relative overflow-hidden group/matrix">
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-voro-secondary/5 rounded-full blur-[100px] group-hover/matrix:bg-voro-secondary/10 transition-colors duration-1000" />

               <div className="relative">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-voro-secondary/10 text-voro-secondary rounded-2xl border border-voro-secondary/20 shadow-lg shadow-voro-secondary/5">
                        <ShoppingCart size={20} />
                      </div>
                      <h3 className="text-[0.65rem] font-mono font-medium uppercase tracking-[0.4em] text-voro-secondary font-black">Supply List</h3>
                    </div>

                    {/* Purge Supply List Button */}
                    {activeProvisions.length > 0 && (
                      <button
                        onClick={handlePurgeProvisions}
                        aria-label={confirmingPurgeProvisions ? "Confirm purge of all provisions" : "Purge provisions list"}
                        className={`p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                          confirmingPurgeProvisions
                            ? 'bg-red-500/15 border-red-500/30 text-red-400 font-bold animate-pulse'
                            : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-red-400'
                        }`}
                        aria-live="polite"
                      >
                        {confirmingPurgeProvisions ? (
                          <>
                            <AlertTriangle size={12} className="text-red-400" />
                            <span className="text-[0.45rem] tracking-widest text-red-400">[PURGE ALL?]</span>
                          </>
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    )}
                  </div>

                  {activeProvisions.length > 0 ? (
                    <div className="space-y-4 mb-12" role="list">
                      {activeProvisions.map((item, i) => (
                        <ProvisionItemCard
                          key={i}
                          item={item}
                          index={i}
                          onToggle={toggleProvision}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center border border-dashed border-white/5 rounded-2xl mb-12 opacity-30">
                      <Package size={24} className="mx-auto mb-2 text-gray-600" />
                      <p className="text-[0.55rem] font-mono uppercase tracking-widest">No supplies registered</p>
                    </div>
                  )}

                  <Button variant="secondary" className="w-full h-14 flex items-center justify-center gap-4 text-[0.65rem]">
                    <Download size={16} />
                    <span>Export Provisions</span>
                  </Button>
               </div>
            </Card>

            <Card className="p-10 space-y-6 border-white/5">
               <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em]">Protocol Advisory</h3>
               <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
                 Batch preparation optimizes metabolic adherence by eliminating friction in the provision supply chain.
               </p>
               <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed">
                 <p className="text-[0.55rem] font-black text-voro-primary uppercase tracking-widest mb-2">Architect Tip</p>
                 <p className="text-xs text-gray-400 leading-relaxed font-mono">
                   Ensure airtight sequestration of prepared units to maintain structural integrity and nutritional density.
                 </p>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPrepPlanner;
