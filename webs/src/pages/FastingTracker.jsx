import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Zap, Target } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

const FastingTracker = () => {
  const { getItem, setItem } = useStorage();
  const { addNotification } = useNotifications();
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Fasting Tracker';
  }, []);

  const fastingData = useMemo(() => {
    return getItem('fasting') || { window: '16:8', started: null, status: 'idle' };
  }, [getItem]);

  const [fastHours, breakHours] = fastingData.window.split(':').map(Number);
  const totalSeconds = fastHours * 3600;

  useEffect(() => {
    if (fastingData.started && fastingData.status === 'active') {
      const start = new Date(fastingData.started).getTime();
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      setElapsed(diff);
      setIsPaused(false);
    } else {
      setElapsed(0);
      setIsPaused(true);
    }
  }, [fastingData]);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  const handleStart = async () => {
    const now = new Date().toISOString();
    await setItem('fasting', { ...fastingData, started: now, status: 'active' });
    addNotification('Metabolic transition initiated. Autophagy sequence started.', 'success');
  };

  const handlePause = async () => {
    // For simplicity in this optimization, we just toggle local state
    // but in a real app we'd save the elapsed time to storage
    setIsPaused(!isPaused);
  };

  const handleReset = async () => {
    await setItem('fasting', { ...fastingData, started: null, status: 'idle' });
    setElapsed(0);
    setIsPaused(true);
    addNotification('Fasting cycle reset.', 'info');
  };

  const handleWindowChange = async (e) => {
    const newWindow = e.target.value;
    await setItem('fasting', { ...fastingData, window: newWindow });
  };

  const progress = Math.min((elapsed / totalSeconds) * 100, 100);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <header className="mb-12">
          <div className="flex items-center gap-3 text-voro-primary mb-2">
            <Clock size={18} />
            <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Temporal Deprivation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
            Metabolic <span className="text-voro-primary not-italic font-bold">Fasting</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-6">
            <Card className="p-12 flex flex-col items-center justify-center bg-gradient-to-b from-[#0A0C14] to-black border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 p-8 opacity-5">
                <Zap size={120} />
              </div>

              <div className="relative mb-12">
                <svg className="w-64 h-64 transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="#7C3AED"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 110}`}
                    strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(124, 58, 237, 0.4))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[0.6rem] font-black text-gray-600 uppercase tracking-[0.4em] mb-2">Elapsed</p>
                  <div className="text-5xl font-mono font-bold text-white tracking-tighter">
                    {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}<span className="text-xl text-gray-500">:{String(seconds).padStart(2, '0')}</span>
                  </div>
                  <div className="mt-4 px-3 py-1 rounded-full bg-voro-primary/10 border border-voro-primary/20 text-[0.55rem] font-black text-voro-primary uppercase tracking-widest">
                    {Math.round(progress)}% Optimized
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-sm">
                {!fastingData.started || fastingData.status === 'idle' ? (
                  <Button onClick={handleStart} className="flex-1 py-6 shadow-xl shadow-voro-primary/20">
                    <Play size={18} className="mr-2" />
                    Initiate Fast
                  </Button>
                ) : (
                  <>
                    <Button onClick={handlePause} variant="secondary" className="flex-1 py-6">
                      {isPaused ? <Play size={18} className="mr-2" /> : <Pause size={18} className="mr-2" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button onClick={handleReset} variant="ghost" className="p-6 text-gray-500 hover:text-white">
                      <RotateCcw size={18} />
                    </Button>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target size={18} className="text-voro-primary" />
                <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white">Window Protocol</h3>
              </div>
              <Select
                value={fastingData.window}
                onChange={handleWindowChange}
                className="w-full bg-[#080B14] border-white/5"
              >
                <option value="16:8">16:8 Intermittent Protocol</option>
                <option value="18:6">18:6 Extended Protocol</option>
                <option value="20:4">20:4 Warrior Protocol</option>
                <option value="23:1">23:1 OMAD Protocol</option>
              </Select>
            </Card>
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card className="p-8 bg-gradient-to-br from-[#0A0C14] to-black border-white/5">
              <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Cycle Composition</p>
              <div className="space-y-8">
                <div>
                  <div className="text-[0.55rem] font-black text-voro-primary uppercase tracking-widest mb-1">Deprivation Phase</div>
                  <div className="text-3xl font-serif italic font-bold text-white">{fastHours} Hours</div>
                </div>
                <div className="w-full h-px bg-white/5" />
                <div>
                  <div className="text-[0.55rem] font-black text-voro-secondary uppercase tracking-widest mb-1">Synthesis Phase</div>
                  <div className="text-3xl font-serif italic font-bold text-white">{breakHours} Hours</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-dashed border-white/5 bg-transparent">
              <h4 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Phase Insight</h4>
              <p className="text-sm font-serif italic text-gray-400 leading-relaxed">
                {progress < 25 ? "Initial glucose depletion. Insulin levels beginning to stabilize." :
                 progress < 50 ? "Liver glycogen stores decreasing. Fatty acid mobilization increasing." :
                 progress < 75 ? "Metabolic switch to ketosis imminent. Autophagy processes accelerating." :
                 "Deep ketosis achieved. Growth hormone levels optimized for cellular repair."}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastingTracker;
