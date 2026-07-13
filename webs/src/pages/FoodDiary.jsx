import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Droplets, Target, Utensils, Zap } from 'lucide-react';
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
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in render loops.
 */
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric'
});

const MEAL_SLOTS = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Late Snack'];

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted log template.
 * Prevents O(N) object and array creation on every render of a new date.
 */
const INITIAL_LOG_TEMPLATE = {
  meals: Object.fromEntries(MEAL_SLOTS.map(slot => [slot, []])),
  water: 0,
  totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
};

const FoodDiary = () => {
  const { user } = useApp();
  const { addNotification } = useNotifications();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const mealSlots = MEAL_SLOTS;

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to the data for the currently selected date.
   * ESTIMATED IMPACT: Eliminates re-renders when data for other dates is updated.
   */
  const nutritionLog = useStorageKeySelector(
    'nutrition_log',
    useCallback((logs) => {
      const log = (logs || {})[date] || INITIAL_LOG_TEMPLATE;

      /**
       * ⚡ PERFORMANCE OPTIMIZATION: Pre-calculate meal slot energy totals.
       */
      const mealTotals = {};
      mealSlots.forEach(slot => {
        mealTotals[slot] = (log.meals[slot] || []).reduce((sum, food) => sum + (food.calories || 0), 0);
      });

      return { ...log, mealTotals };
    }, [date, mealSlots])
  );

  const { setItem, getItem } = useStorageMethods();

  useEffect(() => {
    document.title = 'VORO | Food Diary';
  }, []);

  const handleDateChange = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split('T')[0]);
  };

  const handleAddFood = async (food, portion = 100) => {
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

    // Efficient immutable update
    const updatedMeals = {
      ...currentDayLog.meals,
      [selectedSlot]: [...(currentDayLog.meals[selectedSlot] || []), foodEntry]
    };

    // Incremental totals update (O(1) vs O(N))
    const updatedTotals = {
      calories: currentDayLog.totals.calories + foodEntry.calories,
      protein: Math.round((currentDayLog.totals.protein + foodEntry.protein) * 10) / 10,
      carbs: Math.round((currentDayLog.totals.carbs + foodEntry.carbs) * 10) / 10,
      fat: Math.round((currentDayLog.totals.fat + foodEntry.fat) * 10) / 10,
      fiber: Math.round((currentDayLog.totals.fiber + foodEntry.fiber) * 10) / 10,
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
  };

  const handleRemoveFood = async (slot, index) => {
    /**
     * ⚡ OPTIMISTIC UI: Perform local calculations and update storage.
     * The useStorageKey hook will reactively update the UI immediately
     * after setItem is called, while the storage write persists.
     */
    const allLogs = getItem('nutrition_log') || {};
    const currentDayLog = allLogs[date];
    if (!currentDayLog) return;

    const foodEntry = currentDayLog.meals[slot][index];
    if (!foodEntry) return;

    const updatedSlotMeals = [...currentDayLog.meals[slot]];
    updatedSlotMeals.splice(index, 1);

    const updatedMeals = {
      ...currentDayLog.meals,
      [slot]: updatedSlotMeals
    };

    // Incremental totals update (O(1))
    const updatedTotals = {
      calories: Math.max(0, currentDayLog.totals.calories - foodEntry.calories),
      protein: Math.max(0, Math.round((currentDayLog.totals.protein - (foodEntry.protein || 0)) * 10) / 10),
      carbs: Math.max(0, Math.round((currentDayLog.totals.carbs - (foodEntry.carbs || 0)) * 10) / 10),
      fat: Math.max(0, Math.round((currentDayLog.totals.fat - (foodEntry.fat || 0)) * 10) / 10),
      fiber: Math.max(0, Math.round((currentDayLog.totals.fiber - (foodEntry.fiber || 0)) * 10) / 10),
    };

    const updatedDayLog = {
      ...currentDayLog,
      meals: updatedMeals,
      totals: updatedTotals
    };

    // Immediate storage update for zero-latency UI transition
    setItem('nutrition_log', {
      ...allLogs,
      [date]: updatedDayLog
    });

    addNotification(`${foodEntry.name} removed from ${slot}`, 'info');
  };

  const handleWaterAdd = async (amount) => {
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
  };

  if (!nutritionLog) return null;

  const calorieGoal = user?.calorieGoal || 2000;
  const waterGoal = user?.waterGoal || 2000;

  const macroConfigs = [
    { label: 'Protein', value: nutritionLog.totals.protein, goal: user?.proteinGoal || 160, color: '#7C3AED', unit: 'g' },
    { label: 'Carbs', value: nutritionLog.totals.carbs, goal: user?.carbGoal || 225, color: '#10B981', unit: 'g' },
    { label: 'Fat', value: nutritionLog.totals.fat, goal: user?.fatGoal || 65, color: '#F59E0B', unit: 'g' }
  ];

  const formattedDate = dateFormatter.format(new Date(date));

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Utensils size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Energy Synthesis Log</span>
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
              <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">Temporal Frame</p>
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
          <div className="lg:col-span-4 space-y-8">
             <Card className="flex flex-col items-center justify-center p-10 bg-gradient-to-b from-[#0A0C14] to-black">
              <div className="relative">
                <Ring
                  value={nutritionLog.totals.calories}
                  max={calorieGoal}
                  size={240}
                  unit="kcal"
                  label="Daily Flux"
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {macroConfigs.map(macro => (
                <Card key={macro.label} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">{macro.label}</span>
                    <span className="text-[0.65rem] font-mono text-gray-700 tracking-widest">{macro.goal}{macro.unit} Target</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-serif font-bold text-white italic">{Math.round(macro.value)}</span>
                    <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-widest">{macro.unit}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min((macro.value / macro.goal) * 100, 100)}%`,
                        backgroundColor: macro.color
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                    <Droplets size={18} />
                  </div>
                  <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white">Hydration</h3>
                </div>
                <span className="text-[0.65rem] font-mono font-bold text-gray-500 tracking-widest">
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
                    className="py-3 rounded-xl bg-white/[0.02] border border-white/5 text-[0.65rem] font-black uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                    aria-label={`Add ${amt}ml of water`}
                  >
                    +{amt > 999 ? '1L' : amt}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {mealSlots.map((slot, sIdx) => (
              <Card
                key={slot}
                variant="premium"
                nodeId={`MEAL_0${sIdx + 1}`}
                className="p-0 overflow-hidden group/slot"
              >
                <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                    <h3 className="text-xl font-serif italic font-medium text-white tracking-tight">{slot}</h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xl font-mono font-bold text-white">
                        {nutritionLog.mealTotals[slot] || 0}
                      </p>
                      <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em]">Energy kcal</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSlot(slot);
                        setShowFoodSearch(true);
                      }}
                      className="p-3 bg-white text-black rounded-full hover:scale-110 active:scale-90 transition-all shadow-xl shadow-white/5 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none"
                      aria-label={`Add food to ${slot}`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {Array.isArray(nutritionLog.meals[slot]) && nutritionLog.meals[slot].length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {nutritionLog.meals[slot].map((food, idx) => (
                        <NutritionCard
                          key={food.id}
                          meal={{
                            ...food,
                            mealType: slot
                          }}
                          onDelete={() => handleRemoveFood(slot, idx)}
                          className="animate-slide-up"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-30">
                      <Zap size={32} className="mb-4 text-gray-700" />
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-500">Void Slot</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showFoodSearch && (
        <FoodSearchModal
          isOpen={showFoodSearch}
          onClose={() => setShowFoodSearch(false)}
          onSelectFood={handleAddFood}
        />
      )}
    </div>
  );
};

const FoodSearchModal = ({ isOpen, onClose, onSelectFood }) => {
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState(100);

  /**
   * ⚡ OPTIMIZATION: Deriving filtered results via useMemo.
   * This eliminates the double-render cycle (effect + state update)
   * and ensures results are computed only when the search query changes.
   */
  const results = useMemo(() => {
    if (!search.trim()) return foods.slice(0, 15);

    const query = search.toLowerCase();
    return foods.filter(f =>
      f.name.toLowerCase().includes(query) ||
      (f.category && f.category.toLowerCase().includes(query))
    ).slice(0, 20);
  }, [search]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Caloric Synthesis">
      <div className="space-y-10 min-h-[500px]">
        {!selectedFood ? (
          <div className="space-y-8">
            <div className="space-y-4">
               <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Search Database</label>
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
                  className="w-full text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-voro-primary hover:bg-voro-primary/[0.02] transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white tracking-tight uppercase">{food.name}</span>
                    <span className="text-xs font-mono font-bold text-voro-primary">{food.calories} kcal</span>
                  </div>
                  <div className="text-[0.6rem] font-mono text-gray-600 tracking-widest uppercase">
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
              <p className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Unit Profile (100g)</p>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { l: 'kcal', v: selectedFood.calories },
                  { l: 'prot', v: selectedFood.protein },
                  { l: 'carb', v: selectedFood.carbs },
                  { l: 'fat', v: selectedFood.fat }
                ].map(stat => (
                  <div key={stat.l} className="text-center">
                    <p className="text-xl font-mono font-bold text-white">{stat.v}</p>
                    <p className="text-[0.55rem] font-black text-gray-700 uppercase tracking-widest">{stat.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Magnitude (grams)</label>
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
};

export default FoodDiary;
