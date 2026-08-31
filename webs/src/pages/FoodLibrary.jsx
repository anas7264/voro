import React, { useState, useEffect, useMemo, useDeferredValue, useRef, useCallback, memo } from 'react';
import { Search, Filter, Heart, Utensils, ChevronRight, Sparkles, Zap, Info, ShieldCheck, Leaf, Wheat } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { foods } from '@/data/foods';

const PAGE_SIZE = 24;

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted categories.
 * Prevents O(N) extraction on component render cycles.
 */
const CATEGORIES = ['All', ...new Set(foods.map(f => f.category))];

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Pre-calculate lowercase properties for static foods dataset.
 * Avoids string lowercasing conversions on every search keystroke.
 */
const FOODS_LOWERCASE = foods.map(f => ({
  ...f,
  _nameLower: f.name.toLowerCase(),
  _subCategoryLower: f.subCategory ? f.subCategory.toLowerCase() : '',
}));

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted Category Map.
 * Provides O(1) lookup for category filtering, avoiding O(N) array scans.
 */
const FOOD_BY_CATEGORY = FOODS_LOWERCASE.reduce((acc, food) => {
  if (!acc[food.category]) acc[food.category] = [];
  acc[food.category].push(food);
  return acc;
}, {});

/**
 * ⚡ REFINEMENT: FoodArtifactCard Subcomponent.
 * Conforming to Voro's 'Forge' luxury system aesthetic with:
 * - Direct inline CSS custom property updates on mouse move (O(1) direct-DOM, no React state churn).
 * - Real-time TX/TY coordinate telemetry in JetBrains Mono.
 * - Accessible 3D Interaction Pattern on focus (static 4-degree tilt).
 * - Full ARIA keyboard accessibility and semantic structure.
 */
const FoodArtifactCard = memo(({ food, idx, isFavorite, onToggleFavorite, onInspect }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const nodeId = useMemo(() => `FOOD_NODE_0${idx}`, [idx]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 15 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 30;
    const tiltX = (0.5 - (y / rect.height)) * 30;

    // Direct DOM mutation for buttery smooth 60fps tracking
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
      // Static 4-degree tilt on focus for keyboard accessibility compliance
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

  const interactionActive = isHovered || isFocused;

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
      aria-label={`${food.name}. ${food.calories} kcal, ${food.protein}g protein per 100g. ${isFavorite ? 'Archived in favorites' : 'Not favorited'}.`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        animationDelay: `${idx * 40}ms`
      }}
      className="group relative bg-[#0A0C14]/60 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] hover:border-white/10 flex flex-col shadow-2xl overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] animate-slide-up"
    >
      {/* Precision Grid & Luminous Shimmer Effect */}
      <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.015]" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 60%)`,
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
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/10">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif italic font-medium text-white group-hover:text-voro-primary transition-colors duration-500 leading-tight">
              {food.name}
            </h3>
            <p className="text-[0.65rem] font-mono font-bold uppercase tracking-[0.3em] text-gray-600">
              {food.nameAr || food.subCategory}
            </p>
          </div>
          <button
            onClick={() => onToggleFavorite(food)}
            aria-label={isFavorite ? `Remove ${food.name} from vault` : `Archive ${food.name} in favorites`}
            className={`p-3 rounded-2xl transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary ${
              isFavorite
                ? 'bg-voro-danger/10 text-voro-danger shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'bg-white/5 text-gray-700 hover:text-white hover:bg-white/10'
            }`}
          >
            <Heart
              size={18}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-[0.55rem] font-mono font-bold uppercase tracking-widest text-voro-primary bg-voro-primary/10 px-3 py-1 rounded-full border border-voro-primary/20">
            {food.category}
          </span>
          {food.isVegan && (
            <span className="inline-flex items-center gap-1 text-[0.55rem] font-mono font-bold uppercase tracking-widest text-voro-secondary bg-voro-secondary/10 px-3 py-1 rounded-full border border-voro-secondary/20">
              <Leaf size={10} />
              Vegan
            </span>
          )}
          {food.isHalal && (
            <span className="inline-flex items-center gap-1 text-[0.55rem] font-mono font-bold uppercase tracking-widest text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <ShieldCheck size={10} />
              Halal
            </span>
          )}
          {food.isGlutenFree && (
            <span className="inline-flex items-center gap-1 text-[0.55rem] font-mono font-bold uppercase tracking-widest text-voro-accent bg-voro-accent/10 px-3 py-1 rounded-full border border-voro-accent/20">
              <Wheat size={10} />
              GF
            </span>
          )}
        </div>

        <div className="bg-black/40 border border-white/5 p-8 rounded-[2rem] mb-10 group-hover:bg-black/60 transition-colors duration-500">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest block mb-1">Calories</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif font-bold text-white">{food.calories}</span>
                <span className="text-[0.5rem] font-mono text-gray-700 uppercase">kcal</span>
              </div>
            </div>
            <div>
              <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest block mb-1">Protein</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif font-bold text-voro-primary italic">{food.protein}</span>
                <span className="text-[0.5rem] font-mono text-gray-700 uppercase">g</span>
              </div>
            </div>
          </div>

          {/* Macro-Spectrum Visualizer */}
          {food.calories > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between text-[0.5rem] font-mono font-bold text-gray-600 uppercase tracking-widest">
                <span>C: {food.carbs}g</span>
                <span>F: {food.fat}g</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                  style={{ width: `${(food.protein * 4 / food.calories) * 100}%` }}
                />
                <div
                  className="h-full bg-voro-secondary shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: `${(food.carbs * 4 / food.calories) * 100}%` }}
                />
                <div
                  className="h-full bg-voro-accent shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  style={{ width: `${(food.fat * 9 / food.calories) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <button
          className="mt-auto flex items-center justify-between text-[0.6rem] font-mono font-medium text-gray-700 uppercase tracking-[0.2em] pt-4 border-t border-white/5 w-full text-left transition-all hover:text-white group/footer focus:outline-none focus-visible:ring-1 focus-visible:ring-voro-primary rounded-lg"
          onClick={() => onInspect(food)}
        >
          <div className="flex items-center gap-2">
            <Info size={10} />
            <span>Per 100g Synthesis</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-voro-primary" />
        </button>
      </div>
    </div>
  );
});

