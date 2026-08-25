import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Droplets, Target, Utensils, Zap, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useAppContext as useApp } from '@/hooks/useAppContext';
import { useNotifications } from '@/hooks/useNotifications';
import { validateFoodDiaryEntry, validateWaterEntry } from '@/utils/validators';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Ring from '@/components/Ring';
import { NutritionCard } from '@/components/NutritionCard';
import { foods } from '@/data/foods';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Module-Scoped Frozen Constants.
 * Pre-instantiating static datasets and lookup maps to eliminate heap allocation per render.
 */
const FOODS_LOWERCASE = Object.freeze(foods.map(f => Object.freeze({
  ...f,
  _nameLower: f.name.toLowerCase(),
  _categoryLower: f.category ? f.category.toLowerCase() : '',
})));

const MEAL_SLOTS = Object.freeze(['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Late Snack']);

const INITIAL_LOG_TEMPLATE = Object.freeze({
  meals: Object.freeze(Object.fromEntries(MEAL_SLOTS.map(slot => [slot, Object.freeze([])]))),
  water: 0,
  totals: Object.freeze({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })
});

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Module-Scoped Date Formatter.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in render loops.
 */
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric'
});

/**
 * ⚡ SUBCOMPONENT: KineticMealSlotCard
 * Memoized card component with 60fps direct-DOM 3D volumetric hover tilts,
 * holographic telemetry coordinates, sub-pixel node hashes, and W3C APG focus tilts.
 */
