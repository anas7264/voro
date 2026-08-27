import React, { useState, useMemo, useEffect, useRef, memo, useCallback, useDeferredValue } from 'react';
import { Plus, Trash2, BookOpen, Sparkles, Flame, Scale, Target, Activity, ShieldCheck, Search, ChevronRight, AlertTriangle, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateRecipe } from '@/utils/validators';
import { foods } from '@/data/foods';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted Formatters & Configs.
 * Pre-computes static structures at module scope to eliminate heap allocation churn on renders.
 */
const MACRO_CONFIG = Object.freeze([
  { label: 'Energy Potential', key: 'calories', unit: 'kcal', color: '#7C3AED', glow: 'rgba(124,58,237,0.3)', icon: Flame },
  { label: 'Protein Synthesis', key: 'protein', unit: 'g', color: '#10B981', glow: 'rgba(16,185,129,0.3)', icon: Activity },
  { label: 'Glycogen Storage', key: 'carbs', unit: 'g', color: '#F59E0B', glow: 'rgba(245,158,11,0.3)', icon: Target },
  { label: 'Lipid Homeostasis', key: 'fat', unit: 'g', color: '#EF4444', glow: 'rgba(239,68,68,0.3)', icon: Scale }
]);

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Pre-processed & Frozen Food Index.
 * Pre-lowercases item names once at module import to remove string allocation overhead in search loops.
 */
const FOODS_PREPROCESSED = Object.freeze(
  foods.map(f => Object.freeze({
    ...f,
    lowerName: f.name.toLowerCase()
  }))
);

/**
 * ⚡ REFINEMENT: Re-engineered IngredientItem component.
 * Integrates 3D volumetric hover tilts, real-time spatial telemetry,
 * keyboard-focus offsets, and double-confirmation purge safeguards.
 * Wrapped in React.memo to shield against parent re-renders.
 */
const IngredientItem = memo(({ ing, idx, confirmingPurgeId, onPortionChange, onRemove }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const nodeId = useMemo(() => {
    return `ING_NODE_${(ing.instanceId || idx).toString().slice(-4).toUpperCase()}`;
  }, [ing.instanceId, idx]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
    if (tiltXRef.current) tiltXRef.current.innerText = '0.0';
    if (tiltYRef.current) tiltYRef.current.innerText = '0.0';
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
    }
    if (tiltXRef.current) tiltXRef.current.innerText = '4.0';
    if (tiltYRef.current) tiltYRef.current.innerText = '-4.0';
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
    if (tiltXRef.current) tiltXRef.current.innerText = '0.0';
    if (tiltYRef.current) tiltYRef.current.innerText = '0.0';
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      aria-label={`Infused compound: ${ing.name}, portion ${ing.portion} grams`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#0A0C14] border border-white/5 rounded-3xl gap-6 group/ing hover:border-white/10 hover:bg-white/[0.02] focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none overflow-hidden transition-colors"
    >
      {/* Dynamic Luminous Lens */}
      <div
        className="absolute inset-0 opacity-0 group-hover/ing:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(250px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.12), transparent 80%)'
        }}
      />

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-3 right-6 pointer-events-none opacity-0 group-hover/ing:opacity-100 group-focus-within/ing:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(40px)' }}
      >
        <div className="flex items-center gap-2 font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.2em]">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="flex-1 space-y-1 z-10" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-voro-primary animate-pulse" />
          <span className="text-white font-serif italic text-lg font-bold">{ing.name}</span>
        </div>
        <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest block pl-4">
          BASE MACROS: {ing.calories} kcal · P: {ing.protein}g · C: {ing.carbs}g · F: {ing.fat}g (per 100g)
        </span>
      </div>

      <div className="flex items-center gap-6 z-10" style={{ transform: 'translateZ(40px)' }}>
        {/* Precise Portion Adjustment */}
        <div className="flex items-center gap-3">
          <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-widest">Portion:</span>
          <div className="relative group/portion">
            <input
              type="number"
              value={ing.portion}
              onChange={(e) => onPortionChange(ing.instanceId, Number(e.target.value))}
              className="bg-black/40 text-white font-mono text-xs px-4 py-2 rounded-xl w-24 border border-white/5 focus:border-voro-primary focus:outline-none focus:ring-1 focus:ring-voro-primary text-center"
              placeholder="grams"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.55rem] font-mono text-gray-500 uppercase">g</span>
          </div>
        </div>

        {/* Defensive Double Confirmation Delete */}
        <button
          onClick={() => onRemove(ing.instanceId, ing.name)}
          aria-label={confirmingPurgeId === ing.instanceId ? `Confirm purge of ${ing.name}` : `Purge ${ing.name} from formulation`}
          className={`p-3.5 rounded-2xl transition-all duration-500 outline-none border flex items-center justify-center relative ${
            confirmingPurgeId === ing.instanceId
              ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse scale-105'
              : 'text-gray-600 hover:text-red-400 hover:bg-red-400/5 border-white/5'
          }`}
        >
          {confirmingPurgeId === ing.instanceId ? (
            <div className="flex items-center gap-2 px-1">
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-[0.55rem] font-mono font-black uppercase tracking-widest">PURGE?</span>
            </div>
          ) : (
            <Trash2 size={15} />
          )}
        </button>
      </div>
    </div>
  );
});

