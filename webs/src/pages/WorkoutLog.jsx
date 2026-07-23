import React, { useState, useEffect, useMemo, useCallback, useDeferredValue, memo } from 'react';
import { Plus, Trash2, CheckCircle, Dumbbell, Calendar, Clock, Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Checkbox from '@/components/Checkbox';
import Confetti from '@/components/Confetti';
import DatePicker from '@/components/DatePicker';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateWorkoutEntry } from '@/utils/validators';
import { exercises } from '@/data/exercises';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Concurrent Exercise Search in WorkoutLog.jsx
 * The high-frequency exercise search state is isolated in a memoized subcomponent,
 * ExerciseSearchModal, utilizing React's useDeferredValue hook to defer the expensive
 * O(N) array filtering of the 2,064 item exercise library. This separates typing
 * events from heavy calculations, keeping input fluid at 60fps and protecting the
 * parent layout from redundant reconciliation.
 */
const ExerciseSearchModal = memo(({ isOpen, onClose, onSelectExercise }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredExercises = useMemo(() => {
    if (!isOpen) return [];
    const query = deferredSearchQuery.toLowerCase();
    return exercises.filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query)
    ).slice(0, 15);
  }, [isOpen, deferredSearchQuery]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Movement Pattern Synthesis"
    >
      <div className="space-y-10 min-h-[500px]">
        <div className="space-y-4">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Database Query</p>
          <Input
            placeholder="Search exercise patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="space-y-3 max-h-[450px] overflow-y-auto no-scrollbar pb-10">
          {filteredExercises.map(ex => (
            <button
              key={ex.id}
              onClick={() => onSelectExercise(ex)}
              className="w-full text-left p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-voro-primary hover:bg-voro-primary/[0.02] transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white tracking-tight uppercase">{ex.name}</span>
                <span className="text-[0.55rem] font-black text-voro-primary uppercase tracking-widest px-2 py-0.5 rounded bg-voro-primary/10 border border-voro-primary/20">{ex.difficulty}</span>
              </div>
              <p className="text-[0.6rem] font-mono text-gray-600 tracking-widest uppercase">{ex.category} · {ex.equipment || 'Standard'}</p>
            </button>
          ))}
          {filteredExercises.length === 0 && (
            <div className="text-center py-24 opacity-20">
              <Zap size={48} className="mx-auto mb-4 text-gray-700" />
              <p className="text-[0.65rem] font-black uppercase tracking-[0.3em]">Pattern Void</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
});

ExerciseSearchModal.displayName = 'ExerciseSearchModal';

const WorkoutLog = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to the data for the currently selected date.
   */
  const dayWorkout = useStorageKeySelector(
    'workout_log',
    useCallback((log) => (log || {})[date] || {
      attended: false,
      type: 'Strength',
      duration: 60,
      exercises: [],
    }, [date])
  );

  const { getItem, updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confirmingRemoveId, setConfirmingRemoveId] = useState(null);

  // Use local state for drafting to avoid excessive writes to storage
  const [sessionType, setSessionType] = useState('Strength');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Workout Log';

    /**
     * ⚡ OPTIMIZATION: Reactive initialization.
     * Use the surgically reactive dayWorkout to initialize the local draft state.
     */
    setSessionType(dayWorkout.type);
    setSessionDuration(dayWorkout.duration);
    setSelectedExercises(dayWorkout.exercises || []);
  }, [dayWorkout]);

  // Reset confirmation state after timeout
  useEffect(() => {
    if (confirmingRemoveId) {
      const timer = setTimeout(() => setConfirmingRemoveId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingRemoveId]);

  const addExercise = useCallback((exercise) => {
    const newExercise = {
      id: `${exercise.id}-${Date.now()}`,
      exerciseId: exercise.id,
      name: exercise.name,
      category: exercise.category,
      sets: [
        { reps: 8, weight: 0, completed: false },
        { reps: 8, weight: 0, completed: false },
        { reps: 8, weight: 0, completed: false },
      ],
    };
    setSelectedExercises(prev => [...prev, newExercise]);
    setShowExerciseSearch(false);
    addNotification(`${exercise.name} integrated.`, 'success');
  }, [addNotification]);

  const handleRemoveClick = useCallback((id) => {
    if (confirmingRemoveId === id) {
      setSelectedExercises(prev => prev.filter(ex => ex.id !== id));
      setConfirmingRemoveId(null);
    } else {
      setConfirmingRemoveId(id);
    }
  }, [confirmingRemoveId]);

  const updateSet = useCallback((exerciseIdx, setIdx, field, value) => {
    setSelectedExercises(prev => {
      const updated = [...prev];
      updated[exerciseIdx] = {
        ...updated[exerciseIdx],
        sets: updated[exerciseIdx].sets.map((set, i) =>
          i === setIdx ? { ...set, [field]: value } : set
        )
      };
      return updated;
    });
  }, []);

  const addSet = useCallback((idx) => {
    setSelectedExercises(prev => {
      const updated = [...prev];
      const currentSets = updated[idx].sets;
      const lastSet = currentSets[currentSets.length - 1] || { reps: 8, weight: 0 };
      updated[idx] = {
        ...updated[idx],
        sets: [...currentSets, { reps: lastSet.reps, weight: lastSet.weight, completed: false }]
      };
      return updated;
    });
  }, []);

  const totalVolume = useMemo(() => {
    return selectedExercises.reduce((sum, ex) => {
      return sum + ex.sets.reduce((exSum, set) => exSum + (Number(set.weight) * Number(set.reps)), 0);
    }, 0);
  }, [selectedExercises]);

  const saveWorkout = useCallback(async () => {
    const { valid, errors } = validateWorkoutEntry({
      date,
      exercises: selectedExercises
    });

    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    /**
     * ⚡ OPTIMISTIC UI: Provide immediate feedback while storage persists.
     * Use storageData from hook for surgical immutable updates.
     */
    addNotification('Kinetic manifestation archived.', 'success');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    const workoutData = {
      attended: true,
      type: sessionType,
      duration: sessionDuration,
      exercises: selectedExercises,
      volume: totalVolume,
      timestamp: new Date().toISOString(),
    };

    // Use updateItem for atomic key-level persistence.
    await updateItem('workout_log', { [date]: workoutData });
  }, [date, selectedExercises, sessionType, sessionDuration, totalVolume, updateItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Dumbbell size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Kinetic Synthesis Log</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
              Physical <span className="text-voro-primary not-italic font-bold">Evolution</span>
            </h1>
          </div>

          <div className="flex gap-4">
             <Button onClick={saveWorkout} className="px-10 py-6 shadow-xl shadow-voro-primary/20">
              <CheckCircle size={18} className="mr-3" />
              Archive Session
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-8 space-y-8 bg-gradient-to-b from-[#0A0C14] to-black border-white/5">
              <div className="space-y-6">
                <DatePicker
                  label="Temporal Frame"
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  className="bg-transparent border-white/10"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity size={16} className="text-voro-primary" />
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">Archetype</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Strength', 'Cardio', 'HIIT', 'Yoga'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSessionType(t)}
                      aria-pressed={sessionType === t}
                      className={`py-3 rounded-xl text-[0.65rem] font-bold uppercase tracking-widest transition-all ${sessionType === t ? 'bg-voro-primary text-white ring-1 ring-voro-primary shadow-lg shadow-voro-primary/20' : 'bg-white/[0.02] text-gray-500 hover:bg-white/5 border border-white/5'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={16} className="text-voro-primary" />
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">Temporal Depth</span>
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    min="1"
                    aria-label="Session duration in minutes"
                  />
                  <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">Min</span>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-voro-primary/10 to-transparent border-voro-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp size={16} className="text-voro-primary" />
                <p className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em]">Aggregate Force</p>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-serif italic font-bold text-white">{totalVolume}</span>
                <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-widest">kg total</span>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {selectedExercises.map((exercise, idx) => (
              <Card key={exercise.id} className="p-0 overflow-hidden group/ex animate-slide-up border-white/5">
                <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                  <div className="space-y-1">
                    <p className="text-[0.6rem] font-black text-voro-primary uppercase tracking-[0.3em]">{exercise.category}</p>
                    <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight">{exercise.name}</h3>
                  </div>
                  <button
                    onClick={() => handleRemoveClick(exercise.id)}
                    aria-label={confirmingRemoveId === exercise.id ? `Confirm removal of ${exercise.name}` : `Remove ${exercise.name} from session`}
                    className={`p-3 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${confirmingRemoveId === exercise.id ? 'bg-red-500/20 text-red-400 animate-pulse opacity-100' : 'hover:bg-red-500/10 text-gray-700 hover:text-red-400 opacity-0 group-hover/ex:opacity-100 focus-visible:opacity-100'}`}
                  >
                    {confirmingRemoveId === exercise.id ? <AlertCircle size={20} /> : <Trash2 size={20} />}
                  </button>
                </div>

                <div className="p-8 space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-[0.6rem] font-black text-gray-700 uppercase tracking-widest mb-2 px-4">
                    <div className="col-span-2 text-center">Set</div>
                    <div className="col-span-4">Magnitude (kg)</div>
                    <div className="col-span-4">Magnitude (reps)</div>
                    <div className="col-span-2 text-right">Status</div>
                  </div>

                  <div className="space-y-3">
                    {exercise.sets.map((set, setIdx) => (
                      <div key={setIdx} className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border transition-all ${set.completed ? 'bg-voro-primary/5 border-voro-primary/20 shadow-inner shadow-voro-primary/10' : 'bg-white/[0.02] border-white/5'}`}>
                        <div className="col-span-2 text-center font-mono font-bold text-gray-600">#{setIdx + 1}</div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSet(idx, setIdx, 'weight', e.target.value)}
                            aria-label={`Weight for set ${setIdx + 1} of ${exercise.name}`}
                            className="w-full bg-transparent border-b border-white/10 focus:border-voro-primary focus:outline-none py-1 text-lg font-mono font-bold text-white text-center"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(idx, setIdx, 'reps', e.target.value)}
                            aria-label={`Reps for set ${setIdx + 1} of ${exercise.name}`}
                            className="w-full bg-transparent border-b border-white/10 focus:border-voro-primary focus:outline-none py-1 text-lg font-mono font-bold text-white text-center"
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Checkbox
                            checked={set.completed}
                            onChange={(checked) => updateSet(idx, setIdx, 'completed', checked)}
                            aria-label={`Mark set ${setIdx + 1} of ${exercise.name} as ${set.completed ? 'incomplete' : 'complete'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addSet(idx)}
                    aria-label={`Add a new set to ${exercise.name}`}
                    className="w-full py-5 mt-4 border border-dashed border-white/10 rounded-2xl text-[0.6rem] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white hover:border-voro-primary/30 hover:bg-voro-primary/5 transition-all"
                  >
                    + Supplement Set
                  </button>
                </div>
              </Card>
            ))}

            <button
              onClick={() => setShowExerciseSearch(true)}
              className="w-full flex flex-col items-center justify-center gap-6 py-16 rounded-[3rem] border-2 border-dashed border-white/5 text-gray-600 hover:text-voro-primary hover:border-voro-primary/30 hover:bg-voro-primary/[0.01] transition-all group"
            >
              <div className="p-6 rounded-full bg-white/[0.02] border border-white/5 group-hover:bg-voro-primary group-hover:text-white transition-all shadow-2xl">
                <Plus size={32} />
              </div>
              <span className="text-[0.7rem] font-black uppercase tracking-[0.5em]">Integrate Movement Pattern</span>
            </button>
          </div>
        </div>
      </div>

      {showConfetti && <Confetti />}

      <ExerciseSearchModal
        isOpen={showExerciseSearch}
        onClose={() => setShowExerciseSearch(false)}
        onSelectExercise={addExercise}
      />
    </div>
  );
};

export default WorkoutLog;
