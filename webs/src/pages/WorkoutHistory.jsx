import React, { useEffect, useState, useMemo, useRef, useCallback, useId } from 'react';
import { Dumbbell, Clock, BarChart2, Calendar, ChevronDown, ChevronUp, Zap, Trophy, Flame, Activity } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { useStorageKey } from '@/hooks/useStorage';
import { useNavigate } from 'react-router-dom';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in loops.
 */
const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static style map.
 * Prevents redundant object allocation on every component render.
 */
const typeColors = {
  Strength: 'text-violet-400 group-hover/card:text-violet-300',
  Cardio: 'text-blue-400 group-hover/card:text-blue-300',
  HIIT: 'text-red-400 group-hover/card:text-red-300',
  Yoga: 'text-emerald-400 group-hover/card:text-emerald-300',
  default: 'text-gray-400 group-hover/card:text-gray-300',
};

const ARCHETYPES = ['All', 'Strength', 'Cardio', 'HIIT', 'Yoga'];
const PAGE_SIZE = 15;

/**
 * ⚡ REFINEMENT: ChronoArchiveCard Component.
 * Features 3D volumetric transforms, coordinate telemetry, magnetic mouse tracking,
 * and keyboard accessibility with static focus-tilts (4 degrees).
 */
const ChronoArchiveCard = ({ workout, idx, isExpanded, onToggle, nodeId }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const contentId = useId();
  const triggerId = useId();

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 15 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 15;
    const tiltX = (0.5 - (y / rect.height)) * 15;

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
      // 4-degree static tilt on focus for accessibility compliance
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const interactionActive = isHovered || isFocused;

  // Calculate estimated total session tonnage
  const totalTonnage = useMemo(() => {
    return workout.exercises?.reduce((acc, ex) => {
      const exVol = ex.sets?.reduce((s, set) => s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0) || 0;
      return acc + exVol;
    }, 0) || 0;
  }, [workout.exercises]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative bg-[#0A0C14]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden group/card transition-all duration-700 hover:border-white/10 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
    >
      {/* Precision Grid & Boutique Grain Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-[0.01] group-hover/card:opacity-[0.03] transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.06), transparent 50%)`,
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-all duration-500">
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10 p-8 md:p-10" style={{ transform: 'translateZ(30px)' }}>
        <button
          id={triggerId}
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          className="w-full text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] rounded-[1.5rem]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-gray-500" />
                <span className="text-xs font-mono font-medium text-gray-500 uppercase tracking-widest">
                  {fullDateFormatter.format(new Date(workout.date))}
                </span>
              </div>

              <h3 className={`text-2xl font-serif italic font-bold tracking-tight transition-colors duration-500 ${typeColors[workout.type] || typeColors.default}`}>
                {workout.type}
              </h3>

              <div className="flex flex-wrap gap-6 text-sm font-mono text-gray-400">
                <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Clock size={14} className="text-voro-primary/60" />
                  <span>{workout.duration} Min</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Dumbbell size={14} className="text-voro-primary/60" />
                  <span>{workout.exercises?.length || 0} Movements</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <BarChart2 size={14} className="text-voro-primary/60" />
                  <span>{totalTonnage} kg Vol</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-600 group-hover/card:text-voro-primary group-hover/card:bg-voro-primary/5 group-hover/card:border-voro-primary/10 transition-all duration-700">
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
          </div>
        </button>

        {/* Accordion Set Details Drawer */}
        <div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isExpanded ? 'grid-rows-[1fr] opacity-100 mt-8 pt-8 border-t border-white/5' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden space-y-6">
            {workout.exercises?.map((ex, eIdx) => {
              const exVol = ex.sets?.reduce((s, set) => s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0) || 0;
              return (
                <div key={eIdx} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.3em] text-voro-primary">
                        Movement Pattern {eIdx + 1}
                      </span>
                      <h4 className="text-lg font-serif italic font-bold text-white mt-1">
                        {ex.name}
                      </h4>
                    </div>
                    <div className="px-3.5 py-1.5 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[0.65rem] font-bold text-gray-400">
                      {ex.sets?.length || 0} Sets · {exVol} kg Volume
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {ex.sets?.map((set, setIdx) => (
                      <div key={setIdx} className="p-4 rounded-xl bg-black/40 border border-white/[0.02] flex items-center justify-between">
                        <span className="text-[0.6rem] font-mono font-black text-gray-600">SET #{setIdx + 1}</span>
                        <span className="font-mono text-sm font-bold text-gray-300">
                          {set.weight} kg × {set.reps} reps
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkoutHistory = () => {
  const workoutLog = useStorageKey('workout_log');
  const navigate = useNavigate();
  const pageId = useId();
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedArchetype, setSelectedArchetype] = useState('All');

  useEffect(() => {
    document.title = 'VORO | Absolute Kinetic Chronicles';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Derive workouts using useMemo instead of useEffect + useState.
   * This eliminates the mount-time double-render cycle and ensures the data
   * is reactive to storage changes without secondary state updates.
   */
  const workouts = useMemo(() => {
    const data = workoutLog || {};
    return Object.entries(data)
      .filter(([_, w]) => w.attended)
      .map(([date, w]) => ({ date, ...w }))
      /* ⚡ PERFORMANCE OPTIMIZATION: Raw Relational Sort Optimization.
         Utilizes raw string relational comparison to avoid both dynamic Date
         allocation and localeCompare engine overhead. Safe-guarded with fallbacks. */
      .sort((a, b) => {
        const dA = a.date || '';
        const dB = b.date || '';
        return dA < dB ? 1 : dA > dB ? -1 : 0;
      });
  }, [workoutLog]);

  /**
   * ⚡ OPTIMIZATION: Filter workouts based on the selected archetype.
   */
  const filteredWorkouts = useMemo(() => {
    if (selectedArchetype === 'All') return workouts;
    return workouts.filter(w => w.type === selectedArchetype);
  }, [workouts, selectedArchetype]);

  /**
   * ⚡ OPTIMIZATION: Memoized summary statistics.
   * Prevents O(N) re-calculations on every render (e.g., when expanding/collapsing).
   */
  const summaryStats = useMemo(() => {
    return {
      totalSessions: workouts.length,
      totalHours: Math.round(workouts.reduce((s, w) => s + (w.duration || 0), 0) / 60),
      totalVolumeK: (workouts.reduce((s, w) => s + (w.volume || 0), 0) / 1000).toFixed(0)
    };
  }, [workouts]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-hidden">
      {/* Interactive Ambient Backglows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-16 md:py-24">
        {/* Bespoke Header Grid */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.50em] opacity-90">
                Chrono-Kinetic Archive // ARCHIVE_REGISTRY
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-tighter leading-[0.9]">
              Kinetic <span className="text-gradient not-italic font-bold">Archives</span>
            </h1>

            <p className="text-gray-500 font-sans text-sm md:text-base leading-relaxed max-w-lg">
              A chronological archive of neuromuscular adaptations, metabolic velocity, and temporal training depth.
            </p>
          </div>

          {/* Log Session Action */}
          <div className="flex items-center gap-6">
            <Button
              onClick={() => navigate('/workout/log')}
              className="px-10 py-6 shadow-xl shadow-voro-primary/20 !rounded-full text-[0.65rem] font-mono font-bold tracking-[0.2em] uppercase"
            >
              <Dumbbell size={16} className="mr-3" />
              Log New Session
            </Button>
          </div>
        </header>

        {workouts.length > 0 ? (
          <div className="space-y-16">
            {/* Redesigned Summary Stats Panel */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card variant="premium" nodeId="STATS_SESS" className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-voro-primary/10 rounded-2xl text-voro-primary shadow-lg shadow-voro-primary/20">
                    <Flame size={24} />
                  </div>
                  <span className="text-[0.6rem] font-mono font-bold text-voro-primary uppercase tracking-[0.4em]">VELOCITY_01</span>
                </div>
                <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Active Velocity</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-serif italic font-bold text-white">{summaryStats.totalSessions}</span>
                  <span className="text-[0.65rem] font-mono text-gray-600 uppercase tracking-widest">Sessions</span>
                </div>
              </Card>

              <Card variant="premium" nodeId="STATS_HOURS" className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-voro-secondary/10 rounded-2xl text-voro-secondary shadow-lg shadow-voro-secondary/20">
                    <Clock size={24} />
                  </div>
                  <span className="text-[0.6rem] font-mono font-bold text-voro-secondary uppercase tracking-[0.4em]">TEMPORAL_02</span>
                </div>
                <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Temporal Depth</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-serif italic font-bold text-white">{summaryStats.totalHours}</span>
                  <span className="text-[0.65rem] font-mono text-gray-600 uppercase tracking-widest">Hours</span>
                </div>
              </Card>

              <Card variant="premium" nodeId="STATS_VOL" className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-voro-accent/10 rounded-2xl text-voro-accent shadow-lg shadow-voro-accent/20">
                    <Activity size={24} />
                  </div>
                  <span className="text-[0.6rem] font-mono font-bold text-voro-accent uppercase tracking-[0.4em]">TONNAGE_03</span>
                </div>
                <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Absolute Volume</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-serif italic font-bold text-white">{summaryStats.totalVolumeK}k</span>
                  <span className="text-[0.65rem] font-mono text-gray-600 uppercase tracking-widest">kg tonnage</span>
                </div>
              </Card>
            </section>

            {/* Glowing Archetype Selector Pill-Tabs */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.40em] text-gray-500 mb-2">
                Filter by Archetype Matrix
              </h2>
              <div className="flex flex-wrap gap-4">
                {ARCHETYPES.map((arch) => (
                  <button
                    key={arch}
                    onClick={() => {
                      setSelectedArchetype(arch);
                      setExpandedIdx(null);
                    }}
                    className={`relative px-8 py-4 rounded-full text-xs font-mono font-bold tracking-[0.15em] uppercase transition-all duration-500 overflow-hidden focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none ${
                      selectedArchetype === arch
                        ? 'bg-voro-primary text-white shadow-[0_15px_30px_rgba(124,58,237,0.3)] ring-1 ring-white/10'
                        : 'bg-white/[0.02] text-gray-500 hover:text-white border border-white/5 hover:bg-white/[0.04]'
                    }`}
                  >
                    {arch}
                  </button>
                ))}
              </div>
            </section>

            {/* Chronological Archives List */}
            <section className="space-y-6">
              {filteredWorkouts.slice(0, visibleCount).map((workout, idx) => {
                const uniqueNodeId = `CHRONO_NODE_${pageId.replace(/:/g, '')}_${idx}`;
                return (
                  <div key={workout.date} className="animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    <ChronoArchiveCard
                      workout={workout}
                      idx={idx}
                      isExpanded={expandedIdx === idx}
                      onToggle={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                      nodeId={uniqueNodeId}
                    />
                  </div>
                );
              })}

              {filteredWorkouts.length === 0 && (
                <div className="py-24 text-center border border-dashed border-white/5 rounded-[3rem] bg-[#0A0C14]/30">
                  <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap size={24} className="text-gray-700 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-serif italic font-medium text-white mb-2">Pattern Void</h3>
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.2em]">No session logs match the selected archetype.</p>
                </div>
              )}
            </section>

            {visibleCount < filteredWorkouts.length && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                  className="px-12 py-5 !rounded-full font-mono text-xs tracking-[0.15em]"
                >
                  Retrieve Further Logs
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[4rem] bg-[#0A0C14]/40 backdrop-blur-md">
            <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trophy size={40} className="text-gray-700 animate-pulse" />
            </div>
            <h3 className="text-2xl font-serif italic font-medium text-white mb-3">Archives Void</h3>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
              No sessions found in the archive repository. Initiate and complete your first evolutionary session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;