FoodArtifactCard.displayName = 'FoodArtifactCard';

const FoodLibrary = () => {
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  /**
   * ⚡ OPTIMIZATION: Concurrent Rendering with useDeferredValue.
   * Replaced legacy 200ms debounce with useDeferredValue for "Optimistic Filtering".
   * Allows the UI to remain responsive while React handles filtering as a low-priority transition.
   */
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    document.title = 'VORO | Gastronomy Archive';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Reset visible count when filters change to maintain performance.
   */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deferredSearchQuery, selectedCategory]);

  /**
   * ⚡ OPTIMIZATION: Replace useEffect + useState pattern with useMemo for filtering.
   * Eliminates double-render cycles and provides clean, synchronous data derivation.
   */
  const filteredFoods = useMemo(() => {
    /**
     * ⚡ PERFORMANCE OPTIMIZATION: Category-First Filtering.
     * Uses pre-calculated map for O(1) initial slice if a category is selected.
     */
    let filtered = selectedCategory === 'All' ? FOODS_LOWERCASE : (FOOD_BY_CATEGORY[selectedCategory] || []);

    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f._nameLower.includes(query) ||
        (f.nameAr && f.nameAr.includes(query)) ||
        (f.subCategory && f._subCategoryLower.includes(query))
      );
    }

    return filtered;
  }, [deferredSearchQuery, selectedCategory]);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: O(1) Set lookup table for favorites.
   * Converts array to Set in O(N) once per favorite change, enabling O(1) lookup per card.
   */
  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const toggleFavorite = useCallback((food) => {
    const isFav = favoritesSet.has(food.id);
    setFavorites(prev => isFav ? prev.filter(id => id !== food.id) : [...prev, food.id]);
    addNotification(
      isFav ? `${food.name} removed from vault` : `${food.name} archived in favorites`,
      isFav ? 'info' : 'success'
    );
  }, [favoritesSet, addNotification]);

  const handleInspectFood = useCallback((food) => {
    addNotification(`Detailed structural analysis of ${food.name} synthesized.`, 'info');
  }, [addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Atmospheric Depth Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] right-[5%] w-[45%] h-[45%] bg-voro-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] left-[5%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#020408_100%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20">
          <div className="flex items-center gap-3 text-voro-primary mb-4">
            <Utensils size={18} />
            <span className="text-[0.6rem] font-mono font-medium uppercase tracking-[0.4em]">Metabolic Gastronomy Archive</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-tight leading-tight">
            Curated <span className="text-gradient not-italic font-bold">Nutrients</span>
          </h1>
          <p className="mt-6 text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-60 max-w-xl leading-loose">
            An editorial synthesis of the Levantine diet, architected for physiological optimization and aesthetic delight.
          </p>
        </header>

        {/* Search & Intelligence Filters */}
        <section className="mb-20 space-y-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-gray-500 group-focus-within:text-voro-primary transition-colors duration-500">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Search gastronomic artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0C14]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] pl-20 pr-10 py-7 text-xl font-serif italic text-white placeholder:text-gray-700 focus:outline-none focus:border-voro-primary/40 focus:ring-1 focus:ring-voro-primary/10 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            />
          </div>

          <div className="flex gap-4 flex-wrap items-center" role="group" aria-label="Archive segment categories">
            <div className="flex items-center gap-3 mr-6">
              <Filter size={14} className="text-gray-700" />
              <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-gray-600">Archive Segments</span>
            </div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`px-8 py-3 rounded-full text-[0.6rem] font-black uppercase tracking-[0.25em] transition-all duration-500 border focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary ${
                  selectedCategory === cat
                    ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                    : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Artifact Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredFoods.slice(0, visibleCount).map((food, idx) => (
            <FoodArtifactCard
              key={food.id}
              food={food}
              idx={idx}
              isFavorite={favoritesSet.has(food.id)}
              onToggleFavorite={toggleFavorite}
              onInspect={handleInspectFood}
            />
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="py-40 text-center animate-fade-in">
             <Zap size={48} className="mx-auto text-gray-800 mb-8 opacity-20" />
             <p className="text-xl font-serif italic text-gray-600 tracking-tight">No gastronomic artifacts match your current synthesis.</p>
             <button
              onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
              className="mt-8 text-[0.6rem] font-black uppercase tracking-[0.3em] text-voro-primary hover:text-white transition-colors"
             >
               Reset Intelligence Filter
             </button>
          </div>
        )}

        {visibleCount < filteredFoods.length && (
          <div className="mt-24 flex justify-center">
            <button
              onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
              className="group relative px-16 py-6 rounded-full bg-white/5 border border-white/10 text-[0.65rem] font-black uppercase tracking-[0.5em] text-white overflow-hidden transition-all duration-700 hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-voro-primary/20 via-transparent to-voro-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10 flex items-center gap-4">
                <Sparkles size={16} />
                Expand Archive
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodLibrary;
