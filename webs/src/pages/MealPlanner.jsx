import React, { useState, useCallback, useEffect } from 'react';
import { Zap, Download, Save, Layout, ChevronLeft, Activity } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';
import { useNotifications } from '@/hooks/useNotifications';

const MealPlanner = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey('plans') for specific data
   * and useStorageMethods for stable action references.
   * ESTIMATED IMPACT: Eliminates redundant re-renders and O(N) mount-time syncs.
   */
  const plansData = useStorageKey('plans') || {};
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

  useEffect(() => {
    document.title = 'VORO | AI Meal Planner';
  }, []);

  const generatePlan = useCallback(async () => {
    setLoading(true);

    // Simulate AI synthesis sequence
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
      addNotification('Nutritional matrix synthesized.', 'success');
    }, 1500);
  }, [formData.duration, addNotification]);

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

    const daysCount = parseInt(formData.duration) || 1;
    return mockMeals.slice(0, daysCount).map((day, idx) => ({
      day: idx + 1,
      ...day,
      calories: 1650,
      protein: 165,
      carbs: 185,
      fat: 55,
    }));
  };

  const savePlan = useCallback(async () => {
    const savedMealPlans = plansData.savedMealPlans || [];
    const updatedPlans = {
      ...plansData,
      savedMealPlans: [
        ...savedMealPlans,
        {
          ...mealPlan,
          name: `Matrix ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        }
      ]
    };
    await setItem('plans', updatedPlans);
    addNotification('Meal plan archived in memory', 'success');
  }, [mealPlan, plansData, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Ambient Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-16">
          <div className="flex items-center gap-3 text-voro-primary mb-4">
            <Layout size={18} />
            <span className="text-[0.6rem] font-mono font-bold uppercase tracking-[0.4em]">Nutritional Logic Synthesis</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
            AI Meal <span className="text-voro-primary not-italic font-bold">Planner</span>
          </h1>
        </header>

        {!mealPlan ? (
          <Card className="p-10 bg-[#0A0C14] border-white/5 shadow-2xl space-y-12 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Select
                label="Temporal Duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="bg-white/[0.02] border-white/10"
                options={[
                  { value: '1 day', label: '1 Day' },
                  { value: '3 days', label: '3 Days' },
                  { value: '1 week', label: '1 Week' },
                  { value: '2 weeks', label: '2 Weeks' },
                ]}
              />

              <Select
                label="Economic Flux (Budget)"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                className="bg-white/[0.02] border-white/10"
                options={[
                  { value: 'Budget-friendly', label: 'Budget-friendly' },
                  { value: 'Moderate', label: 'Moderate' },
                  { value: 'Premium', label: 'Premium' },
                ]}
              />
            </div>

            <Textarea
              label="Bespoke Parameters (Special Notes)"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Preferences, biological constraints, fuel unit exclusions..."
              rows={4}
              className="bg-white/[0.02] border-white/10 italic font-serif"
            />

            <Button
              onClick={generatePlan}
              disabled={loading}
              className="w-full h-20 shadow-2xl shadow-voro-primary/20 text-lg tracking-[0.3em] font-black"
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <Activity size={20} className="animate-pulse" />
                  <span>SYNTHESIZING...</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Zap size={20} />
                  <span>INITIALIZE SYNTHESIS</span>
                </div>
              )}
            </Button>
          </Card>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-wrap gap-4 mb-10">
              <Button onClick={() => setMealPlan(null)} variant="secondary" className="px-8 border-white/10">
                <ChevronLeft size={18} className="mr-2" />
                Abort
              </Button>
              <Button onClick={savePlan} className="px-10 shadow-lg shadow-voro-primary/20">
                <Save size={18} className="mr-3" />
                Archive Plan
              </Button>
              <Button variant="secondary" className="px-8 border-white/10 ml-auto">
                <Download size={18} />
              </Button>
            </div>

            <div className="space-y-6">
              {mealPlan.days.map((day) => (
                <Card key={day.day} className="p-8 bg-[#0A0C14] border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-2xl font-serif italic font-bold text-white tracking-tight group-hover:text-voro-primary transition-colors">Day {day.day}</h3>
                     <div className="h-px flex-1 mx-8 bg-white/5" />
                     <span className="text-[0.6rem] font-mono text-gray-700 uppercase tracking-widest">Temporal Frame {day.day}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {[
                      { l: 'Breakfast', v: day.breakfast },
                      { l: 'Lunch', v: day.lunch },
                      { l: 'Dinner', v: day.dinner }
                    ].map(m => (
                      <div key={m.l} className="space-y-3">
                        <p className="text-[0.55rem] font-black text-voro-primary uppercase tracking-[0.3em]">{m.l}</p>
                        <p className="text-white font-serif italic text-lg leading-snug">{m.v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/5">
                    {[
                      { l: 'Energy', v: day.calories, u: 'kcal', c: 'text-white' },
                      { l: 'Protein', v: day.protein, u: 'g', c: 'text-voro-primary' },
                      { l: 'Carbs', v: day.carbs, u: 'g', c: 'text-voro-secondary' },
                      { l: 'Fat', v: day.fat, u: 'g', c: 'text-voro-accent' }
                    ].map(s => (
                      <div key={s.l}>
                        <span className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest block mb-1">{s.l}</span>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-xl font-mono font-bold ${s.c}`}>{s.v}</span>
                          <span className="text-[0.55rem] font-mono text-gray-800">{s.u}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
