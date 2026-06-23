import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, Zap, Activity, Target, Weight } from 'lucide-react';
import { Card, Button, Tabs, LineChartComponent, BarChartComponent, Stat } from '@/components';
import { useStorageKey } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters and key generators.
 * Prevents redundant object instantiation in high-frequency loops.
 */
const labelFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const getISODate = (date) => date.toISOString().slice(0, 10);

const Statistics = () => {
  const nutritionLog = useStorageKey('nutrition_log') || {};
  const workoutLog = useStorageKey('workout_log') || {};
  const { user } = useApp();
  const [period, setPeriod] = useState('30D');

  useEffect(() => {
    document.title = 'VORO | Evolution Analytics';
  }, []);

  const stats = useMemo(() => {

    const getPeriodDays = () => {
      switch (period) {
        case '7D': return 7;
        case '30D': return 30;
        case '90D': return 90;
        case '1Y': return 365;
        default: return 30;
      }
    };

    const days = getPeriodDays();
    const calorieTrend = [];
    let workoutDays = 0;
    let totalVolume = 0;
    let totalKcal = 0;
    let loggedDays = 0;

    // Weekly workout distribution
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyWorkouts = [];

    // ⚡ OPTIMIZATION: Use a single cursor and temporal arithmetic to avoid O(N) Date instantiation.
    // We pre-calculate timestamps to minimize object creation overhead in high-frequency loops.
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayMs = now.getTime();
    const dayMs = 86400000;

    // Populate weekly distribution (last 7 days)
    for (let i = 6; i >= 0; i--) {
      const ts = todayMs - (i * dayMs);
      const d = new Date(ts);
      const dateStr = getISODate(d);
      weeklyWorkouts.push({
        day: daysOfWeek[d.getDay()],
        workouts: workoutLog[dateStr]?.attended ? 1 : 0
      });
    }

    // Populate main trend (period days)
    for (let i = days - 1; i >= 0; i--) {
      const ts = todayMs - (i * dayMs);
      const d = new Date(ts);
      const dateStr = getISODate(d);
      const dayData = nutritionLog[dateStr];
      const workoutDay = workoutLog[dateStr];
      const kcal = dayData?.totals?.calories || 0;

      calorieTrend.push({
        date: labelFormatter.format(d),
        calories: kcal,
      });

      if (kcal > 0) {
        totalKcal += kcal;
        loggedDays++;
      }

      if (workoutDay?.attended) {
        workoutDays++;
        totalVolume += workoutDay.volume || 0;
      }
    }

    return {
      calorieTrend,
      workoutDays,
      totalVolume,
      weeklyWorkouts,
      avgCalories: loggedDays > 0 ? Math.round(totalKcal / loggedDays) : 0,
      adherence: Math.round((loggedDays / days) * 100)
    };
  }, [period, nutritionLog, workoutLog]);

  const periodTabs = useMemo(() => [
    { id: '7D', label: '7D' },
    { id: '30D', label: '30D' },
    { id: '90D', label: '90D' },
    { id: '1Y', label: '1Y' }
  ], []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080B14]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-voro-primary border-t-transparent animate-spin mb-4" />
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Synthesizing Analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30">
       {/* Background Decor */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] right-[5%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[5%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-voro-primary">
                <BarChart3 size={18} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Evolution Metrics</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
                Analytics <span className="text-gradient not-italic font-bold">Timeline</span>
              </h1>
              <p className="text-gray-500 font-medium tracking-widest text-xs uppercase opacity-60">High-fidelity biometric trajectory analysis</p>
           </div>

           <div className="w-full md:w-auto">
             <Tabs
               tabs={periodTabs}
               activeTab={period}
               onTabChange={setPeriod}
             />
           </div>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Stat
            label="Kinetic Sessions"
            value={stats.workoutDays}
            icon={TrendingUp}
            color="voro-primary"
          />
          <Stat
            label="Metabolic Mean"
            value={stats.avgCalories}
            unit="kcal"
            icon={Zap}
            color="voro-secondary"
          />
          <Stat
            label="Absolute Volume"
            value={Math.round(stats.totalVolume / 1000)}
            unit="k kg"
            icon={Weight}
            color="voro-accent"
          />
          <Stat
            label="Neural Adherence"
            value={stats.adherence}
            unit="%"
            icon={Target}
            color="voro-secondary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calorie Trend */}
          <Card className="lg:col-span-8 p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-1000" />
            <div className="relative">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em]">Metabolic Momentum</h3>
                <span className="text-[0.65rem] font-black text-voro-primary uppercase tracking-widest bg-voro-primary/10 px-3 py-1 rounded-full border border-voro-primary/20">Calorie Trend</span>
              </div>
              <div className="h-[400px] w-full">
                <LineChartComponent
                  data={stats.calorieTrend}
                  dataKey="calories"
                  name="Calories"
                  color="#7C3AED"
                  height={400}
                  strokeWidth={3}
                />
              </div>
            </div>
          </Card>

          {/* Weekly Workouts */}
          <Card className="lg:col-span-4 p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-voro-secondary/5 rounded-full blur-[80px] -ml-24 -mb-24 group-hover:bg-voro-secondary/10 transition-colors duration-1000" />
            <div className="relative">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em]">Kinetic Frequency</h3>
                <Calendar size={18} className="text-gray-700" />
              </div>
              <div className="h-[400px] w-full">
                <BarChartComponent
                  data={stats.weeklyWorkouts}
                  dataKey="workouts"
                  xDataKey="day"
                  name="Workouts"
                  color="#10B981"
                  height={400}
                />
              </div>
            </div>
          </Card>
        </div>

        <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em]">VORO Evolutionary Analytics Engine v1.0</p>
           <div className="flex gap-8">
              <button className="text-[0.65rem] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Export CSV</button>
              <button className="text-[0.65rem] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Generate PDF</button>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Statistics;
