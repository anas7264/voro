import React, { useEffect, useState, useMemo, useId, useCallback } from 'react';
import { Plus, Trash2, Check, Zap, Target, Star } from 'lucide-react';
import { Button, Card, Input, Header } from '@/components';
import Confetti from '@/components/Confetti';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateHabit } from '@/utils/validators';
import { defaultHabits } from '@/data/defaultHabits';

const HabitTracker = () => {
  const iconInputId = useId();
  const habitsData = useStorageKey('habits') || { list: [], log: {} };
  const { setItem, updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', icon: '✓', color: 'voro-primary' });

  useEffect(() => {
    document.title = 'VORO | Habit Tracker';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation using useMemo.
   * Eliminates the initial mount-time double-render cycle and ensures
   * reactivity to StorageContext updates without manual load calls.
   */
  const { habits, todayHabits } = useMemo(() => {
    const list = habitsData.list && habitsData.list.length > 0 ? habitsData.list : defaultHabits;
    const today = new Date().toISOString().split('T')[0];
    const log = habitsData.log?.[today] || {};
    return { habits: list, todayHabits: log };
  }, [habitsData]);

  const addHabit = useCallback(async () => {
    const { valid, errors } = validateHabit(newHabit);
    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const habit = {
      id: Date.now().toString(),
      ...newHabit,
      createdAt: new Date().toISOString(),
    };

    const success = await updateItem('habits', {
      list: [...(habitsData.list || []), habit]
    });

    if (success) {
      setNewHabit({ name: '', icon: '✓', color: 'voro-primary' });
      setShowAddForm(false);
      addNotification('Neural pattern registered', 'success');
    }
  }, [newHabit, addNotification, habitsData.list, updateItem]);

  const toggleHabit = useCallback(async (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    const currentLog = habitsData.log?.[today] || {};

    const updatedLog = {
      ...(habitsData.log || {}),
      [today]: {
        ...currentLog,
        [habitId]: !currentLog[habitId]
      }
    };

    await updateItem('habits', { log: updatedLog });
  }, [habitsData.log, updateItem]);

  const removeHabit = useCallback(async (habitId) => {
    const updatedList = (habitsData.list || []).filter(h => h.id !== habitId);
    await updateItem('habits', { list: updatedList });
  }, [habitsData.list, updateItem]);

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <Header
          eyebrow="Neural Synchronization Log"
          title={<>Consistency <span className="text-voro-primary not-italic font-bold">Matrix</span></>}
          action={(
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-8 shadow-xl shadow-voro-primary/20"
            >
              <Plus size={18} className="mr-2" />
              Integrate Habit
            </Button>
          )}
        />

        {/* Add Habit Form */}
        {showAddForm && (
          <Card className="p-10 mb-12 animate-slide-up border-voro-primary/20">
            <h2 className="text-xl font-serif italic font-bold text-white mb-8">Pattern Initialization</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Input
                label="Pattern Name"
                placeholder="e.g., Morning Meditation"
                value={newHabit.name}
                onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                autoFocus
              />
              <div className="flex gap-4">
                 <div className="flex-1">
                    <label htmlFor={iconInputId} className="block text-[0.6rem] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 ml-1">Icon Identifier</label>
                    <input
                      id={iconInputId}
                      type="text"
                      value={newHabit.icon}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, icon: e.target.value }))}
                      maxLength="2"
                      className="w-full bg-[#0A0C14] border-b border-white/10 p-4 text-2xl focus:outline-none focus:border-voro-primary transition-all text-center"
                    />
                 </div>
                 <div className="flex-[2]">
                    <label className="block text-[0.6rem] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 ml-1">Color Palette</label>
                    <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/5">
                      {['voro-primary', 'voro-secondary', 'voro-accent'].map(c => (
                        <button
                          key={c}
                          onClick={() => setNewHabit(prev => ({ ...prev, color: c }))}
                          aria-label={`Select ${c.replace('voro-', '')} theme`}
                          className={`flex-1 h-10 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${c === 'voro-primary' ? 'bg-voro-primary' : c === 'voro-secondary' ? 'bg-voro-secondary' : 'bg-voro-accent'} ${newHabit.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-90' : 'opacity-40 hover:opacity-100'}`}
                        />
                      ))}
                    </div>
                 </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={addHabit} className="flex-1">Initialize Pattern</Button>
              <Button variant="secondary" onClick={() => setShowAddForm(false)} className="px-8">Abort</Button>
            </div>
          </Card>
        )}

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map(habit => {
            const isDone = todayHabits[habit.id];
            return (
              <Card
                key={habit.id}
                className={`p-8 flex items-center justify-between transition-all duration-500 group ${
                  isDone
                    ? 'border-voro-secondary/30 bg-voro-secondary/5'
                    : 'hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-6 flex-1">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    aria-label={`Mark ${habit.name} as ${isDone ? 'incomplete' : 'complete'}`}
                    className={`
                      flex items-center justify-center w-16 h-16 rounded-[1.5rem] border-2 transition-all duration-500 shadow-2xl
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#080B14]
                      ${isDone
                        ? 'border-voro-secondary bg-voro-secondary text-white rotate-[360deg] shadow-voro-secondary/30'
                        : 'border-white/5 bg-white/[0.02] text-gray-500 hover:border-voro-primary/50'
                      }
                    `}
                  >
                    {isDone ? (
                      <Check size={28} strokeWidth={3} />
                    ) : (
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{habit.icon}</span>
                    )}
                  </button>

                  <div className="space-y-1">
                    <h3 className={`text-xl font-bold tracking-tight transition-colors duration-500 uppercase ${isDone ? 'text-voro-secondary' : 'text-white'}`}>
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-voro-secondary animate-pulse' : 'bg-gray-800'}`} />
                       <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-gray-600">
                        {isDone ? 'Synchronization Active' : 'Awaiting Engagement'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeHabit(habit.id)}
                  aria-label={`Remove ${habit.name} pattern`}
                  className="p-3 rounded-xl text-gray-800 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </Card>
            );
          })}
        </div>

        {habits.length === 0 && !showAddForm && (
          <div className="py-40 text-center animate-fade-in">
            <div className="w-24 h-24 mx-auto bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
               <Target size={40} className="text-gray-800" />
            </div>
            <p className="text-2xl font-serif italic text-gray-600 mb-10">No active neural patterns detected.</p>
            <Button onClick={() => setShowAddForm(true)} className="px-12">
              <Plus size={20} className="mr-3" />
              Begin Evolution
            </Button>
          </div>
        )}

        {/* Milestone Celebration */}
        {habits.length > 0 && habits.every(h => todayHabits[h.id]) && (
          <div className="mt-16 p-10 rounded-[3rem] bg-voro-primary/10 border border-voro-primary/20 text-center animate-bounce-soft">
            <Confetti />
            <Star className="w-12 h-12 text-voro-accent mx-auto mb-6 fill-voro-accent shadow-glow" />
            <h3 className="text-2xl font-serif italic font-bold text-white mb-2">Maximum Synchronicity Reached</h3>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-voro-primary">All daily patterns established</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
