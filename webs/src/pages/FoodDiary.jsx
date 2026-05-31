import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Copy } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { useAppContext as useApp } from '@/hooks/useAppContext';
import { useNotifications } from '@/hooks/useNotifications';
import { validateFoodDiaryEntry, validateWaterEntry } from '@/utils/validators';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Ring from '@/components/Ring';
import Badge from '@/components/Badge';
import { foods } from '@/data/foods';

const FoodDiary = () => {
  const { getStorage, setStorage } = useStorage();
  const { user } = useApp();
  const { addNotification } = useNotifications();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [nutritionLog, setNutritionLog] = useState(null);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState([]);

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

    // Security: Validate food entry before calculations and persistence
    const { valid, errors } = validateFoodDiaryEntry({ portion });

    if (!valid) {
      const errorMsg = Object.values(errors).join('. ');
      addNotification(`Validation failed: ${errorMsg}`, 'error');
      return;
    }

    const allLogs = getStorage('voro_nutrition_log') || {};
    const dayLog = allLogs[date] || {
      meals: Object.fromEntries(mealSlots.map(slot => [slot, []])),
      water: 0,
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    };

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

    // Recalculate totals
    dayLog.totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    Object.values(dayLog.meals).forEach(mealFoods => {
      mealFoods.forEach(entry => {
        dayLog.totals.calories += entry.calories;
        dayLog.totals.protein += entry.protein;
        dayLog.totals.carbs += entry.carbs;
        dayLog.totals.fat += entry.fat;
        dayLog.totals.fiber += entry.fiber;
      });
    });

    allLogs[date] = dayLog;
    setStorage('voro_nutrition_log', allLogs);
    setNutritionLog(dayLog);
    setShowFoodSearch(false);
    setSelectedSlot(null);
  };

  const handleRemoveFood = (slot, index) => {
    if (!nutritionLog) return;

    const allLogs = getStorage('voro_nutrition_log') || {};
    const dayLog = allLogs[date];
    dayLog.meals[slot].splice(index, 1);

    // Recalculate totals
    dayLog.totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    Object.values(dayLog.meals).forEach(mealFoods => {
      mealFoods.forEach(entry => {
        dayLog.totals.calories += entry.calories;
        dayLog.totals.protein += entry.protein;
        dayLog.totals.carbs += entry.carbs;
        dayLog.totals.fat += entry.fat;
        dayLog.totals.fiber += entry.fiber;
      });
    });

    allLogs[date] = dayLog;
    setStorage('voro_nutrition_log', allLogs);
    setNutritionLog(dayLog);
  };

  const handleWaterAdd = (amount) => {
    // Security: Validate water intake before persisting to storage
    const { valid, errors } = validateWaterEntry({ amount, date });

    if (!valid) {
      const errorMsg = Object.values(errors).join('. ');
      addNotification(`Validation failed: ${errorMsg}`, 'error');
      return;
    }

    const allLogs = getStorage('voro_nutrition_log') || {};
    const dayLog = allLogs[date] || {
      meals: Object.fromEntries(mealSlots.map(slot => [slot, []])),
      water: 0,
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    };
    dayLog.water = (dayLog.water || 0) + amount;
    allLogs[date] = dayLog;
    setStorage('voro_nutrition_log', allLogs);
    setNutritionLog(dayLog);
  };

  if (!nutritionLog) return <div className="p-8">Loading...</div>;

  const calorieGoal = user?.calorieGoal || 2000;
  const waterGoal = user?.waterGoal || 2000;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] overflow-x-hidden p-8 lg:p-24">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-voro-primary">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Fuel Manifest</span>
              <div className="h-[1px] w-12 bg-voro-primary/30" />
            </div>
            <h1 className="text-7xl font-black font-serif italic text-white leading-[0.9] tracking-tighter">
              Nutritional <span className="text-gradient not-italic">Entropy</span>
            </h1>
          </div>

          <div className="flex items-center gap-6 bg-white/5 p-4 border border-white/5 backdrop-blur-xl">
            <button onClick={() => handleDateChange(-1)} className="text-gray-500 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase">{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
            <button onClick={() => handleDateChange(1)} className="text-gray-500 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </header>

        {/* Metabolic Summation */}
        <div className="grid grid-cols-12 gap-12 mb-24">
          <div className="col-span-12 lg:col-span-4">
            <Card className="h-full flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-voro-primary to-transparent opacity-50" />
              <Ring
                value={nutritionLog.totals.calories}
                max={calorieGoal}
                size={160}
                strokeWidth={4}
                className="drop-shadow-[0_0_30px_rgba(124,58,237,0.2)]"
              />
              <p className="mt-8 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em]">Temporal Energy Density</p>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
             <Stat label="Structural Protein" value={nutritionLog.totals.protein.toFixed(0)} unit="G" change={Math.round((nutritionLog.totals.protein / (user?.proteinGoal || 160)) * 100)} color="voro-primary" />
             <Stat label="Glycogen Flux" value={nutritionLog.totals.carbs.toFixed(0)} unit="G" change={Math.round((nutritionLog.totals.carbs / (user?.carbGoal || 225)) * 100)} color="voro-secondary" />
             <Stat label="Lipid Integrity" value={nutritionLog.totals.fat.toFixed(0)} unit="G" change={Math.round((nutritionLog.totals.fat / (user?.fatGoal || 65)) * 100)} color="voro-accent" />
          </div>
        </div>

        {/* Integration Nodes (Meal Slots) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {mealSlots.map((slot) => (
            <div key={slot} className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-voro-primary" />
                  <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.3em]">{slot}</h3>
                </div>
                <div className="flex items-center gap-8">
                   <span className="text-[10px] font-mono text-gray-600 tracking-widest">{nutritionLog.meals[slot].reduce((sum, food) => sum + food.calories, 0)} KCAL</span>
                   <button
                     onClick={() => { setSelectedSlot(slot); setShowFoodSearch(true); }}
                     className="text-voro-primary hover:text-white transition-colors"
                   >
                     <Plus size={18} />
                   </button>
                </div>
              </div>

              <div className="space-y-1">
                {nutritionLog.meals[slot].length > 0 ? (
                  nutritionLog.meals[slot].map((food, idx) => (
                    <div key={food.id} className="group flex items-center justify-between p-6 bg-white/5 border border-transparent hover:border-white/5 transition-all">
                      <div>
                        <p className="text-sm font-serif italic text-white mb-1">{food.name}</p>
                        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">{food.portion}G // P:{food.protein}G C:{food.carbs}G F:{food.fat}G</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-xs font-mono font-bold text-white tracking-tighter">{food.calories}</span>
                        <button onClick={() => handleRemoveFood(slot, idx)} className="text-gray-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 bg-white/[0.02] border border-dashed border-white/5 text-[10px] font-mono text-gray-800 uppercase tracking-[0.3em] text-center italic">
                    Void State: Awaiting Fuel Integration
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Saturation Matrix (Water) */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.4em]">Intracellular Saturation</h3>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{nutritionLog.water} / {waterGoal} ML</span>
          </div>
          <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 mb-12">
             <div
               className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(37,99,235,0.5)]"
               style={{ width: `${Math.min((nutritionLog.water / waterGoal) * 100, 100)}%` }}
             />
          </div>
          <div className="grid grid-cols-3 gap-8">
             <button onClick={() => handleWaterAdd(250)} className="py-6 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all">+250 ML Delta</button>
             <button onClick={() => handleWaterAdd(500)} className="py-6 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all">+500 ML Delta</button>
             <button onClick={() => handleWaterAdd(1000)} className="py-6 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all">+1.0 L Delta</button>
          </div>
        </section>

        {/* Food Search Modal */}
        {showFoodSearch && (
          <FoodSearchModal
            isOpen={showFoodSearch}
            onClose={() => setShowFoodSearch(false)}
            onSelectFood={handleAddFood}
          />
        )}
      </div>
    </div>
  );
};

