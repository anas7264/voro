import React, { useEffect, useState } from 'react';
import { Plus, Download } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorage } from '@/hooks/useStorage';

const SavedMealPlans = () => {
  const { getStorage } = useStorage();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    document.title = 'VORO | Saved Meal Plans';
    const data = getStorage('voro_plans') || {};
    setPlans(data.savedMealPlans || []);
  }, []);

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Saved Meal Plans</h1>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={18} />
            New Plan
          </Button>
        </div>

        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(plan => (
              <Card key={plan.id} className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-3">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-300 mb-4">
                  {plan.days?.length || 0} days • {plan.days?.reduce((sum, day) => sum + day.calories, 0) || 0} kcal avg
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">View</Button>
                  <Button variant="secondary" size="sm" className="flex items-center gap-1">
                    <Download size={14} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">No meal plans yet</h3>
            <p className="text-gray-400 mb-6">Generate your first AI meal plan to get started</p>
            <Button>Create Meal Plan</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedMealPlans;
