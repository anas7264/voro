import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Plus, Heart, Zap, Target, RefreshCw } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Input from '@/components/Input';
import { useStorage } from '@/hooks/useStorage';
import { foods } from '@/data/foods';

const NutrientTracker = () => {
  const { storageData, updateItem } = useStorage();
  const [selectedNutrient, setSelectedNutrient] = useState('iron');
  const [supplementAmount, setSupplementAmount] = useState('');

  useEffect(() => {
    document.title = 'VORO | Nutrient Tracker';
  }, []);

  const nutrients = useMemo(() => [
    { id: 'iron', name: 'Iron', unit: 'mg', dailyGoal: 18, warning: 'Essential for oxygen transport', color: '#EF4444' },
    { id: 'calcium', name: 'Calcium', unit: 'mg', dailyGoal: 1000, warning: 'Critical for bone density and signaling', color: '#3B82F6' },
    { id: 'vitaminC', name: 'Vitamin C', unit: 'mg', dailyGoal: 90, warning: 'Potent antioxidant and immune support', color: '#10B981' },
    { id: 'potassium', name: 'Potassium', unit: 'mg', dailyGoal: 3400, warning: 'Maintains fluid balance and neural function', color: '#7C3AED' },
    { id: 'sodium', name: 'Sodium', unit: 'mg', dailyGoal: 2300, warning: 'Essential electrolyte for neural transmission', color: '#6B7280' },
    { id: 'vitamin_d', name: 'Vitamin D', unit: 'IU', dailyGoal: 2000, warning: 'Low levels linked to poor mood and immunity', color: '#F59E0B' },
  ], []);

  const tracker = useMemo(() => storageData['nutrient_tracker'] || {}, [storageData['nutrient_tracker']]);
  const currentNutrient = nutrients.find(n => n.id === selectedNutrient) || nutrients[0];

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Food Intake Calculation.
   * Derives micronutrient values from nutrition_log by mapping to the foods master list.
   * This provides a dynamic, real-time view of dietary nutrient absorption.
   */
  const foodIntake = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const log = storageData['nutrition_log']?.[today];
    if (!log || !log.meals) return 0;

    let total = 0;
    Object.values(log.meals).forEach(meal => {
      meal.forEach(entry => {
        const masterFood = foods.find(f => f.id === entry.foodId);
        if (masterFood && masterFood[currentNutrient.id]) {
          total += (masterFood[currentNutrient.id] * entry.portion) / 100;
        }
      });
    });
    return Math.round(total * 10) / 10;
  }, [storageData['nutrition_log'], currentNutrient.id]);

  const supplementIntake = useMemo(() => tracker[selectedNutrient]?.intake || 0, [tracker, selectedNutrient]);
  const totalIntake = foodIntake + supplementIntake;
  const progressPercentage = Math.min(Math.round((totalIntake / currentNutrient.dailyGoal) * 100), 100);

  const handleAddSupplement = useCallback(async () => {
    if (!supplementAmount || isNaN(supplementAmount)) return;
    const current = tracker[selectedNutrient] || { intake: 0 };
    await updateItem('nutrient_tracker', {
      [selectedNutrient]: {
        ...current,
        intake: (current.intake || 0) + Number(supplementAmount),
      }
    });
    setSupplementAmount('');
  }, [selectedNutrient, supplementAmount, tracker, updateItem]);

  const handleReset = useCallback(async () => {
    await updateItem('nutrient_tracker', {
      [selectedNutrient]: { intake: 0 }
    });
  }, [selectedNutrient, updateItem]);

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <header className="mb-12">
          <div className="flex items-center gap-3 text-voro-primary mb-2">
            <Heart size={18} />
            <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Micronutrient Matrix</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
            Nutritional <span className="text-voro-primary not-italic font-bold">Optimization</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Nutrient Selector */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <Target size={18} className="text-voro-primary" />
                <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white">Select Biological Marker</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {nutrients.map(nutrient => (
                  <button
                    key={nutrient.id}
                    onClick={() => setSelectedNutrient(nutrient.id)}
                    className={`p-6 rounded-2xl border transition-all text-left group ${
                      selectedNutrient === nutrient.id
                        ? 'bg-voro-primary/5 border-voro-primary ring-1 ring-voro-primary'
                        : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                    }`}
                  >
                    <p className={`text-[0.55rem] font-black uppercase tracking-widest mb-2 ${selectedNutrient === nutrient.id ? 'text-voro-primary' : 'text-gray-600'}`}>
                      {nutrient.unit} Marker
                    </p>
                    <p className={`text-sm font-bold tracking-tight uppercase ${selectedNutrient === nutrient.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {nutrient.name}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">Intake Statistics</h4>
                  <button onClick={handleReset} className="text-gray-600 hover:text-voro-primary transition-colors" title="Reset Supplement Intake">
                    <RefreshCw size={14} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white uppercase tracking-tight">Supplements</span>
                      <p className="text-[0.6rem] font-mono text-gray-600">{supplementIntake} {currentNutrient.unit}</p>
                    </div>
                    <Badge variant="voro-secondary">{Math.round((supplementIntake / currentNutrient.dailyGoal) * 100)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white uppercase tracking-tight">Dietary Sources</span>
                      <p className="text-[0.6rem] font-mono text-gray-600">{foodIntake} {currentNutrient.unit}</p>
                    </div>
                    <Badge variant="voro-accent">{Math.round((foodIntake / currentNutrient.dailyGoal) * 100)}%</Badge>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Input
                    type="number"
                    placeholder={`Log ${currentNutrient.unit}...`}
                    value={supplementAmount}
                    onChange={(e) => setSupplementAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddSupplement} className="px-4">
                    <Plus size={18} />
                  </Button>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-voro-primary/5 to-transparent border-white/5">
                <div className="flex items-center gap-3 mb-4 text-yellow-500">
                  <Heart size={16} />
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em]">Clinical Insight</span>
                </div>
                <p className="text-lg font-serif italic text-white leading-relaxed">
                  "{currentNutrient.warning}"
                </p>
              </Card>
            </div>
          </div>

          {/* Metric Card */}
          <div className="lg:col-span-4">
            <Card className="p-10 h-full flex flex-col justify-center bg-[#0A0C14] border-white/5 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-5">
                <Zap size={200} />
              </div>

              <div className="relative z-10 space-y-10 text-center">
                <div>
                  <p className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Metabolic Goal</p>
                  <div className="flex flex-col items-center">
                    <span className="text-7xl font-serif italic font-bold text-white leading-none">{currentNutrient.dailyGoal}</span>
                    <span className="text-xs font-mono font-bold text-voro-primary uppercase tracking-[0.4em] mt-4">{currentNutrient.unit} per cycle</span>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                  <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-widest mb-6">Synthesis Progress</p>
                  <div className="relative h-48 w-48 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke={currentNutrient.color}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        strokeDashoffset={`${2 * Math.PI * 80 * (1 - progressPercentage / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 8px ${currentNutrient.color}40)` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-serif italic font-bold text-white">{progressPercentage}%</span>
                      <span className="text-[0.5rem] font-black text-gray-600 uppercase tracking-widest">Absorbed</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutrientTracker;
