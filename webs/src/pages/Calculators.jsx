import React, { useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useCalculators } from '@/hooks/useCalculators';
import { useApp } from '@/hooks/useAppContext';

const Calculators = () => {
  const { 
    calculateBMI, 
    calculateBMR, 
    calculateTDEE, 
    calculateIdealWeight, 
    calculateFFMI 
  } = useCalculators();
  const { user } = useApp();
  const [active, setActive] = React.useState('bmi');

  useEffect(() => {
    document.title = 'VORO | Calculators';
  }, []);

  const calculators = [
    { id: 'bmi', name: 'BMI', icon: '📊' },
    { id: 'bmr', name: 'BMR', icon: '🔥' },
    { id: 'tdee', name: 'TDEE', icon: '⚡' },
    { id: 'ideal', name: 'Ideal Weight', icon: '🎯' },
    { id: 'ffmi', name: 'FFMI', icon: '💪' },
    { id: 'deficit', name: 'Deficit', icon: '📉' },
  ];

  const renderCalculator = () => {
    if (!user) return <div className="text-gray-400">Loading...</div>;

    switch (active) {
      case 'bmi':
        return (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">Weight: {user.currentWeight} kg</div>
              <div className="text-sm text-gray-400 mb-2">Height: {user.heightCm} cm</div>
              <div className="text-4xl font-bold text-voro-primary mt-4">
                {calculateBMI(user.currentWeight, user.heightCm / 100)?.toFixed(1)}
              </div>
              <div className="text-sm text-gray-400 mt-2">Classification: Normal</div>
            </div>
          </div>
        );
      case 'bmr':
        return (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-4">Mifflin-St Jeor Formula</div>
              <div className="text-4xl font-bold text-voro-primary">
                {calculateBMR({
                  weight: user.currentWeight,
                  height: user.heightCm,
                  age: user.age,
                  gender: user.gender
                })?.toFixed(0)} kcal/day
              </div>
              <div className="text-xs text-gray-500 mt-2">Calories at complete rest</div>
            </div>
          </div>
        );
      case 'tdee':
        return (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-4">Activity Level: {user.activityLevel}</div>
              <div className="text-4xl font-bold text-voro-secondary">
                {calculateTDEE(user.bmr || 1500, user.activityLevel || 'moderately_active')?.toFixed(0)} kcal/day
              </div>
              <div className="text-xs text-gray-500 mt-2">Daily calorie burn</div>
            </div>
          </div>
        );
      case 'ideal':
        return (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-4">Based on Devine Formula</div>
              <div className="text-4xl font-bold text-voro-accent">
                {calculateIdealWeight(user.heightCm, user.gender)?.toFixed(1)} kg
              </div>
              <div className="text-sm text-gray-400 mt-2">Range: ±10% for frame size</div>
            </div>
          </div>
        );
      case 'ffmi':
        return (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">Lean Body Mass FFMI</div>
              <div className="text-4xl font-bold text-voro-primary">
                {calculateFFMI(user.currentWeight, 20, user.heightCm)?.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 mt-2">Average: 18-21</div>
            </div>
          </div>
        );
      case 'deficit':
        return (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">Current TDEE: {user.tdee} kcal</div>
              <div className="text-sm text-gray-400 mb-4">500 kcal deficit daily</div>
              <div className="text-4xl font-bold text-orange-500">
                {(user.tdee - 500)?.toFixed(0)} kcal/day
              </div>
              <div className="text-sm text-gray-400 mt-2">≈ 0.5 kg loss per week</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Calculators</h1>

        {/* Calculator Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {calculators.map(calc => (
            <Button
              key={calc.id}
              variant={active === calc.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActive(calc.id)}
              className="flex items-center gap-2"
            >
              {calc.icon} {calc.name}
            </Button>
          ))}
        </div>

        {/* Calculator Display */}
        <Card className="p-8">
          {renderCalculator()}
        </Card>
      </div>
    </div>
  );
};

export default Calculators;
