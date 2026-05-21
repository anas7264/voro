import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorage } from '@/hooks/useStorage';

const TrainingPlan = () => {
  const { getStorage, setStorage } = useStorage();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Training Plan Generator';
  }, []);

  const handleGeneratePlan = () => {
    const plan = {
      id: Date.now(),
      name: 'Custom Training Plan',
      duration: 12,
      level: 'intermediate',
      frequency: 4,
      focus: 'balanced',
      createdAt: new Date().toISOString(),
      days: [
        {
          day: 'Monday',
          type: 'Upper Body Push',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: '6-8', rest: 120 },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '8-10', rest: 90 },
            { name: 'Tricep Dips', sets: 3, reps: '8-12', rest: 90 },
          ]
        },
        {
          day: 'Tuesday',
          type: 'Lower Body Quad Focus',
          exercises: [
            { name: 'Barbell Squat', sets: 4, reps: '6-8', rest: 120 },
            { name: 'Leg Press', sets: 3, reps: '8-10', rest: 90 },
            { name: 'Leg Extensions', sets: 3, reps: '10-12', rest: 60 },
          ]
        },
      ]
    };
    const data = getStorage('voro_plans') || {};
    data.currentPlan = plan;
    setStorage('voro_plans', data);
    alert('Training plan generated successfully!');
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Training Plan Generator</h1>
          <Button onClick={handleGeneratePlan} className="flex items-center gap-2">
            <Plus size={18} />
            Generate Plan
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Customize Your Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Duration</label>
              <select className="w-full bg-voro-elevated text-white px-4 py-2 rounded border border-voro-border">
                <option>4 Weeks</option>
                <option>8 Weeks</option>
                <option>12 Weeks</option>
                <option>16 Weeks</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Level</label>
              <select className="w-full bg-voro-elevated text-white px-4 py-2 rounded border border-voro-border">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Frequency</label>
              <select className="w-full bg-voro-elevated text-white px-4 py-2 rounded border border-voro-border">
                <option>3 Days/Week</option>
                <option>4 Days/Week</option>
                <option>5 Days/Week</option>
                <option>6 Days/Week</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Focus</label>
              <select className="w-full bg-voro-elevated text-white px-4 py-2 rounded border border-voro-border">
                <option>Balanced</option>
                <option>Strength</option>
                <option>Hypertrophy</option>
                <option>Endurance</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Sample Weekly Schedule
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-voro-surface rounded-lg">
              <div className="font-semibold text-white">Monday - Upper Body Push</div>
              <div className="text-sm text-gray-400 mt-1">Bench Press, Incline Press, Tricep Dips</div>
            </div>
            <div className="p-4 bg-voro-surface rounded-lg">
              <div className="font-semibold text-white">Wednesday - Lower Body Quads</div>
              <div className="text-sm text-gray-400 mt-1">Squat, Leg Press, Leg Extensions</div>
            </div>
            <div className="p-4 bg-voro-surface rounded-lg">
              <div className="font-semibold text-white">Friday - Upper Body Pull</div>
              <div className="text-sm text-gray-400 mt-1">Pull-ups, Bent Rows, Barbell Rows</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrainingPlan;
