import React, { useEffect, useState, useMemo, useDeferredValue } from 'react';
import { Search, Activity } from 'lucide-react';
import { exercises } from '@/data/exercises';
import { ExerciseCard } from '@/components/ExerciseCard';

const PAGE_SIZE = 20;

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted categories.
 * Prevents O(N) extraction on every component render cycle.
 */
const CATEGORIES = ['All', ...new Set(exercises.map(e => e.category))];

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Category-First Filtering.
 * Pre-computes an EXERCISES_BY_CATEGORY map at the module level.
 * This enables the filtering useMemo hook to retrieve exercises of a selected
 * category in O(1) time instead of performing an O(N) array scan over all
 * 2,064 exercises on every render cycle or keystroke.
 */
const EXERCISES_BY_CATEGORY = exercises.reduce((acc, exercise) => {
  if (!acc[exercise.category]) acc[exercise.category] = [];
  acc[exercise.category].push(exercise);
  return acc;
}, {});

const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  /**
   * ⚡ OPTIMIZATION: Concurrent Rendering with useDeferredValue.
   * Eliminates the mandatory 200ms debounce delay.
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

  /**
   * ⚡ OPTIMIZATION: Replace useEffect + useState pattern with useMemo for filtering.
   * This eliminates the double-render cycle and provides cleaner data derivation.
   * ⚡ PERFORMANCE OPTIMIZATION: Category-First Filtering.
   * Uses pre-calculated map for O(1) initial slice if a category is selected.
   */
  const filteredExercises = useMemo(() => {
    let filtered = selectedCategory === 'All' ? exercises : (EXERCISES_BY_CATEGORY[selectedCategory] || []);

    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [deferredSearchQuery, selectedCategory]);

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
                className={`px-6 py-2.5 rounded-full text-[0.6rem] font-black uppercase tracking-[0.25em] transition-all border ${
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
          {filteredExercises.slice(0, visibleCount).map((exercise, idx) => (
            <div key={exercise.id} className="animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <ExerciseCard
                exercise={exercise}
                onSelect={() => console.log('Selected:', exercise.name)}
              />
            </div>
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
            <button
              onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
              className="px-12 py-5 rounded-2xl bg-white/5 border border-white/5 text-[0.65rem] font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-2xl"
            >
              Load More Exercises
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
