import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorage } from '@/hooks/useStorage';
import { foods } from '@/data/foods';

const SavedTrainingPlans = () => {
  const { getStorage } = useStorage();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    document.title = 'VORO | Saved Training Plans';
    const data = getStorage('voro_plans') || {};
    setPlans(data.savedTrainingPlans || []);
  }, []);

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Saved Training Plans</h1>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={18} />
            New Plan
          </Button>
        </div>

        {plans.length > 0 ? (
          <div className="space-y-4">
            {plans.map(plan => (
              <Card key={plan.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-400">
                      {plan.days}/week • {plan.level} • {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" className="text-danger">
                    <Trash2 size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🏋️</div>
            <h3 className="text-xl font-bold text-white mb-2">No training plans yet</h3>
            <p className="text-gray-400 mb-6">Generate your first AI training plan to get started</p>
            <Button>Create Training Plan</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedTrainingPlans;
