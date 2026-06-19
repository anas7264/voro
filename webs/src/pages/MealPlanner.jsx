import React, { useState } from 'react';
import { Zap, Download, Save } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';
import { useStorage } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';

const MealPlanner = () => {
  const { getItem, setItem } = useStorage();
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [formData, setFormData] = useState({
    duration: '1 week',
    notes: '',
    budget: 'Moderate',
  });

  const generatePlan = async () => {
    setLoading(true);

    // Simulate API call - in production would call Claude API
    setTimeout(() => {
      const plan = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        duration: formData.duration,
        days: generateMockMealPlan(),
        totalCalories: 0,
      };
      setMealPlan(plan);
      setLoading(false);
    }, 1500);
  };

  const generateMockMealPlan = () => {
    const mockMeals = [
      { breakfast: 'Eggs with toast & hummus (480 kcal)', lunch: 'Chicken shawarma plate (650 kcal)', dinner: 'Grilled fish with rice (520 kcal)' },
      { breakfast: 'Oatmeal with almonds (420 kcal)', lunch: 'Falafel wrap (580 kcal)', dinner: 'Lamb kofta with salad (610 kcal)' },
      { breakfast: 'Shakshuka (520 kcal)', lunch: 'Freekeh soup with bread (480 kcal)', dinner: 'Grilled chicken with vegetables (550 kcal)' },
      { breakfast: 'Labneh plate (390 kcal)', lunch: 'Maqluba (690 kcal)', dinner: 'Fish with couscous (520 kcal)' },
      { breakfast: 'Pancakes with berries (510 kcal)', lunch: 'Tabbouleh salad bowl (450 kcal)', dinner: 'Lamb stew (580 kcal)' },
      { breakfast: 'Avocado toast (480 kcal)', lunch: 'Chickpea salad (420 kcal)', dinner: 'Roasted vegetables with tofu (490 kcal)' },
      { breakfast: 'Smoothie bowl (520 kcal)', lunch: 'Grilled chicken wrap (560 kcal)', dinner: 'Pasta with tomato sauce (520 kcal)' },
    ];

    return mockMeals.slice(0, parseInt(formData.duration) || 1).map((day, idx) => ({
      day: idx + 1,
      ...day,
      calories: 1650,
      protein: 165,
      carbs: 185,
      fat: 55,
    }));
  };

  const savePlan = async () => {
    const plans = getItem('plans') || {};
    const allPlans = plans.savedMealPlans || [];
    allPlans.push({
      ...mealPlan,
      name: `Meal Plan ${new Date().toLocaleDateString()}`
    });
    await setItem('plans', { ...plans, savedMealPlans: allPlans });
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">AI Meal Planner</h1>

        {!mealPlan ? (
          <Card className="p-8">
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
                className="w-full flex items-center justify-center gap-2"
              >
                <Zap size={18} />
                {loading ? 'Generating Plan...' : 'Generate Plan'}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-2">
              <Button onClick={() => setMealPlan(null)}>← Back</Button>
              <Button variant="secondary" onClick={savePlan} className="flex items-center gap-2">
                <Save size={18} />
                Save Plan
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <Download size={18} />
                Export PDF
              </Button>
            </div>

            {mealPlan.days.map((day) => (
              <Card key={day.day} className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Day {day.day}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Breakfast</p>
                    <p className="text-white">{day.breakfast}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Lunch</p>
                    <p className="text-white">{day.lunch}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Dinner</p>
                    <p className="text-white">{day.dinner}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Calories:</span>
                    <span className="text-white ml-2">{day.calories} kcal</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Protein:</span>
                    <span className="text-voro-primary ml-2">{day.protein}g</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Carbs:</span>
                    <span className="text-voro-secondary ml-2">{day.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Fat:</span>
                    <span className="text-voro-accent ml-2">{day.fat}g</span>
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
