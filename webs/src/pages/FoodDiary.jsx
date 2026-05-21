import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Copy } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { useAppContext as useApp } from '@/hooks/useAppContext';
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
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Food Diary</h1>

        {/* Date Navigation */}
        <Card className="p-4 mb-6 flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={() => handleDateChange(-1)}>
            <ChevronLeft size={18} />
          </Button>
          <div className="text-center">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-voro-surface border border-voro-border rounded px-4 py-2 text-white"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={() => handleDateChange(1)}>
            <ChevronRight size={18} />
          </Button>
        </Card>

        {/* Summary Rings */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 flex flex-col items-center justify-center">
            <Ring
              value={nutritionLog.totals.calories}
              max={calorieGoal}
              size={120}
              unit="kcal"
            />
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Protein</div>
              <div className="text-3xl font-bold text-voro-primary">{nutritionLog.totals.protein.toFixed(0)}g</div>
              <div className="text-xs text-gray-500">{user?.proteinGoal || 160}g goal</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Carbs</div>
              <div className="text-3xl font-bold text-voro-secondary">{nutritionLog.totals.carbs.toFixed(0)}g</div>
              <div className="text-xs text-gray-500">{user?.carbGoal || 225}g goal</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Fat</div>
              <div className="text-3xl font-bold text-voro-accent">{nutritionLog.totals.fat.toFixed(0)}g</div>
              <div className="text-xs text-gray-500">{user?.fatGoal || 65}g goal</div>
            </div>
          </Card>
        </div>

        {/* Meal Slots */}
        <div className="space-y-4 mb-6">
          {mealSlots.map((slot) => (
            <Card key={slot} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{slot}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {nutritionLog.meals[slot].reduce((sum, food) => sum + food.calories, 0)} kcal
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedSlot(slot);
                      setShowFoodSearch(true);
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {nutritionLog.meals[slot].length > 0 ? (
                <div className="space-y-2 mb-3">
                  {nutritionLog.meals[slot].map((food, idx) => (
                    <div key={food.id} className="flex items-center justify-between bg-voro-surface p-3 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm text-white">{food.name}</div>
                        <div className="text-xs text-gray-500">{food.portion}g | {food.calories} kcal | P:{food.protein}g C:{food.carbs}g F:{food.fat}g</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFood(slot, idx)}
                        className="text-danger hover:text-danger"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 py-2">No foods logged</div>
              )}
            </Card>
          ))}
        </div>

        {/* Water Tracker */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Water Intake</h3>
            <span className="text-sm text-gray-400">{nutritionLog.water} / {waterGoal} ml</span>
          </div>
          <div className="w-full bg-voro-border rounded-full h-2 mb-4">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all"
              style={{ width: `${Math.min((nutritionLog.water / waterGoal) * 100, 100)}%` }}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleWaterAdd(250)}>+250ml</Button>
            <Button size="sm" onClick={() => handleWaterAdd(500)}>+500ml</Button>
            <Button size="sm" onClick={() => handleWaterAdd(1000)}>+1L</Button>
          </div>
        </Card>

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-voro-card p-6 rounded-lg border border-voro-border max-w-2xl w-full max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Add Food</h2>
        
        {!selectedFood ? (
          <div className="space-y-4">
            <Input
              placeholder="Search foods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map(food => (
                <div
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className="p-3 bg-voro-surface border border-voro-border rounded-lg cursor-pointer hover:border-voro-primary transition-all"
                >
                  <div className="font-medium text-white">{food.name}</div>
                  <div className="text-xs text-gray-400">{food.calories} kcal | P:{food.protein}g C:{food.carbs}g F:{food.fat}g</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-voro-surface rounded-lg">
              <div className="font-bold text-white mb-2">{selectedFood.name}</div>
              <div className="text-sm text-gray-400">Per 100g:</div>
              <div className="text-sm text-gray-300">
                {selectedFood.calories} kcal | P:{selectedFood.protein}g | C:{selectedFood.carbs}g | F:{selectedFood.fat}g
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Portion (g)</label>
              <Input
                type="number"
                value={portion}
                onChange={(e) => setPortion(Number(e.target.value))}
                min="1"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setSelectedFood(null)}>Back</Button>
              <Button
                onClick={() => onSelectFood(selectedFood, portion)}
                className="flex-1"
              >
                Add Food
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FoodDiary;
