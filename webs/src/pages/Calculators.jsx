import React, { useEffect, useMemo } from 'react';
import { Card, Tabs } from '@/components';
import { useCalculators } from '@/hooks/useCalculators';
import { useApp } from '@/hooks/useAppContext';
import { Activity, Flame, Zap, Target, Dumbbell, TrendingDown } from 'lucide-react';

const Calculators = () => {
  const { 
    calculateBMI, 
    calculateBMR, 
    calculateTDEE, 
    calculateIdealWeight, 
    calculateFFMI 
  } = useCalculators();
  const { user } = useApp();
  const [active, setActive] = React.useState('bmi');

  useEffect(() => {
    document.title = 'VORO | Biometric Calculators';
  }, []);

  const calculatorTabs = useMemo(() => {
    if (!user) return [];

    // Helper to ensure we don't call toFixed on strings
    const formatValue = (val, decimals = 1) => {
      const num = parseFloat(val);
      return isNaN(num) ? '0.0' : num.toFixed(decimals);
    };

    return [
      {
        id: 'bmi',
        label: 'BMI',
        icon: <Activity size={18} />,
        content: (
          <div className="animate-slide-up">
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Body Mass Index</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
                    {formatValue(calculateBMI(user.currentWeight, user.heightCm), 1)}
                  </span>
                  <span className="text-sm font-black text-voro-primary uppercase tracking-widest">Index</span>
                </div>
                <p className="text-gray-400 font-medium tracking-widest text-xs uppercase">Classification: Normal Range</p>
              </div>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest block mb-2">Current Metrics</span>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-serif italic text-xl">{user.currentWeight} kg</span>
                    <span className="text-white font-serif italic text-xl">{user.heightCm} cm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'bmr',
        label: 'BMR',
        icon: <Flame size={18} />,
        content: (
          <div className="animate-slide-up">
             <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Basal Metabolic Rate</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
                    {formatValue(calculateBMR(
                      user.currentWeight,
                      user.heightCm,
                      user.age,
                      user.gender
                    ), 0)}
                  </span>
                  <span className="text-sm font-black text-voro-secondary uppercase tracking-widest">kcal/day</span>
                </div>
                <p className="text-gray-400 font-medium tracking-widest text-xs uppercase">Mifflin-St Jeor Algorithm</p>
              </div>
              <div className="p-8 rounded-3xl bg-voro-secondary/5 border border-voro-secondary/10">
                <p className="text-gray-300 text-sm leading-relaxed italic font-serif">
                  "Your BMR represents the minimum energy expenditure required to maintain vital physiological functions at complete rest."
                </p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'tdee',
        label: 'TDEE',
        icon: <Zap size={18} />,
        content: (
          <div className="animate-slide-up">
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Total Daily Energy Expenditure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
                    {formatValue(calculateTDEE(user.bmr || 1500, user.activityLevel || 'moderately_active'), 0)}
                  </span>
                  <span className="text-sm font-black text-voro-accent uppercase tracking-widest">kcal/day</span>
                </div>
                <p className="text-gray-400 font-medium tracking-widest text-xs uppercase">Activity Magnitude: {user.activityLevel?.replace('_', ' ')}</p>
              </div>
              <div className="space-y-4">
                 {[
                  { label: 'Maintenance', value: '100%', color: 'bg-voro-accent' },
                  { label: 'Hypertrophy', value: '110%', color: 'bg-voro-primary' },
                  { label: 'Fat Loss', value: '80%', color: 'bg-voro-secondary' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[0.6rem] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                    <span className="text-white font-serif italic font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'ideal',
        label: 'Ideal Weight',
        icon: <Target size={18} />,
        content: (
          <div className="animate-slide-up">
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Ideal Body Weight</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
                    {formatValue(calculateIdealWeight(user.heightCm, user.gender), 1)}
                  </span>
                  <span className="text-sm font-black text-voro-primary uppercase tracking-widest">kg</span>
                </div>
                <p className="text-gray-400 font-medium tracking-widest text-xs uppercase">Devine Formula Calibration</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest block">Variance</span>
                      <span className="text-2xl font-serif italic font-bold text-white">±10%</span>
                   </div>
                   <div className="w-12 h-12 rounded-full border border-voro-primary/30 flex items-center justify-center">
                      <Target size={20} className="text-voro-primary" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'ffmi',
        label: 'FFMI',
        icon: <Dumbbell size={18} />,
        content: (
          <div className="animate-slide-up">
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Fat-Free Mass Index</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
                    {formatValue(calculateFFMI(user.currentWeight, 20, user.heightCm), 1)}
                  </span>
                  <span className="text-sm font-black text-voro-secondary uppercase tracking-widest">Normalized</span>
                </div>
                <p className="text-gray-400 font-medium tracking-widest text-xs uppercase">Anabolic Potential Matrix</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest block mb-1">Average</span>
                    <span className="text-lg font-serif italic text-white font-bold">18 - 21</span>
                 </div>
                 <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest block mb-1">Elite</span>
                    <span className="text-lg font-serif italic text-white font-bold">22 - 25</span>
                 </div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'deficit',
        label: 'Deficit',
        icon: <TrendingDown size={18} />,
        content: (
          <div className="animate-slide-up">
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Kinetic Loss Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
                    {formatValue(user.tdee - 500, 0)}
                  </span>
                  <span className="text-sm font-black text-voro-danger uppercase tracking-widest">kcal/day</span>
                </div>
                <p className="text-gray-400 font-medium tracking-widest text-xs uppercase">Strategic 500 kcal Deficit</p>
              </div>
              <div className="p-8 rounded-3xl bg-voro-danger/5 border border-voro-danger/10">
                <div className="flex items-center gap-6">
                  <div className="text-4xl">📉</div>
                  <div>
                    <span className="text-2xl font-serif italic font-bold text-white">≈ 0.5 kg</span>
                    <span className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest block">Projected Weekly Shift</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
    ];
  }, [user, calculateBMI, calculateBMR, calculateTDEE, calculateIdealWeight, calculateFFMI]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080B14]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-voro-primary border-t-transparent animate-spin mb-4" />
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Analyzing Biometrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-12 py-20">
        <header className="mb-20">
           <div className="flex items-center gap-3 text-voro-primary mb-4">
              <Zap size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Computation Engine</span>
            </div>
            <h1 className="text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Biometric <span className="text-gradient not-italic font-bold">Calculators</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-xs uppercase mt-4 opacity-60">Mathematical models for physiological evolution</p>
        </header>

        {/* Refined Tabs Integration */}
        <div className="mb-16">
          <Tabs
            tabs={calculatorTabs}
            activeTab={active}
            onTabChange={setActive}
          />
        </div>

        <Card className="p-12 md:p-16 bg-[#0A0C14] border-white/5 rounded-[3rem] shadow-2xl">
           {/* The Tabs component handles its own content rendering via the tabs prop */}
           {calculatorTabs.find(t => t.id === active)?.content}
        </Card>

        <footer className="mt-20 pt-12 border-t border-white/5">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] block mb-4">Precision</span>
                <p className="text-xs text-gray-500 leading-relaxed">All formulas utilize peer-reviewed physiological models including Mifflin-St Jeor and Devine equations for maximum accuracy.</p>
              </div>
              <div>
                <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] block mb-4">Context</span>
                <p className="text-xs text-gray-500 leading-relaxed">Biometric markers should be interpreted within the context of overall lifestyle, training load, and metabolic history.</p>
              </div>
              <div>
                <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] block mb-4">Sync</span>
                <p className="text-xs text-gray-500 leading-relaxed">Updates to your profile metrics automatically synchronize across all computational models in real-time.</p>
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Calculators;
