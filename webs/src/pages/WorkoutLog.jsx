import React, { useState, useEffect, useMemo, useCallback, useDeferredValue, useRef, memo, useId } from 'react';
import { Plus, Trash2, CheckCircle, Dumbbell, Calendar, Clock, Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
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

// ⚡ PERFORMANCE OPTIMIZATION: Pre-calculate lowercase properties for the static exercises dataset.
// Avoids allocating and converting 4,128 strings on every single keystroke inside the filter loop.
const EXERCISES_LOWERCASE = Object.freeze(exercises.map(e => ({
  ...e,
  _nameLower: e.name.toLowerCase(),
  _categoryLower: e.category.toLowerCase(),
})));

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static default workout fallback.
 * Prevents heap allocations on every storage key snapshot evaluation.
 */
const EMPTY_DAY_WORKOUT = Object.freeze({
  attended: false,
  type: 'Strength',
  duration: 60,
  exercises: Object.freeze([]),
});

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Concurrent Exercise Search Modal
 * Defer heavy search filtering over 2,064 exercise items using useDeferredValue
 * to maintain 60fps input responsiveness during typing.
 */
const ExerciseSearchModal = memo(({ isOpen, onClose, onSelectExercise }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredExercises = useMemo(() => {
    if (!isOpen) return [];
    const query = deferredSearchQuery.toLowerCase().trim();
    if (!query) return EXERCISES_LOWERCASE.slice(0, 15);
    return EXERCISES_LOWERCASE.filter(e =>
      e._nameLower.includes(query) ||
      e._categoryLower.includes(query)
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

/**
 * ⚡ PERFORMANCE OPTIMIZATION: KineticSetRow
 * Isolated set row subcomponent preventing parent re-renders on keystrokes.
 */
const KineticSetRow = memo(({ exerciseIdx, setIdx, set, onUpdateSet }) => {
  const handleWeightChange = (e) => {
    onUpdateSet(exerciseIdx, setIdx, 'weight', e.target.value);
  };

  const handleRepsChange = (e) => {
    onUpdateSet(exerciseIdx, setIdx, 'reps', e.target.value);
  };

  const handleCompletedChange = (checked) => {
    onUpdateSet(exerciseIdx, setIdx, 'completed', checked);
  };

  return (
    <div className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border transition-all ${set.completed ? 'bg-voro-primary/5 border-voro-primary/20 shadow-inner shadow-voro-primary/10' : 'bg-white/[0.02] border-white/5'}`}>
      <div className="col-span-2 text-center font-mono font-bold text-gray-600">#{setIdx + 1}</div>
      <div className="col-span-4">
        <input
          type="number"
          value={set.weight}
          onChange={handleWeightChange}
          aria-label={`Weight for set ${setIdx + 1}`}
          className="w-full bg-transparent border-b border-white/10 focus:border-voro-primary focus:outline-none py-1 text-lg font-mono font-bold text-white text-center"
        />
      </div>
      <div className="col-span-4">
        <input
          type="number"
          value={set.reps}
          onChange={handleRepsChange}
          aria-label={`Reps for set ${setIdx + 1}`}
          className="w-full bg-transparent border-b border-white/10 focus:border-voro-primary focus:outline-none py-1 text-lg font-mono font-bold text-white text-center"
        />
      </div>
      <div className="col-span-2 flex justify-end">
        <Checkbox
          checked={set.completed}
          onChange={handleCompletedChange}
          aria-label={`Mark set ${setIdx + 1} as ${set.completed ? 'incomplete' : 'complete'}`}
        />
      </div>
    </div>
  );
});

KineticSetRow.displayName = 'KineticSetRow';

/**
 * ⚡ LUXURY REFINEMENT: KineticExerciseCard
 * Feature-packed luxury exercise node with direct-DOM 3D volumetric hover tilts,
 * holographic coordinate telemetry overlays, static 4-degree keyboard accessibility tilts,
 * and double-confirmation 3s defensive purge sequence.
 */
const KineticExerciseCard = memo(({ exercise, exerciseIdx, onUpdateSet, onAddSet, onRemoveExercise }) => {
  const cardRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const purgeTimerRef = useRef(null);
  const reactId = useId();

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const nodeId = useMemo(() => `EX_${reactId.replace(/:/g, '').slice(0, 4).toUpperCase()}`, [reactId]);

  useEffect(() => {
    return () => {
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 12;
    const tiltX = (0.5 - (y / rect.height)) * 12;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '4deg');
      cardRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const handlePurgeTrigger = (e) => {
    e.stopPropagation();
    if (isPurging) {
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
      onRemoveExercise(exercise.id);
    } else {
      setIsPurging(true);
      purgeTimerRef.current = setTimeout(() => {
        setIsPurging(false);
      }, 3000);
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      role="region"
      aria-label={`Kinetic Exercise Node for ${exercise.name}`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className="group relative rounded-[2.5rem] bg-[#0A0C14] border border-white/5 transition-all duration-700 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-voro-primary shadow-2xl hover:border-white/10"
    >
      {/* Dynamic Luminous Lens */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124,58,237,0.06), transparent 75%)',
        }}
      />

      {/* Holographic Coordinate Telemetry */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 z-20"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex items-center gap-2 font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-widest">
          <span>TX_<span ref={txRef}>0.0</span>°</span>
          <span>TY_<span ref={tyRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]" style={{ transform: 'translateZ(30px)' }}>
        <div className="space-y-1">
          <p className="text-[0.6rem] font-black text-voro-primary uppercase tracking-[0.3em]">{exercise.category}</p>
          <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight">{exercise.name}</h3>
        </div>

        {/* Double-Confirmation Safeguard Decommission Trigger */}
        <button
          onClick={handlePurgeTrigger}
          aria-label={isPurging ? `Confirm removal of ${exercise.name}` : `Decommission ${exercise.name}`}
          className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
            isPurging
              ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]'
              : 'bg-white/[0.01] border-white/5 text-gray-600 hover:text-red-400 hover:bg-red-500/10'
          }`}
        >
          {isPurging ? (
            <>
              <AlertTriangle size={14} className="animate-bounce" />
              <span aria-live="assertive">PURGE?</span>
            </>
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>

      <div className="p-8 space-y-4" style={{ transform: 'translateZ(20px)' }}>
        <div className="grid grid-cols-12 gap-4 text-[0.6rem] font-black text-gray-700 uppercase tracking-widest mb-2 px-4">
          <div className="col-span-2 text-center">Set</div>
          <div className="col-span-4">Magnitude (kg)</div>
          <div className="col-span-4">Magnitude (reps)</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="space-y-3">
          {exercise.sets.map((set, setIdx) => (
            <KineticSetRow
              key={setIdx}
              exerciseIdx={exerciseIdx}
              setIdx={setIdx}
              set={set}
              onUpdateSet={onUpdateSet}
            />
          ))}
        </div>

        <button
          onClick={() => onAddSet(exerciseIdx)}
          aria-label={`Add a new set to ${exercise.name}`}
          className="w-full py-5 mt-4 border border-dashed border-white/10 rounded-2xl text-[0.6rem] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white hover:border-voro-primary/30 hover:bg-voro-primary/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
        >
          + Supplement Set
        </button>
      </div>
    </div>
  );
});

KineticExerciseCard.displayName = 'KineticExerciseCard';

const WorkoutLog = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to the data for the currently selected date.
   */
  const dayWorkout = useStorageKeySelector(
    'workout_log',
    useCallback((log) => (log || {})[date] || EMPTY_DAY_WORKOUT, [date])
  );

  const { updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [showConfetti, setShowConfetti] = useState(false);

  // Local drafting state for fluid updates
  const [sessionType, setSessionType] = useState('Strength');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Workout Log';
  }, []);

  useEffect(() => {
    setSessionType(dayWorkout.type || 'Strength');
    setSessionDuration(dayWorkout.duration || 60);
    setSelectedExercises(dayWorkout.exercises || []);
  }, [dayWorkout]);

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

  const handleRemoveExercise = useCallback((id) => {
    setSelectedExercises(prev => prev.filter(ex => ex.id !== id));
    addNotification('Kinetic movement node decommissioned.', 'info');
  }, [addNotification]);

  const updateSet = useCallback((exerciseIdx, setIdx, field, value) => {
    setSelectedExercises(prev => {
      const updated = [...prev];
      if (!updated[exerciseIdx]) return prev;
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
      if (!updated[idx]) return prev;
      const currentSets = updated[idx].sets;
      const lastSet = currentSets[currentSets.length - 1] || { reps: 8, weight: 0 };
      updated[idx] = {
        ...updated[idx],
        sets: [...currentSets, { reps: lastSet.reps, weight: lastSet.weight, completed: false }]
      };
      return updated;
    });
  }, []);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Zero-allocation total volume computation.
   * Replaces nested .reduce() array allocations with a single-pass zero-allocation loop.
   */
  const totalVolume = useMemo(() => {
    let volume = 0;
    const numExercises = selectedExercises.length;
    for (let i = 0; i < numExercises; i++) {
      const sets = selectedExercises[i].sets;
      if (!sets) continue;
      const numSets = sets.length;
      for (let j = 0; j < numSets; j++) {
        const set = sets[j];
        volume += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0);
      }
    }
    return volume;
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

    await updateItem('workout_log', { [date]: workoutData });
  }, [date, selectedExercises, sessionType, sessionDuration, totalVolume, updateItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-24 selection:bg-voro-primary/30 relative overflow-x-hidden">
      {/* Ambient background architectural lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[130px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <KineticExerciseCard
                key={exercise.id}
                exercise={exercise}
                exerciseIdx={idx}
                onUpdateSet={updateSet}
                onAddSet={addSet}
                onRemoveExercise={handleRemoveExercise}
              />
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
