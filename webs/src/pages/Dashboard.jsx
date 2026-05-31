import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Activity,
  Zap,
  ChevronRight,
  Shield,
  Dna,
  Binary,
  Waves,
  Maximize2,
  Atom
} from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import { useStorage } from '@/hooks/useStorage';
import { useAI } from '@/hooks/useAI';
import { useNotifications } from '@/hooks/useNotifications';
import Modal from '@/components/Modal';

// --- Visual Sub-Components (The Biology & Nutrition Matrix) ---

const BiologicalCore = ({ recoveryScore = 85 }) => (
  <div className="relative w-full aspect-[3/4] flex items-center justify-center perspective-1000">
    <div className="absolute inset-0 bg-gradient-to-b from-voro-primary/5 to-transparent rounded-full blur-3xl opacity-20 transform-3d -translate-z-20" />

    {/* Stylized Human Silhouette / Matrix Core */}
    <div className="relative w-full h-full flex items-center justify-center animate-float">
      <svg viewBox="0 0 200 300" className="w-[80%] h-[80%] drop-shadow-[0_0_30px_rgba(124,58,237,0.3)]">
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Abstract "Vitals" Nodes */}
        <path
          d="M100,20 C110,20 120,30 120,50 C120,80 80,80 80,50 C80,30 90,20 100,20 Z"
          fill="none" stroke="url(#bodyGrad)" strokeWidth="0.5"
          className="animate-pulse"
        />
        <path
          d="M80,55 L50,110 L60,180 L85,280 L115,280 L140,180 L150,110 L120,55 Z"
          fill="rgba(124,58,237,0.05)" stroke="url(#bodyGrad)" strokeWidth="1"
          strokeDasharray="2 2"
        />
        {/* Recovery "Heatmap" Points */}
        <circle cx="100" cy="90" r="4" fill="#7C3AED" filter="url(#glow)" className="animate-ping opacity-70" />
        <circle cx="70" cy="130" r="3" fill="#10B981" filter="url(#glow)" />
        <circle cx="130" cy="130" r="3" fill="#10B981" filter="url(#glow)" />
        <circle cx="80" cy="220" r="3" fill="#7C3AED" filter="url(#glow)" />
        <circle cx="120" cy="220" r="3" fill="#7C3AED" filter="url(#glow)" />
      </svg>

      {/* Floating HUD Elements */}
      <div className="absolute top-[10%] -left-[5%] p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg transform -rotate-6">
        <p className="text-[10px] font-mono text-voro-primary uppercase tracking-tighter mb-1">Neural State</p>
        <p className="text-sm font-bold text-white uppercase tracking-widest font-serif">Optimized</p>
      </div>

      <div className="absolute bottom-[20%] -right-[5%] p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg transform rotate-3">
        <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-tighter mb-1">Recovery index</p>
        <p className="text-sm font-bold text-white font-mono tracking-tighter">{recoveryScore}%</p>
      </div>
    </div>
  </div>
);

const FuelRing = ({ label, value, max, color, icon: Icon }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <div className="relative group flex flex-col items-center">
      <div className="relative w-32 h-32 transform-gpu transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
        {/* 3D Depth Rings */}
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="6"
            strokeDasharray="283" strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Icon size={14} className="mb-1 opacity-40" style={{ color }} />
          <span className="text-lg font-mono font-bold tracking-tighter text-white">{value}</span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">grams</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
};

