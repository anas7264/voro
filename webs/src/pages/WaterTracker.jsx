import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Droplet, Trash2, TrendingUp, ChevronLeft, ChevronRight, Target, Zap } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateWaterEntry } from '@/utils/validators';
import Button from '@/components/Button';
import Card from '@/components/Card';
import LineChartComponent from '@/components/LineChartComponent';

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
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Droplet size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Hydration Dynamics</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
              Molecular <span className="text-voro-primary not-italic font-bold">Flux</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-[#0A0C14] border border-white/5 rounded-2xl p-2 shadow-xl">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-3 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 text-center">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">Temporal Frame</p>
              <p className="text-sm font-mono font-bold text-white uppercase tracking-widest">{formattedDate}</p>
            </div>
            <button
              onClick={() => handleDateChange(1)}
              className="p-3 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Metrics */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-10 bg-gradient-to-b from-[#0A0C14] to-black border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Droplet size={120} />
              </div>

              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Current Intake</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-serif italic font-bold text-white">{todayTotal}</span>
                    <span className="text-lg font-mono font-bold text-voro-primary uppercase tracking-widest">ml</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[0.6rem] font-black uppercase tracking-widest text-gray-600">
                    <span>Saturation</span>
                    <span>{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-[0.55rem] font-mono text-gray-700 tracking-[0.2em] uppercase text-right">Target: {dailyGoal}ml</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {[250, 500, 750, 1000].map(amt => (
                <button
                  key={amt}
                  onClick={() => addWater(amt)}
                  className="group p-6 rounded-3xl bg-[#0A0C14] border border-white/5 hover:border-voro-primary transition-all active:scale-95 text-left"
                >
                  <Plus size={16} className="text-voro-primary mb-4 group-hover:scale-125 transition-transform" />
                  <p className="text-2xl font-serif italic font-bold text-white mb-1">
                    {amt >= 1000 ? '1.0' : amt}
                  </p>
                  <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-widest">
                    {amt >= 1000 ? 'Liters' : 'Milliliters'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* History & Trend */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Target size={18} className="text-voro-primary" />
                  <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white">Temporal Intake Log</h3>
                </div>
              </div>

              {dailyLogs.length > 0 ? (
                <div className="space-y-3">
                  {dailyLogs.map((log) => (
                    <div key={log.id} className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <div>
                          <p className="text-sm font-bold text-white font-mono tracking-tight">{log.amount}ml</p>
                          <p className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">{log.time}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="p-2.5 rounded-xl text-gray-700 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center opacity-30">
                  <Zap size={32} className="mb-4 text-gray-700" />
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-500">Hydration Void</p>
                </div>
              )}
            </Card>

            {waterHistory.length > 1 && (
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp size={18} className="text-voro-primary" />
                  <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white">Molecular Trend Matrix</h3>
                </div>
                <div className="h-[250px] w-full">
                  <LineChartComponent
                    data={waterHistory}
                    dataKey="water"
                    name="Hydration"
                    color="#3B82F6"
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
