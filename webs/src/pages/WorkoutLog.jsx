import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Modal from '@/components/Modal';
import Checkbox from '@/components/Checkbox';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateWorkoutEntry } from '@/utils/validators';
import { exercises } from '@/data/exercises';

const WorkoutLog = () => {
  const { getStorage, setStorage } = useStorage();
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
    const allWorkouts = getStorage('voro_workout_log') || {};
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
    // Security: Validate workout session data before persisting to storage
    const { valid, errors } = validateWorkoutEntry({
      date,
      exercises: selectedExercises
    });

    if (!valid) {
      const errorMsg = Object.values(errors)[0]; // Get the first error message
      addNotification(`Validation failed: ${errorMsg}`, 'error');
      return;
    }

    const allWorkouts = getStorage('voro_workout_log') || {};
    const volume = selectedExercises.reduce((sum, ex) => {
      return sum + ex.sets.reduce((exSum, set) => exSum + (set.weight * set.reps), 0);
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

    setStorage('voro_workout_log', allWorkouts);
    setWorkoutData(allWorkouts[date]);
    addNotification('Workout saved successfully', 'success');
  };

  if (!workoutData) return <div className="p-8">Loading...</div>;

  /**
   * ⚡ OPTIMIZATION: Memoize filtered exercises and skip calculation when modal is closed.
   * This avoids O(N) filtering (N=150+) on every keystroke when user is updating
   * reps or weights in the main workout log.
   */
  const filteredExercises = useMemo(() => {
    if (!showExerciseSearch) return [];

    const query = searchQuery.toLowerCase();
    return exercises.filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query)
    );
  }, [showExerciseSearch, searchQuery]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] overflow-x-hidden p-8 lg:p-24">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-emerald-500">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Kinetic Manifest</span>
              <div className="h-[1px] w-12 bg-emerald-500/30" />
            </div>
            <h1 className="text-7xl font-black font-serif italic text-white leading-[0.9] tracking-tighter">
              Neural <span className="text-gradient-emerald not-italic">Drive</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => setShowExerciseSearch(true)} className="px-8 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all">
              Add Stimulus
            </button>
            <button onClick={saveWorkout} className="px-8 py-5 border border-white/10 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] hover:border-emerald-500 transition-all">
              Synchronize Session
            </button>
          </div>
        </header>

        {/* Temporal Parameters */}
        <div className="grid grid-cols-12 gap-8 mb-24">
           <div className="col-span-12 lg:col-span-4">
              <Input type="date" label="Temporal Node" value={date} onChange={(e) => setDate(e.target.value)} />
           </div>
           <div className="col-span-12 lg:col-span-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-500">Modality</label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/10 py-6 text-2xl font-serif italic text-white focus:outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="HIIT">HIIT</option>
                </select>
              </div>
           </div>
           <div className="col-span-12 lg:col-span-4">
              <Input label="Temporal Duration (MIN)" type="number" value={sessionDuration} onChange={(e) => setSessionDuration(Number(e.target.value))} />
           </div>
        </div>

        {/* Integration Sequence (Exercises) */}
        <div className="space-y-12">
          {selectedExercises.map((exercise, idx) => (
            <section key={exercise.id} className="relative group">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h3 className="text-4xl font-serif italic text-white leading-none mb-2">{exercise.name}</h3>
                  <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em]">{exercise.category} // Sequence Node {idx + 1}</p>
                </div>
                <button onClick={() => removeExercise(idx)} className="text-gray-800 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {exercise.sets.map((set, setIdx) => (
                  <div key={setIdx} className={`p-8 border transition-all ${set.completed ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">Set {setIdx + 1}</span>
                      <Checkbox checked={set.completed} onChange={(checked) => updateSet(idx, setIdx, 'completed', checked)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-[8px] font-mono text-gray-500 uppercase mb-1">Reps</p>
                         <input
                           type="number" value={set.reps}
                           onChange={(e) => updateSet(idx, setIdx, 'reps', Number(e.target.value))}
                           className="w-full bg-transparent border-b border-white/10 text-xl font-mono text-white focus:outline-none focus:border-emerald-500"
                         />
                       </div>
                       <div>
                         <p className="text-[8px] font-mono text-gray-500 uppercase mb-1">Mass (KG)</p>
                         <input
                           type="number" value={set.weight}
                           onChange={(e) => updateSet(idx, setIdx, 'weight', Number(e.target.value))}
                           className="w-full bg-transparent border-b border-white/10 text-xl font-mono text-white focus:outline-none focus:border-emerald-500"
                         />
                       </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updated = [...selectedExercises];
                    updated[idx].sets.push({ reps: 8, weight: 0, completed: false });
                    setSelectedExercises(updated);
                  }}
                  className="p-8 bg-transparent border border-dashed border-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white hover:border-white transition-all"
                >
                  + Add Volumetric Set
                </button>
              </div>
            </section>
          ))}
        </div>

        {/* Empty State */}
        {selectedExercises.length === 0 && (
           <div className="py-32 border border-dashed border-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6">
                 <Plus size={24} className="text-gray-700" />
              </div>
              <p className="text-sm font-serif italic text-gray-500 mb-2">Quiescent State: Stimulus Required</p>
              <button onClick={() => setShowExerciseSearch(true)} className="text-[10px] font-mono font-bold text-voro-primary uppercase tracking-[0.3em]">Initialize Training Sequence</button>
           </div>
        )}

        {/* Exercise Search Modal */}
        <Modal isOpen={showExerciseSearch} onClose={() => setShowExerciseSearch(false)} title="Kinetic Database: Stimulus Search" size="lg">
          <div className="space-y-12">
            <Input placeholder="Query kinetic nodes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1
              [&::-webkit-scrollbar]:w-0.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-white/5">
              {filteredExercises.slice(0, 24).map(ex => (
                <div
                  key={ex.id}
                  onClick={() => addExercise(ex)}
                  className="p-8 bg-white/[0.02] border border-white/5 hover:border-emerald-500 cursor-pointer transition-all group"
                >
                  <div className="font-serif italic text-white mb-2 group-hover:text-emerald-500 transition-colors">{ex.name}</div>
                  <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">{ex.category} // {ex.difficulty}</div>
                </div>
              ))}
            </div>
            <Button variant="secondary" fullWidth onClick={() => setShowExerciseSearch(false)}>Abort Search</Button>
          </div>
        </Modal>
      </div>

      <style>{`
        .text-gradient-emerald {
          background: linear-gradient(to right, #10B981, #34D399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default WorkoutLog;
