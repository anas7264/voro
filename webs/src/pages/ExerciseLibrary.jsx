import React, { useEffect, useState, useMemo } from 'react';
import { Search, Activity, ChevronRight, Sparkles } from 'lucide-react';
import { exercises } from '@/data/exercises';

const PAGE_SIZE = 20;

const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
  }, [searchQuery, selectedCategory]);

  /**
   * ⚡ OPTIMIZATION: Memoize categories to avoid O(N) extraction on every render.
   */
  const categories = useMemo(() => ['All', ...new Set(exercises.map(e => e.category))], []);

  /**
   * ⚡ OPTIMIZATION: Replace useEffect + useState pattern with useMemo for filtering.
   * This eliminates the double-render cycle and provides cleaner data derivation.
   */
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

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
            {categories.map(cat => (
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
            <div
              key={exercise.id}
              className="group animate-slide-up relative bg-[#0A0C14] border border-white/5 p-8 rounded-[2.5rem] transition-all hover:border-white/10 hover:translate-y-[-4px] flex flex-col justify-between"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-serif italic font-medium text-white mb-2 group-hover:text-voro-primary transition-colors">
                      {exercise.name}
                    </h3>
                    <div className="flex gap-3 flex-wrap items-center">
                      <span className="text-[0.55rem] font-mono font-bold uppercase tracking-widest text-voro-primary bg-voro-primary/5 px-2 py-0.5 rounded">
                        {exercise.category}
                      </span>
                      <span className="text-[0.55rem] font-mono font-bold uppercase tracking-widest text-gray-600">
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-voro-primary/10 group-hover:text-voro-primary transition-all">
                    <Activity size={18} />
                  </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-8 opacity-80 line-clamp-2">
                  {exercise.description}
                </p>

                {exercise.tips && exercise.tips.length > 0 && (
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-[0.55rem] font-black uppercase tracking-[0.3em] text-gray-700">
                      <Sparkles size={10} className="text-voro-accent" />
                      <span>Kinetic Insights</span>
                    </div>
                    {exercise.tips.slice(0, 1).map((tip, idx) => (
                      <p key={idx} className="text-xs italic text-gray-400 pl-4 border-l border-voro-accent/20">
                        "{tip}"
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button className="w-full mt-auto flex items-center justify-between px-8 py-5 rounded-2xl bg-white/5 border border-white/5 text-[0.65rem] font-black uppercase tracking-[0.3em] text-white transition-all group-hover:bg-voro-primary group-hover:border-voro-primary group-hover:shadow-2xl group-hover:shadow-voro-primary/20">
                <span>Integrate Pattern</span>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No exercises found</p>
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
