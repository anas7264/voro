import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateHabit } from '@/utils/validators';
import { defaultHabits } from '@/data/defaultHabits';

const HabitTracker = () => {
  const { getItemAsync, setItem, storageData } = useStorage();
  const { addNotification } = useNotifications();
  const [habits, setHabits] = useState([]);
  const [todayHabits, setTodayHabits] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', icon: '✓', color: 'voro-primary' });

  const loadHabits = useCallback(async () => {
    const data = await getItemAsync('habits') || { list: [], log: {} };
    setHabits(data.list && data.list.length > 0 ? data.list : defaultHabits);
    const today = new Date().toISOString().split('T')[0];
    setTodayHabits(data.log?.[today] || {});
  }, [getItemAsync]);

  useEffect(() => {
    document.title = 'VORO | Habit Tracker';
    loadHabits();
  }, [loadHabits]);

  // Sync state when storageData changes (reactive updates)
  useEffect(() => {
    if (storageData.habits) {
      setHabits(storageData.habits.list && storageData.habits.list.length > 0 ? storageData.habits.list : defaultHabits);
      const today = new Date().toISOString().split('T')[0];
      setTodayHabits(storageData.habits.log?.[today] || {});
    }
  }, [storageData.habits]);

  const addHabit = async () => {
    // Security: Validate habit data before persisting to storage
    const { valid, errors } = validateHabit(newHabit);
    if (!valid) {
      const errorMsg = Object.values(errors).join('. ');
      addNotification(`Validation failed: ${errorMsg}`, 'error');
      return;
    }

    const data = await getItemAsync('habits') || { list: [], log: {} };
    const habit = {
      id: Date.now().toString(),
      ...newHabit,
      createdAt: new Date().toISOString(),
    };

    // Safety: Use immutable update pattern
    const updatedData = {
      ...data,
      list: [...(data.list || []), habit]
    };

    const success = await setItem('habits', updatedData);
    if (success) {
      setNewHabit({ name: '', icon: '✓', color: 'voro-primary' });
      setShowAddForm(false);
      addNotification('Habit added successfully', 'success');
    }
  };

  const toggleHabit = async (habitId) => {
    const data = await getItemAsync('habits') || { list: [], log: {} };
    const today = new Date().toISOString().split('T')[0];

    // Safety: Use immutable update pattern
    const updatedLog = {
      ...(data.log || {}),
      [today]: {
        ...(data.log?.[today] || {}),
        [habitId]: !data.log?.[today]?.[habitId]
      }
    };

    const updatedData = { ...data, log: updatedLog };
    await setItem('habits', updatedData);
  };

  const removeHabit = async (habitId) => {
    const data = await getItemAsync('habits') || { list: [], log: {} };

    // Safety: Use immutable update pattern
    const updatedData = {
      ...data,
      list: (data.list || []).filter(h => h.id !== habitId)
    };

    await setItem('habits', updatedData);
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Habit Tracker</h1>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Habit
          </Button>
        </div>

        {/* Add Habit Form */}
        {showAddForm && (
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <Input
                label="Habit Name"
                placeholder="Habit name"
                value={newHabit.name}
                onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                autoFocus
              />
              <div className="flex gap-2">
                <Input
                  label="Icon (emoji)"
                  placeholder="Icon (emoji)"
                  value={newHabit.icon}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, icon: e.target.value }))}
                  maxLength="2"
                  className="w-20"
                />
                <Select
                  label="Color"
                  value={newHabit.color}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, color: e.target.value }))}
                  options={[
                    { value: 'voro-primary', label: 'Violet' },
                    { value: 'voro-secondary', label: 'Green' },
                    { value: 'voro-accent', label: 'Amber' },
                  ]}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addHabit} className="flex-1">Create</Button>
                <Button variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Today's Habits */}
        <h2 className="text-xl font-semibold text-white mb-4">Today's Habits</h2>
        <div className="space-y-3">
          {habits.map(habit => (
            <Card
              key={habit.id}
              className={`p-4 flex items-center justify-between transition-all border-2 ${
                todayHabits[habit.id]
                  ? 'border-green-600 bg-green-950 bg-opacity-30'
                  : 'border-voro-border'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  aria-label={`Mark ${habit.name} as ${todayHabits[habit.id] ? 'not done' : 'done'}`}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-voro-surface outline-none ${
                    todayHabits[habit.id]
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-500'
                  }`}
                >
                  {todayHabits[habit.id] ? (
                    <Check size={20} className="text-white" />
                  ) : (
                    <span className="text-lg">{habit.icon}</span>
                  )}
                </button>
                <div>
                  <h3 className="text-white font-semibold">{habit.name}</h3>
                  <p className="text-xs text-gray-500">
                    {todayHabits[habit.id] ? '✓ Done today' : 'Not done yet'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeHabit(habit.id)}
                aria-label={`Delete ${habit.name} habit`}
                className="text-gray-400 hover:text-danger"
              >
                <Trash2 size={16} />
              </Button>
            </Card>
          ))}
        </div>

        {habits.length === 0 && !showAddForm && (
          <Card className="p-8 text-center">
            <p className="text-gray-400 mb-4">No habits yet. Create one to get started!</p>
            <Button onClick={() => setShowAddForm(true)}>Create Habit</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
