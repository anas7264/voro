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

const MACRO_CONFIG = [
  { label: 'Protein', macro: 'protein', color: '#7C3AED', bg: 'bg-[#7C3AED]/10', text: 'text-[#A78BFA]', icon: '🍗' },
  { label: 'Carbs', macro: 'carbs', color: '#10B981', bg: 'bg-[#10B981]/10', text: 'text-[#34D399]', icon: '🍚' },
  { label: 'Fats', macro: 'fat', color: '#F59E0B', bg: 'bg-[#F59E0B]/10', text: 'text-[#FBBF24]', icon: '🥑' },
  { label: 'Hydration', macro: 'water', color: '#3B82F6', bg: 'bg-[#3B82F6]/10', text: 'text-[#60A5FA]', icon: '💧' }
];

const STREAK_CONFIG = [
  { key: 'training', label: 'Training', icon: <Flame size={18} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { key: 'logging', label: 'Logging', icon: <Zap size={18} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { key: 'water', label: 'Hydration', icon: <Droplets size={18} />, color: 'text-blue-500', bg: 'bg-blue-500/10' }
];

const NAV_LINKS = [
  { label: 'Metrics', path: '/body/metrics', icon: <TrendingUp size={18} /> },
  { label: 'Evolution', path: '/ai-coach', icon: <Activity size={18} /> }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { getItem, setItem, storageData } = useStorage();
  const { response: aiInsight } = useAI();
  const { addNotification } = useNotifications();
  
  const [showQuickLog, setShowQuickLog] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Evolution Dashboard';
  }, []);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation using useMemo.
   * Eliminates the initial mount-time double-render cycle and ensures
   * reactivity to StorageContext updates without manual load calls.
   */
  const nutritionToday = useMemo(() => {
    const nutritionLog = storageData['nutrition_log'] || {};
    return nutritionLog[today] || {
      meals: {},
      water: 0,
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    };
  }, [storageData['nutrition_log'], today]);

  const workoutToday = useMemo(() => {
    const workoutLog = storageData['workout_log'] || {};
    return workoutLog[today];
  }, [storageData['workout_log'], today]);

  const weightTrend = useMemo(() => {
    const metrics = storageData['body_metrics'] || {};
    const weights = metrics.weights || [];
    return weights.slice(-30).map(w => ({
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: w.value,
      fullDate: w.date
    }));
  }, [storageData['body_metrics']]);

  const streaks = useMemo(() => {
    const workoutLog = storageData['workout_log'] || {};
    const nutritionLog = storageData['nutrition_log'] || {};
    const waterGoal = user?.waterGoal || 2000;
    
    let trainingStreak = 0;
    let loggingStreak = 0;
    let waterStreak = 0;
    
    let trainingActive = true;
    let loggingActive = true;
    let waterActive = true;

    const cursorDate = new Date();
    for (let i = 0; i < 365; i++) {
      if (!trainingActive && !loggingActive && !waterActive) break;

      const dateStr = cursorDate.toISOString().split('T')[0];

      if (trainingActive) {
        if (workoutLog[dateStr]?.attended) trainingStreak++;
        else if (trainingStreak > 0 || i > 0) trainingActive = false;
      }

      if (loggingActive) {
        if (nutritionLog[dateStr]?.totals?.calories > 0) loggingStreak++;
        else if (loggingStreak > 0 || i > 0) loggingActive = false;
      }

      if (waterActive) {
        if (nutritionLog[dateStr]?.water >= waterGoal) waterStreak++;
        else if (waterStreak > 0 || i > 0) waterActive = false;
      }

      cursorDate.setDate(cursorDate.getDate() - 1);
    }

    return { training: trainingStreak, logging: loggingStreak, water: waterStreak };
  }, [storageData['workout_log'], storageData['nutrition_log'], user?.waterGoal]);

  const handleQuickLog = (type, value) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue <= 0) {
      addNotification('Please enter a valid magnitude', 'error');
      return;
    }

    if (type === 'weight') {
      const metrics = getItem('body_metrics') || { weights: [] };
      metrics.weights.push({ date: todayStr, value: numValue });
      setItem('body_metrics', metrics);
      addNotification('Body transformation record synthesized', 'success');
    } else if (type === 'water') {
      const log = getItem('nutrition_log') || {};
      if (!log[todayStr]) log[todayStr] = { meals: {}, water: 0, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
      log[todayStr].water = (log[todayStr].water || 0) + numValue;
      setItem('nutrition_log', log);
      addNotification('Hydration matrix updated', 'success');
    } else if (type === 'meal') {
      const log = getItem('nutrition_log') || {};
      if (!log[todayStr]) log[todayStr] = { meals: {}, water: 0, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
      const mealId = `express_${Date.now()}`;
      log[todayStr].meals[mealId] = { name: 'Express Log', calories: numValue, protein: 0, carbs: 0, fat: 0, timestamp: new Date().toISOString() };
      log[todayStr].totals.calories += numValue;
      setItem('nutrition_log', log);
      addNotification('Energy dynamics logged', 'success');
    }

    setShowQuickLog(false);
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const calorieStatus = useMemo(() => {
    if (!user) return { status: 'neutral', remaining: 2000 };
    const goal = user.calorieGoal || 2000;
    const remaining = goal - (nutritionToday.totals?.calories || 0);
    return {
      status: remaining > 0 ? 'under' : 'over',
      remaining: Math.abs(remaining)
    };
  }, [nutritionToday.totals?.calories, user]);

  /**
   * ⚡ OPTIMIZATION: Consolidated macro stats derivation.
   * Calculates all macro data in a single pass to reduce render-loop overhead.
   */
  const macroStats = useMemo(() => {
    if (!user) return [];
    return MACRO_CONFIG.map(config => {
      const goal = user[`${config.macro}Goal`] || 1;
      const actual = config.macro === 'water'
        ? (nutritionToday.water || 0)
        : (nutritionToday.totals?.[config.macro] || 0);
      const progress = Math.min((actual / goal) * 100, 100);

      return {
        ...config,
        actual,
        progress,
        displayValue: config.macro === 'water'
          ? (Math.round(actual / 100) / 10).toFixed(1)
          : actual
      };
    });
  }, [nutritionToday, user]);

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
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Activity size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Live Synthesis</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              {greeting}, <span className="text-gradient not-italic font-bold">{user.name}</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-xs uppercase opacity-60">{todayDate}</p>
          </div>

          <div className="flex gap-4">
             <button
              onClick={() => setShowQuickLog(true)}
              className="group flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
            >
              <Plus size={16} />
              <span>Express Log</span>
            </button>
            <button
              onClick={() => navigate('/ai-coach')}
              className="flex items-center gap-3 px-8 py-3.5 bg-[#0D1424] border border-white/5 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] transition-all hover:bg-white/[0.05] hover:border-voro-primary/30"
            >
              <Zap size={16} className="text-voro-accent" />
              <span>AI Advisor</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <section className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0C14] border border-white/5 p-8 md:p-12 shadow-2xl shadow-black/40 transition-all hover:border-white/10 group/card">
              <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover/card:bg-voro-primary/10 transition-colors duration-700" />

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                  <div className="relative p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <Ring
                      value={(nutritionToday?.totals?.calories || 0)}
                      max={user.calorieGoal}
                      size={280}
                      unit="kcal"
                      label="Energy Balance"
                    />
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Metabolic Velocity</h3>
                    <div className="flex items-baseline gap-4">
                      <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
                        {nutritionToday?.totals?.calories || 0}
                      </span>
                      <span className="text-lg font-medium text-gray-500 tracking-tight">/ {user.calorieGoal} kcal</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${calorieStatus.status === 'under' ? 'bg-voro-secondary/10 text-voro-secondary' : 'bg-voro-danger/10 text-voro-danger'}`}>
                          {calorieStatus.status === 'under' ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Allowance</span>
                      </div>
                      <span className="text-xl font-serif italic font-bold text-white">{calorieStatus.remaining} <span className="text-[0.6rem] not-italic font-sans font-black text-gray-600 uppercase ml-1 tracking-widest">kcal</span></span>
                    </div>

                    <button
                      onClick={() => navigate('/nutrition/diary')}
                      className="w-full flex items-center justify-between px-8 py-5 rounded-2xl bg-voro-primary text-white font-black uppercase tracking-[0.3em] text-[0.65rem] transition-all hover:bg-voro-primary-dark hover:scale-[1.02] active:scale-[0.98] group shadow-xl shadow-voro-primary/20"
                    >
                      <span>Examine Nutrition Matrix</span>
                      <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {macroStats.map((item) => (
                <div key={item.macro} className="group relative bg-[#0A0C14] border border-white/5 p-6 rounded-[2rem] transition-all hover:border-white/10 hover:translate-y-[-4px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-2xl ${item.bg}`}>
                      {item.icon}
                    </div>
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-gray-600 group-hover:text-gray-400 transition-colors">{item.label}</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-serif font-bold text-white tracking-tight">
                        {item.displayValue}
                      </span>
                      <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-widest ml-1">{item.macro === 'water' ? 'L' : 'g'}</span>
                    </div>
                  </div>

                  <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out rounded-full"
                      style={{
                        width: `${item.progress}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[0.6rem] font-bold text-gray-600 uppercase tracking-widest">{Math.round(item.progress)}% Goal</span>
                    <div className="w-1 h-1 rounded-full bg-gray-800" />
                  </div>
                </div>
              ))}
            </section>

            {weightTrend.length > 0 && (
              <section className="bg-[#0A0C14] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Biometric Timeline</h3>
                    <p className="text-3xl font-serif font-bold text-white tracking-tight">Kinetic Shift <span className="text-[0.65rem] font-sans font-black text-gray-700 uppercase ml-3 tracking-[0.2em]">30D Matrix</span></p>
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

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <section className="relative overflow-hidden bg-gradient-to-br from-voro-primary/10 to-transparent border border-voro-primary/20 p-8 rounded-[2.5rem] shadow-[0_0_40px_rgba(124,58,237,0.1)] group/ai">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-voro-primary/10 rounded-full blur-3xl group-hover/ai:bg-voro-primary/20 transition-colors duration-1000" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-2.5 bg-voro-primary rounded-xl shadow-lg shadow-voro-primary/30">
                    <Layout size={20} className="text-white" />
                  </div>
                  <h3 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-white">Neural Synthesis</h3>
                </div>
                <p className="text-xl font-serif italic font-medium text-gray-200 leading-relaxed">
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

            <section className="bg-[#0A0C14] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-xl">
              <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em]">Consistency Matrix</h3>

              <div className="space-y-5">
                {STREAK_CONFIG.map((streak) => (
                  <div key={streak.key} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group/streak">
                    <div className="flex items-center gap-5">
                      <div className={`p-3.5 rounded-xl ${streak.bg} ${streak.color} shadow-lg shadow-black/20 group-hover/streak:scale-110 transition-transform duration-500`}>
                        {streak.icon}
                      </div>
                      <span className="text-sm font-bold text-gray-400 group-hover:text-gray-200 transition-colors tracking-tight">{streak.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-serif font-bold text-white leading-none">{streaks[streak.key]}</div>
                      <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest mt-1 block">Days</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#0A0C14] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em]">Daily Engagement</h3>
                <Calendar size={18} className="text-gray-700" />
              </div>

              {workoutToday?.attended ? (
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-voro-secondary/10 text-voro-secondary border border-voro-secondary/20 rounded-full text-[0.6rem] font-black uppercase tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 rounded-full bg-voro-secondary animate-pulse" />
                    Evolution Logged
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Archetype</span>
                      <span className="text-white font-serif italic text-lg font-bold">{workoutToday.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Temporal</span>
                      <span className="text-white font-serif italic text-lg font-bold">{workoutToday.duration} min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/workout/log')}
                    className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 transition-all hover:bg-white/[0.06] hover:text-white"
                  >
                    Review Manifest
                  </button>
                </div>
              ) : (
                <div className="space-y-10 text-center py-4">
                  <div className="w-20 h-20 mx-auto bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center shadow-inner">
                    <Target size={32} className="text-gray-700" />
                  </div>
                  <div>
                    <p className="text-gray-400 font-serif italic text-xl mb-2">No session recorded</p>
                    <p className="text-[0.6rem] text-gray-600 uppercase font-black tracking-[0.3em]">Awaiting initiation</p>
                  </div>
                  <button
                    onClick={() => navigate('/workout/log')}
                    className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl bg-white text-black text-[0.65rem] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-white/5"
                  >
                    <Plus size={18} />
                    <span>Begin Session</span>
                  </button>
                </div>
              )}
            </section>

            <section className="grid grid-cols-2 gap-5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-[#0A0C14] border border-white/5 transition-all hover:border-voro-primary/30 hover:bg-voro-primary/[0.02] group shadow-lg"
                >
                  <div className="text-gray-600 group-hover:text-voro-primary transition-colors duration-500">
                    {link.icon}
                  </div>
                  <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-gray-600 group-hover:text-white transition-colors duration-500">{link.label}</span>
                </button>
              ))}
            </section>
          </div>
        </div>
      </div>

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