const KineticMealSlotCard = memo(({ slot, sIdx, slotMeal, totalKcal, onOpenSearch, onRemoveFood }) => {
  const cardRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const nodeId = useMemo(() => `0xMEAL_SLOT_0${sIdx + 1}`, [sIdx]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 10;
    const tiltX = (0.5 - (y / rect.height)) * 10;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '4deg');
      cardRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const isActive = isHovered || isFocused;

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
      aria-label={`Meal Slot: ${slot}, Total Energy: ${totalKcal} kcal`}
      style={{
        transform: isActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="group/slot relative p-0 rounded-[2.5rem] bg-[#0A0C14] border border-white/5 hover:border-voro-primary/30 transition-all duration-500 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/80 shadow-2xl"
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/slot:opacity-100 transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover/slot:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 45%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/slot:opacity-100 group-focus-within:opacity-100 transition-all duration-500 z-30"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.45rem] font-black text-voro-primary/60 tracking-[0.2em] space-y-0.5 select-none">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
        <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.5)] animate-pulse" />
            <div>
              <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.3em] text-voro-primary/80">Slot 0{sIdx + 1}</span>
              <h3 className="text-xl md:text-2xl font-serif italic font-medium text-white tracking-tight">{slot}</h3>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-white tracking-tight">
                {totalKcal}
              </p>
              <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em]">Energy kcal</p>
            </div>
            <button
              onClick={() => onOpenSearch(slot)}
              className="p-3.5 bg-white text-black rounded-full hover:scale-110 active:scale-90 transition-all shadow-xl shadow-white/5 focus-visible:ring-2 focus-visible:ring-voro-primary outline-none"
              aria-label={`Synthesize food into ${slot}`}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {Array.isArray(slotMeal) && slotMeal.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slotMeal.map((food, idx) => (
                <NutritionCard
                  key={food.id || `${slot}-${idx}`}
                  meal={{
                    ...food,
                    mealType: slot
                  }}
                  onDelete={() => onRemoveFood(slot, idx)}
                  className="animate-slide-up"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-40 group-hover/slot:opacity-60 transition-opacity">
              <Zap size={32} className="mb-4 text-voro-primary/50 animate-pulse" />
              <p className="text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] text-gray-400">Void Slot Node</p>
              <p className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest mt-1">Awaiting Trophic Synthesis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

KineticMealSlotCard.displayName = 'KineticMealSlotCard';

/**
 * ⚡ SUBCOMPONENT: KineticMacroCard
 * 3D volumetric card displaying macro targets and progress.
 */
const KineticMacroCard = memo(({ label, value, goal, color, unit }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 8;
    const tiltX = (0.5 - (y / rect.height)) * 8;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
  };

  const pct = Math.min((value / (goal || 1)) * 100, 100);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-2px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="p-6 rounded-3xl bg-[#0A0C14] border border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.25em] text-gray-400">{label}</span>
        <span className="text-[0.65rem] font-mono text-gray-600 tracking-widest">{goal}{unit} Target</span>
      </div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-serif font-bold text-white italic">{Math.round(value)}</span>
        <span className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest">{unit}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
});

KineticMacroCard.displayName = 'KineticMacroCard';

const FoodDiary = () => {
  const { user } = useApp();
  const { addNotification } = useNotifications();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribes strictly to data for the selected date slice in 'nutrition_log'.
   */
  const nutritionLog = useStorageKeySelector(
    'nutrition_log',
    useCallback((logs) => {
      const log = (logs || {})[date] || INITIAL_LOG_TEMPLATE;

      const mealTotals = {};
      MEAL_SLOTS.forEach(slot => {
        mealTotals[slot] = (log.meals?.[slot] || []).reduce((sum, food) => sum + (food.calories || 0), 0);
      });

      return {
        meals: log.meals || INITIAL_LOG_TEMPLATE.meals,
        water: log.water || 0,
        totals: log.totals || INITIAL_LOG_TEMPLATE.totals,
        mealTotals
      };
    }, [date])
  );

  const { setItem, getItem } = useStorageMethods();

  useEffect(() => {
    document.title = 'VORO | Food Diary';
  }, []);

  const handleDateChange = useCallback((days) => {
    setDate(prevDate => {
      const d = new Date(prevDate);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    });
  }, []);

  const handleOpenSearch = useCallback((slot) => {
    setSelectedSlot(slot);
    setShowFoodSearch(true);
  }, []);

  const handleAddFood = useCallback(async (food, portion = 100) => {
    if (!selectedSlot || !nutritionLog) return;

    const { valid, errors } = validateFoodDiaryEntry({ portion });
    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const multiplier = portion / 100;
    const foodEntry = {
      id: `${food.id}-${Date.now()}`,
      foodId: food.id,
      name: food.name,
      portion,
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10,
      fiber: Math.round((food.fiber || 0) * multiplier * 10) / 10,
    };

    const allLogs = getItem('nutrition_log') || {};
    const currentDayLog = allLogs[date] || nutritionLog;

    const updatedMeals = {
      ...currentDayLog.meals,
      [selectedSlot]: [...(currentDayLog.meals[selectedSlot] || []), foodEntry]
    };

    const updatedTotals = {
      calories: (currentDayLog.totals?.calories || 0) + foodEntry.calories,
      protein: Math.round(((currentDayLog.totals?.protein || 0) + foodEntry.protein) * 10) / 10,
      carbs: Math.round(((currentDayLog.totals?.carbs || 0) + foodEntry.carbs) * 10) / 10,
      fat: Math.round(((currentDayLog.totals?.fat || 0) + foodEntry.fat) * 10) / 10,
      fiber: Math.round(((currentDayLog.totals?.fiber || 0) + foodEntry.fiber) * 10) / 10,
    };

    const updatedDayLog = {
      ...currentDayLog,
      meals: updatedMeals,
      totals: updatedTotals
    };

    await setItem('nutrition_log', {
      ...allLogs,
      [date]: updatedDayLog
    });

    setShowFoodSearch(false);
    setSelectedSlot(null);
    addNotification(`${food.name} added to ${selectedSlot}`, 'success');
  }, [selectedSlot, nutritionLog, date, getItem, setItem, addNotification]);

  const handleRemoveFood = useCallback(async (slot, index) => {
    const allLogs = getItem('nutrition_log') || {};
    const currentDayLog = allLogs[date];
    if (!currentDayLog || !currentDayLog.meals?.[slot]) return;

    const foodEntry = currentDayLog.meals[slot][index];
    if (!foodEntry) return;

    const updatedSlotMeals = [...currentDayLog.meals[slot]];
    updatedSlotMeals.splice(index, 1);

    const updatedMeals = {
      ...currentDayLog.meals,
      [slot]: updatedSlotMeals
    };

    const updatedTotals = {
      calories: Math.max(0, (currentDayLog.totals?.calories || 0) - foodEntry.calories),
      protein: Math.max(0, Math.round(((currentDayLog.totals?.protein || 0) - (foodEntry.protein || 0)) * 10) / 10),
      carbs: Math.max(0, Math.round(((currentDayLog.totals?.carbs || 0) - (foodEntry.carbs || 0)) * 10) / 10),
      fat: Math.max(0, Math.round(((currentDayLog.totals?.fat || 0) - (foodEntry.fat || 0)) * 10) / 10),
      fiber: Math.max(0, Math.round(((currentDayLog.totals?.fiber || 0) - (foodEntry.fiber || 0)) * 10) / 10),
    };

    const updatedDayLog = {
      ...currentDayLog,
      meals: updatedMeals,
      totals: updatedTotals
    };

    await setItem('nutrition_log', {
      ...allLogs,
      [date]: updatedDayLog
    });

    addNotification(`${foodEntry.name} removed from ${slot}`, 'info');
  }, [date, getItem, setItem, addNotification]);

  const handleWaterAdd = useCallback(async (amount) => {
    const { valid, errors } = validateWaterEntry({ amount, date });
    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const allLogs = getItem('nutrition_log') || {};
    const currentDayLog = allLogs[date] || nutritionLog;

    await setItem('nutrition_log', {
      ...allLogs,
      [date]: {
        ...currentDayLog,
        water: (currentDayLog.water || 0) + amount
      }
    });
  }, [date, nutritionLog, getItem, setItem, addNotification]);

  const calorieGoal = user?.calorieGoal || 2000;
  const waterGoal = user?.waterGoal || 2000;

  const macroConfigs = useMemo(() => [
    { label: 'Protein', value: nutritionLog.totals.protein, goal: user?.proteinGoal || 160, color: '#7C3AED', unit: 'g' },
    { label: 'Carbs', value: nutritionLog.totals.carbs, goal: user?.carbGoal || 225, color: '#10B981', unit: 'g' },
    { label: 'Fat', value: nutritionLog.totals.fat, goal: user?.fatGoal || 65, color: '#F59E0B', unit: 'g' }
  ], [nutritionLog.totals, user]);

  const formattedDate = useMemo(() => dateFormatter.format(new Date(`${date}T00:00:00`)), [date]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-20 bg-boutique-grain selection:bg-voro-primary/30 relative">
      {/* Ambient Background Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Utensils size={18} />
              <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.3em]">Energy Synthesis Log</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
              Metabolic <span className="text-voro-primary not-italic font-bold">Archive</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-[#0A0C14] border border-white/5 rounded-2xl p-2 shadow-xl">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-3 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-voro-primary outline-none"
              aria-label="Previous day"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 text-center">
              <p className="text-[0.65rem] font-mono font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Temporal Frame</p>
              <p className="text-sm font-mono font-bold text-white uppercase tracking-widest">{formattedDate}</p>
            </div>
            <button
              onClick={() => handleDateChange(1)}
              className="p-3 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-voro-primary outline-none"
              aria-label="Next day"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Caloric Gauge & Macro Diagnostics */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="flex flex-col items-center justify-center p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-[60px]" />
              <Ring
                value={nutritionLog.totals.calories}
                max={calorieGoal}
                size={240}
                unit="kcal"
                label="Daily Flux"
              />
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {macroConfigs.map(macro => (
                <KineticMacroCard
                  key={macro.label}
                  label={macro.label}
                  value={macro.value}
                  goal={macro.goal}
                  color={macro.color}
                  unit={macro.unit}
                />
              ))}
            </div>

            {/* Hydration Enclave */}
            <Card className="p-8 space-y-6 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                    <Droplets size={18} />
                  </div>
                  <h3 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.2em] text-white">Hydration Matrix</h3>
                </div>
                <span className="text-[0.65rem] font-mono font-bold text-gray-400 tracking-widest">
                  {nutritionLog.water} / {waterGoal} ml
                </span>
              </div>

              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((nutritionLog.water / waterGoal) * 100, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[250, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => handleWaterAdd(amt)}
                    className="py-3 rounded-xl bg-white/[0.02] border border-white/5 text-[0.65rem] font-mono font-black uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                    aria-label={`Add ${amt}ml of water`}
                  >
                    +{amt > 999 ? '1L' : amt}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Meal Slots Feed */}
          <div className="lg:col-span-8 space-y-6">
            {MEAL_SLOTS.map((slot, sIdx) => (
              <KineticMealSlotCard
                key={slot}
                slot={slot}
                sIdx={sIdx}
                slotMeal={nutritionLog.meals[slot]}
                totalKcal={nutritionLog.mealTotals[slot] || 0}
                onOpenSearch={handleOpenSearch}
                onRemoveFood={handleRemoveFood}
              />
            ))}
          </div>
        </div>
      </div>

      {showFoodSearch && (
        <FoodSearchModal
          isOpen={showFoodSearch}
          onClose={() => {
            setShowFoodSearch(false);
            setSelectedSlot(null);
          }}
          onSelectFood={handleAddFood}
        />
      )}
    </div>
  );
};

const FoodSearchModal = memo(({ isOpen, onClose, onSelectFood }) => {
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState(100);

  const results = useMemo(() => {
    if (!search.trim()) return FOODS_LOWERCASE.slice(0, 15);

    const query = search.toLowerCase();
    return FOODS_LOWERCASE.filter(f =>
      f._nameLower.includes(query) ||
      f._categoryLower.includes(query)
    ).slice(0, 20);
  }, [search]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Caloric Synthesis Engine">
      <div className="space-y-10 min-h-[500px]">
        {!selectedFood ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[0.65rem] font-mono font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Search Food Database</label>
              <Input
                placeholder="Search food units..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pb-8">
              {results.map(food => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className="w-full text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-voro-primary hover:bg-voro-primary/[0.02] transition-all group focus-visible:ring-2 focus-visible:ring-voro-primary outline-none"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white tracking-tight uppercase font-mono">{food.name}</span>
                    <span className="text-xs font-mono font-bold text-voro-primary">{food.calories} kcal</span>
                  </div>
                  <div className="text-[0.6rem] font-mono text-gray-500 tracking-widest uppercase">
                    P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g | {food.category}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-fade-in">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <h3 className="text-2xl font-serif italic font-bold text-white mb-2">{selectedFood.name}</h3>
              <p className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Unit Profile (100g base)</p>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { l: 'kcal', v: selectedFood.calories },
                  { l: 'prot', v: selectedFood.protein },
                  { l: 'carb', v: selectedFood.carbs },
                  { l: 'fat', v: selectedFood.fat }
                ].map(stat => (
                  <div key={stat.l} className="text-center">
                    <p className="text-xl font-mono font-bold text-white">{stat.v}</p>
                    <p className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-widest">{stat.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[0.65rem] font-mono font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Portion Magnitude (grams)</label>
              <Input
                type="number"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                min="1"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="secondary"
                onClick={() => setSelectedFood(null)}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                onClick={() => onSelectFood(selectedFood, Number(portion))}
                className="flex-[2]"
              >
                Synthesize Entry
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
});

FoodSearchModal.displayName = 'FoodSearchModal';

export default FoodDiary;
