import React, { useState, useEffect, useMemo, useCallback, useRef, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Calendar,
  ChevronRight,
  Droplets,
  Flame,
  Layout,
  Plus,
  Scale,
  Target,
  TrendingDown,
  TrendingUp,
  Utensils,
  Zap
} from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import { useStorageMethods, useStorageKey, useStorageKeySelector } from '@/hooks/useStorage';
import { useAI } from '@/hooks/useAI';
import { useNotifications } from '@/hooks/useNotifications';
import Modal from '@/components/Modal';
import LineChartComponent from '@/components/LineChartComponent';
import Ring from '@/components/Ring';
import Stat from '@/components/Stat';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Breadcrumb from '@/components/Breadcrumb';
import Card from '@/components/Card';

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

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Static greeting derivation.
 * Moves greeting logic out of the render cycle to module scope.
 */
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return 'Night Synthesis';
  if (hour < 12) return 'Morning Synthesis';
  if (hour < 17) return 'Midday Momentum';
  if (hour < 21) return 'Evening Recovery';
  return 'Nocturnal Audit';
};

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in loops or high-frequency renders.
 */
const shortDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Fast date string builder.
 */
const getFastDateStr = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const INITIAL_NUTRITION = {
  meals: {},
  water: 0,
  totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to relevant data slices to avoid redundant re-renders
   * when unrelated data (e.g., past logs, other metrics) is updated.
   */
  const today = useMemo(() => getFastDateStr(new Date()), []);

  const nutritionToday = useStorageKeySelector(
    'nutrition_log',
    useCallback((log) => (log || {})[today] || INITIAL_NUTRITION, [today])
  );

  const workoutToday = useStorageKeySelector(
    'workout_log',
    useCallback((log) => (log || {})[today], [today])
  );

  const weights30D = useStorageKeySelector(
    'body_metrics',
    useCallback((metrics) => (metrics?.weights || []).slice(-30), [])
  );

  // We still need full logs for streaks, but we'll use useStorageKey for them
  // to keep the logic simple, as they naturally depend on the full history.
  const nutritionLog = useStorageKey('nutrition_log') || {};
  const workoutLog = useStorageKey('workout_log') || {};

  const { response: aiInsight } = useAI();
  const { addNotification } = useNotifications();
  
  const [showQuickLog, setShowQuickLog] = useState(false);
  const metabolicCardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!metabolicCardRef.current) return;
    const rect = metabolicCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    metabolicCardRef.current.style.setProperty('--mouse-x', `${x}px`);
    metabolicCardRef.current.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  useEffect(() => {
    document.title = 'VORO | Evolution Dashboard';

    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'q' &&
          !e.ctrlKey && !e.altKey && !e.metaKey &&
          !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        setShowQuickLog(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const weightTrend = useMemo(() => {
    return weights30D.map(w => ({
      date: shortDateFormatter.format(new Date(w.date)),
      weight: w.value,
      fullDate: w.date
    }));
  }, [weights30D]); // ⚡ OPTIMIZATION: Only recompute if 30D weights change

  const streaks = useMemo(() => {
    const waterGoal = user?.waterGoal || 2000;

    let trainingStreak = 0;
    let loggingStreak = 0;
    let waterStreak = 0;

    let trainingActive = true;
    let loggingActive = true;
    let waterActive = true;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayMs = now.getTime();
    const dayMs = 86400000;

    /**
     * ⚡ PERFORMANCE OPTIMIZATION: High-Speed Temporal Cursor.
     * Replaces expensive string generation with direct temporal arithmetic.
     * Implements aggressive early exit based on maximum valid history.
     */
    const cursor = new Date();
    const maxDays = 365;

    for (let i = 0; i < maxDays; i++) {
      if (!trainingActive && !loggingActive && !waterActive) break;

      cursor.setTime(todayMs - (i * dayMs));

      // Fast manual date formatting to avoid expensive Intl or template literal overhead
      const y = cursor.getFullYear();
      const m = cursor.getMonth() + 1;
      const d = cursor.getDate();
      const dateStr = `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;

      if (trainingActive) {
        if (workoutLog[dateStr]?.attended) {
          trainingStreak++;
        } else if (i > 0 || trainingStreak > 0) {
          trainingActive = false;
        }
      }

      if (loggingActive) {
        if (nutritionLog[dateStr]?.totals?.calories > 0) {
          loggingStreak++;
        } else if (i > 0 || loggingStreak > 0) {
          loggingActive = false;
        }
      }

      if (waterActive) {
        if (nutritionLog[dateStr]?.water >= waterGoal) {
          waterStreak++;
        } else if (i > 0 || waterStreak > 0) {
          waterActive = false;
        }
      }
    }

    return { training: trainingStreak, logging: loggingStreak, water: waterStreak };
  }, [workoutLog, nutritionLog, user?.waterGoal]);

  const { setItem, getItem } = useStorageMethods();

  const handleQuickLog = useCallback(async (type, value) => {
    const todayStr = getFastDateStr(new Date());
    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue <= 0) {
      addNotification('Please enter a valid magnitude', 'error');
      return;
    }

    /**
     * ⚡ OPTIMISTIC UI: Close modal and notify immediately.
     * The background storage write is non-blocking for user flow.
     */
    setShowQuickLog(false);

    if (type === 'weight') {
      const metrics = { ...(getItem('body_metrics') || {}) };
      if (!metrics.weights) metrics.weights = [];

      const updated = {
        ...metrics,
        weights: [...metrics.weights, { date: todayStr, value: numValue }]
      };
      setItem('body_metrics', updated);
      addNotification('Body transformation record synthesized', 'success');
    } else if (type === 'water') {
      const log = { ...(getItem('nutrition_log') || {}) };
      const dayData = log[todayStr] || { meals: {}, water: 0, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };

      log[todayStr] = {
        ...dayData,
        water: (dayData.water || 0) + numValue
      };

      setItem('nutrition_log', log);
      addNotification('Hydration matrix updated', 'success');
    } else if (type === 'meal') {
      const log = { ...(getItem('nutrition_log') || {}) };
      const dayData = log[todayStr] || { meals: {}, water: 0, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
      const mealId = `express_${Date.now()}`;

      log[todayStr] = {
        ...dayData,
        meals: {
          ...dayData.meals,
          [mealId]: { name: 'Express Log', calories: numValue, protein: 0, carbs: 0, fat: 0, timestamp: new Date().toISOString() }
        },
        totals: {
          ...dayData.totals,
          calories: (dayData.totals?.calories || 0) + numValue
        }
      };

      setItem('nutrition_log', log);
      addNotification('Energy dynamics logged', 'success');
    }
  }, [getItem, setItem, addNotification]);

  const greeting = useMemo(() => getGreeting(), []);

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

  const todayDate = longDateFormatter.format(new Date());

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
    <div className="min-h-screen bg-transparent text-[#F0F4FF] selection:bg-voro-primary/30">
      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <Breadcrumb
          items={[
            { label: 'System', href: '/dashboard' },
            { label: 'Neural Matrix', href: '/dashboard' },
            { label: 'Evolution Dashboard' }
          ]}
          className="mb-12"
        />
        <header className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-16 group/header">
          <div className="space-y-10 max-w-4xl">
            {/* Neural Pulse Eyebrow */}
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.7rem] font-mono font-black uppercase tracking-[0.6em] opacity-90">
                Evolutionary Status // {user.name.replace(' ', '_').toUpperCase()}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-[5rem] md:text-[8.5rem] font-serif italic font-medium tracking-[-0.04em] text-white leading-[0.85] mb-4">
                {greeting},
              </h1>
              <div className="flex flex-col md:flex-row md:items-end gap-12">
                <span className="text-gradient text-[5.5rem] md:text-[9rem] font-serif font-black tracking-[-0.05em] leading-[0.8]">
                  In Motion.
                </span>

                {/* System Telemetry Grid */}
                <div className="grid grid-cols-2 gap-10 pb-4 border-l border-white/5 pl-10 ml-2">
                  <div className="space-y-2">
                    <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-[0.5em] block">Integrity</span>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-voro-secondary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[0.7rem] font-mono text-white font-bold tracking-[0.2em]">0x99_NOMINAL</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-[0.5em] block">Sync Node</span>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-voro-primary animate-pulse" />
                      <span className="text-[0.7rem] font-mono text-voro-primary font-bold tracking-[0.2em]">ACTIVE_v2.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Architectural Datum Line */}
            <div className="flex items-center gap-6">
              <div className="h-px w-32 bg-gradient-to-r from-voro-primary to-transparent opacity-50 group-hover/header:w-64 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <p className="text-gray-600 font-mono font-bold tracking-[0.5em] text-[0.6rem] uppercase opacity-50 whitespace-nowrap">{todayDate}</p>
            </div>
          </div>

          <div className="flex gap-8 pb-2">
            <Button
              onClick={() => setShowQuickLog(true)}
              shortcut="Q"
              aria-keyshortcuts="q"
              className="!bg-white !text-black !rounded-full shadow-2xl shadow-white/10"
            >
              <Plus size={16} aria-hidden="true" />
              <span>Express Log</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/ai-coach')}
              className="!rounded-full"
            >
              <Zap size={16} className="text-voro-accent" aria-hidden="true" />
              <span>AI Advisor</span>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <section
              ref={metabolicCardRef}
              onMouseMove={handleMouseMove}
              className="relative overflow-hidden rounded-[4rem] bg-[#0A0C14] border border-white/5 p-20 md:p-24 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)] transition-all duration-1000 hover:border-white/10 group/card bg-boutique-grain"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-voro-primary/5 rounded-full blur-[140px] -mr-64 -mt-64 group-hover/card:bg-voro-primary/10 transition-colors duration-1000" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-voro-secondary/5 rounded-full blur-[120px] -ml-48 -mb-48" />

              {/* Dynamic Light Lens */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(1200px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 45%)`,
                }}
              />

              <div className="kinetic-sweep opacity-30 group-hover/card:opacity-50 transition-opacity duration-1000" />

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 items-center">
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative p-4 rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_2px_2px_0_rgba(255,255,255,0.05)]">
                    <div className="absolute inset-[-20px] rounded-full bg-voro-primary/10 animate-pulse-slow blur-3xl" />
                    <Ring
                      value={(nutritionToday?.totals?.calories || 0)}
                      max={user.calorieGoal}
                      size={320}
                      unit="kcal"
                      label="Energy Balance"
                    />

                    {/* Precision Ring Overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-white/5 rounded-full pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] border border-white/[0.02] rounded-full pointer-events-none" />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-16">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8 bg-voro-primary" />
                      <h3 className="text-[0.7rem] font-mono font-black text-voro-primary uppercase tracking-[0.6em]">Metabolic Velocity</h3>
                    </div>
                    <div className="flex items-baseline gap-6">
                      <span className="text-9xl font-serif italic font-medium tracking-[-0.05em] text-white leading-none">
                        {nutritionToday?.totals?.calories || 0}
                      </span>
                      <span className="text-2xl font-serif italic text-gray-500 tracking-tight opacity-60">/ {user.calorieGoal} kcal</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl transition-all hover:bg-white/[0.05]">
                      <div className="flex items-center justify-between">
                         <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">Allowance</span>
                         <div className={`p-2 rounded-lg ${calorieStatus.status === 'under' ? 'text-voro-secondary bg-voro-secondary/10' : 'text-voro-danger bg-voro-danger/10'}`}>
                           {calorieStatus.status === 'under' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                         </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-serif italic font-bold text-white">{calorieStatus.remaining}</span>
                        <span className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-widest">kcal</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/nutrition/diary')}
                      className="relative h-full flex flex-col justify-center items-center gap-4 px-10 py-8 rounded-[2rem] bg-voro-primary text-white font-black uppercase tracking-[0.4em] text-[0.7rem] transition-all duration-700 hover:scale-[1.02] active:scale-[0.98] group/btn shadow-[0_30px_60px_rgba(124,58,237,0.3)] hover:shadow-[0_40px_80px_rgba(124,58,237,0.5)] overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
                      <div className="flex items-center gap-4 relative z-10">
                        <span>Examine Matrix</span>
                        <ChevronRight size={18} className="transition-transform duration-500 group-hover/btn:translate-x-2" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
              {macroStats.map((item, idx) => (
                <Stat
                  key={item.macro}
                  label={item.label}
                  value={item.displayValue}
                  unit={item.macro === 'water' ? 'L' : 'g'}
                  progress={item.progress}
                  color={item.macro === 'protein' ? 'voro-primary' : item.macro === 'carbs' ? 'voro-secondary' : item.macro === 'fat' ? 'voro-accent' : 'primary'}
                  className="p-8"
                  nodeId={`METRIC_0${idx + 1}`}
                />
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
            <section className="relative overflow-hidden bg-[#0A0C14] border border-voro-primary/20 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] group/ai backdrop-blur-3xl">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-voro-primary/10 rounded-full blur-[100px] animate-pulse group-hover/ai:bg-voro-primary/20 transition-colors duration-1000" />
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-voro-secondary/5 rounded-full blur-[100px] animate-pulse delay-700" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-voro-primary rounded-2xl shadow-lg shadow-voro-primary/30">
                    <Layout size={20} className="text-white" />
                  </div>
                  <h3 className="text-[0.65rem] font-mono font-medium uppercase tracking-[0.4em] text-voro-primary">Neural Synthesis</h3>
                </div>
                <p className="text-2xl font-serif italic font-medium text-white leading-relaxed tracking-tight">
                   "{aiInsight || `Your current momentum in ${user.primaryGoal?.toLowerCase() || 'health'} is exceptional. Prioritizing ${nutritionToday?.totals?.protein < (user.proteinGoal * 0.8) ? 'protein density' : 'hydration recovery'} will further optimize your evolution.`}"
                </p>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[0.55rem] font-mono font-medium text-gray-500 uppercase tracking-[0.3em]">Active Processing</span>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-voro-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                    <div className="w-1.5 h-1.5 bg-voro-primary rounded-full animate-pulse delay-75 shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                    <div className="w-1.5 h-1.5 bg-voro-primary rounded-full animate-pulse delay-150 shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                  </div>
                </div>
              </div>
            </section>

            <Card variant="premium" nodeId="CNS_MTX" className="space-y-8">
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
            </Card>

            <Card variant="premium" nodeId="DLY_ENG" className="p-8">
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
            </Card>

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

const QUICK_LOG_ICONS = {
  meal: Utensils,
  weight: Scale,
  water: Droplets
};

const QuickLogModal = ({ isOpen, onClose, onSubmit }) => {
  const magnitudeId = useId();
  const [type, setType] = useState('meal');
  const [value, setValue] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Express Manifestation">
      <div className="p-2 space-y-12">
        {/* Classification Node */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-voro-primary/40" />
            <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">Classification</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Object.keys(QUICK_LOG_ICONS).map((t) => {
              const Icon = QUICK_LOG_ICONS[t];
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={`
                    relative py-6 rounded-2xl text-[0.65rem] font-black uppercase tracking-[0.3em] transition-all duration-500 overflow-hidden group/opt
                    active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14]
                    ${type === t
                      ? 'bg-voro-primary text-white shadow-[0_20px_40px_rgba(124,58,237,0.3)] ring-1 ring-white/20'
                      : 'bg-white/[0.02] text-gray-600 border border-white/5 hover:border-white/20 hover:text-gray-300'
                    }
                  `}
                >
                  {type === t && <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-20" />}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <Icon size={18} className={type === t ? 'text-white' : 'text-gray-600 group-hover/opt:text-gray-300'} />
                    <span className="relative z-10">{t}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Magnitude Entry Node */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-voro-primary/40" />
            <label
              htmlFor={magnitudeId}
              className="text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500 cursor-pointer"
            >
              Magnitude Entry
            </label>
          </div>
          <div className="relative">
            <Input
              id={magnitudeId}
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'meal' ? 'Energy intake...' : type === 'weight' ? 'Current mass...' : 'Hydration level...'}
              autoFocus
              className="w-full"
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
               <div className="h-4 w-px bg-white/5" />
               <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.3em] text-voro-primary/60">
                 {type === 'meal' ? 'kcal' : type === 'weight' ? 'kg' : 'ml'}
               </span>
            </div>
          </div>
        </div>

        {/* Execution Sequence */}
        <div className="flex gap-4 pt-6">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Abort
          </Button>
          <Button
            onClick={() => onSubmit(type, value)}
            disabled={!value || parseFloat(value) <= 0}
            className="flex-[2]"
          >
            Confirm Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Dashboard;
