import React, { useState, useCallback } from 'react';
import { Zap, Download, Save } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useAppContext as useApp } from '@/hooks/useAppContext';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static mock data.
 * Prevents redundant object instantiation on every component render.
 */
const MOCK_MEALS = [
  { breakfast: 'Eggs with toast & hummus (480 kcal)', lunch: 'Chicken shawarma plate (650 kcal)', dinner: 'Grilled fish with rice (520 kcal)' },
  { breakfast: 'Oatmeal with almonds (420 kcal)', lunch: 'Falafel wrap (580 kcal)', dinner: 'Lamb kofta with salad (610 kcal)' },
  { breakfast: 'Shakshuka (520 kcal)', lunch: 'Freekeh soup with bread (480 kcal)', dinner: 'Grilled chicken with vegetables (550 kcal)' },
  { breakfast: 'Labneh plate (390 kcal)', lunch: 'Maqluba (690 kcal)', dinner: 'Fish with couscous (520 kcal)' },
  { breakfast: 'Pancakes with berries (510 kcal)', lunch: 'Tabbouleh salad bowl (450 kcal)', dinner: 'Lamb stew (580 kcal)' },
  { breakfast: 'Avocado toast (480 kcal)', lunch: 'Chickpea salad (420 kcal)', dinner: 'Roasted vegetables with tofu (490 kcal)' },
  { breakfast: 'Smoothie bowl (520 kcal)', lunch: 'Grilled chicken wrap (560 kcal)', dinner: 'Pasta with tomato sauce (520 kcal)' },
];

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted generation logic.
 */
const generateMockMealPlan = (duration) => {
  const daysCount = parseInt(duration) || 1;
  return MOCK_MEALS.slice(0, daysCount).map((day, idx) => ({
    day: idx + 1,
    ...day,
    calories: 1650,
    protein: 165,
    carbs: 185,
    fat: 55,
  }));
};

const MealPlanner = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey for specific data and
   * useStorageMethods for stable action references.
   */
  const plans = useStorageKey('plans') || {};
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const { user } = useApp();

  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [formData, setFormData] = useState({
    duration: '1 week',
    notes: '',
    budget: 'Moderate',
  });

  const generatePlan = useCallback(async () => {
    setLoading(true);

    // Simulate API call - in production would call Claude API
    setTimeout(() => {
      const plan = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        duration: formData.duration,
        days: generateMockMealPlan(formData.duration),
        totalCalories: 0,
      };
      setMealPlan(plan);
      setLoading(false);
      addNotification('Metabolic blueprint synthesized', 'success');
    }, 1500);
  }, [formData.duration, addNotification]);

  const savePlan = useCallback(async () => {
    if (!mealPlan) return;

    /**
     * ⚡ OPTIMISTIC UI: Immediate feedback while storage persists.
     */
    addNotification('Plan archived in repository', 'success');

    const allSavedPlans = plans.savedMealPlans || [];
    const updatedPlans = [
      ...allSavedPlans,
      {
        ...mealPlan,
        name: `Meal Plan ${new Date().toLocaleDateString()}`
      }
    ];

    await setItem('plans', { ...plans, savedMealPlans: updatedPlans });
  }, [plans, mealPlan, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 font-serif italic">AI Meal Planner</h1>

        {!mealPlan ? (
          <Card className="p-8 bg-[#0A0C14] border-white/5">
            <div className="space-y-6">
              <Select
                label="Duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                options={[
                  { value: '1 day', label: '1 Day' },
                  { value: '3 days', label: '3 Days' },
                  { value: '1 week', label: '1 Week' },
                  { value: '2 weeks', label: '2 Weeks' },
                ]}
              />

              <Select
                label="Budget Level"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                options={[
                  { value: 'Budget-friendly', label: 'Budget-friendly' },
                  { value: 'Moderate', label: 'Moderate' },
                  { value: 'Premium', label: 'Premium' },
                ]}
              />

              <Textarea
                label="Special Notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any preferences, foods to include/avoid..."
                rows={4}
              />

              <Button
                onClick={generatePlan}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-6 shadow-xl shadow-voro-primary/10"
              >
                <Zap size={18} />
                {loading ? 'Synthesizing Plan...' : 'Generate Plan'}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setMealPlan(null)} className="!rounded-xl px-6">← Back</Button>
              <Button onClick={savePlan} className="flex items-center gap-2 !rounded-xl px-8 shadow-lg shadow-voro-primary/20">
                <Save size={18} />
                Save Plan
              </Button>
              <Button variant="secondary" className="flex items-center gap-2 !rounded-xl px-6">
                <Download size={18} />
                Export PDF
              </Button>
            </div>

            {mealPlan.days.map((day) => (
              <Card key={day.day} className="p-8 bg-[#0A0C14] border-white/5 group hover:border-voro-primary/20 transition-all duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-serif italic font-medium text-white tracking-tight">Day {day.day}</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-voro-primary/10 rounded-full border border-voro-primary/20">
                     <div className="w-1 h-1 rounded-full bg-voro-primary animate-pulse" />
                     <span className="text-[0.6rem] font-black text-voro-primary uppercase tracking-widest">Calculated</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="space-y-1">
                    <p className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">Breakfast</p>
                    <p className="text-white font-medium">{day.breakfast}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">Lunch</p>
                    <p className="text-white font-medium">{day.lunch}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">Dinner</p>
                    <p className="text-white font-medium">{day.dinner}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[0.55rem] font-black text-gray-700 uppercase tracking-widest">Calories</span>
                    <p className="text-white font-mono font-bold">{day.calories} <span className="text-[0.6rem] text-gray-600">kcal</span></p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[0.55rem] font-black text-gray-700 uppercase tracking-widest">Protein</span>
                    <p className="text-voro-primary font-mono font-bold">{day.protein}g</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[0.55rem] font-black text-gray-700 uppercase tracking-widest">Carbs</span>
                    <p className="text-voro-secondary font-mono font-bold">{day.carbs}g</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[0.55rem] font-black text-gray-700 uppercase tracking-widest">Fat</span>
                    <p className="text-voro-accent font-mono font-bold">{day.fat}g</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
