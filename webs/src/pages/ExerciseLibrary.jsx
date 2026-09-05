import React, { useEffect, useState, useMemo, useDeferredValue, useCallback, memo } from 'react';
import { Search, Activity } from 'lucide-react';
import { exercises } from '@/data/exercises';
import { ExerciseCard } from '@/components/ExerciseCard';
import Button from '@/components/Button';

const PAGE_SIZE = 20;

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted categories.
 * Prevents O(N) extraction on every component render cycle.
 */
const CATEGORIES = Object.freeze(['All', ...new Set(exercises.map(e => e.category))]);

// ⚡ PERFORMANCE OPTIMIZATION: Pre-calculate lowercase properties for the static exercises dataset.
// This completely avoids allocating and converting strings on every single keystroke inside the filter loop.
const EXERCISES_LOWERCASE = Object.freeze(exercises.map(e => Object.freeze({
  ...e,
  _nameLower: e.name.toLowerCase(),
})));

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted Category Map.
 * Provides O(1) lookup for category filtering, avoiding O(N) array scans on all 2,064 exercises.
 */
const EXERCISES_BY_CATEGORY = Object.freeze(EXERCISES_LOWERCASE.reduce((acc, exercise) => {
  if (!acc[exercise.category]) acc[exercise.category] = [];
  acc[exercise.category].push(exercise);
  return acc;
}, {}));

/**
 * ⚡ SUBCOMPONENT: ExerciseItemWrapper
 * Memoized item container that encapsulates entrance animation styling,
 * preventing inline style object allocations inside the parent render map loop.
 */
const ExerciseItemWrapper = memo(({ exercise, index, onSelect }) => {
  const animationStyle = useMemo(() => ({
    animationDelay: `${Math.min(index, 10) * 50}ms`
  }), [index]);

  return (
    <div className="animate-slide-up" style={animationStyle}>
      <ExerciseCard
        exercise={exercise}
        onSelect={onSelect}
      />
    </div>
  );
});

ExerciseItemWrapper.displayName = 'ExerciseItemWrapper';

const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  /**
   * ⚡ OPTIMIZATION: Concurrent Rendering with useDeferredValue.
   * Eliminates mandatory debounce delay while maintaining smooth UI typing.
   */
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    document.title = 'VORO | Exercise Library';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Reset visible count when filters change to maintain performance.
   */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deferredSearchQuery, selectedCategory]);

  const handleSelectExercise = useCallback((exercise) => {
    // Stable handler reference prevents ExerciseCard React.memo invalidation
    console.log('Selected movement pattern:', exercise?.name || exercise);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  }, []);

  /**
   * ⚡ OPTIMIZATION: Replace useEffect + useState pattern with useMemo for filtering.
   * This eliminates double-render cycles and provides clean, single-pass data derivation.
   */
  const filteredExercises = useMemo(() => {
    /**
     * ⚡ PERFORMANCE OPTIMIZATION: Category-First Filtering.
     * Uses pre-calculated map for O(1) initial slice if a category is selected.
     */
    let filtered = selectedCategory === 'All' ? EXERCISES_LOWERCASE : (EXERCISES_BY_CATEGORY[selectedCategory] || []);

    const query = deferredSearchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(e => e._nameLower.includes(query));
    }

    return filtered;
  }, [deferredSearchQuery, selectedCategory]);

  const visibleExercises = useMemo(() => {
    return filteredExercises.slice(0, visibleCount);
  }, [filteredExercises, visibleCount]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Architectural Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20">
          <div className="flex items-center gap-3 text-voro-primary mb-4">
            <Activity size={18} />
            <span className="text-[0.6rem] font-mono font-medium uppercase tracking-[0.4em]">Kinetic Movement Atlas</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
            Anatomical <span className="text-voro-primary not-italic font-bold">Library</span>
          </h1>
          <p className="mt-4 text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-60 max-w-lg">
            A curated synthesis of human movement and biomechanical efficiency.
          </p>
        </header>

        {/* Search & Filters */}
        <section className="mb-16 space-y-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-500 group-focus-within:text-voro-primary transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search movement patterns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0C14]/50 backdrop-blur-xl border border-white/5 rounded-[2rem] pl-16 pr-8 py-6 text-lg font-serif italic text-white placeholder:text-gray-700 focus:outline-none focus:border-voro-primary/50 focus:ring-1 focus:ring-voro-primary/20 transition-all shadow-2xl"
            />
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-gray-600 mr-4">Classification</span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`px-6 py-2.5 rounded-full text-[0.6rem] font-black uppercase tracking-[0.25em] transition-all border outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] ${
                  selectedCategory === cat
                    ? 'bg-white text-black border-white shadow-xl shadow-white/5'
                    : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleExercises.map((exercise, idx) => (
            <ExerciseItemWrapper
              key={exercise.id}
              exercise={exercise}
              index={idx}
              onSelect={handleSelectExercise}
            />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12 opacity-20">
            <Activity size={48} className="mx-auto mb-4 text-gray-700" />
            <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400">Pattern Void</p>
          </div>
        )}

        {visibleCount < filteredExercises.length && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="secondary"
              onClick={handleLoadMore}
            >
              Load More Exercises
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