IngredientItem.displayName = 'IngredientItem';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: SavedRecipeCard.
 * Memoized subcomponent to isolate 3D hover/focus tilt effects and prevent parent re-renders.
 */
const SavedRecipeCard = memo(({ recipe, idx }) => {
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

    const tiltY = ((x / rect.width) - 0.5) * 12;
    const tiltX = (0.5 - (y / rect.height)) * 12;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
    if (tiltXRef.current) tiltXRef.current.innerText = '0.0';
    if (tiltYRef.current) tiltYRef.current.innerText = '0.0';
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
    }
    if (tiltXRef.current) tiltXRef.current.innerText = '4.0';
    if (tiltYRef.current) tiltYRef.current.innerText = '-4.0';
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
    if (tiltXRef.current) tiltXRef.current.innerText = '0.0';
    if (tiltYRef.current) tiltYRef.current.innerText = '0.0';
  };

  const interactionActive = isHovered || isFocused;
  const nodeHex = recipe.id?.toString().slice(-4).toUpperCase() || 'FORM';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      aria-label={`Synthesized formula: ${recipe.name}, ${Math.round(recipe.totals?.calories || 0)} calories`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative p-10 flex flex-col justify-between h-[360px] bg-[#0A0C14] border border-white/5 rounded-3xl group hover:border-white/10 hover:bg-white/[0.02] focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none overflow-hidden transition-colors"
    >
      {/* Dynamic Backglow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(250px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 80%)'
        }}
      />

      {/* Spatial Telemetry */}
      <div className="absolute top-4 right-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="flex items-center gap-2 font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.2em]">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
        </div>
      </div>

      <div className="space-y-6 z-10" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex justify-between items-start">
          <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-widest">
            SYN_NODE // 0x{nodeHex}
          </span>
          <div className="w-2 h-2 rounded-full bg-voro-primary animate-pulse shadow-[0_0_8px_#7C3AED]" />
        </div>

        <h4 className="text-2xl font-serif italic font-medium text-white group-hover:text-voro-primary transition-colors leading-tight">
          {recipe.name}
        </h4>

        <p className="text-xs text-gray-500 leading-relaxed font-mono">
          CONTAINS {recipe.ingredients?.length || 0} INFUSED MATRIX COMPOUNDS
        </p>
      </div>

      <div className="pt-6 border-t border-white/5 flex items-center justify-between z-10" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-serif italic font-bold text-white">
            {Math.round(recipe.totals?.calories || 0)}
          </span>
          <span className="text-[0.55rem] font-mono text-gray-600 uppercase font-black">kcal</span>
        </div>

        <div className="flex gap-2 text-[0.55rem] font-mono text-gray-400">
          <span className="bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded">P: {recipe.totals?.protein ? recipe.totals.protein.toFixed(0) : 0}g</span>
          <span className="bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded">C: {recipe.totals?.carbs ? recipe.totals.carbs.toFixed(0) : 0}g</span>
          <span className="bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded">F: {recipe.totals?.fat ? recipe.totals.fat.toFixed(0) : 0}g</span>
        </div>
      </div>
    </div>
  );
});

