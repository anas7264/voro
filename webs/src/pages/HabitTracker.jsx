import React, { useEffect, useState, useMemo, useId, useCallback, memo, useRef } from 'react';
import { Plus, Trash2, Check, Zap, Target, Star, AlertTriangle, X } from 'lucide-react';
import { Button, Card, Input, Header } from '@/components';
import Confetti from '@/components/Confetti';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateHabit } from '@/utils/validators';
import { defaultHabits } from '@/data/defaultHabits';

/**
 * ⚡ REFINEMENT: Re-engineered HabitItem component as an elite "Neural Habit Synapse Conduit".
 * Integrates interactive 3D volumetric transforms, magnetic mouse tracking,
 * coordinate telemetry tracking, and Double-Confirmation Defensive UX deletion.
 * Fully keyboard accessible, revealing actions on focus-within and supporting standard focus-tilt.
 */
const HabitItem = memo(({ habit, isDone, onToggle, onRemove }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const deleteTimeoutRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const reactId = useId();

  // Stable ID for the node using React useId
  const nodeId = useMemo(() => {
    const cleanId = reactId.replace(/:/g, '');
    return `HAB_NODE_${cleanId.slice(0, 4).toUpperCase()}`;
  }, [reactId]);

  const colorHex = useMemo(() => {
    if (habit.color === 'voro-primary') return '#7C3AED';
    if (habit.color === 'voro-secondary') return '#10B981';
    if (habit.color === 'voro-accent') return '#F59E0B';
    if (habit.color && habit.color.startsWith('#')) return habit.color;
    return '#7C3AED';
  }, [habit.color]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    // Internal Parallax Displacement
    const gridX = (x / rect.width - 0.5) * -12;
    const gridY = (y / rect.height - 0.5) * -12;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
    containerRef.current.style.setProperty('--grid-x', `${gridX}px`);
    containerRef.current.style.setProperty('--grid-y', `${gridY}px`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
      containerRef.current.style.setProperty('--grid-x', '0px');
      containerRef.current.style.setProperty('--grid-y', '0px');
    }
    if (tiltXRef.current) tiltXRef.current.innerText = '0.0';
    if (tiltYRef.current) tiltYRef.current.innerText = '0.0';
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      containerRef.current.style.setProperty('--grid-x', '-2px');
      containerRef.current.style.setProperty('--grid-y', '2px');
    }
    if (tiltXRef.current) tiltXRef.current.innerText = '4.0';
    if (tiltYRef.current) tiltYRef.current.innerText = '-4.0';
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
      containerRef.current.style.setProperty('--grid-x', '0px');
      containerRef.current.style.setProperty('--grid-y', '0px');
    }
    if (tiltXRef.current) tiltXRef.current.innerText = '0.0';
    if (tiltYRef.current) tiltYRef.current.innerText = '0.0';
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (isDeleting) {
      onRemove(habit.id);
      setIsDeleting(false);
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    } else {
      setIsDeleting(true);
      deleteTimeoutRef.current = setTimeout(() => {
        setIsDeleting(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    };
  }, []);

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      role="article"
      aria-label={`Neural habit pattern: ${habit.name}. Status: ${isDone ? 'Synchronization Active' : 'Awaiting Engagement'}. ${isDeleting ? 'Pending permanent pattern purge.' : ''}`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative p-8 rounded-[2.5rem] bg-[#0A0C14] border border-white/5
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]
        focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] outline-none
        group flex items-center justify-between min-h-[140px] overflow-hidden
        ${isDone ? 'border-voro-secondary/30 bg-voro-secondary/[0.01]' : ''}
      `}
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.03] group-focus-within:opacity-[0.03] transition-opacity duration-1000" style={{ transform: 'translate3d(var(--grid-x, 0px), var(--grid-y, 0px), 0)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens with custom habit color signature */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-700"
          style={{
            background: isHovered
              ? `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${colorHex} 12%, transparent), transparent 60%)`
              : `radial-gradient(300px circle at 50% 50%, color-mix(in srgb, ${colorHex} 12%, transparent), transparent 60%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* 🛰️ Liquid Border Intelligence: Reactive perimeter illumination */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${colorHex} 40%, transparent), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Liquid Light Laser Indicator */}
      <div className={`
        absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-voro-primary rounded-r-full
        transition-all duration-700 origin-center
        shadow-[0_0_15px_rgba(124,58,237,0.8)]
        scale-y-0 group-hover:scale-y-100 group-focus-within:scale-y-100
        ${isDone ? "bg-voro-secondary shadow-[0_0_15px_rgba(16,185,129,0.8)]" : ""}
      `} />

      <div className="flex items-center gap-6 flex-1 z-10" style={{ transform: 'translateZ(40px)' }}>
        {/* Neural Synapse Core Toggle Button */}
        <button
          onClick={() => onToggle(habit.id)}
          aria-label={`Mark ${habit.name} as ${isDone ? 'incomplete' : 'complete'}`}
          className={`
            relative flex items-center justify-center w-16 h-16 rounded-[1.5rem] border-2 transition-all duration-500 shadow-2xl
            focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
            ${isDone
              ? 'border-voro-secondary bg-voro-secondary/10 text-voro-secondary rotate-[360deg] shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'border-white/5 bg-white/[0.02] text-gray-500 hover:border-voro-primary/50'
            }
          `}
        >
          {isDone ? (
            <>
              {/* Pulsing ring inside when complete */}
              <div className="absolute inset-[-4px] rounded-[1.75rem] border border-voro-secondary/30 animate-pulse-slow" />
              <Check size={28} strokeWidth={3} className="text-voro-secondary" />
            </>
          ) : (
            <span className="text-2xl group-hover:scale-110 transition-transform duration-500">{habit.icon || habit.emoji || '✓'}</span>
          )}
        </button>

        <div className="space-y-1">
          <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest block">
            {habit.category || 'MTRX_NODE'}
          </span>
          <h3 className={`text-2xl font-serif italic font-medium tracking-tight transition-colors duration-500 ${isDone ? 'text-voro-secondary' : 'text-white'}`}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-voro-secondary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-gray-800'}`} />
             <p className="text-[0.6rem] font-mono font-bold uppercase tracking-[0.2em] text-gray-600">
              {isDone ? 'SYNAPSE ACTIVE // LOCK OK' : 'AWAITING ENGAGEMENT'}
            </p>
          </div>
        </div>
      </div>

      {/* Double-Confirmation Defensive UX Deletion Trigger */}
      <div className="flex items-center gap-4 z-10" style={{ transform: 'translateZ(50px)' }}>
        <button
          onClick={handleDeleteClick}
          aria-label={
            isDeleting
              ? `Confirm deletion of ${habit.name}. Action cannot be undone. Click again to purge.`
              : `Remove ${habit.name} pattern`
          }
          className={`
            p-3.5 rounded-xl transition-all duration-500 flex items-center gap-2
            focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500
            opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
            ${isDeleting
              ? 'bg-red-500/10 border border-red-500/30 text-red-500 opacity-100 scale-105 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
              : 'text-gray-800 hover:text-red-400 hover:bg-red-400/10'
            }
          `}
        >
          {isDeleting ? (
            <>
              <AlertTriangle size={18} className="animate-bounce-soft" />
              <span className="text-[0.55rem] font-mono font-black uppercase tracking-widest">PURGE?</span>
            </>
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>

      {/* Aesthetic Bottom Segment Detail */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all duration-1000" />
    </div>
  );
});

