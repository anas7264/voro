import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react';
import { Play, Pause, RotateCcw, Clock, Zap, Target, Activity, ShieldCheck, Flame } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

const MetabolicChronometer = memo(({ progress, hours, minutes, seconds, isActive }) => {
  const ticks = useMemo(() => Array.from({ length: 60 }).map((_, i) => (
    <rect
      key={i}
      x="127.5"
      y="12"
      width="1"
      height={i % 5 === 0 ? "10" : "4"}
      fill={i % 5 === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}
      transform={`rotate(${i * 6}, 128, 128)`}
      className="transition-all duration-700"
    />
  )), []);

  return (
    <div className="relative w-80 h-80 mx-auto group">
      {/* Outer Glow Ring */}
      <div className={`absolute inset-[-10px] rounded-full transition-all duration-1000 blur-2xl opacity-20 ${isActive ? 'bg-voro-primary' : 'bg-transparent'}`} />

      {/* Background Glass Plate */}
      <div className="absolute inset-0 rounded-full bg-[#0A0C14]/60 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]" />

      {/* Metabolic Aura (Radial Pulse) */}
      <div className={`absolute inset-10 rounded-full transition-all duration-[2000ms] ease-in-out ${
        isActive
          ? "bg-gradient-radial from-voro-primary/10 via-voro-primary/5 to-transparent animate-pulse-slow opacity-100"
          : "opacity-0"
      }`} />

      <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 256 256">
        <defs>
          <linearGradient id="chrono-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Static Precision Ticks */}
        {ticks}

        {/* Track Ring */}
        <circle
          cx="128"
          cy="128"
          r="108"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          fill="none"
        />

        {/* Active Progress Ring */}
        <circle
          cx="128"
          cy="128"
          r="108"
          stroke="url(#chrono-grad)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 108}`}
          strokeDashoffset={`${2 * Math.PI * 108 * (1 - progress / 100)}`}
          strokeLinecap="round"
          className="transition-all duration-[1500ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          filter="url(#ring-glow)"
        />
      </svg>

      {/* Central Time Core */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <p className="text-[0.6rem] font-mono font-bold text-gray-500 uppercase tracking-[0.5em] mb-4">Metabolic Phase</p>

        <div className="flex items-baseline gap-1">
          <div className="text-6xl font-serif italic font-medium text-white tracking-tighter">
            {String(hours).padStart(2, '0')}
          </div>
          <div className="text-4xl font-serif italic font-light text-white/20">:</div>
          <div className="text-6xl font-serif italic font-medium text-white tracking-tighter">
            {String(minutes).padStart(2, '0')}
          </div>
          <div className="ml-2 w-8 text-xl font-mono font-bold text-voro-primary tabular-nums">
            {String(seconds).padStart(2, '0')}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
           <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-voro-primary animate-pulse' : 'bg-gray-700'}`} />
           <span className="text-[0.55rem] font-black text-gray-400 uppercase tracking-[0.3em]">
             {Math.round(progress)}% Potential Achieved
           </span>
        </div>
      </div>
    </div>
  );
});

const FastingTracker = () => {
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorageKey with useStorageKeySelector to subscribe only to
   * the 'fasting' state.
   */
  const fastingData = useStorageKeySelector(
    'fasting',
    useCallback((data) => data || { window: '16:8', started: null, status: 'idle' }, []),
  );

  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Fasting Tracker';
  }, []);

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

  const handlePause = () => {
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
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30">
      {/* Ambient background architectural lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-10 py-20">
        <header className="mb-20">
          <div className="flex items-center gap-4 text-voro-primary mb-4">
            <div className="p-2 bg-voro-primary/10 rounded-lg">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-500">Temporal Deprivation Matrix</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
            Metabolic <span className="text-voro-primary not-italic font-bold">Fasting</span>
          </h1>
          <p className="text-gray-600 font-mono text-[0.65rem] uppercase tracking-[0.3em] mt-4 max-w-xl leading-relaxed">
            Optimizing cellular longevity through controlled nutritional cycles and metabolic switching protocols.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            <Card className="p-16 flex flex-col items-center justify-center bg-gradient-to-b from-[#0D121F]/40 to-[#020408]/40 border-white/5 relative overflow-hidden group">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-white/[0.03] rounded-tl-[2rem]" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-white/[0.03] rounded-br-[2rem]" />

              <MetabolicChronometer
                progress={progress}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
                isActive={!isPaused && fastingData.status === 'active'}
              />

              <div className="mt-16 flex gap-6 w-full max-w-md relative z-20">
                {!fastingData.started || fastingData.status === 'idle' ? (
                  <Button
                    onClick={handleStart}
                    className="flex-1 py-8 shadow-2xl shadow-voro-primary/20 text-lg tracking-widest font-bold"
                  >
                    <Play size={20} className="mr-3 fill-current" />
                    INITIATE PROTOCOL
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handlePause}
                      variant="secondary"
                      className="flex-1 py-8 text-sm tracking-[0.2em] font-bold border-white/10"
                    >
                      {isPaused ? <Play size={18} className="mr-3 fill-current" /> : <Pause size={18} className="mr-3 fill-current" />}
                      {isPaused ? 'RESUME SEQUENCE' : 'PAUSE TEMPORALITY'}
                    </Button>
                    <button
                      onClick={handleReset}
                      className="p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-500"
                      aria-label="Reset metabolic cycle"
                    >
                      <RotateCcw size={20} />
                    </button>
                  </>
                )}
              </div>
            </Card>

            <section className="bg-[#0A0C14] border border-white/5 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-voro-primary/5 rounded-2xl">
                  <Target size={20} className="text-voro-primary" />
                </div>
                <div>
                  <h3 className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-gray-500 mb-1">Window Protocol</h3>
                  <p className="text-sm font-mono text-gray-400 tracking-widest uppercase">Select Metabolic Configuration</p>
                </div>
              </div>

              <div className="relative group">
                <Select
                  value={fastingData.window}
                  onChange={handleWindowChange}
                  className="w-full bg-[#020408]/60 border-white/10 h-20 pl-8 pr-12 rounded-2xl text-lg font-serif italic tracking-wide appearance-none focus:ring-voro-primary/20"
                >
                  <option value="16:8">16:8 — Intermittent Efficiency</option>
                  <option value="18:6">18:6 — Advanced Autophagy</option>
                  <option value="20:4">20:4 — Warrior Adaptation</option>
                  <option value="23:1">23:1 — OMAD Peak Performance</option>
                </Select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                   <Activity size={18} />
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-10">
            {/* Cycle Composition Card */}
            <Card className="p-12 bg-gradient-to-br from-[#0D121F]/40 to-[#020408]/20 border-white/10 flex flex-col justify-between min-h-[360px]">
              <div className="flex items-center justify-between mb-12">
                <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.5em]">Cycle Composition</p>
                <ShieldCheck size={16} className="text-voro-secondary opacity-50" />
              </div>

              <div className="space-y-12">
                <div className="group">
                  <div className="text-[0.6rem] font-mono font-bold text-voro-primary uppercase tracking-[0.3em] mb-3 group-hover:translate-x-1 transition-transform">Deprivation Phase</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-serif italic font-medium text-white">{fastHours}</span>
                    <span className="text-sm font-mono text-gray-600 uppercase tracking-widest">Hours</span>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent" />

                <div className="group">
                  <div className="text-[0.6rem] font-mono font-bold text-voro-secondary uppercase tracking-[0.3em] mb-3 group-hover:translate-x-1 transition-transform">Synthesis Phase</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-serif italic font-medium text-white">{breakHours}</span>
                    <span className="text-sm font-mono text-gray-600 uppercase tracking-widest">Hours</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <Flame size={14} className="text-orange-500" />
                <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest leading-relaxed">
                  Fuel source shifting to <span className="text-white">lipid oxidation</span>
                </p>
              </div>
            </Card>

            {/* Phase Insight Card */}
            <Card className="p-12 border-dashed border-white/10 bg-transparent flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                <h4 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400">Biological Insight</h4>
              </div>

              <p className="text-lg font-serif italic text-gray-300 leading-relaxed indent-8">
                {progress < 25 ? "Initial glucose depletion. Insulin levels beginning to stabilize, signaling the shift to endogenous energy utilization." :
                 progress < 50 ? "Liver glycogen stores decreasing. Fatty acid mobilization increasing as the system enters early metabolic transition." :
                 progress < 75 ? "Metabolic switch to ketosis imminent. Autophagy processes accelerating, prioritizing cellular component recycling." :
                 "Deep ketosis achieved. Growth hormone levels optimized for cellular repair and neuro-protective factor synthesis."}
              </p>

              <div className="mt-auto pt-8 border-t border-white/5">
                 <p className="text-[0.5rem] font-mono text-gray-600 uppercase tracking-[0.4em]">Chronological metabolic analysis — VORO V1.0</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastingTracker;
