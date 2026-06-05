import React, { useEffect, useMemo } from 'react';
import { Calendar, Plus } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorage } from '@/hooks/useStorage';

const MealPrepPlanner = () => {
  const { storageData } = useStorage();

  useEffect(() => {
    document.title = 'VORO | Meal Prep Planner';
  }, []);

  // Synchronous derivation of prep plan from StorageContext
  const prepPlan = useMemo(() => {
    const data = storageData['meal_prep'] || {};
    return data.plan || [];
  }, [storageData]);

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Meal Prep Planner</h1>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Create Prep Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample Prep Schedule */}
          {[1, 2, 3, 4].map(day => (
            <Card key={day} className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Prep Session {day}
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Day: Sunday</div>
                  <div className="text-sm text-gray-400 mb-2">Duration: 2 hours</div>
                  <div className="text-sm text-gray-400 mb-2">Meals: 20 containers</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-white font-semibold mb-2">Recipes to Prep:</div>
                  <div className="text-xs text-gray-400">- Chicken & Rice</div>
                  <div className="text-xs text-gray-400">- Salmon & Vegetables</div>
                  <div className="text-xs text-gray-400">- Ground Turkey & Sweet Potato</div>
                </div>
                <Button variant="secondary" className="w-full mt-4">View Details</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Shopping List Preview */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Shopping List</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="w-4 h-4" />
              <span>3 kg Chicken Breast</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="w-4 h-4" />
              <span>2 kg Salmon Fillet</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="w-4 h-4" />
              <span>5 kg Rice</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="w-4 h-4" />
              <span>2 kg Sweet Potato</span>
            </div>
          </div>
          <Button className="w-full mt-4">View Full Shopping List</Button>
        </Card>
      </div>
    </div>
  );
};

export default MealPrepPlanner;
