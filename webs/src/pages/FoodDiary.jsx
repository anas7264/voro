import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Droplets, Target, Utensils, Zap } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { useAppContext as useApp } from '@/hooks/useAppContext';
import { useNotifications } from '@/hooks/useNotifications';
import { validateFoodDiaryEntry, validateWaterEntry } from '@/utils/validators';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Ring from '@/components/Ring';
import { foods } from '@/data/foods';

const FoodDiary = () => {
  const { getStorage, setStorage } = useStorage();
  const { user } = useApp();
  const { addNotification } = useNotifications();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [nutritionLog, setNutritionLog] = useState(null);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const mealSlots = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Late Snack'];

  useEffect(() => {
    document.title = 'VORO | Food Diary';
    loadNutritionData();
  }, [date]);

  const loadNutritionData = () => {
    const allLogs = getStorage('voro_nutrition_log') || {};
    const dayLog = allLogs[date] || {
      meals: Object.fromEntries(mealSlots.map(slot => [slot, []])),
      water: 0,
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    };
    setNutritionLog(dayLog);
  };

  const handleDateChange = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split('T')[0]);
  };

  const handleAddFood = (food, portion = 100) => {
    if (!selectedSlot || !nutritionLog) return;

    const { valid, errors } = validateFoodDiaryEntry({ portion });
    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const allLogs = getStorage('voro_nutrition_log') || {};
    const dayLog = JSON.parse(JSON.stringify(nutritionLog));

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

    dayLog.meals[selectedSlot].push(foodEntry);

    dayLog.totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    Object.values(dayLog.meals).forEach(mealFoods => {
      mealFoods.forEach(entry => {
        dayLog.totals.calories += entry.calories;
        dayLog.totals.protein += entry.protein;
        dayLog.totals.carbs += entry.carbs;
        dayLog.totals.fat += entry.fat;
        dayLog.totals.fiber += (entry.fiber || 0);
      });
    });

    allLogs[date] = dayLog;
    setStorage('voro_nutrition_log', allLogs);
    setNutritionLog(dayLog);
    setShowFoodSearch(false);
    setSelectedSlot(null);
    addNotification(`${food.name} added to ${selectedSlot}`, 'success');
  };

  const handleRemoveFood = (slot, index) => {
    const allLogs = getStorage('voro_nutrition_log') || {};
    const dayLog = JSON.parse(JSON.stringify(nutritionLog));
    dayLog.meals[slot].splice(index, 1);

    dayLog.totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    Object.values(dayLog.meals).forEach(mealFoods => {
      mealFoods.forEach(entry => {
        dayLog.totals.calories += entry.calories;
        dayLog.totals.protein += entry.protein;
        dayLog.totals.carbs += entry.carbs;
        dayLog.totals.fat += entry.fat;
        dayLog.totals.fiber += (entry.fiber || 0);
      });
    });

    allLogs[date] = dayLog;
    setStorage('voro_nutrition_log', allLogs);
    setNutritionLog(dayLog);
  };

  const handleWaterAdd = (amount) => {
    const { valid, errors } = validateWaterEntry({ amount, date });
    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const allLogs = getStorage('voro_nutrition_log') || {};
    const dayLog = JSON.parse(JSON.stringify(nutritionLog));
    dayLog.water = (dayLog.water || 0) + amount;
    allLogs[date] = dayLog;
    setStorage('voro_nutrition_log', allLogs);
    setNutritionLog(dayLog);
  };

  if (!nutritionLog) return null;

  const calorieGoal = user?.calorieGoal || 2000;
  const waterGoal = user?.waterGoal || 2000;

  const macroConfigs = [
    { label: 'Protein', value: nutritionLog.totals.protein, goal: user?.proteinGoal || 160, color: '#7C3AED', unit: 'g' },
    { label: 'Carbs', value: nutritionLog.totals.carbs, goal: user?.carbGoal || 225, color: '#10B981', unit: 'g' },
    { label: 'Fat', value: nutritionLog.totals.fat, goal: user?.fatGoal || 65, color: '#F59E0B', unit: 'g' }
  ];

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

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
              className="p-3 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 text-center">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">Temporal Frame</p>
              <p className="text-sm font-mono font-bold text-white uppercase tracking-widest">{formattedDate}</p>
            </div>
            <button
              onClick={() => handleDateChange(1)}
              className="p-3 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"
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
                    className="py-3 rounded-xl bg-white/[0.02] border border-white/5 text-[0.65rem] font-black uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-all active:scale-95"
                  >
                    +{amt > 999 ? '1L' : amt}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {mealSlots.map((slot) => (
              <Card key={slot} className="p-0 overflow-hidden group/slot">
                <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                    <h3 className="text-xl font-serif italic font-medium text-white tracking-tight">{slot}</h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xl font-mono font-bold text-white">
                        {nutritionLog.meals[slot].reduce((sum, food) => sum + food.calories, 0)}
                      </p>
                      <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em]">Energy kcal</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSlot(slot);
                        setShowFoodSearch(true);
                      }}
                      className="p-3 bg-white text-black rounded-full hover:scale-110 active:scale-90 transition-all shadow-xl shadow-white/5"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {nutritionLog.meals[slot].length > 0 ? (
                    <div className="space-y-4">
                      {nutritionLog.meals[slot].map((food, idx) => (
                        <div key={food.id} className="group relative flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-white tracking-tight uppercase">{food.name}</p>
                            <p className="text-[0.65rem] font-mono text-gray-500 tracking-widest">
                               {food.portion}g | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                            </p>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-sm font-bold text-voro-primary font-mono">{food.calories} kcal</span>
                            <button
                              onClick={() => handleRemoveFood(slot, idx)}
                              className="p-2.5 rounded-xl text-gray-700 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
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
  const [results, setResults] = useState(foods.slice(0, 15));
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState(100);

  useEffect(() => {
    if (search.trim()) {
      const filtered = foods.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        (f.category && f.category.toLowerCase().includes(search.toLowerCase()))
      );
      setResults(filtered.slice(0, 20));
    } else {
      setResults(foods.slice(0, 15));
    }
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
