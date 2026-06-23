import React, { useEffect, useState, useMemo } from 'react';
import { Dumbbell, Clock, BarChart2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
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

const WorkoutHistory = () => {
  const workoutLog = useStorageKey('workout_log');
  const navigate = useNavigate();
  const [expandedIdx, setExpandedIdx] = useState(null);

  useEffect(() => {
    document.title = 'VORO | Workout History';
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
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [workoutLog]);

  const typeColors = {
    Strength: 'text-violet-400',
    Cardio: 'text-blue-400',
    HIIT: 'text-red-400',
    Yoga: 'text-emerald-400',
    default: 'text-gray-400',
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Workout History</h1>
            <p className="text-gray-400 mt-1">{workouts.length} sessions logged</p>
          </div>
          <Button onClick={() => navigate('/workout/log')} className="flex items-center gap-2">
            <Dumbbell size={18} />
            Log Workout
          </Button>
        </div>

        {workouts.length > 0 ? (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-violet-400">{workouts.length}</div>
                <div className="text-xs text-gray-400 mt-1">Total Sessions</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {Math.round(workouts.reduce((s, w) => s + (w.duration || 0), 0) / 60)}h
                </div>
                <div className="text-xs text-gray-400 mt-1">Total Time</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-400">
                  {(workouts.reduce((s, w) => s + (w.volume || 0), 0) / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-gray-400 mt-1">Total Volume (kg)</div>
              </Card>
            </div>

            <div className="space-y-3">
              {workouts.map((workout, idx) => (
                <Card key={idx} className="p-0 overflow-hidden hover:border-voro-primary/50 transition-all border border-voro-border">
                  <button
                    type="button"
                    className="w-full p-5 flex items-start justify-between text-left transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-voro-surface outline-none"
                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                    aria-expanded={expandedIdx === idx}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Calendar size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-400">
                          {fullDateFormatter.format(new Date(workout.date))}
                        </span>
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${typeColors[workout.type] || typeColors.default}`}>
                        {workout.type}
                      </h3>
                      <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Clock size={14} />
                          {workout.duration} min
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Dumbbell size={14} />
                          {workout.exercises?.length || 0} exercises
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <BarChart2 size={14} />
                          {Math.round((workout.volume || 0) / 1000)}k kg
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-gray-500">
                      {expandedIdx === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      <span className="sr-only">
                        {expandedIdx === idx ? 'Collapse details' : 'Expand details'}
                      </span>
                    </div>
                  </button>

                  {expandedIdx === idx && workout.exercises?.length > 0 && (
                    <div className="px-5 pb-5 border-t border-voro-border">
                      <div className="space-y-2 mt-4">
                        {workout.exercises.map((ex, eIdx) => (
                          <div key={eIdx} className="flex items-center justify-between text-sm">
                            <span className="text-white">{ex.name}</span>
                            <span className="text-gray-400">
                              {ex.sets?.length || 0} sets ·{' '}
                              {ex.sets?.reduce((s, set) => s + (set.weight || 0) * (set.reps || 0), 0)} kg vol
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-16 text-center">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-xl font-bold text-white mb-2">No workouts logged yet</h3>
            <p className="text-gray-400 mb-6">Start tracking your training sessions to build your history</p>
            <Button onClick={() => navigate('/workout/log')}>Log First Workout</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;
