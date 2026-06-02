import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, CheckCircle, Dumbbell, Calendar, Clock, Activity } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Checkbox from '@/components/Checkbox';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateWorkoutEntry } from '@/utils/validators';
import { exercises } from '@/data/exercises';

const WorkoutLog = () => {
  const { getItem, setItem } = useStorage();
  const { addNotification } = useNotifications();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutData, setWorkoutData] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionType, setSessionType] = useState('Strength');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'VORO | Workout Log';
    loadWorkoutData();
  }, [date]);

  const loadWorkoutData = () => {
    const allWorkouts = getItem('workout_log') || {};
    const dayWorkout = allWorkouts[date] || {
      attended: false,
      type: 'Strength',
      duration: 60,
      exercises: [],
      cardio: [],
      notes: '',
      rating: 0,
      volume: 0,
    };
    setWorkoutData(dayWorkout);
    setSessionType(dayWorkout.type);
    setSessionDuration(dayWorkout.duration);
    setSelectedExercises(dayWorkout.exercises || []);
  };

  const addExercise = (exercise) => {
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
      notes: '',
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    setShowExerciseSearch(false);
    addNotification(`${exercise.name} added to session`, 'success');
  };

  const removeExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const updateSet = (exerciseIdx, setIdx, field, value) => {
    const updated = [...selectedExercises];
    updated[exerciseIdx].sets[setIdx][field] = value;
    setSelectedExercises(updated);
  };

  const saveWorkout = () => {
    const { valid, errors } = validateWorkoutEntry({
      date,
      exercises: selectedExercises
    });

    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const allWorkouts = getItem('workout_log') || {};
    const volume = selectedExercises.reduce((sum, ex) => {
      return sum + ex.sets.reduce((exSum, set) => exSum + (Number(set.weight) * Number(set.reps)), 0);
    }, 0);

    allWorkouts[date] = {
      attended: true,
      type: sessionType,
      duration: sessionDuration,
      exercises: selectedExercises,
      cardio: workoutData?.cardio || [],
      notes: workoutData?.notes || '',
      rating: workoutData?.rating || 0,
      volume,
      timestamp: new Date().toISOString(),
    };

    setItem('workout_log', allWorkouts);
    setWorkoutData(allWorkouts[date]);
    addNotification('Kinetic manifestation archived', 'success');
  };

  const filteredExercises = useMemo(() => {
    if (!showExerciseSearch) return [];
    const query = searchQuery.toLowerCase();
    return exercises.filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query)
    ).slice(0, 20);
  }, [showExerciseSearch, searchQuery]);

  if (!workoutData) return null;

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Dumbbell size={18} aria-hidden="true" />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Kinetic Manifestation Log</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
              Physical <span className="text-voro-primary not-italic font-bold">Evolution</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <Button onClick={saveWorkout} className="px-8 shadow-xl shadow-voro-primary/20">
              <CheckCircle size={18} className="mr-2" aria-hidden="true" />
              Archive Session
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Controls & Metrics */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={16} className="text-voro-primary" aria-hidden="true" />
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">Temporal Frame</span>
                </div>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label="Workout Date"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity size={16} className="text-voro-primary" aria-hidden="true" />
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">Archetype</span>
                </div>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label="Select session archetype">
                  {['Strength', 'Cardio', 'HIIT', 'Yoga'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSessionType(t)}
                      className={`py-3 rounded-xl text-[0.65rem] font-bold uppercase tracking-widest transition-all ${sessionType === t ? 'bg-voro-primary text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/5'}`}
                      aria-pressed={sessionType === t}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={16} className="text-voro-primary" aria-hidden="true" />
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">Temporal Depth</span>
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    min="1"
                    aria-label="Session Duration in Minutes"
                  />
                  <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-widest" aria-hidden="true">Minutes</span>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-voro-primary/5 to-transparent border-voro-primary/10">
              <p className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Aggregate Force</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-serif italic font-bold text-white">
                  {selectedExercises.reduce((sum, ex) => sum + ex.sets.reduce((s, set) => s + (Number(set.weight) * Number(set.reps)), 0), 0)}
                </span>
                <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-widest">kg Volume</span>
              </div>
            </Card>
          </div>

          {/* Exercise List */}
          <div className="lg:col-span-8 space-y-6">
            {selectedExercises.map((exercise, idx) => (
              <Card key={exercise.id} className="p-0 overflow-hidden group/ex animate-slide-up">
                <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                  <div className="space-y-1">
                    <p className="text-[0.6rem] font-black text-voro-primary uppercase tracking-[0.3em]">{exercise.category}</p>
                    <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight">{exercise.name}</h3>
                  </div>
                  <button
                    onClick={() => removeExercise(idx)}
                    className="p-3 rounded-full hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all opacity-0 group-hover/ex:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
                    aria-label={`Remove ${exercise.name} from session`}
                  >
                    <Trash2 size={20} aria-hidden="true" />
                  </button>
                </div>

                <div className="p-8 space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-[0.6rem] font-black text-gray-600 uppercase tracking-widest mb-2 px-4" aria-hidden="true">
                    <div className="col-span-2">Set</div>
                    <div className="col-span-4">Magnitude (kg)</div>
                    <div className="col-span-4">Reps</div>
                    <div className="col-span-2 text-right">Status</div>
                  </div>

                  <div className="space-y-3">
                    {exercise.sets.map((set, setIdx) => (
                      <div key={setIdx} className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border transition-all ${set.completed ? 'bg-voro-primary/5 border-voro-primary/20' : 'bg-white/[0.02] border-white/5'}`}>
                        <div className="col-span-2 font-mono font-bold text-gray-500" aria-hidden="true">#{setIdx + 1}</div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSet(idx, setIdx, 'weight', e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 focus:border-voro-primary focus:outline-none py-1 text-lg font-mono font-bold text-white transition-all"
                            aria-label={`Weight for ${exercise.name}, Set ${setIdx + 1} in kilograms`}
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(idx, setIdx, 'reps', e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 focus:border-voro-primary focus:outline-none py-1 text-lg font-mono font-bold text-white transition-all"
                            aria-label={`Repetitions for ${exercise.name}, Set ${setIdx + 1}`}
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Checkbox
                            checked={set.completed}
                            onChange={(checked) => updateSet(idx, setIdx, 'completed', checked)}
                            aria-label={`Mark Set ${setIdx + 1} of ${exercise.name} as completed`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const updated = [...selectedExercises];
                      const lastSet = exercise.sets[exercise.sets.length - 1] || { reps: 8, weight: 0 };
                      updated[idx].sets.push({ reps: lastSet.reps, weight: lastSet.weight, completed: false });
                      setSelectedExercises(updated);
                    }}
                    className="w-full py-4 mt-4 border border-dashed border-white/10 rounded-2xl text-[0.6rem] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white hover:border-voro-primary/30 hover:bg-voro-primary/5 transition-all"
                  >
                    + Supplement Set
                  </button>
                </div>
              </Card>
            ))}

            <button
              onClick={() => setShowExerciseSearch(true)}
              className="w-full flex items-center justify-center gap-4 py-10 rounded-[2.5rem] border-2 border-dashed border-white/5 text-gray-500 hover:text-voro-primary hover:border-voro-primary/30 hover:bg-voro-primary/[0.02] transition-all group"
            >
              <div className="p-4 rounded-full bg-white/5 group-hover:bg-voro-primary group-hover:text-white transition-all shadow-xl">
                <Plus size={24} aria-hidden="true" />
              </div>
              <span className="text-[0.7rem] font-black uppercase tracking-[0.4em]">Integrate Movement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Search Modal */}
      <Modal
        isOpen={showExerciseSearch}
        onClose={() => setShowExerciseSearch(false)}
        title="Movement Synthesis"
      >
        <div className="space-y-10 min-h-[500px]">
          <div className="space-y-4">
            <Input
              label="Pattern Search"
              placeholder="Search exercise database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto no-scrollbar pb-10">
            {filteredExercises.map(ex => (
              <button
                key={ex.id}
                onClick={() => addExercise(ex)}
                className="w-full text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-voro-primary hover:bg-voro-primary/[0.02] transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white tracking-tight uppercase">{ex.name}</span>
                  <span className="text-[0.6rem] font-black text-voro-primary uppercase tracking-widest">{ex.difficulty}</span>
                </div>
                <p className="text-[0.6rem] font-mono text-gray-600 tracking-widest uppercase">{ex.category} · {ex.equipment || 'Bodyweight'}</p>
              </button>
            ))}
            {filteredExercises.length === 0 && (
              <div className="text-center py-20 opacity-20">
                <Dumbbell size={48} className="mx-auto mb-4" aria-hidden="true" />
                <p className="text-[0.65rem] font-black uppercase tracking-[0.3em]">No Pattern Found</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkoutLog;
