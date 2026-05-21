import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useStorage } from '@/hooks/useStorage';
import { defaultHabits } from '@/data/defaultHabits';

const HabitTracker = () => {
  const { getStorage, setStorage } = useStorage();
  const [habits, setHabits] = useState([]);
  const [todayHabits, setTodayHabits] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', icon: '✓', color: 'voro-primary' });

  useEffect(() => {
    document.title = 'VORO | Habit Tracker';
    loadHabits();
  }, []);

  const loadHabits = () => {
    const data = getStorage('voro_habits') || { list: [], log: {} };
    setHabits(data.list || defaultHabits);
    const today = new Date().toISOString().split('T')[0];
    setTodayHabits(data.log?.[today] || {});
  };

  const addHabit = () => {
    if (!newHabit.name) return;
    const data = getStorage('voro_habits') || { list: [], log: {} };
    const habit = {
      id: Date.now().toString(),
      ...newHabit,
      createdAt: new Date().toISOString(),
    };
    data.list.push(habit);
    setStorage('voro_habits', data);
    setHabits(data.list);
    setNewHabit({ name: '', icon: '✓', color: 'voro-primary' });
    setShowAddForm(false);
  };

  const toggleHabit = (habitId) => {
    const data = getStorage('voro_habits') || { list: [], log: {} };
    const today = new Date().toISOString().split('T')[0];
    if (!data.log) data.log = {};
    if (!data.log[today]) data.log[today] = {};
    
    data.log[today][habitId] = !data.log[today][habitId];
    setStorage('voro_habits', data);
    setTodayHabits(data.log[today]);
  };

  const removeHabit = (habitId) => {
    const data = getStorage('voro_habits') || { list: [], log: {} };
    data.list = data.list.filter(h => h.id !== habitId);
    setStorage('voro_habits', data);
    setHabits(data.list);
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
                placeholder="Habit name"
                value={newHabit.name}
                onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                autoFocus
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Icon (emoji)"
                  value={newHabit.icon}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, icon: e.target.value }))}
                  maxLength="2"
                  className="w-20"
                />
                <Select
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
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
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
