import React, { useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Calendar, RotateCcw, Zap, Target } from 'lucide-react';
import { Card, Button } from '@/components';
import { useStorage } from '@/hooks/useStorage';

const DailyStreak = () => {
  const { storageData } = useStorage();

  useEffect(() => {
    document.title = 'VORO | Daily Streak';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation using useMemo.
   * Eliminates the initial mount-time double-render cycle and ensures
   * reactivity to StorageContext updates without manual load calls.
   */
  const streaks = useMemo(() => {
    const data = storageData['voro_streaks'] || {
      trainingDays: 15,
      nutritionLogging: 8,
      waterIntake: 12,
      sleepGoal: 6,
    };
    return data;
  }, [storageData['voro_streaks']]);

  const chartData = useMemo(() => [
    { day: 'Mon', completed: 4 },
    { day: 'Tue', completed: 3 },
    { day: 'Wed', completed: 4 },
    { day: 'Thu', completed: 4 },
    { day: 'Fri', completed: 4 },
    { day: 'Sat', completed: 2 },
    { day: 'Sun', completed: 4 },
  ], []);

  const streakGoals = useMemo(() => [
    { name: 'Training', current: streaks.trainingDays, icon: '🏋️', goal: 30, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Nutrition Logging', current: streaks.nutritionLogging, icon: '📝', goal: 30, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { name: 'Water Intake', current: streaks.waterIntake, icon: '💧', goal: 30, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Sleep Goal', current: streaks.sleepGoal, icon: '😴', goal: 30, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ], [streaks]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3 text-orange-500 mb-2">
              <Flame size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.4em]">Momentum Matrix</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Consistency <span className="text-gradient not-italic font-bold">Streaks</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-xs uppercase opacity-60">High-fidelity analysis of behavioral synchronicity</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {streakGoals.map(streak => (
            <Card key={streak.name} className="p-10 text-center bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
              <div className={`w-20 h-20 mx-auto rounded-[2rem] ${streak.bg} flex items-center justify-center text-4xl mb-8 shadow-2xl transition-transform group-hover:scale-110`}>
                {streak.icon}
              </div>
              <div className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">{streak.name}</div>
              <div className="text-5xl font-serif italic font-bold text-white mb-6">{streak.current}</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest">Efficiency</span>
                  <span className="text-[0.65rem] font-bold text-white">{Math.round((streak.current / streak.goal) * 100)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 p-0.5 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-voro-primary transition-all duration-1000 shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                    style={{ width: `${Math.min((streak.current / streak.goal) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <Card className="lg:col-span-8 p-10 md:p-12 bg-[#0A0C14] border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-1000" />
             <div className="relative">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Neural Adherence</h3>
                    <p className="text-3xl font-serif italic font-bold text-white tracking-tight">Weekly <span className="text-voro-primary not-italic">Completion</span> Matrix</p>
                  </div>
                  <Calendar size={18} className="text-gray-700" />
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis
                        dataKey="day"
                        stroke="#4B5563"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#4B5563', fontWeight: 900 }}
                        dy={15}
                      />
                      <YAxis
                        stroke="#4B5563"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#4B5563', fontWeight: 900 }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff' }}
                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      />
                      <Bar
                        dataKey="completed"
                        fill="#7C3AED"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                        className="drop-shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </Card>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <Card className="flex-1 p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-center items-center text-center">
              <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                 <Target size={200} className="text-voro-primary" />
              </div>
              <div className="relative">
                <Zap className="w-12 h-12 text-voro-accent mx-auto mb-6 drop-shadow-glow" />
                <h3 className="text-2xl font-serif italic font-bold text-white mb-2">Evolution Threshold</h3>
                <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] max-w-[200px]">3 more days to establish neural permanence</p>
              </div>
            </Card>

            <button className="w-full flex items-center justify-center gap-4 py-8 rounded-[2.5rem] bg-white text-black text-[0.7rem] font-black uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/5 group">
              <RotateCcw size={18} className="transition-transform group-hover:rotate-180 duration-700" />
              <span>Reset Synchronicity</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyStreak;