const HydrationMatrix = ({ level = 0, goal = 2000 }) => {
  const pct = Math.min((level / goal) * 100, 100);

  return (
    <div className="relative h-64 w-full bg-black/20 rounded-3xl overflow-hidden border border-white/5 flex items-end shadow-inner">
      {/* Liquid Simulation Layer */}
      <div
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-1000 ease-in-out"
        style={{ height: `${pct}%` }}
      >
        <div className="absolute top-0 inset-x-0 h-4 bg-white/20 blur-sm animate-pulse" />
        <svg className="absolute -top-6 left-0 w-[200%] h-12 fill-cyan-400/30 animate-wave-slow" viewBox="0 0 1000 100">
          <path d="M0,50 Q250,0 500,50 T1000,50 V100 H0 Z" />
        </svg>
      </div>

      <div className="relative z-10 w-full p-6 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <Waves size={20} className="text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.3em]">Intracellular Index</span>
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-mono font-bold text-white tracking-tighter">{(level / 1000).toFixed(2)}L</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hydration Saturation: {pct.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Implementation ---

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { getItem, setItem } = useStorage();
  const { response: aiInsight } = useAI();
  const { addNotification } = useNotifications();
  
  const [nutritionToday, setNutritionToday] = useState(null);
  const [workoutToday, setWorkoutToday] = useState(null);
  const [showQuickLog, setShowQuickLog] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Biological Matrix';
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
    setWorkoutToday(workoutLog[today]);
  };

  const handleQuickLog = (type, value) => {
    const today = new Date().toISOString().split('T')[0];
    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue <= 0) {
      addNotification('Invalid magnitude detected', 'error');
      return;
    }

    if (type === 'weight') {
      const metrics = getItem('voro_body_metrics') || { weights: [] };
      metrics.weights.push({ date: today, value: numValue });
      setItem('voro_body_metrics', metrics);
      addNotification('Mass record synthesized', 'success');
    } else if (type === 'water') {
      const log = getItem('voro_nutrition_log') || {};
      if (!log[today]) log[today] = { meals: {}, water: 0, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
      log[today].water = (log[today].water || 0) + numValue;
      setItem('voro_nutrition_log', log);
      addNotification('Saturation levels elevated', 'success');
    } else if (type === 'meal') {
      const log = getItem('voro_nutrition_log') || {};
      if (!log[today]) log[today] = { meals: {}, water: 0, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
      const mealId = `exp_${Date.now()}`;
      log[today].meals[mealId] = { name: 'Matrix Entry', calories: numValue, protein: 0, carbs: 0, fat: 0, timestamp: new Date().toISOString() };
      log[today].totals.calories += numValue;
      setItem('voro_nutrition_log', log);
      addNotification('Energy dynamics integrated', 'success');
    }

    loadDashboardData();
    setShowQuickLog(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] overflow-x-hidden">
      {/* Background Micro-asymmetry elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[15%] left-[5%] w-[30vw] h-[30vw] bg-voro-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[20vw] h-[20vw] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-8 py-16 lg:px-24">
        {/* Editorial Header */}
        <header className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-4 text-voro-primary">
              <Shield size={16} />
              <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Biological Status: Secure</span>
              <div className="h-[1px] w-12 bg-voro-primary/30" />
            </div>
            <h1 className="text-7xl md:text-8xl font-black font-serif italic text-white leading-[0.9] tracking-tighter">
              The {new Date().getHours() < 12 ? 'Ascension' : 'Metabolic'} <span className="text-gradient not-italic">Matrix</span>
            </h1>
            <p className="text-gray-500 font-mono text-sm tracking-tight flex items-center gap-3">
              <Binary size={14} className="text-voro-primary/50" />
              SYNCHRONIZING SUBJECT: {user.name.toUpperCase()} // TEMPORAL NODE: {new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowQuickLog(true)}
              className="group relative overflow-hidden px-8 py-5 bg-white text-black rounded-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-voro-primary to-voro-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
              <Plus size={20} strokeWidth={3} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Synthesize Data</span>
            </button>
            <button
              onClick={() => navigate('/ai-coach')}
              className="px-8 py-5 border border-white/10 bg-black/40 backdrop-blur-xl rounded-sm hover:border-voro-primary/50 transition-all flex items-center gap-4"
            >
              <Zap size={20} className="text-voro-accent" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white">AI Neural Link</span>
            </button>
          </div>
        </header>

        {/* The Matrix Exhibition Grid */}
        <div className="grid grid-cols-12 gap-x-12 gap-y-16">

          {/* Column 1: Physical Domain */}
          <div className="col-span-12 lg:col-span-4 space-y-12">
            <section className="relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-[#0A0C14] rounded-[calc(1.5rem-1px)]" />
              <div className="relative p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono font-bold text-voro-primary uppercase tracking-[0.3em]">Biological Core</h3>
                  <Maximize2 size={16} className="text-gray-600 hover:text-white cursor-pointer transition-colors" />
                </div>

                <BiologicalCore recoveryScore={workoutToday?.attended ? 45 : 88} />

                <div className="pt-8 border-t border-white/5 space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Hypertrophy Progress</p>
                      <p className="text-2xl font-serif italic text-white">Neural Drive Active</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-emerald-400 font-bold">104.2%</p>
                      <p className="text-[8px] font-black text-gray-600 uppercase">Velocity</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/workout/log')}
                    className="w-full py-4 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 transition-all rounded-sm"
                  >
                    Examine Neural Logs
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <Dna size={18} className="text-voro-secondary" />
                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.3em]">Genetic Potential Insight</h3>
              </div>
              <div className="p-8 bg-gradient-to-r from-voro-primary/20 to-transparent border-l-2 border-voro-primary rounded-r-2xl">
                <p className="text-lg font-serif leading-relaxed italic text-gray-200">
                  "{aiInsight || `Subject's metabolic velocity is currently peaking at 2.4k. Intracellular saturation levels indicate a prime window for anabolic fuel integration within the next 45 temporal units.`}"
                </p>
              </div>
            </section>
          </div>

          {/* Column 2: Nutritional Matrix */}
          <div className="col-span-12 lg:col-span-8 space-y-16">

            {/* Metabolic Velocity Centerpiece */}
            <section className="relative overflow-hidden p-12 bg-[#0A0C14] border border-white/5 rounded-[3rem] shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-voro-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />

              <div className="relative flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Atom size={18} className="text-voro-primary animate-spin-slow" />
                      <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-[0.3em]">Metabolic Velocity</h3>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-8xl font-serif font-black tracking-tighter text-white">
                        {nutritionToday?.totals?.calories || 0}
                      </span>
                      <span className="text-sm font-mono text-gray-500 uppercase tracking-widest italic">kcal / 24h</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <p className="text-[10px] font-mono text-voro-primary uppercase tracking-widest mb-1">Target Threshold</p>
                      <p className="text-2xl font-mono font-bold text-white tracking-tighter">{user.calorieGoal || 2000} <span className="text-[10px] text-gray-600">LIMIT</span></p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-1">Fuel Delta</p>
                      <p className="text-2xl font-mono font-bold text-white tracking-tighter">
                        {Math.max(0, (user.calorieGoal || 2000) - (nutritionToday?.totals?.calories || 0))} <span className="text-[10px] text-gray-600">REMAIN</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-center gap-8">
                  <HydrationMatrix level={nutritionToday?.water || 0} goal={user.waterGoal || 2000} />
                </div>
              </div>
            </section>

            {/* Anabolic Fuel Ratios */}
            <section className="space-y-12">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.4em]">Anabolic Fuel Ratios</h3>
                <div className="h-[1px] flex-1 mx-8 bg-white/5" />
                <button
                  onClick={() => navigate('/nutrition/diary')}
                  className="text-[10px] font-black uppercase tracking-widest text-voro-primary hover:text-white transition-colors"
                >
                  Edit Manifest
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                <FuelRing
                  label="Structural Protein"
                  value={nutritionToday?.totals?.protein || 0}
                  max={user.proteinGoal || 150}
                  color="#7C3AED"
                  icon={Shield}
                />
                <FuelRing
                  label="Glycogen Flux"
                  value={nutritionToday?.totals?.carbs || 0}
                  max={user.carbsGoal || 250}
                  color="#10B981"
                  icon={Zap}
                />
                <FuelRing
                  label="Lipid Integrity"
                  value={nutritionToday?.totals?.fat || 0}
                  max={user.fatGoal || 70}
                  color="#F59E0B"
                  icon={Atom}
                />
              </div>
            </section>

            {/* Grid-breaking Stat Blocks */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
               <div className="group p-10 bg-[#0A0C14] border border-white/5 rounded-sm hover:border-voro-primary/50 transition-all transform hover:-translate-y-2">
                 <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mb-4">Consistency Resonance</p>
                 <div className="flex items-center gap-6">
                    <div className="text-5xl font-serif italic text-white">08</div>
                    <div className="h-10 w-[1px] bg-white/10" />
                    <p className="text-[10px] font-mono text-voro-primary uppercase leading-relaxed tracking-widest">
                      Consecutive Days of<br />Metabolic Integration
                    </p>
                 </div>
               </div>

               <div className="group p-10 bg-[#0A0C14] border border-white/5 rounded-sm hover:border-emerald-500/50 transition-all transform hover:-translate-y-2 translate-y-8">
                 <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mb-4">Neural Drive History</p>
                 <div className="flex items-center gap-6">
                    <div className="text-5xl font-serif italic text-white">12</div>
                    <div className="h-10 w-[1px] bg-white/10" />
                    <p className="text-[10px] font-mono text-emerald-400 uppercase leading-relaxed tracking-widest">
                      Temporal Sessions<br />Synthesized This Phase
                    </p>
                 </div>
               </div>
            </section>
          </div>
        </div>
      </div>

      {/* Quick Log Modal Implementation */}
      {showQuickLog && (
        <QuickLogModal
          isOpen={showQuickLog}
          onClose={() => setShowQuickLog(false)}
          onSubmit={handleQuickLog}
        />
      )}

      {/* Custom Styles for Overhaul */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes wave-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-slow {
          animation: wave-slow 15s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-3d {
          transform-style: preserve-3d;
        }
        .translate-z-20 {
          transform: translateZ(-20px);
        }
        .text-gradient {
          background: linear-gradient(to right, #7C3AED, #A78BFA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

const QuickLogModal = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState('meal');
  const [value, setValue] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Neural Link: Data Synthesis">
      <div className="p-4 space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-500 ml-1">Manifest Category</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'meal', label: 'Fuel' },
              { id: 'weight', label: 'Mass' },
              { id: 'water', label: 'Fluid' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${type === t.id ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-500 ml-1">Temporal Magnitude</label>
          <div className="relative">
             <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent border-b-2 border-white/10 py-6 text-6xl font-serif italic text-white focus:outline-none focus:border-voro-primary transition-all placeholder:text-gray-900"
            />
            <div className="absolute right-0 bottom-6 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-voro-primary">
               {type === 'meal' ? 'kcal' : type === 'weight' ? 'kg' : 'ml'}
            </div>
          </div>
        </div>

        <div className="flex gap-6 pt-6">
          <button
            onClick={onClose}
            className="flex-1 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all"
          >
            Abort Link
          </button>
          <button
            onClick={() => onSubmit(type, value)}
            className="flex-[2] py-5 bg-voro-primary text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-voro-primary-dark transition-all shadow-[0_10px_30px_rgba(124,58,237,0.3)]"
          >
            Synchronize
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Dashboard;