const FoodSearchModal = ({ isOpen, onClose, onSelectFood }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState(foods.slice(0, 20));
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState(100);

  useEffect(() => {
    if (search.trim()) {
      const filtered = foods.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        (f.category && f.category.toLowerCase().includes(search.toLowerCase()))
      );
      setResults(filtered.slice(0, 30));
    } else {
      setResults(foods.slice(0, 20));
    }
  }, [search]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Molecular Synthesis: Fuel Search" size="lg">
      <div className="space-y-12">
        {!selectedFood ? (
          <div className="space-y-8">
            <Input
              placeholder="Query molecular database..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto px-1
              [&::-webkit-scrollbar]:w-0.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-white/5">
              {results.map(food => (
                <div
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className="p-6 bg-white/[0.02] border border-white/5 hover:border-voro-primary cursor-pointer transition-all group"
                >
                  <div className="font-serif italic text-white mb-2 group-hover:text-voro-primary transition-colors">{food.name}</div>
                  <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{food.calories} KCAL // P:{food.protein}G</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="p-10 bg-white/5 border border-voro-primary/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-voro-primary/10 blur-2xl" />
              <div className="relative z-10">
                <div className="text-4xl font-serif italic text-white mb-4">{selectedFood.name}</div>
                <div className="grid grid-cols-4 gap-4">
                   <div className="space-y-1">
                     <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Energy</p>
                     <p className="text-xl font-mono text-white">{selectedFood.calories}K</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Protein</p>
                     <p className="text-xl font-mono text-voro-primary">{selectedFood.protein}G</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Carbs</p>
                     <p className="text-xl font-mono text-voro-secondary">{selectedFood.carbs}G</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Lipids</p>
                     <p className="text-xl font-mono text-voro-accent">{selectedFood.fat}G</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Temporal Mass Integration (G)"
                type="number"
                value={portion}
                onChange={(e) => setPortion(Number(e.target.value))}
                min="1"
              />
            </div>

            <div className="flex gap-4">
              <Button variant="secondary" fullWidth onClick={() => setSelectedFood(null)}>De-select</Button>
              <Button
                onClick={() => onSelectFood(selectedFood, portion)}
                fullWidth
              >
                Synthesize
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FoodDiary;