HabitItem.displayName = 'HabitItem';

const HabitTracker = () => {
  const iconInputId = useId();
  const { getItemAsync, setItem } = useStorageMethods();
  const storageHabits = useStorageKey('habits');
  const { addNotification } = useNotifications();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', icon: '✓', color: 'voro-primary' });

  // Celebration state trackers for interactive 3D standard compliance
  const celebrationRef = useRef(null);
  const [isCelebrationHovered, setIsCelebrationHovered] = useState(false);
  const [isCelebrationFocused, setIsCelebrationFocused] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Habit Tracker';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation using useMemo.
   * Eliminates the initial mount-time double-render cycle and ensures
   * reactivity to StorageContext updates without manual load calls.
   */
  const { habits, todayHabits } = useMemo(() => {
    const data = storageHabits || { list: [], log: {} };
    const list = data.list && data.list.length > 0 ? data.list : defaultHabits;
    const today = new Date().toISOString().split('T')[0];
    const log = data.log?.[today] || {};
    return { habits: list, todayHabits: log };
  }, [storageHabits]);

  const addHabit = useCallback(async () => {
    const { valid, errors } = validateHabit(newHabit);
    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const data = await getItemAsync('habits') || { list: [], log: {} };
    const habit = {
      id: Date.now().toString(),
      ...newHabit,
      createdAt: new Date().toISOString(),
    };

    const updatedData = {
      ...data,
      list: [...(data.list || []), habit]
    };

    const success = await setItem('habits', updatedData);
    if (success) {
      setNewHabit({ name: '', icon: '✓', color: 'voro-primary' });
      setShowAddForm(false);
      addNotification('Neural pattern registered', 'success');
    }
  }, [newHabit, addNotification, getItemAsync, setItem]);

  const toggleHabit = useCallback(async (habitId) => {
    const data = await getItemAsync('habits') || { list: [], log: {} };
    const today = new Date().toISOString().split('T')[0];

    const updatedLog = {
      ...(data.log || {}),
      [today]: {
        ...(data.log?.[today] || {}),
        [habitId]: !data.log?.[today]?.[habitId]
      }
    };

    const updatedData = { ...data, log: updatedLog };
    await setItem('habits', updatedData);
  }, [getItemAsync, setItem]);

  const removeHabit = useCallback(async (habitId) => {
    const data = await getItemAsync('habits') || { list: [], log: {} };
    const updatedData = {
      ...data,
      list: (data.list || []).filter(h => h.id !== habitId)
    };
    await setItem('habits', updatedData);
  }, [getItemAsync, setItem]);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Stabilized Header action.
   * Prevents the memoized Header component from re-rendering on every
   * HabitTracker render by providing a referentially stable JSX element.
   */
  const headerAction = useMemo(() => (
    <Button
      onClick={() => setShowAddForm(prev => !prev)}
      className="px-8 shadow-xl shadow-voro-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
    >
      <Plus size={18} className="mr-2 animate-pulse" />
      Integrate Habit
    </Button>
  ), []);

  // Volumetric mouse tilt handlers for the Milestone celebration card
  const handleCelebrationMouseMove = (e) => {
    if (!celebrationRef.current) return;
    const rect = celebrationRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    celebrationRef.current.style.setProperty('--cel-tilt-x', `${tiltX}deg`);
    celebrationRef.current.style.setProperty('--cel-tilt-y', `${tiltY}deg`);
  };

  const handleCelebrationMouseLeave = () => {
    setIsCelebrationHovered(false);
    if (celebrationRef.current) {
      celebrationRef.current.style.setProperty('--cel-tilt-x', '0deg');
      celebrationRef.current.style.setProperty('--cel-tilt-y', '0deg');
    }
  };

  const handleCelebrationFocus = () => {
    setIsCelebrationFocused(true);
    if (celebrationRef.current) {
      celebrationRef.current.style.setProperty('--cel-tilt-x', '4deg');
      celebrationRef.current.style.setProperty('--cel-tilt-y', '-4deg');
    }
  };

  const handleCelebrationBlur = () => {
    setIsCelebrationFocused(false);
    if (celebrationRef.current) {
      celebrationRef.current.style.setProperty('--cel-tilt-x', '0deg');
      celebrationRef.current.style.setProperty('--cel-tilt-y', '0deg');
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30">
      {/* Ambient background architectural lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[130px] animate-pulse-slow" />
      </div>

      <div className="relative max-w-6xl mx-auto px-10 py-20 z-10">

        <Header
          eyebrow="Neural Synchronization Log"
          title={<>Consistency <span className="text-voro-primary not-italic font-bold">Matrix</span></>}
          action={headerAction}
        />

        {/* Add Habit Form */}
        {showAddForm && (
          <Card className="p-12 mb-16 animate-slide-up border-voro-primary/20 relative overflow-hidden group">
            {/* Structural aesthetics */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-white/[0.03] rounded-tl-[2.5rem]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-white/[0.03] rounded-br-[2.5rem]" />

            <h2 className="text-2xl font-serif italic font-medium text-white mb-10">Pattern Initialization</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <Input
                label="Pattern Name"
                placeholder="e.g., Morning Meditation"
                value={newHabit.name}
                onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                autoFocus
              />
              <div className="flex gap-6">
                 <div className="flex-1">
                    <label htmlFor={iconInputId} className="block text-[0.6rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 mb-4 ml-1">Icon Identifier</label>
                    <input
                      id={iconInputId}
                      type="text"
                      value={newHabit.icon}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, icon: e.target.value }))}
                      maxLength="2"
                      className="w-full bg-[#0A0C14] border border-white/5 rounded-2xl p-4 text-2xl focus:outline-none focus:border-voro-primary focus:ring-1 focus:ring-voro-primary transition-all text-center font-mono"
                    />
                 </div>
                 <div className="flex-[2]">
                    <label className="block text-[0.6rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 mb-4 ml-1">Color Palette</label>
                    <div className="flex gap-2 p-2.5 bg-white/[0.02] rounded-2xl border border-white/5">
                      {['voro-primary', 'voro-secondary', 'voro-accent'].map(c => (
                        <button
                          key={c}
                          onClick={() => setNewHabit(prev => ({ ...prev, color: c }))}
                          aria-label={`Select ${c.replace('voro-', '')} theme`}
                          className={`flex-1 h-12 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${c === 'voro-primary' ? 'bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.3)]' : c === 'voro-secondary' ? 'bg-voro-secondary shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-voro-accent shadow-[0_0_10px_rgba(245,158,11,0.3)]'} ${newHabit.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-90' : 'opacity-40 hover:opacity-100'}`}
                        />
                      ))}
                    </div>
                 </div>
              </div>
            </div>
            <div className="flex gap-6">
              <Button onClick={addHabit} className="flex-1 py-4 text-xs font-black tracking-widest uppercase shadow-2xl shadow-voro-primary/20">Initialize Pattern</Button>
              <Button variant="secondary" onClick={() => setShowAddForm(false)} className="px-10 py-4 text-xs font-bold tracking-widest uppercase border-white/10">Abort</Button>
            </div>
          </Card>
        )}

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {habits.map(habit => (
            <HabitItem
              key={habit.id}
              habit={habit}
              isDone={todayHabits[habit.id]}
              onToggle={toggleHabit}
              onRemove={removeHabit}
            />
          ))}
        </div>

        {habits.length === 0 && !showAddForm && (
          <div className="py-40 text-center animate-fade-in relative overflow-hidden rounded-[3rem] border border-dashed border-white/5 bg-[#0A0C14]/30 backdrop-blur-md">
            <div className="w-24 h-24 mx-auto bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner group">
               <Target size={40} className="text-gray-700 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <p className="text-2xl font-serif italic text-gray-500 mb-10">No active neural patterns detected.</p>
            <Button onClick={() => setShowAddForm(true)} className="px-12 py-5 shadow-2xl shadow-voro-primary/10">
              <Plus size={20} className="mr-3" />
              Begin Evolution
            </Button>
          </div>
        )}

        {/* Milestone Celebration */}
        {habits.length > 0 && habits.every(h => todayHabits[h.id]) && (
          <div
            ref={celebrationRef}
            onMouseMove={handleCelebrationMouseMove}
            onMouseEnter={() => setIsCelebrationHovered(true)}
            onMouseLeave={handleCelebrationMouseLeave}
            onFocus={handleCelebrationFocus}
            onBlur={handleCelebrationBlur}
            tabIndex="0"
            role="article"
            aria-label="Milestone reached: Maximum Synchronicity. All daily neural synapse patterns established."
            style={{
              transform: (isCelebrationHovered || isCelebrationFocused)
                ? 'perspective(1200px) rotateX(var(--cel-tilt-x, 0deg)) rotateY(var(--cel-tilt-y, 0deg)) translateY(-4px)'
                : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
              transition: isCelebrationHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transformStyle: 'preserve-3d'
            }}
            className="mt-16 p-12 rounded-[3rem] bg-gradient-to-b from-voro-primary/10 to-[#0A0C14] border border-voro-primary/20 text-center relative overflow-hidden group/cel shadow-[0_50px_100px_-20px_rgba(124,58,237,0.15)] outline-none focus-visible:ring-2 focus-visible:ring-voro-accent focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]"
          >
            {/* Liquid Border & Parallax */}
            <div className="absolute inset-0 bg-boutique-grain opacity-[0.03]" />
            <div className="absolute inset-0 bg-grid-white opacity-[0.03]" />
            <Confetti />

            <div className="relative z-10 space-y-6" style={{ transform: 'translateZ(60px)' }}>
              <div className="relative inline-flex">
                <div className="absolute inset-[-10px] bg-voro-accent/20 rounded-full blur-xl animate-pulse" />
                <Star className="w-16 h-16 text-voro-accent fill-voro-accent relative z-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-spin-slow" />
              </div>
              <h3 className="text-3xl font-serif italic font-bold text-white tracking-tight">Maximum Synchronicity Reached</h3>
              <p className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-voro-primary">All daily patterns established</p>

              <div className="pt-4 flex justify-center">
                <span className="text-[0.5rem] font-mono text-gray-500 uppercase tracking-[0.3em]">[ SYSTEM LOCK STATUS: 100% COMPLETE // APEX STATE RECOVERED ]</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
