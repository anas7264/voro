import React, { useState, useEffect } from 'react';
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

  const filteredExercises = exercises.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Workout Log</h1>

        {/* Date & Session Info */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Select
              label="Session Type"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              options={[
                { value: 'Strength', label: 'Strength' },
                { value: 'Cardio', label: 'Cardio' },
                { value: 'HIIT', label: 'HIIT' },
                { value: 'Yoga', label: 'Yoga' },
              ]}
            />
            <Input
              label="Duration (min)"
              type="number"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(Number(e.target.value))}
              min="1"
              max="300"
            />
          </div>
        </Card>

        {/* Exercises */}
        <div className="space-y-4 mb-6">
          {selectedExercises.map((exercise, idx) => (
            <Card key={exercise.id} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
                  <p className="text-xs text-gray-400">{exercise.category}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExercise(idx)}
                  className="text-danger"
                  aria-label={`Remove ${exercise.name}`}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="space-y-2">
                {exercise.sets.map((set, setIdx) => (
                  <div key={setIdx} className="flex gap-2 items-center">
                    <span className="text-sm text-gray-400 w-8">Set {setIdx + 1}</span>
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) => updateSet(idx, setIdx, 'reps', Number(e.target.value))}
                      className="w-20"
                      aria-label={`${exercise.name} set ${setIdx + 1} reps`}
                    />
                    <Input
                      type="number"
                      placeholder="Weight"
                      value={set.weight}
                      onChange={(e) => updateSet(idx, setIdx, 'weight', Number(e.target.value))}
                      step="0.5"
                      className="w-20"
                      aria-label={`${exercise.name} set ${setIdx + 1} weight`}
                    />
                    <span className="text-sm text-gray-400">kg</span>
                    <Checkbox
                      checked={set.completed}
                      onChange={(checked) => updateSet(idx, setIdx, 'completed', checked)}
                      className="ml-auto"
                      aria-label={`Mark ${exercise.name} set ${setIdx + 1} as completed`}
                    />
                  </div>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="mt-3 w-full"
                onClick={() => {
                  const updated = [...selectedExercises];
                  updated[idx].sets.push({ reps: 8, weight: 0, completed: false });
                  setSelectedExercises(updated);
                }}
              >
                + Add Set
              </Button>
            </Card>
          ))}
        </div>

        {/* Add Exercise Button */}
        <Button
          onClick={() => setShowExerciseSearch(true)}
          className="w-full mb-6 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Exercise
        </Button>

        {/* Exercise Search Modal */}
        <Modal
          isOpen={showExerciseSearch}
          onClose={() => setShowExerciseSearch(false)}
          title="Add Exercise"
          size="2xl"
        >
          <div className="space-y-4">
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredExercises.slice(0, 20).map(ex => (
                <div
                  key={ex.id}
                  onClick={() => addExercise(ex)}
                  className="p-3 bg-voro-surface border border-voro-border rounded-lg cursor-pointer hover:border-voro-primary transition-all"
                >
                  <div className="font-medium text-white">{ex.name}</div>
                  <div className="text-xs text-gray-400">{ex.category} · {ex.difficulty}</div>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              className="w-full mt-4"
              onClick={() => setShowExerciseSearch(false)}
            >
              Close
            </Button>
          </div>
        </Modal>

        {/* Save Button */}
        <Button onClick={saveWorkout} className="w-full flex items-center justify-center gap-2">
          <CheckCircle size={18} />
          Save Workout
        </Button>
      </div>
    </div>
  );
};

export default WorkoutLog;
