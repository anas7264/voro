import React, { useEffect, useState, useMemo, memo } from 'react';
import Card from '@/components/Card';
import Tabs from '@/components/Tabs';
import { useCalculators } from '@/hooks/useCalculators';
import { useAppContext as useApp } from '@/hooks/useAppContext';
import {
  Activity,
  Flame,
  Zap,
  Target,
  Dumbbell,
  TrendingDown,
  Sparkles,
  Scale,
  Info,
  Layers,
  ChevronRight,
  TrendingUp,
  Brain,
  ShieldAlert,
  CalendarDays
} from 'lucide-react';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Isolated Active Calculator Components.
 * Re-engineered to the 'Forge' luxury standard with custom visualizers,
 * mathematical whitespace, and interactive micro-animations.
 */

// 1. BMI CALCULATOR
const BMICalculator = memo(({ weight, height, calculateBMI, getBMICategory }) => {
  const bmi = useMemo(() => calculateBMI(weight, height), [weight, height, calculateBMI]);
  const category = useMemo(() => getBMICategory(bmi), [bmi, getBMICategory]);

  // Position caret indicator along the horizontal spectrum (min: 15, max: 35)
  const bmiPct = useMemo(() => {
    const val = parseFloat(bmi);
    return Math.min(Math.max(((val - 15) / 20) * 100, 0), 100);
  }, [bmi]);

  return (
    <div className="animate-slide-up space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[0.65rem] font-mono font-black text-voro-primary uppercase tracking-[0.3em] mb-2">Biometric Index</h3>
          <p className="text-3xl font-serif font-bold text-white tracking-tight">Body Mass Index</p>
        </div>
        <div className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[0.45rem] text-gray-500 uppercase tracking-widest">
          NODE // BMI_SPEC_01
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Cinematic value display */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-8xl font-serif italic font-medium tracking-tighter text-white select-none">
              {bmi}
            </span>
            <span className="text-sm font-mono font-black text-voro-primary uppercase tracking-[0.2em] relative -top-4">
              kg/m²
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest block">Classification Spectrum</span>
            <span className="text-xl font-serif italic text-voro-primary font-bold">{category}</span>
          </div>
        </div>

        {/* Right Side: Interactive color-graded spectrum bar */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between text-[0.55rem] font-mono font-black text-gray-600 uppercase tracking-widest">
              <span>Underweight (15)</span>
              <span>Normal (18.5)</span>
              <span>Overweight (25)</span>
              <span>Obese (30+)</span>
            </div>

            {/* Gradient Track */}
            <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-blue-500/80 via-green-500/80 via-yellow-500/80 to-red-500/80 shadow-inner overflow-visible">
              {/* Caret Indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ left: `${bmiPct}%` }}
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)] relative z-10 animate-pulse" />
                  <div className="w-0.5 h-6 bg-white/60 absolute top-2" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
            <Info size={16} className="text-voro-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              BMI serves as a general systemic surrogate for adiposity. While extremely useful for population studies, it does not directly differentiate between skeletal muscle and adipose tissue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

BMICalculator.displayName = "BMICalculator";


// 2. BMR CALCULATOR
const BMRCalculator = memo(({ weight, height, age, gender, calculateBMR }) => {
  const bmr = useMemo(() => calculateBMR(weight, height, age, gender), [weight, height, age, gender, calculateBMR]);

  // Scientific allocation of resting metabolic expenditure
  const organBmr = useMemo(() => Math.round(bmr * 0.60), [bmr]);
  const digestiveBmr = useMemo(() => Math.round(bmr * 0.10), [bmr]);
  const nervousBmr = useMemo(() => Math.round(bmr * 0.30), [bmr]);

  return (
    <div className="animate-slide-up space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[0.65rem] font-mono font-black text-voro-secondary uppercase tracking-[0.3em] mb-2">Metabolic Velocity Core</h3>
          <p className="text-3xl font-serif font-bold text-white tracking-tight">Basal Metabolic Rate</p>
        </div>
        <div className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[0.45rem] text-gray-500 uppercase tracking-widest">
          ALGO // MIFFLIN_ST_JEOR
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left display */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
              {bmr}
            </span>
            <span className="text-sm font-mono font-black text-voro-secondary uppercase tracking-[0.2em]">
              kcal/day
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest block">Baseline Autonomic Expenditure</span>
            <span className="text-lg font-serif text-white font-bold italic">100% Hermetic Maintenance</span>
          </div>
        </div>

        {/* Right sub-allocation breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-widest block">Systemic Allocation Profile</span>

          <div className="space-y-4">
            {[
              { label: 'Visceral & Organic Load (60%)', value: organBmr, color: 'bg-voro-primary/80', desc: 'Liver, kidneys, heart, and metabolic viscera' },
              { label: 'Neural & Skeletal Activation (30%)', value: nervousBmr, color: 'bg-voro-secondary/80', desc: 'Central nervous system and quiet muscular tone' },
              { label: 'Thermic Maintenance (10%)', value: digestiveBmr, color: 'bg-voro-accent/80', desc: 'Digestive organ base state and baseline cell repair' }
            ].map((zone) => (
              <div key={zone.label} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs font-bold text-gray-400">{zone.label}</span>
                  <span className="text-sm font-mono font-bold text-white">{zone.value} kcal</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full transition-all duration-1000 ${zone.color}`}
                    style={{ width: `${(zone.value / bmr) * 100}%` }}
                  />
                </div>
                <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-wide block">{zone.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

BMRCalculator.displayName = "BMRCalculator";


// 3. TDEE CALCULATOR
const TDEECalculator = memo(({ weight, height, age, gender, activityLevel, calculateBMR, calculateTDEE }) => {
  const bmr = useMemo(() => calculateBMR(weight, height, age, gender), [weight, height, age, gender, calculateBMR]);
  const tdee = useMemo(() => calculateTDEE(bmr, activityLevel), [bmr, activityLevel, calculateTDEE]);

  const multipliers = useMemo(() => [
    { key: 'sedentary', label: 'Sedentary', multiplier: 1.2, desc: 'Little to no exercise, quiet desk profile' },
    { key: 'lightly_active', label: 'Lightly Active', multiplier: 1.375, desc: '1–3 days/week of light athletic training' },
    { key: 'moderately_active', label: 'Moderately Active', multiplier: 1.55, desc: '3–5 days/week of high-intensity training' },
    { key: 'very_active', label: 'Very Active', multiplier: 1.725, desc: '6–7 days/week of heavy metabolic load' },
    { key: 'extremely_active', label: 'Extremely Active', multiplier: 1.9, desc: 'Double daily kinetic sessions or elite athlete load' }
  ], []);

  return (
    <div className="animate-slide-up space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[0.65rem] font-mono font-black text-voro-accent uppercase tracking-[0.3em] mb-2">Active Kinetic Velocity</h3>
          <p className="text-3xl font-serif font-bold text-white tracking-tight">Total Daily Energy Expenditure</p>
        </div>
        <div className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[0.45rem] text-gray-500 uppercase tracking-widest">
          NODE // TDEE_ACTIVE_03
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side TDEE Value */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
                {tdee}
              </span>
              <span className="text-sm font-mono font-black text-voro-accent uppercase tracking-[0.2em]">
                kcal/day
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest block">Active Metabolic Target</span>
              <span className="text-lg font-serif text-white font-bold italic">
                {activityLevel.replace('_', ' ').toUpperCase()} Scale
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <span className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-widest block">Deficit vs Surplus Zones</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-center">
                <span className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest block">Fat Loss Base</span>
                <span className="text-xl font-serif font-bold text-red-400">{Math.round(tdee - 500)} kcal</span>
              </div>
              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl text-center">
                <span className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest block">Anabolic Load</span>
                <span className="text-xl font-serif font-bold text-green-400">{Math.round(tdee * 1.1)} kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Interactive Multipliers List */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-widest block mb-2">Metabolic Multiplier Index</span>
          <div className="space-y-2.5">
            {multipliers.map((m) => {
              const isActive = activityLevel === m.key;
              const val = Math.round(bmr * m.multiplier);

              return (
                <div
                  key={m.key}
                  className={`
                    relative p-5 rounded-2xl border transition-all duration-500 overflow-hidden
                    ${isActive
                      ? "border-voro-accent bg-voro-accent/[0.03] shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                      : "border-white/5 bg-white/[0.01] hover:border-white/10"
                    }
                  `}
                >
                  {isActive && <div className="kinetic-sweep opacity-10" />}

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-voro-accent animate-pulse shadow-[0_0_8px_#F59E0B]' : 'bg-gray-800'}`} />
                      <div>
                        <span className={`text-xs font-bold ${isActive ? 'text-white font-serif italic text-sm' : 'text-gray-400'}`}>
                          {m.label}
                        </span>
                        <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-wider block mt-1">{m.desc}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono text-sm font-bold ${isActive ? 'text-voro-accent text-lg' : 'text-gray-500'}`}>
                        {val} <span className="text-[0.55rem] text-gray-600 uppercase font-black">kcal</span>
                      </span>
                      <span className="text-[0.5rem] font-mono text-gray-700 block mt-0.5">x{m.multiplier} multiplier</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

TDEECalculator.displayName = "TDEECalculator";


// 4. IDEAL WEIGHT CALCULATOR
const IdealWeightCalculator = memo(({ height, gender, calculateIdealWeight }) => {
  const idealWeight = useMemo(() => calculateIdealWeight(height, gender), [height, gender, calculateIdealWeight]);

  // Derive variance bounds (±10% weight deviation range)
  const lowerBound = useMemo(() => idealWeight * 0.9, [idealWeight]);
  const upperBound = useMemo(() => idealWeight * 1.1, [idealWeight]);

  return (
    <div className="animate-slide-up space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[0.65rem] font-mono font-black text-voro-primary uppercase tracking-[0.3em] mb-2">Biological Calibration</h3>
          <p className="text-3xl font-serif font-bold text-white tracking-tight">Ideal Body Weight</p>
        </div>
        <div className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[0.45rem] text-gray-500 uppercase tracking-widest">
          FORMULA // DEVINE_HEIGHT_CAL
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side display */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
              {Number(idealWeight).toFixed(1)}
            </span>
            <span className="text-sm font-mono font-black text-voro-primary uppercase tracking-[0.2em]">
              kg
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest block">Structural Homoeostasis Center</span>
            <span className="text-lg font-serif text-white font-bold italic">Perfect Mechanical Equilibrium</span>
          </div>
        </div>

        {/* Symmetrical target range display */}
        <div className="lg:col-span-7 space-y-8">
          <span className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-widest block">Symmetrical Adaptive Variance Range (±10%)</span>

          <div className="relative p-8 rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col justify-center overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-voro-primary/5 rounded-full blur-xl pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="text-left">
                <span className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest block">Lower Boundary</span>
                <span className="text-2xl font-serif italic font-medium text-gray-400">{Number(lowerBound).toFixed(1)} kg</span>
              </div>
              <div className="w-12 h-12 rounded-full border border-voro-primary/30 flex items-center justify-center animate-pulse">
                <Target size={20} className="text-voro-primary" />
              </div>
              <div className="text-right">
                <span className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest block">Upper Boundary</span>
                <span className="text-2xl font-serif italic font-medium text-gray-400">{Number(upperBound).toFixed(1)} kg</span>
              </div>
            </div>

            {/* Symmetrical Brackets visualizer */}
            <div className="relative h-6 flex items-center justify-between px-2">
              <span className="text-white/20 font-mono text-xl select-none">[</span>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-white/5 via-voro-primary/60 to-white/5 relative mx-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-voro-primary border border-white" />
              </div>
              <span className="text-white/20 font-mono text-xl select-none">]</span>
            </div>
            <span className="text-center text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest mt-4">
              90% to 110% Physiological Density Scale
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

IdealWeightCalculator.displayName = "IdealWeightCalculator";


// 5. FFMI CALCULATOR
const FFMICalculator = memo(({ weight, height, bodyFat, calculateFFMI }) => {
  const ffmi = useMemo(() => calculateFFMI(weight, bodyFat, height), [weight, bodyFat, height, calculateFFMI]);

  // Muscular classification tiers
  const tiers = useMemo(() => [
    { label: 'Below Average / Lean', range: '< 18.0', key: 'lean', desc: 'Typical baseline somatic mass or athletic fat-free structure.' },
    { label: 'Average / Active', range: '18.0 - 20.0', key: 'active', desc: 'Consistent active training adaptation, healthy dense matrix.' },
    { label: 'Advanced Athletic', range: '20.1 - 22.0', key: 'advanced', desc: 'Extensive progression overload training, outstanding skeletal muscle.' },
    { label: 'Elite Tier', range: '22.1 - 25.0', key: 'elite', desc: 'Near physiological limit of natural biological muscular density.' },
    { label: 'Somatic Genetic Ceiling', range: '> 25.0', key: 'ceiling', desc: 'Exceeds standard human biological limits without pharmacological synthesis.' }
  ], []);

  const activeKey = useMemo(() => {
    const val = parseFloat(ffmi);
    if (val < 18) return 'lean';
    if (val <= 20) return 'active';
    if (val <= 22) return 'advanced';
    if (val <= 25) return 'elite';
    return 'ceiling';
  }, [ffmi]);

  return (
    <div className="animate-slide-up space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[0.65rem] font-mono font-black text-voro-secondary uppercase tracking-[0.3em] mb-2">Anabolic Muscular Density</h3>
          <p className="text-3xl font-serif font-bold text-white tracking-tight">Fat-Free Mass Index</p>
        </div>
        <div className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[0.45rem] text-gray-500 uppercase tracking-widest">
          NODE // FFMI_ANABOLIC_05
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left display */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-8xl font-serif italic font-medium tracking-tighter text-white">
                {ffmi}
              </span>
              <span className="text-sm font-mono font-black text-voro-secondary uppercase tracking-[0.2em]">
                index
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest block">Muscular Potential Status</span>
              <span className="text-lg font-serif text-white font-bold italic">
                {tiers.find(t => t.key === activeKey)?.label || "Undetermined"}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
            <Info size={16} className="text-voro-secondary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Fat-Free Mass Index normalizes skeletal muscular mass to your absolute height, preventing weight bias, and tracks biological potential over long cycles.
            </p>
          </div>
        </div>

        {/* Right Benchmarks Matrix */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-widest block mb-2">Anabolic Potential Matrix Tiers</span>
          <div className="space-y-2.5">
            {tiers.map((t) => {
              const isActive = activeKey === t.key;
              return (
                <div
                  key={t.key}
                  className={`
                    relative p-5 rounded-2xl border transition-all duration-500 overflow-hidden
                    ${isActive
                      ? "border-voro-secondary bg-voro-secondary/[0.03] shadow-[0_0_25px_rgba(16,185,129,0.08)]"
                      : "border-white/5 bg-white/[0.01] hover:border-white/10"
                    }
                  `}
                >
                  {isActive && (
                    <>
                      <div className="absolute right-4 top-4 bg-voro-secondary/20 border border-voro-secondary/40 text-voro-secondary rounded-full px-3 py-1 font-mono text-[0.45rem] tracking-wider uppercase">
                        [CHOSEN_TIER]
                      </div>
                      <div className="kinetic-sweep opacity-10" />
                    </>
                  )}

                  <div className="flex justify-between items-baseline mb-1 relative z-10">
                    <span className={`text-xs font-bold ${isActive ? 'text-white font-serif italic text-sm' : 'text-gray-400'}`}>
                      {t.label}
                    </span>
                    <span className={`font-mono text-xs font-bold ${isActive ? 'text-voro-secondary' : 'text-gray-500'}`}>
                      {t.range}
                    </span>
                  </div>
                  <p className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-wide relative z-10 leading-relaxed max-w-[85%]">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

FFMICalculator.displayName = "FFMICalculator";


// 6. DEFICIT CALCULATOR (KINETIC LOSS FORECAST)
const DeficitCalculator = memo(({ weight, height, age, gender, activityLevel, calculateBMR, calculateTDEE }) => {
  const bmr = useMemo(() => calculateBMR(weight, height, age, gender), [weight, height, age, gender, calculateBMR]);
  const tdee = useMemo(() => calculateTDEE(bmr, activityLevel), [bmr, activityLevel, calculateTDEE]);

  // Target deficit state (slider: 0 to 1000 kcal)
  const [deficitTarget, setDeficitTarget] = useState(500);

  // Generate 12-week weight projection based on deficit target
  const forecast = useMemo(() => {
    const list = [];
    let currentWt = parseFloat(weight);

    for (let wk = 1; wk <= 12; wk++) {
      // 1kg of adipose tissue is roughly 7700 kcal
      const totalDeficitKcal = deficitTarget * 7;
      const fatLostKg = totalDeficitKcal / 7700;
      currentWt -= fatLostKg;

      list.push({
        week: wk,
        weight: currentWt.toFixed(1),
        cumulativeFatLoss: (fatLostKg * wk).toFixed(1),
        cumulativeDeficit: (deficitTarget * 7 * wk).toLocaleString()
      });
    }
    return list;
  }, [weight, deficitTarget]);

  return (
    <div className="animate-slide-up space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[0.65rem] font-mono font-black text-voro-danger uppercase tracking-[0.3em] mb-2">Kinetic Loss Forecast</h3>
          <p className="text-3xl font-serif font-bold text-white tracking-tight">Thermodynamic Projection</p>
        </div>
        <div className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[0.45rem] text-gray-500 uppercase tracking-widest">
          SIM // CALORIC_DEF_12W
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Deficit input slider and summary */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest block">Daily Deficit Magnitude</span>
              <span className="px-3 py-1 bg-voro-danger/10 border border-voro-danger/20 text-voro-danger font-mono text-xs font-bold rounded-lg select-none">
                {deficitTarget} kcal/day
              </span>
            </div>

            {/* Premium Deficit Slider */}
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={deficitTarget}
              onChange={(e) => setDeficitTarget(parseInt(e.target.value))}
              className="accent-voro-danger h-1.5 w-full bg-white/5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-voro-danger"
            />
            <div className="flex justify-between text-[0.45rem] font-mono font-black text-gray-700 uppercase tracking-widest select-none">
              <span>0 kcal (Maintenance)</span>
              <span>1000 kcal (Aggressive)</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#0D121F]/40 border border-white/5 space-y-4 relative overflow-hidden">
              <span className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-widest block">Projected 12-Week Synthesis</span>
              <div className="flex items-baseline justify-between">
                <span className="text-5xl font-serif italic font-bold text-white">
                  -{forecast[11].cumulativeFatLoss} <span className="text-xs font-mono font-black text-voro-danger uppercase tracking-widest">kg</span>
                </span>
                <span className="text-lg font-serif italic text-gray-500">
                  Target: {forecast[11].weight} kg
                </span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest">
                <span>Cumulative Deficit</span>
                <span className="text-white font-bold">{forecast[11].cumulativeDeficit} kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline Prediction Calendar Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <CalendarDays size={14} className="text-voro-danger" />
            <span className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-widest">12-Week Projection Timeline</span>
          </div>

          <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
            <table className="w-full font-mono text-[0.6rem] text-left">
              <thead>
                <tr className="bg-white/[0.03] text-gray-500 border-b border-white/5 font-black uppercase tracking-widest">
                  <th className="px-5 py-4">Week</th>
                  <th className="px-5 py-4">Projected Weight</th>
                  <th className="px-5 py-4 text-right">Cumulative Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] font-bold text-gray-400">
                {forecast.filter(f => f.week % 3 === 0).map((f) => (
                  <tr key={f.week} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-white">Week {f.week}</td>
                    <td className="px-5 py-4 text-white font-serif italic text-sm">{f.weight} kg</td>
                    <td className="px-5 py-4 text-right text-voro-danger font-mono text-sm">-{f.cumulativeFatLoss} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

DeficitCalculator.displayName = "DeficitCalculator";


// MAIN MASTERCLASS PAGE
const Calculators = () => {
  const {
    calculateBMI,
    getBMICategory,
    calculateBMR,
    calculateTDEE,
    calculateIdealWeight,
    calculateFFMI
  } = useCalculators();

  const { user } = useApp();
  const [active, setActive] = useState('bmi');

  // Specimen State Variables
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [bodyFat, setBodyFat] = useState(15);
  const [activityLevel, setActivityLevel] = useState('moderately_active');

  // Synchronize local states from real user context on initial loading
  useEffect(() => {
    if (user) {
      if (user.currentWeight) setWeight(user.currentWeight);
      if (user.heightCm) setHeight(user.heightCm);
      if (user.age) setAge(user.age);
      if (user.gender) setGender(user.gender.toLowerCase());
      if (user.bodyFatPercent) setBodyFat(user.bodyFatPercent);
      if (user.activityLevel) setActivityLevel(user.activityLevel);
    }
  }, [user]);

  useEffect(() => {
    document.title = 'VORO | Biometric Calculators';
  }, []);

  const calculatorTabs = useMemo(() => {
    if (!user) return [];

    return [
      { id: 'bmi', label: 'BMI', icon: <Activity size={18} /> },
      { id: 'bmr', label: 'BMR', icon: <Flame size={18} /> },
      { id: 'tdee', label: 'TDEE', icon: <Zap size={18} /> },
      { id: 'ideal', label: 'Ideal Weight', icon: <Target size={18} /> },
      { id: 'ffmi', label: 'FFMI', icon: <Dumbbell size={18} /> },
      { id: 'deficit', label: 'Deficit', icon: <TrendingDown size={18} /> },
    ];
  }, [user]);

  const activeContent = useMemo(() => {
    if (!user) return null;
    switch (active) {
      case 'bmi':
        return (
          <BMICalculator
            weight={weight}
            height={height}
            calculateBMI={calculateBMI}
            getBMICategory={getBMICategory}
          />
        );
      case 'bmr':
        return (
          <BMRCalculator
            weight={weight}
            height={height}
            age={age}
            gender={gender}
            calculateBMR={calculateBMR}
          />
        );
      case 'tdee':
        return (
          <TDEECalculator
            weight={weight}
            height={height}
            age={age}
            gender={gender}
            activityLevel={activityLevel}
            calculateBMR={calculateBMR}
            calculateTDEE={calculateTDEE}
          />
        );
      case 'ideal':
        return (
          <IdealWeightCalculator
            height={height}
            gender={gender}
            calculateIdealWeight={calculateIdealWeight}
          />
        );
      case 'ffmi':
        return (
          <FFMICalculator
            weight={weight}
            height={height}
            bodyFat={bodyFat}
            calculateFFMI={calculateFFMI}
          />
        );
      case 'deficit':
        return (
          <DeficitCalculator
            weight={weight}
            height={height}
            age={age}
            gender={gender}
            activityLevel={activityLevel}
            calculateBMR={calculateBMR}
            calculateTDEE={calculateTDEE}
          />
        );
      default:
        return null;
    }
  }, [
    active,
    user,
    weight,
    height,
    age,
    gender,
    bodyFat,
    activityLevel,
    calculateBMI,
    getBMICategory,
    calculateBMR,
    calculateTDEE,
    calculateIdealWeight,
    calculateFFMI
  ]);

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
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16">
        <header className="mb-20">
          <div className="flex items-center gap-3 text-voro-primary mb-4">
            <Zap size={18} className="animate-pulse" />
            <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.3em]">Computation Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tight text-white leading-tight">
            Biometric <span className="text-gradient not-italic font-bold">Calculators</span>
          </h1>
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase mt-4 opacity-60">
            Interactive mathematical projection models for physiological evolution
          </p>
        </header>

        {/* RE-ENGINEERED: BESPOKE SIDE-BY-SIDE MASTERCLASS LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          {/* LEFT PANEL: BIOMETRIC CALIBRATION ENCLAVE */}
          <section className="xl:col-span-4 space-y-8">
            <Card className="p-8 md:p-10 bg-[#0A0C14] border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              {/* Corner Telemetry Accent */}
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none font-mono text-[0.4rem] font-black">
                [INPUT_CON_X2]
              </div>

              <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-voro-primary/10 text-voro-primary rounded-xl">
                  <Scale size={18} />
                </div>
                <div>
                  <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500 block mb-1">
                    System variables
                  </span>
                  <h2 className="text-xl font-serif italic text-white font-bold">
                    Biometric Calibration
                  </h2>
                </div>
              </div>

              <div className="space-y-8">
                {/* 1. Weight Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest">
                      Current Mass
                    </label>
                    <span className="text-lg font-serif italic font-bold text-white">
                      {weight} <span className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-widest">kg</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                    className="accent-voro-primary h-1.5 w-full bg-white/5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-voro-primary"
                  />
                  <div className="flex justify-between text-[0.45rem] font-mono font-black text-gray-700 uppercase tracking-widest">
                    <span>30 kg</span>
                    <span>200 kg</span>
                  </div>
                </div>

                {/* 2. Height Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest">
                      Height Dimension
                    </label>
                    <span className="text-lg font-serif italic font-bold text-white">
                      {height} <span className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-widest">cm</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="250"
                    step="1"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="accent-voro-primary h-1.5 w-full bg-white/5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-voro-primary"
                  />
                  <div className="flex justify-between text-[0.45rem] font-mono font-black text-gray-700 uppercase tracking-widest">
                    <span>100 cm</span>
                    <span>250 cm</span>
                  </div>
                </div>

                {/* 3. Age Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest">
                      Temporal Age
                    </label>
                    <span className="text-lg font-serif italic font-bold text-white">
                      {age} <span className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-widest">yrs</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="accent-voro-primary h-1.5 w-full bg-white/5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-voro-primary"
                  />
                  <div className="flex justify-between text-[0.45rem] font-mono font-black text-gray-700 uppercase tracking-widest">
                    <span>10 yrs</span>
                    <span>100 yrs</span>
                  </div>
                </div>

                {/* 4. Body Fat Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest">
                      Body Fat Ratio
                    </label>
                    <span className="text-lg font-serif italic font-bold text-white">
                      {bodyFat} <span className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-widest">%</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="0.5"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(parseFloat(e.target.value))}
                    className="accent-voro-primary h-1.5 w-full bg-white/5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-voro-primary"
                  />
                  <div className="flex justify-between text-[0.45rem] font-mono font-black text-gray-700 uppercase tracking-widest">
                    <span>5 %</span>
                    <span>50 %</span>
                  </div>
                </div>

                {/* 5. Gender Selection Buttons */}
                <div className="space-y-3">
                  <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest block">
                    Phenotypic Sex
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {['male', 'female'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`
                          py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-[0.3em] border transition-all duration-500
                          ${gender === g
                            ? "bg-voro-primary text-white border-voro-primary shadow-[0_10px_20px_rgba(124,58,237,0.2)]"
                            : "bg-white/[0.01] text-gray-500 border-white/5 hover:border-white/20 hover:text-gray-300"
                          }
                        `}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Activity Level Selector */}
                <div className="space-y-3">
                  <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest block">
                    Activity Coefficient
                  </span>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full bg-[#020408] border border-white/5 rounded-2xl py-4 px-6 text-xs font-mono text-white tracking-widest uppercase focus:outline-none focus:border-voro-primary transition-colors cursor-pointer"
                  >
                    <option value="sedentary">Sedentary (No Exercise)</option>
                    <option value="lightly_active">Lightly Active</option>
                    <option value="moderately_active">Moderately Active</option>
                    <option value="very_active">Very Active</option>
                    <option value="extremely_active">Extremely Active</option>
                  </select>
                </div>
              </div>
            </Card>
          </section>

          {/* RIGHT PANEL: COMPUTATIONAL PROJECTION NODE */}
          <section className="xl:col-span-8 space-y-8">
            <div className="mb-8">
              <Tabs
                tabs={calculatorTabs}
                activeTab={active}
                onTabChange={setActive}
              />
            </div>

            <Card className="p-10 md:p-14 bg-[#0A0C14] border-white/5 rounded-[3.5rem] shadow-2xl relative min-h-[480px] flex flex-col justify-center">
              {activeContent}
            </Card>
          </section>
        </div>

        <footer className="mt-28 pt-16 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div>
              <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] block mb-4">Precision Science</span>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Our mathematical models utilize peer-reviewed somatic equations including Mifflin-St Jeor, Epley/Brzycki formulas, and Devine scales for absolute accuracy and precision calibration.
              </p>
            </div>
            <div>
              <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] block mb-4">Clinical Context</span>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                These estimations are optimized for elite physical training and biological tracking. All variables must be evaluated in accordance with overall energy levels, hormone balance, and sleep.
              </p>
            </div>
            <div>
              <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] block mb-4">Real-Time Sync</span>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Modifications in this local calibration panel remain ephemeral to allow secure sandbox simulation. Your actual profiles can be permanently committed inside the Profile Configuration Node.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Calculators;
