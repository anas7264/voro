import React, { useEffect, useState } from 'react';
import { Share2, Download } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorage } from '@/hooks/useStorage';

const QuickLog = () => {
  const { getStorage, setStorage } = useStorage();
  const [activeTab, setActiveTab] = useState('food');
  const [logs, setLogs] = useState({ food: [], workout: [], water: [] });

  useEffect(() => {
    document.title = 'VORO | Quick Log';
    const data = getStorage('voro_quick_log') || {};
    setLogs(data);
  }, []);

  const tabs = [
    { id: 'food', label: '🍽️ Food', icon: '🍽️' },
    { id: 'workout', label: '💪 Workout', icon: '💪' },
    { id: 'water', label: '💧 Water', icon: '💧' },
  ];

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Quick Log</h1>

        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? 'bg-voro-primary text-white'
                  : 'bg-voro-elevated text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="p-6">
          {activeTab === 'food' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Food Log</h3>
              <div className="space-y-2 mb-4">
                <Button variant="secondary" className="w-full justify-start">🍗 Chicken Breast</Button>
                <Button variant="secondary" className="w-full justify-start">🍚 White Rice</Button>
                <Button variant="secondary" className="w-full justify-start">🥗 Mixed Vegetables</Button>
                <Button variant="secondary" className="w-full justify-start">🍎 Apple</Button>
              </div>
            </div>
          )}

          {activeTab === 'workout' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Workout Log</h3>
              <div className="space-y-2 mb-4">
                <Button variant="secondary" className="w-full justify-start">🏋️ Bench Press - 4x8</Button>
                <Button variant="secondary" className="w-full justify-start">🤸 Squats - 4x8</Button>
                <Button variant="secondary" className="w-full justify-start">🚴 Cardio - 30 min</Button>
                <Button variant="secondary" className="w-full justify-start">🧘 Yoga - 20 min</Button>
              </div>
            </div>
          )}

          {activeTab === 'water' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Water Log</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button className="flex flex-col items-center justify-center py-4">
                  <div className="text-2xl mb-1">+250ml</div>
                </Button>
                <Button className="flex flex-col items-center justify-center py-4">
                  <div className="text-2xl mb-1">+500ml</div>
                </Button>
                <Button className="flex flex-col items-center justify-center py-4">
                  <div className="text-2xl mb-1">+750ml</div>
                </Button>
                <Button className="flex flex-col items-center justify-center py-4">
                  <div className="text-2xl mb-1">+1L</div>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QuickLog;
