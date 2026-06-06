import React, { useState, useEffect, useMemo, memo } from 'react';
import { Plus, Droplet, Trash2, TrendingUp, ChevronLeft, ChevronRight, Target, Zap, Waves } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateWaterEntry } from '@/utils/validators';
import Button from '@/components/Button';
import LineChartComponent from '@/components/LineChartComponent';

const HydroVessel = memo(({ percentage }) => {
  return (
    <div className="relative w-48 h-80 mx-auto group">
      {/* Outer Glass Rim */}
      <div className="absolute inset-[-4px] rounded-[3rem] border border-white/5 opacity-50" />

      {/* The Vessel */}
      <div className="relative w-full h-full rounded-[2.5rem] border-2 border-white/10 bg-[#0D121F]/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-900/20">
        {/* Dynamic Water Body */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ transform: `translateY(${100 - percentage}%)` }}
        >
          {/* Surface Waves */}
          <div className="absolute top-0 left-0 w-[200%] h-20 -translate-y-[15px] pointer-events-none">
            <svg className="absolute inset-0 animate-wave-slow opacity-60" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="url(#water-grad)" />
            </svg>
            <svg className="absolute inset-0 animate-wave translate-x-[-100px]" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="url(#water-grad)" fillOpacity="0.4" />
            </svg>
          </div>

          {/* Liquid Mass */}
          <div className="absolute top-[20px] left-0 w-full h-[1000px] bg-gradient-to-b from-blue-600/40 via-blue-800/20 to-blue-950/40" />

          <svg className="hidden">
            <defs>
              <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Internal Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none" />

        {/* Glass Reflection */}
        <div className="absolute top-8 left-6 w-1 h-3/4 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[1px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-4 h-4 bg-white/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Measurement Matrix */}
      <div className="absolute left-[-40px] inset-y-10 flex flex-col justify-between items-end py-4">
        {[2000, 1500, 1000, 500].map(val => (
          <div key={val} className="flex items-center gap-3">
             <span className="text-[0.5rem] font-mono font-medium text-gray-700 tracking-tighter">{val}ml</span>
             <div className="w-2 h-[1px] bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
});

const WaterTracker = () => {
  const { getItem, setItem } = useStorage();
  const { addNotification } = useNotifications();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const dailyGoal = 2000;

  useEffect(() => {
    document.title = 'VORO | Water Tracker';
  }, []);

  const dailyLogs = useMemo(() => {
    const logs = getItem('water_log') || {};
    return logs[date] || [];
  }, [getItem, date]);

  const waterHistory = useMemo(() => {
    const all = getItem('water_history') || {};
    return Object.entries(all)
      .slice(-30)
      .map(([d, amount]) => ({
        date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        water: amount,
      }));
  }, [getItem]);

  const todayTotal = useMemo(() => {
    return dailyLogs.reduce((sum, log) => sum + (log.amount || 0), 0);
  }, [dailyLogs]);

  const addWater = async (amount) => {
    const { valid, errors } = validateWaterEntry({ amount, date });

    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const newLog = {
      id: `${Date.now()}`,
      amount,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    const logs = getItem('water_log') || {};
    const updatedLogs = [...(logs[date] || []), newLog];

    const history = getItem('water_history') || {};
    const newTotal = (history[date] || 0) + amount;

    await setItem('water_log', { ...logs, [date]: updatedLogs });
    await setItem('water_history', { ...history, [date]: newTotal });

    if (newTotal >= dailyGoal && (newTotal - amount) < dailyGoal) {
      addNotification('Hydration threshold achieved. Cellular homeostasis optimized.', 'success');
    }
  };

  const deleteLog = async (id) => {
    const logs = getItem('water_log') || {};
    const currentLogs = logs[date] || [];
    const logToDelete = currentLogs.find(l => l.id === id);
    if (!logToDelete) return;

    const updatedLogs = currentLogs.filter(log => log.id !== id);
    const history = getItem('water_history') || {};
    const newTotal = Math.max(0, (history[date] || 0) - logToDelete.amount);

    await setItem('water_log', { ...logs, [date]: updatedLogs });
    await setItem('water_history', { ...history, [date]: newTotal });
  };

  const handleDateChange = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split('T')[0]);
  };

  const percentage = Math.min((todayTotal / dailyGoal) * 100, 100);
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-blue-500/30">
      {/* Ambient Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500">
              <Droplet size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.4em]">Molecular Resonance</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
              Hydration <span className="text-blue-600 not-italic font-bold">Dynamics</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-xs uppercase opacity-60">Cellular homeostasis & fluid optimization matrix</p>
          </div>

          <div className="flex items-center gap-6 bg-[#0A0C14] border border-white/5 rounded-[2rem] p-3 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-4 hover:bg-white/5 rounded-2xl text-gray-600 hover:text-white transition-all active:scale-90"
              aria-label="Previous temporal frame"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 text-center min-w-[140px]">
              <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-gray-600 mb-1">Temporal Frame</p>
              <p className="text-sm font-mono font-bold text-white uppercase tracking-widest">{formattedDate}</p>
            </div>
            <button
              onClick={() => handleDateChange(1)}
              className="p-4 hover:bg-white/5 rounded-2xl text-gray-600 hover:text-white transition-all active:scale-90"
              aria-label="Next temporal frame"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Metrics */}
          <div className="lg:col-span-5 space-y-12">
            <div className="relative pt-12">
              <HydroVessel percentage={percentage} />

              <div className="mt-16 text-center space-y-2">
                <p className="text-[0.6rem] font-black text-gray-600 uppercase tracking-[0.4em]">Current Saturation</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-7xl font-serif italic font-medium text-white tracking-tighter">{todayTotal}</span>
                  <span className="text-xs font-mono font-medium text-blue-500 uppercase tracking-[0.2em]">/ {dailyGoal} ml</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[0.55rem] font-bold text-blue-400 uppercase tracking-widest">
                  <Waves size={10} />
                  {Math.round(percentage)}% Molecular Goal
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[250, 500, 750, 1000].map(amt => (
                <button
                  key={amt}
                  onClick={() => addWater(amt)}
                  className="group relative p-8 rounded-[2rem] bg-[#0A0C14] border border-white/5 hover:border-blue-500/50 transition-all active:scale-95 text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Droplet size={14} className="text-blue-500 mx-auto mb-4 group-hover:scale-125 transition-transform" />
                  <p className="text-3xl font-serif italic font-medium text-white mb-1">
                    {amt >= 1000 ? (amt / 1000).toFixed(1) : amt}
                  </p>
                  <p className="text-[0.6rem] font-mono font-medium text-gray-600 uppercase tracking-[0.2em]">
                    {amt >= 1000 ? 'Liters' : 'ml'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* History & Trend */}
          <div className="lg:col-span-7 space-y-12">
            <section className="bg-[#0A0C14] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl transition-all hover:border-white/10">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <Target size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-gray-500 mb-1">Temporal Intake Log</h3>
                    <p className="text-sm font-mono text-gray-400 tracking-widest uppercase">Chronological Data Sequence</p>
                  </div>
                </div>
              </div>

              {dailyLogs.length > 0 ? (
                <div className="space-y-4">
                  {dailyLogs.map((log) => (
                    <div key={log.id} className="group flex items-center justify-between p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500">
                      <div className="flex items-center gap-6">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse" />
                        <div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <p className="text-2xl font-serif italic font-medium text-white tracking-tight">{log.amount}</p>
                            <p className="text-[0.6rem] font-mono font-bold text-gray-600 uppercase tracking-widest">ml</p>
                          </div>
                          <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.2em]">{log.time}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="p-3 rounded-xl text-gray-700 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500"
                        aria-label={`Remove entry of ${log.amount}ml at ${log.time}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center group/void">
                  <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 group-hover/void:border-blue-500/30 transition-colors duration-700">
                    <Zap size={24} className="text-gray-800 group-hover/void:text-blue-500/50 transition-colors duration-700" />
                  </div>
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-gray-600">Hydration Void Detected</p>
                  <p className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-widest mt-2">Waiting for first molecular entry</p>
                </div>
              )}
            </section>

            {waterHistory.length > 1 && (
              <section className="bg-[#0A0C14] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center gap-4 mb-12">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <TrendingUp size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-gray-500 mb-1">Molecular Trend Matrix</h3>
                    <p className="text-sm font-mono text-gray-400 tracking-widest uppercase">30D Kinetic Analysis</p>
                  </div>
                </div>
                <div className="h-[300px] w-full px-4">
                  <LineChartComponent
                    data={waterHistory}
                    dataKey="water"
                    name="Hydration"
                    color="#3B82F6"
                    height={300}
                    strokeWidth={3}
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
