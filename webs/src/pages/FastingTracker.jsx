import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useStorage } from '@/hooks/useStorage';

const FastingTracker = () => {
  const { getStorage, setStorage } = useStorage();
  const [fastingWindow, setFastingWindow] = useState('16:8');
  const [startTime, setStartTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    document.title = 'VORO | Fasting Tracker';
    const data = getStorage('voro_fasting') || { window: '16:8' };
    setFastingWindow(data.window);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    setStartTime(new Date());
    setIsActive(true);
    setStorage('voro_fasting', { window: fastingWindow, started: new Date().toISOString() });
  };

  const handleReset = () => {
    setStartTime(null);
    setIsActive(false);
    setElapsed(0);
    setStorage('voro_fasting', { window: fastingWindow });
  };

  const [fastHours, breakHours] = fastingWindow.split(':').map(Number);
  const totalSeconds = (fastHours * 3600);
  const progress = Math.min(elapsed / totalSeconds * 100, 100);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Fasting Tracker</h1>

        <Card className="p-8 text-center mb-6">
          <div className="mb-6">
            <Select
              value={fastingWindow}
              onChange={(e) => {
                setFastingWindow(e.target.value);
                setStorage('voro_fasting', { window: e.target.value });
              }}
              className="max-w-xs mx-auto"
            >
              <option value="16:8">16:8 Intermittent Fasting</option>
              <option value="18:6">18:6 Extended Fasting</option>
              <option value="20:4">20:4 OMAD Light</option>
              <option value="23:1">23:1 One Meal a Day</option>
            </Select>
          </div>

          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#374151"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#7C3AED"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(2 * Math.PI * 56 * progress) / 100} ${2 * Math.PI * 56}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-white">
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-400">{progress.toFixed(0)}%</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={isActive ? () => setIsActive(false) : handleStart}
              className="flex items-center gap-2"
            >
              {isActive ? <Pause size={18} /> : <Play size={18} />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button variant="secondary" onClick={handleReset} className="flex items-center gap-2">
              <RotateCcw size={18} />
              Reset
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Fasting Window Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Fasting Duration</div>
              <div className="text-2xl font-bold text-voro-primary">{fastHours}h</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Eating Window</div>
              <div className="text-2xl font-bold text-voro-secondary">{breakHours}h</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FastingTracker;
