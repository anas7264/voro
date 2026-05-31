import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  Zap,
  Droplets,
  Calendar,
  ChevronRight,
  Target,
  Layout
} from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import { useStorage } from '@/hooks/useStorage';
import { useAI } from '@/hooks/useAI';
import { useNotifications } from '@/hooks/useNotifications';
import Modal from '@/components/Modal';
import LineChartComponent from '@/components/LineChartComponent';
import Ring from '@/components/Ring';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { getItem, setItem } = useStorage();
  const { response: aiInsight } = useAI();
  const { addNotification } = useNotifications();
  
  const [nutritionToday, setNutritionToday] = useState(null);
  const [workoutToday, setWorkoutToday] = useState(null);
  const [weightTrend, setWeightTrend] = useState([]);
  const [streaks, setStreaks] = useState({ training: 0, logging: 0, water: 0 });
  const [showQuickLog, setShowQuickLog] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Evolution Dashboard';
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const today = new Date().toISOString().split('T')[0];
    const nutritionLog = getItem('voro_nutrition_log') || {};
    const todayNutrition = nutritionLog[today] || {
      meals: {},
      water: 0,
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    };
    setNutritionToday(todayNutrition);

    const workoutLog = getItem('voro_workout_log') || {};
    const todayWorkout = workoutLog[today];
    setWorkoutToday(todayWorkout);

    const metrics = getItem('voro_body_metrics') || {};
    const weights = metrics.weights || [];
    const last30 = weights.slice(-30).map(w => ({
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: w.value,
      fullDate: w.date
    }));
    setWeightTrend(last30);

    calculateStreaks();
  };

  const calculateStreaks = () => {
    const workoutLog = getItem('voro_workout_log') || {};
    const nutritionLog = getItem('voro_nutrition_log') || {};
    
    let trainingStreak = 0;
    let loggingStreak = 0;
    let waterStreak = 0;
    
    let date = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = date.toISOString().split('T')[0];
      if (workoutLog[dateStr]?.attended) trainingStreak++;
      else if (trainingStreak > 0) break;
      date.setDate(date.getDate() - 1);
    }

    date = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = date.toISOString().split('T')[0];
      if (nutritionLog[dateStr]?.totals?.calories > 0) loggingStreak++;
      else if (loggingStreak > 0) break;
      date.setDate(date.getDate() - 1);
    }

    date = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = date.toISOString().split('T')[0];
      if (nutritionLog[dateStr]?.water >= (user?.waterGoal || 2000)) waterStreak++;
      else if (waterStreak > 0) break;
      date.setDate(date.getDate() - 1);
    }

    setStreaks({ training: trainingStreak, logging: loggingStreak, water: waterStreak });
  };

  const handleQuickLog = (type, value) => {
    const today = new Date().toISOString().split('T')[0];
    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue <= 0) {
      addNotification('Please enter a valid magnitude', 'error');
      return;
    }

    if (type === 'weight') {
      const metrics = getItem('voro_body_metrics') || { weights: [] };
      metrics.weights.push({ date: today, value: numValue });
      setItem('voro_body_metrics', metrics);
      addNotification('Body transformation record synthesized', 'success');
    } else if (type === 'water') {
      const log = getItem('voro_nutrition_log') || {};
      if (!log[today]) log[today] = { meals: {}, water: 0, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
      log[today].water = (log[today].water || 0) + numValue;
      setItem('voro_nutrition_log', log);
      addNotification('Hydration matrix updated', 'success');
    } else if (type === 'meal') {
      const log = getItem('voro_nutrition_log') || {};
      if (!log[today]) log[today] = { meals: {}, water: 0, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
      const mealId = `express_${Date.now()}`;
      log[today].meals[mealId] = { name: 'Express Log', calories: numValue, protein: 0, carbs: 0, fat: 0, timestamp: new Date().toISOString() };
      log[today].totals.calories += numValue;
      setItem('voro_nutrition_log', log);
      addNotification('Energy dynamics logged', 'success');
    }

    loadDashboardData();
    setShowQuickLog(false);
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const calorieStatus = useMemo(() => {
    if (!nutritionToday || !user) return { status: 'neutral', remaining: user?.calorieGoal || 2000 };
    const remaining = (user.calorieGoal || 2000) - (nutritionToday.totals?.calories || 0);
    return {
      status: remaining > 0 ? 'under' : 'over',
      remaining: Math.abs(remaining)
    };
  }, [nutritionToday, user]);

  const getMacroProgress = (macro) => {
    if (!nutritionToday || !user) return 0;
    const goal = user[`${macro}Goal`] || 1;
    const actual = macro === 'water' ? (nutritionToday.water || 0) : (nutritionToday.totals?.[macro] || 0);
    return Math.min((actual / goal) * 100, 100);
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080B14]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-voro-primary border-t-transparent animate-spin mb-4" />
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Initializing Evolution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] selection:bg-voro-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        {/* Header Section */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Activity size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Live Synthesis</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              {greeting}, <span className="text-gradient">{user.name}</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-wide">{todayDate}</p>
          </div>

          <div className="flex gap-4">
             <button
              onClick={() => setShowQuickLog(true)}
              className="group flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
            >
              <Plus size={18} />
              <span>Express Log</span>
            </button>
            <button
              onClick={() => navigate('/ai-coach')}
              className="flex items-center gap-3 px-6 py-3 bg-[#1A2438] border border-[#2A3A52] text-white rounded-full font-bold transition-all hover:bg-[#243044] hover:border-voro-primary/50"
            >
              <Zap size={18} className="text-voro-accent" />
              <span>AI Advisor</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Exhibition: Calorie Performance */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <section className="relative overflow-hidden rounded-[2.5rem] bg-[#111827] border border-white/5 p-8 md:p-12 shadow-2xl shadow-black/40">
              <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                  <div className="relative p-4 rounded-full bg-black/20 backdrop-blur-sm border border-white/5">
                    <Ring
                      value={(nutritionToday?.totals?.calories || 0)}
                      max={user.calorieGoal}
                      size={240}
                      unit="kcal"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Energy Dynamics</h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-7xl font-bold tracking-tighter text-white">
                        {nutritionToday?.totals?.calories || 0}
                      </span>
                      <span className="text-xl font-medium text-gray-400">/ {user.calorieGoal} kcal</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${calorieStatus.status === 'under' ? 'bg-voro-secondary/20 text-voro-secondary' : 'bg-voro-danger/20 text-voro-danger'}`}>
                          {calorieStatus.status === 'under' ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                        </div>
                        <span className="text-sm font-semibold text-gray-300">Remaining Allowance</span>
                      </div>
                      <span className="text-lg font-bold text-white">{calorieStatus.remaining} <span className="text-xs text-gray-500 uppercase ml-1">kcal</span></span>
                    </div>

                    <button
                      onClick={() => navigate('/nutrition/diary')}
                      className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-voro-primary text-white font-bold transition-all hover:bg-voro-primary-dark group"
                    >
                      <span>Examine Nutrition Details</span>
                      <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Metric Exposition: Macros */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { label: 'Protein', macro: 'protein', color: '#7C3AED', bg: 'bg-[#7C3AED]/10', text: 'text-[#A78BFA]', icon: '🍗' },
                { label: 'Carbs', macro: 'carbs', color: '#10B981', bg: 'bg-[#10B981]/10', text: 'text-[#34D399]', icon: '🍚' },
                { label: 'Fats', macro: 'fat', color: '#F59E0B', bg: 'bg-[#F59E0B]/10', text: 'text-[#FBBF24]', icon: '🥑' },
                { label: 'Hydration', macro: 'water', color: '#3B82F6', bg: 'bg-[#3B82F6]/10', text: 'text-[#60A5FA]', icon: '💧' }
              ].map((item) => (
                <div key={item.macro} className="group relative bg-[#111827] border border-white/5 p-6 rounded-[2rem] transition-all hover:border-white/10 hover:translate-y-[-4px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-2xl ${item.bg}`}>
                      {item.icon}
                    </div>
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">{item.label}</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">
                        {item.macro === 'water'
                          ? (Math.round((nutritionToday?.water || 0) / 100) / 10).toFixed(1)
                          : (nutritionToday?.totals?.[item.macro] || 0)
                        }
                      </span>
                      <span className="text-xs font-bold text-gray-500">{item.macro === 'water' ? 'L' : 'g'}</span>
                    </div>
                  </div>

                  <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out rounded-full"
                      style={{
                        width: `${getMacroProgress(item.macro)}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[0.6rem] font-bold text-gray-600 uppercase tracking-widest">{Math.round(getMacroProgress(item.macro))}% Goal</span>
                    <div className="w-1 h-1 rounded-full bg-gray-800" />
                  </div>
                </div>
              ))}
            </section>

            {/* Evolutionary Pattern: Weight Trend */}
            {weightTrend.length > 0 && (
              <section className="bg-[#111827] border border-white/5 p-8 rounded-[2.5rem]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Body Transformation</h3>
                    <p className="text-2xl font-bold text-white tracking-tight">Weight Analysis <span className="text-xs text-gray-500 font-medium ml-2">30D Matrix</span></p>
                  </div>
                  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                    <span className={`text-sm font-bold ${weightTrend[weightTrend.length-1].weight < weightTrend[0].weight ? 'text-voro-secondary' : 'text-voro-danger'}`}>
                      {weightTrend[weightTrend.length-1].weight < weightTrend[0].weight ? '-' : '+'}
                      {Math.abs(weightTrend[weightTrend.length - 1].weight - weightTrend[0].weight).toFixed(1)} kg
                    </span>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <LineChartComponent
                    data={weightTrend}
                    dataKey="weight"
                    name="Weight"
                    color="#7C3AED"
                    height={300}
                    strokeWidth={3}
                  />
                </div>
              </section>
            )}
          </div>

          {/* Side Panels: Consistency & Quick Actions */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* AI Synchronicity */}
            <section className="relative overflow-hidden bg-gradient-to-br from-voro-primary/20 to-voro-primary/5 border border-voro-primary/20 p-8 rounded-[2.5rem]">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-voro-primary/20 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-voro-primary rounded-xl">
                    <Layout size={20} className="text-white" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">System Insight</h3>
                </div>
                <p className="text-lg font-medium text-gray-200 leading-relaxed italic">
                   "{aiInsight || `Your current momentum in ${user.primaryGoal?.toLowerCase() || 'health'} is exceptional. Prioritizing ${nutritionToday?.totals?.protein < (user.proteinGoal * 0.8) ? 'protein density' : 'hydration recovery'} will further optimize your evolution.`}"
                </p>
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[0.65rem] font-bold text-voro-primary uppercase tracking-widest">Active Processing</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-voro-primary rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-voro-primary rounded-full animate-pulse delay-75" />
                    <div className="w-1 h-1 bg-voro-primary rounded-full animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            </section>

            {/* Consistency Matrix: Streaks */}
            <section className="bg-[#111827] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em]">Consistency Matrix</h3>

              <div className="space-y-4">
                {[
                  { label: 'Training', value: streaks.training, icon: <Flame size={18} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                  { label: 'Logging', value: streaks.logging, icon: <Zap size={18} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                  { label: 'Hydration', value: streaks.water, icon: <Droplets size={18} />, color: 'text-blue-500', bg: 'bg-blue-500/10' }
                ].map((streak) => (
                  <div key={streak.label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${streak.bg} ${streak.color}`}>
                        {streak.icon}
                      </div>
                      <span className="font-bold text-gray-300">{streak.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white leading-none">{streak.value}</div>
                      <span className="text-[0.6rem] font-bold text-gray-500 uppercase tracking-widest">Days</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Active Task: Workout */}
            <section className="bg-[#111827] border border-white/5 p-8 rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em]">Daily Engagement</h3>
                <Calendar size={18} className="text-gray-600" />
              </div>

              {workoutToday?.attended ? (
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-voro-secondary/10 text-voro-secondary border border-voro-secondary/20 rounded-full text-xs font-bold uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-voro-secondary animate-pulse" />
                    Completed
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm font-medium">Session Archetype</span>
                      <span className="text-white font-bold">{workoutToday.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm font-medium">Temporal Duration</span>
                      <span className="text-white font-bold">{workoutToday.duration} min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/workout/log')}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-white font-bold transition-all hover:bg-white/10"
                  >
                    Review Manifest
                  </button>
                </div>
              ) : (
                <div className="space-y-8 text-center">
                  <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center">
                    <Target size={28} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium mb-1">No session recorded</p>
                    <p className="text-[0.65rem] text-gray-600 uppercase font-black tracking-[0.15em]">Awaiting initiation</p>
                  </div>
                  <button
                    onClick={() => navigate('/workout/log')}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus size={18} />
                    <span>Begin Workout</span>
                  </button>
                </div>
              )}
            </section>

            {/* Navigation Grid */}
            <section className="grid grid-cols-2 gap-4">
              {[
                { label: 'Metrics', path: '/body/metrics', icon: <TrendingUp size={18} /> },
                { label: 'Evolution', path: '/ai-coach', icon: <Activity size={18} /> }
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-[#111827] border border-white/5 transition-all hover:border-voro-primary/50 hover:bg-voro-primary/5 group"
                >
                  <div className="text-gray-500 group-hover:text-voro-primary transition-colors">
                    {link.icon}
                  </div>
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">{link.label}</span>
                </button>
              ))}
            </section>
          </div>
        </div>
      </div>

      {/* Quick Log Modal Integration */}
      {showQuickLog && (
        <QuickLogModal
          isOpen={showQuickLog}
          onClose={() => setShowQuickLog(false)}
          onSubmit={handleQuickLog}
        />
      )}
    </div>
  );
};

const QuickLogModal = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState('meal');
  const [value, setValue] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Express Manifestation">
      <div className="p-2 space-y-8">
        <div className="space-y-2">
          <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Type of Entry</label>
          <div className="grid grid-cols-3 gap-2">
            {['meal', 'weight', 'water'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === t ? 'bg-voro-primary text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Magnitude</label>
          <div className="relative">
             <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'meal' ? 'Calories' : type === 'weight' ? 'kg' : 'ml'}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold text-white focus:outline-none focus:border-voro-primary focus:ring-1 focus:ring-voro-primary transition-all placeholder:text-gray-700"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">
               {type === 'meal' ? 'kcal' : type === 'weight' ? 'kg' : 'ml'}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 font-bold hover:bg-white/10 transition-all"
          >
            Abort
          </button>
          <button
            onClick={() => onSubmit(type, value)}
            className="flex-[2] py-4 rounded-2xl bg-voro-primary text-white font-bold hover:bg-voro-primary-dark shadow-lg shadow-voro-primary/20 transition-all"
          >
            Confirm Entry
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Dashboard;
