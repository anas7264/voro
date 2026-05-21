import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Heart } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { useStorage } from '@/hooks/useStorage';

const NutrientTracker = () => {
  const { getStorage, setStorage } = useStorage();
  const [selectedNutrient, setSelectedNutrient] = useState('vitamin_d');
  const [tracker, setTracker] = useState([]);

  useEffect(() => {
    document.title = 'VORO | Nutrient Tracker';
    const data = getStorage('voro_nutrient_tracker') || [];
    setTracker(data);
  }, []);

  const nutrients = [
    { id: 'vitamin_d', name: 'Vitamin D', unit: 'IU', dailyGoal: 2000, warning: 'Low levels linked to poor mood and immunity' },
    { id: 'iron', name: 'Iron', unit: 'mg', dailyGoal: 18, warning: 'Essential for oxygen transport' },
    { id: 'magnesium', name: 'Magnesium', unit: 'mg', dailyGoal: 420, warning: 'Critical for muscle recovery' },
    { id: 'zinc', name: 'Zinc', unit: 'mg', dailyGoal: 11, warning: 'Immune system support' },
    { id: 'b12', name: 'Vitamin B12', unit: 'mcg', dailyGoal: 2.4, warning: 'Energy metabolism' },
    { id: 'omega3', name: 'Omega-3', unit: 'g', dailyGoal: 1.1, warning: 'Anti-inflammatory benefits' },
  ];

  const currentNutrient = nutrients.find(n => n.id === selectedNutrient);

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Nutrient Tracker</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Nutrient Selector */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Select Nutrient</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {nutrients.map(nutrient => (
                  <button
                    key={nutrient.id}
                    onClick={() => setSelectedNutrient(nutrient.id)}
                    className={`p-3 rounded-lg font-medium transition ${
                      selectedNutrient === nutrient.id
                        ? 'bg-voro-primary text-white'
                        : 'bg-voro-surface text-gray-400 hover:text-white'
                    }`}
                  >
                    {nutrient.name}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Info Card */}
          {currentNutrient && (
            <Card className="p-6">
              <h4 className="text-lg font-bold text-white mb-2">{currentNutrient.name}</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-400">Daily Goal</div>
                  <div className="text-2xl font-bold text-voro-primary">{currentNutrient.dailyGoal} {currentNutrient.unit}</div>
                </div>
                <div className="text-sm text-yellow-400 flex items-start gap-2">
                  <Heart size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{currentNutrient.warning}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Log</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-voro-surface rounded-lg">
              <span className="text-white">Supplement intake logged</span>
              <Badge color="success">✓ 100%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-voro-surface rounded-lg">
              <span className="text-white">From food sources</span>
              <Badge color="warning">⚠ 60%</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NutrientTracker;