SavedRecipeCard.displayName = 'SavedRecipeCard';

const RecipeBuilder = () => {
  const navigate = useNavigate();
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Directly subscribing to 'recipes' key prevents re-renders when other keys change.
   */
  const savedRecipes = useStorageKey('recipes') || [];

  const [ingredients, setIngredients] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmingPurgeId, setConfirmingPurgeId] = useState(null);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Non-blocking search.
   * Concurrent React state rendering prevents UI thread lockup on high-frequency keystrokes.
   */
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    document.title = 'VORO | Molecular Formulation Studio';
  }, []);

  // Deletion double-confirmation timeout reset
  useEffect(() => {
    if (confirmingPurgeId) {
      const timer = setTimeout(() => setConfirmingPurgeId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingPurgeId]);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Preprocessed Fast-Lookup Search.
   * Uses `lowerName` from pre-processed dataset to avoid string instantiation allocations per match.
   */
  const filteredFoods = useMemo(() => {
    const trimmed = deferredSearchQuery.trim();
    if (trimmed.length < 2) return [];
    const query = trimmed.toLowerCase();

    const matches = [];
    for (let i = 0; i < FOODS_PREPROCESSED.length; i++) {
      const item = FOODS_PREPROCESSED[i];
      if (item.lowerName.includes(query)) {
        matches.push(item);
        if (matches.length === 8) break;
      }
    }
    return matches;
  }, [deferredSearchQuery]);

  const handleAddIngredient = useCallback((food) => {
    setIngredients(prev => [...prev, { ...food, portion: 100, instanceId: Date.now() }]);
    setSearchQuery('');
    addNotification(`${food.name} infused into formulation matrix.`, 'success');
  }, [addNotification]);

  const handlePortionChange = useCallback((instanceId, portion) => {
    setIngredients(prev => prev.map(ing => ing.instanceId === instanceId ? { ...ing, portion } : ing));
  }, []);

  const handleRemoveIngredient = useCallback((instanceId, name) => {
    setConfirmingPurgeId(prev => {
      if (prev === instanceId) {
        setIngredients(p => p.filter(ing => ing.instanceId !== instanceId));
        addNotification(`${name} purged from molecular structure.`, 'info');
        return null;
      }
      return instanceId;
    });
  }, [addNotification]);

  /**
   * ⚡ OPTIMIZATION: Single-pass zero-allocation total computation.
   */
  const totals = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];
      const factor = ing.portion / 100;
      calories += ing.calories * factor;
      protein += ing.protein * factor;
      carbs += ing.carbs * factor;
      fat += ing.fat * factor;
    }

    return { calories, protein, carbs, fat };
  }, [ingredients]);

  const handleSaveRecipe = async () => {
    const recipe = {
      id: Date.now(),
      name: recipeName || 'Unnamed Formulation',
      ingredients,
      totals,
      servings: 1,
    };

    const { valid, errors } = validateRecipe(recipe);
    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const updated = [...savedRecipes, recipe];
    await setItem('recipes', updated);

    setRecipeName('');
    setIngredients([]);
    addNotification('Molecular culinary formula archived.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-hidden bg-boutique-grain">
      {/* Cinematic Ambient Radial Backglows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-voro-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-voro-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">

        {/* 'Forge' Luxury Editorial Header */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12 group/header">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.6em] text-voro-primary">
                Thermodynamic Formulation Deck
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-[-0.03em] leading-none">
              Culinary <span className="text-gradient not-italic font-black">Synthesis</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.6rem] uppercase tracking-[0.4em]">
              Precision molecular mapping & trophic element alignment studio
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-voro-primary to-transparent opacity-40 group-hover/header:w-32 transition-all duration-1000" />
            <p className="text-gray-600 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-50 whitespace-nowrap">
              Node Ref: 0xCUL_SYNT
            </p>
          </div>
        </header>

        {/* Workspace divide via mathematical Golden Ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Formulation Node: Left Col-span 8 */}
          <div className="lg:col-span-8 space-y-10">
            <Card
              variant="premium"
              nodeId="FORM_NODE"
              className="p-12 bg-gradient-to-b from-[#0A0C14] to-black border-white/5"
            >
              <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-2xl font-serif italic text-white font-bold">Formulation Core</h3>
                  <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest mt-1">Configure active compound matrices & ingredients</p>
                </div>
                <span className="text-[0.45rem] font-mono text-voro-primary uppercase tracking-[0.3em] bg-voro-primary/5 border border-voro-primary/10 px-3 py-1 rounded-md">
                  Active Assembly
                </span>
              </div>

              <div className="space-y-8">
                {/* Recipe Name Input */}
                <div className="space-y-3">
                  <label className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 block ml-1">
                    Formula Identity
                  </label>
                  <div className="relative group/input">
                    <Input
                      placeholder="Enter recipe name (e.g. Protein Biosynthesis Bowl)..."
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      className="w-full bg-[#0A0C14] border-white/5 focus:border-voro-primary/50 text-white italic font-serif text-lg py-5 px-6"
                    />
                    <div className="absolute inset-0 rounded-[1.25rem] opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-all duration-1000 ring-2 ring-voro-primary/20" />
                  </div>
                </div>

                {/* Compound Search Interface */}
                <div className="space-y-3 relative">
                  <label className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 block ml-1">
                    Compound Infusion search
                  </label>
                  <div className="relative group/search">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-500 group-focus-within/search:text-voro-primary transition-colors">
                      <Search size={18} />
                    </div>
                    <Input
                      placeholder="Search bioactive foods & materials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0A0C14] border-white/5 focus:border-voro-primary/50 text-white font-mono text-sm py-5 pl-16 pr-6"
                    />
                  </div>

                  {/* Glassmorphic Query Overlay */}
                  {filteredFoods.length > 0 && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0A0C14]/95 backdrop-blur-3xl rounded-[2rem] border border-white/10 max-h-80 overflow-y-auto z-50 shadow-[0_50px_100px_rgba(0,0,0,0.8)] no-scrollbar p-3 space-y-2">
                      <div className="p-3 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Matching Compounds ({filteredFoods.length})</span>
                        <span className="text-[0.5rem] font-mono text-voro-primary uppercase tracking-widest">Click to Infuse</span>
                      </div>
                      {filteredFoods.map(food => (
                        <button
                          key={food.id}
                          onClick={() => handleAddIngredient(food)}
                          className="w-full flex justify-between items-center p-4 hover:bg-voro-primary/[0.03] hover:border-voro-primary/20 border border-transparent rounded-xl cursor-pointer transition-all text-left group/row"
                        >
                          <div>
                            <span className="text-white font-serif italic text-base group-hover/row:text-voro-primary transition-colors">{food.name}</span>
                            <span className="text-[0.55rem] font-mono text-gray-600 block uppercase tracking-wider mt-0.5">Category: {food.category}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-mono text-gray-400">
                              {food.calories} kcal / 100g
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 group-hover/row:bg-voro-primary group-hover/row:text-white group-hover/row:border-voro-primary transition-all">
                              <Plus size={14} />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Infusion Core */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <label className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 block ml-1">
                      Infused Compounds
                    </label>
                    <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest">
                      {ingredients.length} items integrated
                    </span>
                  </div>

                  {ingredients.length > 0 ? (
                    <div className="space-y-4">
                      {ingredients.map((ing, idx) => (
                        <IngredientItem
                          key={ing.instanceId}
                          ing={ing}
                          idx={idx}
                          confirmingPurgeId={confirmingPurgeId}
                          onPortionChange={handlePortionChange}
                          onRemove={handleRemoveIngredient}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl bg-[#0A0C14]/10">
                      <RotateCcw size={32} className="mx-auto text-gray-700 animate-spin-slow mb-4" />
                      <h4 className="text-lg font-serif italic font-medium text-gray-400 mb-1">Matrix Blank</h4>
                      <p className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-[0.25em]">Use the search bar above to infuse ingredients</p>
                    </div>
                  )}
                </div>

                {/* Main Action Sequence */}
                <div className="pt-8 border-t border-white/5">
                  <Button
                    onClick={handleSaveRecipe}
                    disabled={ingredients.length === 0}
                    className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.3em] text-[0.65rem] shadow-xl shadow-white/5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed group/save"
                  >
                    <span>Synthesize & Register Formula</span>
                    <ChevronRight size={16} className="ml-2 group-hover/save:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Thermodynamic Diagnostics Panel: Right Col-span 4 */}
          <div className="lg:col-span-4 space-y-8">
            <Card
              variant="glass"
              className="p-10 bg-gradient-to-b from-[#0A0C14] to-black border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                  <div>
                    <h3 className="text-xl font-serif italic text-white font-bold">Diagnostics</h3>
                    <p className="text-[0.5rem] font-mono text-gray-500 uppercase tracking-widest mt-1">Real-time thermodynamic calibration</p>
                  </div>
                  <ShieldCheck size={18} className="text-voro-primary animate-pulse" />
                </div>

                <div className="space-y-6">
                  {MACRO_CONFIG.map(config => {
                    const rawVal = totals[config.key];
                    const valStr = config.key === 'calories' ? Math.round(rawVal).toString() : rawVal.toFixed(1);
                    const percent = Math.min((rawVal / (config.key === 'calories' ? 2000 : 100)) * 100, 100);

                    const Icon = config.icon;

                    return (
                      <div key={config.key} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-all space-y-4 group/diagnostic">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/[0.02] border border-white/5 rounded-lg text-gray-500 group-hover/diagnostic:text-white transition-colors">
                              <Icon size={14} />
                            </div>
                            <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-widest group-hover/diagnostic:text-gray-400 transition-colors">
                              {config.label}
                            </span>
                          </div>
                          <span className="text-lg font-mono font-bold text-white">
                            {valStr} <span className="text-[0.6rem] text-gray-600 font-normal uppercase">{config.unit}</span>
                          </span>
                        </div>

                        {/* Composite-layer optimized scaleX progress bars */}
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden relative">
                          <div
                            className="h-full rounded-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left"
                            style={{
                              transform: `scaleX(${percent / 100})`,
                              backgroundColor: config.color,
                              boxShadow: `0 0 10px ${config.glow}`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed space-y-2">
                <span className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-widest block">
                  Bio-calibration Note
                </span>
                <p className="text-xs text-gray-500 leading-relaxed font-serif italic">
                  "Formulations are automatically synchronized into your active diet planner. Ensure portion sizes align with your current evolutionary target macros."
                </p>
              </div>
            </Card>
          </div>

        </div>

        {/* Synthesized Recipe Archives */}
        {savedRecipes.length > 0 && (
          <div className="mt-32 border-t border-white/5 pt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-voro-primary">
                  <BookOpen size={16} />
                  <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">
                    Formulation Databases
                  </span>
                </div>
                <h2 className="text-4xl font-serif italic font-medium text-white tracking-tight">
                  Synthesized <span className="text-gradient not-italic font-black">Formula Archives</span>
                </h2>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate('/nutrition/recipes')}
                className="font-mono text-xs uppercase tracking-widest px-8 py-4 border-white/10 rounded-full"
              >
                Open Codex Library
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedRecipes.map((recipe, idx) => (
                <SavedRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  idx={idx}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeBuilder;
