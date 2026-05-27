import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateVitals } from '@/utils/validators';

const VitalsTracker = () => {
  const { getStorage, setStorage } = useStorage();
  const { addNotification } = useNotifications();
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    sleep: 7,
    mood: 8,
    energy: 8,
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    document.title = 'VORO | Vitals Tracker';
    const data = getStorage('voro_vitals') || [];
    setHistory(data);
  }, []);

  const handleSaveVitals = () => {
    // Security: Validate vitals before persisting to storage
    const { valid, errors } = validateVitals(vitals);

    if (!valid) {
      const errorMsg = Object.values(errors).join('. ');
      addNotification(`Validation failed: ${errorMsg}`, 'error');
      return;
    }

    const entry = {
      date: new Date().toISOString(),
      ...vitals,
    };
    const updated = [...history, entry];
    setHistory(updated);
    setStorage('voro_vitals', updated);
    addNotification('Vitals recorded successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Vitals Tracker</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Log Today's Vitals</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Heart Rate (bpm)</label>
                  <Input
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Blood Pressure (mmHg)</label>
                  <Input
                    value={vitals.bloodPressure}
                    onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Sleep (hours)</label>
                  <Input
                    type="number"
                    value={vitals.sleep}
                    onChange={(e) => setVitals({ ...vitals, sleep: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Mood (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={vitals.mood}
                    onChange={(e) => setVitals({ ...vitals, mood: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-white font-bold">{vitals.mood}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Energy (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={vitals.energy}
                    onChange={(e) => setVitals({ ...vitals, energy: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-white font-bold">{vitals.energy}</div>
                </div>
                <Button onClick={handleSaveVitals} className="w-full">
                  Record Vitals
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="p-6 text-center">
              <div className="text-3xl mb-2">❤️</div>
              <div className="text-sm text-gray-400">Heart Rate</div>
              <div className="text-3xl font-bold text-danger">{vitals.heartRate}</div>
              <div className="text-xs text-gray-500 mt-1">bpm</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl mb-2">😴</div>
              <div className="text-sm text-gray-400">Sleep</div>
              <div className="text-3xl font-bold text-blue-400">{vitals.sleep}h</div>
              <div className="text-xs text-gray-500 mt-1">last night</div>
            </Card>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Recent History
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.slice(-10).reverse().map((entry, idx) => (
                <div key={idx} className="p-3 bg-voro-surface rounded-lg text-sm">
                  <div className="text-gray-400">{new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="text-white mt-1">❤️ {entry.heartRate} bpm • 😴 {entry.sleep}h • Mood: {entry.mood}/10 • Energy: {entry.energy}/10</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VitalsTracker;
