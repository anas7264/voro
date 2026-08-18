import React, { useEffect, useMemo, useCallback, useRef, useState, useDeferredValue, memo, useId } from 'react';
import { Trash2, BookOpen, Plus, Heart, Sparkles, Flame, Clock, Search, ShieldAlert, AlertTriangle, ChevronRight, Zap, RefreshCw, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted, frozen static datasets.
 * Eliminates heap allocations and GC pressure across frequent renders.
 */
const CATEGORIES = Object.freeze(['All', 'High Protein', 'Low Carb', 'Keto', 'Balanced']);

const ALIGNMENT_MESSAGES = Object.freeze([
  'INITIALIZING_CULINARY_CODEX_CORE...',
  'MAPPING_TROPHIC_AMINO_ACID_STRUCTURES...',
  'CALIBRATING_LIPID_METABOLISM_INDEXES...',
  'TROPHIC_FORMULA_REPOSITORY_STABILIZED'
]);

const MOCK_DEMO_RECIPES = Object.freeze([
  {
    id: 'demo_recipe_01',
    name: 'Kinetic Levant Chicken & Basmati Matrix',
    category: 'High Protein',
    servings: 2,
    ingredients: [
      { name: 'Organic Chicken Breast', amount: 400, unit: 'g' },
      { name: 'Basmati Rice', amount: 150, unit: 'g' },
      { name: 'Cold-Pressed Olive Oil', amount: 15, unit: 'ml' }
    ],
    totals: { calories: 650, protein: 62, carbs: 55, fat: 14 }
  },
  {
    id: 'demo_recipe_02',
    name: 'Atlantic Salmon & Dark Greens Synthesis',
    category: 'Keto',
    servings: 1,
    ingredients: [
      { name: 'Wild Atlantic Salmon', amount: 250, unit: 'g' },
      { name: 'Fresh Baby Spinach', amount: 120, unit: 'g' },
      { name: 'Avocado Oil', amount: 10, unit: 'ml' }
    ],
    totals: { calories: 520, protein: 48, carbs: 6, fat: 34 }
  },
  {
    id: 'demo_recipe_03',
    name: 'Anabolic Egg White & Freekeh Bowl',
    category: 'Balanced',
    servings: 1,
    ingredients: [
      { name: 'Egg Whites', amount: 200, unit: 'ml' },
      { name: 'Whole Roasted Freekeh', amount: 80, unit: 'g' },
      { name: 'Microgreens', amount: 30, unit: 'g' }
    ],
    totals: { calories: 430, protein: 42, carbs: 45, fat: 8 }
  }
]);

/**
 * ⚡ LUXURY REFINEMENT: RecipeArtifactCard Subcomponent.
 * Memoized subcomponent featuring:
 * - 60fps direct-DOM 3D volumetric hover tilts (`--mouse-x`, `--mouse-y`, `--tilt-x`, `--tilt-y`).
 * - Holographic coordinate telemetry overlays (`TX_...°`, `TY_...°`, `[REC_0x...]`).
 * - W3C APG accessible static 4-degree focus tilts.
 * - Reactive liquid border perimeter illumination.
 * - 2-step defensive confirmation purge protection ("PURGE?") with 3-second auto-reset.
 */
const RecipeArtifactCard = memo(({ recipe, index, onLog, onDelete }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const purgeTimerRef = useRef(null);
  const reactId = useId();

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const nodeId = useMemo(() => {
    const cleanId = (recipe.id || reactId).toString().replace(/[^a-zA-Z0-9]/g, '');
    return `REC_${cleanId.slice(-4).toUpperCase()}`;
  }, [recipe.id, reactId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 15 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 30;
    const tiltX = (0.5 - (y / rect.height)) * 30;

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
    if (isPurging) {
      setIsPurging(false);
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
    }
  };

  const handlePurgeClick = (e) => {
    e.stopPropagation();
    if (isPurging) {
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
      onDelete(recipe.id, recipe.name);
      setIsPurging(false);
    } else {
      setIsPurging(true);
      purgeTimerRef.current = setTimeout(() => {
        setIsPurging(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
    };
  }, []);

  const interactionActive = isHovered || isFocused;
  const totals = recipe.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (containerRef.current) {
          containerRef.current.style.setProperty('--tilt-x', '0deg');
          containerRef.current.style.setProperty('--tilt-y', '0deg');
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="article"
      aria-label={`Culinary Formula: ${recipe.name}. Category: ${recipe.category || 'Standard'}. Energy: ${Math.round(totals.calories)} kcal, Protein: ${Math.round(totals.protein)} grams.`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-6px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        animationDelay: `${index * 60}ms`
      }}
      className="relative p-10 rounded-[2.5rem] bg-[#0A0C14] border border-white/5 transition-all duration-700 hover:border-white/20 hover:shadow-[0_60px_120px_rgba(0,0,0,0.8)] focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none group/recipe flex flex-col justify-between overflow-hidden animate-slide-up"
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/recipe:opacity-[0.03] transition-opacity duration-1000 pointer-events-none" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover/recipe:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(450px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 50%)`,
          }}
        />
      </div>

      {/* 🛰️ Liquid Border Intelligence: Reactive perimeter illumination */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/recipe:opacity-100 group-focus-within/recipe:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/recipe:opacity-100 transition-all duration-500 z-10"
        style={{ transform: 'translateZ(20px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1 pointer-events-none">
          <span className="pointer-events-none">TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span className="pointer-events-none">TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20 pointer-events-none">[{nodeId}]</span>
        </div>
      </div>

      {/* Top Details & Header */}
      <div className="relative z-10 space-y-8" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-voro-primary/10 border border-voro-primary/20 text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-[0.3em]">
              {recipe.category || 'Formula'}
            </span>
            <div className="h-px w-3 bg-white/10" />
            <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Clock size={11} className="text-voro-primary" />
              {recipe.ingredients?.length || 0} Compounds
            </span>
          </div>

          <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest bg-white/[0.02] border border-white/5 px-3 py-1 rounded-full">
            {recipe.servings || 1} {recipe.servings === 1 ? 'Portion' : 'Portions'}
          </span>
        </div>

        <div>
          <h3 className="text-2.5xl font-serif italic font-medium text-white group-hover/recipe:text-voro-primary transition-colors leading-snug">
            {recipe.name}
          </h3>
        </div>

        {/* High-fidelity Macro Spectrum Matrix */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
            <span className="text-[0.5rem] font-mono font-black text-gray-600 uppercase tracking-widest block select-none">ENERGY MAGNITUDE</span>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className="text-2xl font-serif italic font-bold text-white tracking-tight">{Math.round(totals.calories)}</span>
              <span className="text-[0.55rem] font-mono text-gray-600 uppercase font-black tracking-widest">kcal</span>
            </div>
          </div>

          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-voro-primary/20 transition-colors">
            <span className="text-[0.5rem] font-mono font-black text-voro-primary/80 uppercase tracking-widest block select-none">PROTEIN DENSITY</span>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className="text-2xl font-serif italic font-bold text-voro-primary tracking-tight">{(totals.protein || 0).toFixed(1)}</span>
              <span className="text-[0.55rem] font-mono text-gray-600 uppercase font-black tracking-widest">g</span>
            </div>
          </div>

          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-voro-secondary/20 transition-colors">
            <span className="text-[0.5rem] font-mono font-black text-voro-secondary/80 uppercase tracking-widest block select-none">CARBON MATRIX</span>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className="text-2xl font-serif italic font-bold text-voro-secondary tracking-tight">{(totals.carbs || 0).toFixed(1)}</span>
              <span className="text-[0.55rem] font-mono text-gray-600 uppercase font-black tracking-widest">g</span>
            </div>
          </div>

          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-voro-accent/20 transition-colors">
            <span className="text-[0.5rem] font-mono font-black text-voro-accent/80 uppercase tracking-widest block select-none">LIPID STRUCTURE</span>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className="text-2xl font-serif italic font-bold text-voro-accent tracking-tight">{(totals.fat || 0).toFixed(1)}</span>
              <span className="text-[0.55rem] font-mono text-gray-600 uppercase font-black tracking-widest">g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tactile Control Panel & Defensive Purge Trigger */}
      <div className="relative z-30 flex items-center gap-4 pt-8 mt-8 border-t border-white/5" style={{ transform: 'translateZ(40px)' }}>
        <button
          onClick={() => onLog(recipe)}
          className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-voro-primary text-white text-[0.65rem] font-mono font-black uppercase tracking-[0.25em] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_rgba(124,58,237,0.3)] hover:shadow-[0_30px_60px_rgba(124,58,237,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-voro-primary cursor-pointer"
        >
          <Plus size={14} />
          <span>Synthesize</span>
        </button>

        <button
          onClick={handlePurgeClick}
          aria-label={isPurging ? `Confirm decommission of ${recipe.name}` : `Decommission ${recipe.name}`}
          className={`p-4 rounded-2xl border transition-all duration-500 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer ${
            isPurging
              ? 'bg-red-500/15 border-red-500/40 text-red-400 font-bold shadow-[0_0_20px_rgba(239,68,68,0.25)] scale-105'
              : 'bg-white/[0.01] border-white/5 text-gray-600 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5'
          }`}
        >
          {isPurging ? (
            <>
              <AlertTriangle size={15} className="animate-pulse" />
              <span className="text-[0.55rem] font-mono font-black uppercase tracking-widest">PURGE?</span>
            </>
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>

      {/* Decorative Bottom Border Highlight */}
      <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover/recipe:via-voro-primary/40 transition-all duration-1000 pointer-events-none" />
    </div>
  );
});

RecipeArtifactCard.displayName = 'RecipeArtifactCard';

const RecipeLibrary = () => {
  const navigate = useNavigate();
  const { setItem, getItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  // Storage key reactive subscription
  const storedRecipes = useStorageKey('recipes');

  // Cinematic alignment loader state
  const [loading, setLoading] = useState(true);
  const tickerRef = useRef(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Initial cinematic loading sequence (with Playwright E2E bypass)
  useEffect(() => {
    document.title = 'VORO | Culinary Codex & Trophic Formula Repository';

    // Playwright / test bypass check
    const isTestBypass =
      typeof window !== 'undefined' &&
      (window.__VORO_TEST_BYPASS__ || localStorage.getItem('voro_test_mode') === 'true');

    if (isTestBypass) {
      setLoading(false);
      return;
    }

    let msgIndex = 0;
    const tickerInterval = setInterval(() => {
      if (msgIndex < ALIGNMENT_MESSAGES.length - 1) {
        msgIndex++;
        if (tickerRef.current) {
          tickerRef.current.innerText = ALIGNMENT_MESSAGES[msgIndex];
        }
      } else {
        clearInterval(tickerInterval);
      }
    }, 600);

    const loaderTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearInterval(tickerInterval);
      clearTimeout(loaderTimer);
    };
  }, []);

  /**
   * ⚡ OPTIMIZATION: Pure derived recipes list with fallback demo formulas.
   */
  const recipes = useMemo(() => {
    if (Array.isArray(storedRecipes) && storedRecipes.length > 0) {
      return storedRecipes;
    }
    return MOCK_DEMO_RECIPES;
  }, [storedRecipes]);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Filtered recipes calculation using deferred query.
   */
  const filteredRecipes = useMemo(() => {
    const q = deferredSearchQuery.trim().toLowerCase();
    return recipes.filter(recipe => {
      const nameMatch = !q || (recipe.name || '').toLowerCase().includes(q);
      const catMatch = selectedCategory === 'All' || (recipe.category || '') === selectedCategory;
      return nameMatch && catMatch;
    });
  }, [recipes, deferredSearchQuery, selectedCategory]);

  const handleDelete = useCallback(async (id, name) => {
    const updated = recipes.filter(r => r.id !== id);
    await setItem('recipes', updated);
    addNotification(`Formula "${name}" decommissioned from codex.`, 'info');
  }, [recipes, setItem, addNotification]);

  const handleLogRecipe = useCallback(async (recipe) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const log = { ...(getItem('nutrition_log') || {}) };
    const dayData = log[todayStr] || { meals: {}, water: 0, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
    const mealId = `recipe_${recipe.id}_${Date.now()}`;
    const recipeTotals = recipe.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };

    log[todayStr] = {
      ...dayData,
      meals: {
        ...dayData.meals,
        [mealId]: {
          name: recipe.name,
          calories: recipeTotals.calories,
          protein: recipeTotals.protein,
          carbs: recipeTotals.carbs,
          fat: recipeTotals.fat,
          timestamp: new Date().toISOString()
        }
      },
      totals: {
        calories: (dayData.totals?.calories || 0) + recipeTotals.calories,
        protein: (dayData.totals?.protein || 0) + recipeTotals.protein,
        carbs: (dayData.totals?.carbs || 0) + recipeTotals.carbs,
        fat: (dayData.totals?.fat || 0) + recipeTotals.fat,
      }
    };

    await setItem('nutrition_log', log);
    addNotification(`"${recipe.name}" nutrient profile synthesized into today's matrix`, 'success');
  }, [getItem, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-32 relative overflow-hidden bg-boutique-grain">
      {/* Cinematic Load Alignment Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020408] backdrop-blur-3xl transition-all duration-1000">
          <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />

          {/* Golden-Ratio Concentric Counter-Rotating Rings */}
          <div className="relative w-56 h-56 flex items-center justify-center mb-12">
            <div className="absolute inset-0 border border-dashed border-voro-primary/30 rounded-full animate-spin [animation-duration:15s]" />
            <div className="absolute w-44 h-44 border border-voro-secondary/40 rounded-full animate-spin [animation-duration:8s] [animation-direction:reverse]" />
            <div className="absolute w-32 h-32 border border-dashed border-voro-accent/20 rounded-full animate-spin [animation-duration:20s]" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0A0C14] to-voro-primary/20 border border-white/10 flex items-center justify-center shadow-2xl">
              <BookOpen size={24} className="text-voro-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 text-center max-w-md px-6">
            <span className="text-[0.55rem] font-mono font-black text-voro-primary tracking-[0.5em] uppercase block animate-pulse">
              TROPHIC FORMULA ALIGNMENT
            </span>
            <div className="h-10 flex items-center justify-center">
              <p ref={tickerRef} className="text-xs font-mono text-gray-400 uppercase tracking-widest transition-opacity duration-300">
                {ALIGNMENT_MESSAGES[0]}
              </p>
            </div>
            <div className="w-48 h-1 bg-white/[0.03] rounded-full mx-auto overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-voro-primary animate-kinetic-sweep" />
            </div>
          </div>
        </div>
      )}

      {/* Editorial Ambient Background Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[130px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        {/* Luxury Status Header Section */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 group/header">
          <div className="space-y-6 max-w-3xl">
            {/* Active Neural Pulse Eyebrow */}
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.7rem] font-mono font-black uppercase tracking-[0.6em]">
                Culinary Codex // Trophic Formula Repository
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-[4.5rem] md:text-[6.5rem] font-serif italic font-medium tracking-[-0.04em] text-white leading-[0.9] mb-2">
                Recipe <span className="text-gradient not-italic font-black">Archive</span>
              </h1>
              <p className="text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-70 leading-relaxed max-w-xl">
                A premium catalog of dense, structured formulations optimized for thermal adaptation and energy balance.
              </p>
            </div>

            {/* Architectural Datum Line */}
            <div className="flex items-center gap-6 pt-2">
              <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent opacity-40 group-hover/header:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <p className="text-gray-600 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-50 whitespace-nowrap">
                Node Ref: 0xCUL_ARCH // TOTAL: {recipes.length}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/nutrition/recipe-builder')}
              className="px-10 py-5 !rounded-full shadow-2xl shadow-voro-primary/20 hover:scale-[1.05] transition-all text-xs font-mono font-black uppercase tracking-[0.25em]"
            >
              <Plus size={18} className="mr-2" />
              Synthesize Formula
            </Button>
          </div>
        </header>

        {/* Interactive Search Terminal & Category Filter Bar */}
        <section className="mb-16 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Search Input Terminal */}
            <div className="md:col-span-6 relative">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query formula index by keyword or name..."
                  className="w-full bg-[#0A0C14] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-white font-mono text-sm placeholder:font-serif placeholder:italic placeholder:text-gray-600 focus:outline-none focus:border-voro-primary focus:ring-1 focus:ring-voro-primary transition-all duration-500"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="md:col-span-6 flex flex-wrap gap-3 justify-start md:justify-end">
              {CATEGORIES.map(category => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={isActive}
                    className={`px-5 py-3 rounded-2xl text-[0.6rem] font-mono font-black uppercase tracking-[0.25em] transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-voro-primary ${
                      isActive
                        ? 'bg-voro-primary text-white shadow-[0_10px_25px_rgba(124,58,237,0.3)] border border-white/20 scale-105'
                        : 'bg-white/[0.02] text-gray-500 border border-white/5 hover:border-white/20 hover:text-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe, idx) => (
              <RecipeArtifactCard
                key={recipe.id || idx}
                recipe={recipe}
                index={idx}
                onLog={handleLogRecipe}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          /* High-end empty state: Codex Void */
          <div className="py-32 text-center max-w-xl mx-auto space-y-12 bg-[#0A0C14]/40 border border-white/5 rounded-[3.5rem] p-16 backdrop-blur-2xl">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-[-10px] rounded-full border border-dashed border-voro-primary/20 animate-[spin_30s_linear_infinite]" />
              <div className="w-24 h-24 rounded-[2rem] bg-[#0A0C14] border border-white/5 flex items-center justify-center shadow-2xl">
                <BookOpen size={36} className="text-voro-primary/80" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-serif italic font-medium text-white tracking-tight">
                Codex <span className="text-voro-primary not-italic font-bold">Void</span>
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">
                {searchQuery || selectedCategory !== 'All'
                  ? 'No formulas match the current query filter. Try broadening your criteria.'
                  : 'No custom recipes currently synthesized into the archive. Map out a new nutritional blueprint and register it in the local database.'}
              </p>
            </div>

            <Button
              onClick={() => {
                if (searchQuery || selectedCategory !== 'All') {
                  setSearchQuery('');
                  setSelectedCategory('All');
                } else {
                  navigate('/nutrition/recipe-builder');
                }
              }}
              className="px-10 py-5 !rounded-full shadow-2xl shadow-voro-primary/20 hover:scale-[1.05] transition-all text-xs font-mono font-black uppercase tracking-[0.2em]"
            >
              <Plus size={18} className="mr-3" />
              <span>{searchQuery || selectedCategory !== 'All' ? 'Reset Query Filters' : 'Map New Formula'}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeLibrary;
