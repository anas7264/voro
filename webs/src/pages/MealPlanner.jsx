import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Zap,
  Download,
  Save,
  ArrowLeft,
  RefreshCw,
  Check,
  Clock,
  Utensils,
  Sparkle
} from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useAppContext } from '@/hooks/useAppContext';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static mock datasets and generators.
 * Prevents dynamic re-allocations in high-frequency React render paths.
 */
const MOCK_MEALS = [
  { breakfast: 'Eggs with toast & hummus (480 kcal)', lunch: 'Chicken shawarma plate (650 kcal)', dinner: 'Grilled fish with rice (520 kcal)' },
  { breakfast: 'Oatmeal with almonds (420 kcal)', lunch: 'Falafel wrap (580 kcal)', dinner: 'Lamb kofta with salad (610 kcal)' },
  { breakfast: 'Shakshuka (520 kcal)', lunch: 'Freekeh soup with bread (480 kcal)', dinner: 'Grilled chicken with vegetables (550 kcal)' },
  { breakfast: 'Labneh plate (390 kcal)', lunch: 'Maqluba (690 kcal)', dinner: 'Fish with couscous (520 kcal)' },
  { breakfast: 'Pancakes with berries (510 kcal)', lunch: 'Tabbouleh salad bowl (450 kcal)', dinner: 'Lamb stew (580 kcal)' },
  { breakfast: 'Avocado toast (480 kcal)', lunch: 'Chickpea salad (420 kcal)', dinner: 'Roasted vegetables with tofu (490 kcal)' },
  { breakfast: 'Smoothie bowl (520 kcal)', lunch: 'Grilled chicken wrap (560 kcal)', dinner: 'Pasta with tomato sauce (520 kcal)' },
];

const BUDGET_TILES = [
  { value: 'Budget-friendly', title: 'Standard Allocation', desc: 'Optimized metabolic efficiency', tag: 'EFFICIENCY' },
  { value: 'Moderate', title: 'Premium Integration', desc: 'Balanced culinary composition', tag: 'BALANCED' },
  { value: 'Premium', title: 'Elite Curated', desc: 'Exquisite luxury ingredient matrix', tag: 'LUXURY' },
];

const DURATION_TILES = [
  { value: '1 day', label: '1 Day Sprint', desc: 'Single cycle metabolic calibration', days: 1 },
  { value: '3 days', label: '3 Day Shifter', desc: 'Short-term insulin resetting protocol', days: 3 },
  { value: '1 week', label: '1 Week Matrix', desc: 'Chronological adaptation block', days: 7 },
  { value: '2 weeks', label: '2 Weeks Megablock', desc: 'Systemic cellular evolution cycle', days: 14 },
];

const generateMockMealPlan = (duration) => {
  let daysCount = 7;
  if (duration === '1 day') daysCount = 1;
  else if (duration === '3 days') daysCount = 3;
  else if (duration === '1 week') daysCount = 7;
  else if (duration === '2 weeks') daysCount = 14;
  else {
    daysCount = parseInt(duration) || 7;
  }

  return Array.from({ length: daysCount }).map((_, idx) => {
    const mealTemplate = MOCK_MEALS[idx % MOCK_MEALS.length];
    return {
      day: idx + 1,
      ...mealTemplate,
      calories: 1650,
      protein: 165,
      carbs: 185,
      fat: 55,
    };
  });
};

const MealPlanner = () => {
  const plansObj = useStorageKeySelector(
    'plans',
    useCallback((plansData) => plansData || {}, [])
  );
  const savedMealPlans = useMemo(() => plansObj.savedMealPlans || [], [plansObj]);
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const { user } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');

  const [mealPlan, setMealPlan] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingState, setSavingState] = useState('idle'); // 'idle' | 'saving' | 'saved'

  const [formData, setFormData] = useState({
    duration: '1 week',
    notes: '',
    budget: 'Moderate',
  });

  const [focusedCardId, setFocusedCardId] = useState(null);

  useEffect(() => {
    document.title = 'VORO | Trophic Architect';
  }, []);

  const generatePlan = useCallback(async () => {
    setLoading(true);
    setLoadingProgress(0);
    setLoadingStatus("Connecting to Trophic Enclave...");

    const steps = [
      { prg: 15, msg: "Connecting to Trophic Enclave...", delay: 0 },
      { prg: 35, msg: "Retrieving Basal Metabolic Parameters...", delay: 500 },
      { prg: 55, msg: "Sequencing Macronutrient Density Matrix...", delay: 1100 },
      { prg: 75, msg: "Calibrating Lipolysis and Glycolysis Profiles...", delay: 1700 },
      { prg: 90, msg: "Optimizing Culinary Moisture & Amino Acid Indexes...", delay: 2300 },
      { prg: 100, msg: "Synthesis Complete.", delay: 2900 },
    ];

    steps.forEach(({ prg, msg, delay }) => {
      setTimeout(() => {
        setLoadingProgress(prg);
        setLoadingStatus(msg);
        if (prg === 100) {
          setTimeout(() => {
            const plan = {
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              duration: formData.duration,
              budget: formData.budget,
              notes: formData.notes,
              days: generateMockMealPlan(formData.duration),
              totalCalories: 0,
            };
            setMealPlan(plan);
            setLoading(false);
            setIsSaved(false);
            setSavingState('idle');
            addNotification('Metabolic blueprint synthesized successfully.', 'success');
          }, 300);
        }
      }, delay);
    });
  }, [formData, addNotification]);

  const savePlan = useCallback(async () => {
    if (!mealPlan || isSaved) return;

    // Optimistic UI updates - immediate user feedback
    setSavingState('saved');
    setIsSaved(true);
    addNotification('Trophic blueprint archived in secure local repository.', 'success');

    try {
      const allSavedPlans = savedMealPlans || [];
      const updatedPlans = [
        ...allSavedPlans,
        {
          ...mealPlan,
          name: `Metabolic Protocol — ${new Date().toLocaleDateString()}`
        }
      ];

      const currentPlansObj = plansObj || {};
      await setItem('plans', { ...currentPlansObj, savedMealPlans: updatedPlans });
    } catch (err) {
      setSavingState('idle');
      setIsSaved(false);
      addNotification('Archiving protocol failed.', 'error');
    }
  }, [mealPlan, isSaved, savedMealPlans, plansObj, setItem, addNotification]);

  const handleExportJSON = useCallback(() => {
    if (!mealPlan) return;
    try {
      const jsonStr = JSON.stringify(mealPlan, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `voro-trophic-manifest-${mealPlan.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addNotification('Secure raw JSON export completed.', 'success');
    } catch (err) {
      addNotification('Secure export failed.', 'error');
    }
  }, [mealPlan, addNotification]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020408]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-voro-primary border-t-transparent animate-spin mb-6" />
          <p className="text-gray-500 font-mono font-bold tracking-[0.4em] text-xs uppercase">Initializing Trophic Architect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-hidden bg-boutique-grain">
      {/* Cinematic Ambient Background Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] bg-voro-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* Cinematic 3-Second Loading Simulation Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020408]/95 backdrop-blur-3xl p-6">
          <div className="relative w-96 h-96 flex flex-col items-center justify-center">
            {/* Counter-rotating luxury telemetry orbits */}
            <div className="absolute inset-0 rounded-full border border-dashed border-voro-primary/20 animate-orbit-clockwise" />
            <div className="absolute inset-[15px] rounded-full border border-dashed border-voro-secondary/10 animate-orbit-counter" />
            <div className="absolute inset-[30px] rounded-full border border-white/5 opacity-40" />

            {/* Micro Sparkle Accents */}
            <div className="absolute top-8 left-12 animate-pulse text-voro-primary"><Sparkle size={10} /></div>
            <div className="absolute bottom-12 right-10 animate-pulse text-voro-secondary delay-500"><Sparkle size={12} /></div>

            {/* Percentage Display */}
            <div className="relative z-10 text-center">
              <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-[0.5em] mb-3">SYNTHESIS SEQUENCING</p>
              <p className="text-7xl font-serif italic font-medium text-white tracking-tighter mb-4">
                {loadingProgress}%
              </p>
              <div className="w-36 h-1.5 bg-white/5 mx-auto rounded-full overflow-hidden p-[1px] border border-white/15">
                <div
                  className="h-full bg-gradient-to-r from-voro-primary to-voro-secondary rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.7)]"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center space-y-2">
            <p className="text-[0.7rem] font-mono font-bold uppercase tracking-[0.4em] text-voro-primary animate-pulse text-center max-w-md">
              {loadingStatus}
            </p>
            <p className="text-[0.5rem] font-mono text-gray-600 uppercase tracking-[0.3em]">
              VORO BIOTECH CORE — SECURE SESSION ACTIVE
            </p>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">

        {/* 'Forge' Luxury Editorial Header */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Utensils size={16} className="animate-pulse" />
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.6em] text-voro-primary">
                Trophic Synthesis Enclave
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-[-0.03em] leading-none">
              Dietary <span className="text-gradient not-italic font-black">Architect</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.6rem] uppercase tracking-[0.4em]">
              Chronological macronutrient optimization & metabolic scheduling console
            </p>
          </div>

          <div className="flex gap-4">
            <span className="text-[0.55rem] font-mono font-bold text-gray-700 uppercase tracking-widest border border-white/5 px-4 py-2 rounded-xl bg-white/[0.01]">
              NODE // SEC_0x3F9A
            </span>
          </div>
        </header>

        {!mealPlan ? (
          <div className="space-y-12">
            <Card
              variant="premium"
              nodeId="FORM_MEAL_PLAN"
              className="p-12 bg-gradient-to-b from-[#0A0C14] to-black border-voro-primary/20 animate-slide-up"
            >
              <div className="border-b border-white/5 pb-8 mb-12">
                <h3 className="text-3xl font-serif italic text-white font-medium tracking-tight">Metabolic Protocol Settings</h3>
                <p className="text-[0.6rem] font-mono text-gray-500 uppercase tracking-widest mt-2">
                  Configure structural dietary parameters for genomic cellular adaptation
                </p>
              </div>

              <div className="space-y-12">
                {/* Duration Picker Tiles */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">
                      Chronological Duration
                    </span>
                    <span className="text-[0.45rem] font-mono font-bold text-gray-700 uppercase tracking-widest">
                      [SELECT_MATRIX]
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {DURATION_TILES.map((tile) => {
                      const isSelected = formData.duration === tile.value;
                      return (
                        <button
                          key={tile.value}
                          onClick={() => setFormData(prev => ({ ...prev, duration: tile.value }))}
                          className={`
                            p-6 rounded-2xl text-left border transition-all duration-500 outline-none group/tile relative overflow-hidden
                            ${isSelected
                              ? 'bg-voro-primary/10 border-voro-primary text-white shadow-[0_20px_40px_rgba(124,58,237,0.15)] ring-1 ring-voro-primary/30'
                              : 'bg-white/[0.01] border-white/5 hover:border-white/15 text-gray-400 hover:text-white'
                            }
                          `}
                        >
                          <div className="absolute top-0 right-0 p-3 opacity-[0.05] group-hover/tile:opacity-20 transition-opacity">
                            <Clock size={16} />
                          </div>
                          <p className="text-sm font-mono font-bold uppercase tracking-wider">{tile.label}</p>
                          <p className="text-[0.6rem] text-gray-500 font-mono tracking-wide mt-2">{tile.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget / Composition Quality Selector */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">
                      Culinary & Ingredient Allocation
                    </span>
                    <span className="text-[0.45rem] font-mono font-bold text-gray-700 uppercase tracking-widest">
                      [TROPHIC_INTEGRATION]
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {BUDGET_TILES.map((tile) => {
                      const isSelected = formData.budget === tile.value;
                      return (
                        <button
                          key={tile.value}
                          onClick={() => setFormData(prev => ({ ...prev, budget: tile.value }))}
                          className={`
                            p-8 rounded-[2rem] text-left border transition-all duration-500 outline-none relative group/tile overflow-hidden
                            ${isSelected
                              ? 'bg-voro-secondary/10 border-voro-secondary text-white shadow-[0_30px_60px_rgba(16,185,129,0.1)] ring-1 ring-voro-secondary/20'
                              : 'bg-white/[0.01] border-white/5 hover:border-white/15 text-gray-400 hover:text-white'
                            }
                          `}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-[0.55rem] font-mono font-black text-gray-600 group-hover/tile:text-voro-secondary tracking-[0.2em] uppercase">
                              {tile.tag}
                            </p>
                            {isSelected && (
                              <span className="p-1 bg-voro-secondary/20 border border-voro-secondary/40 rounded-full text-voro-secondary">
                                <Check size={10} />
                              </span>
                            )}
                          </div>
                          <h4 className="text-xl font-serif italic font-bold text-white mt-4">{tile.title}</h4>
                          <p className="text-xs text-gray-500 font-mono tracking-wide mt-2 leading-relaxed">{tile.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Special Notes (Textarea) */}
                <div className="grid grid-cols-1 gap-6">
                  <Textarea
                    label="Metabolic Customizations & Allergens"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="E.g. High fatty acid density, include levantine olive oil matrices, exclude dynamic dairy complexes..."
                    rows={4}
                    maxLength={500}
                  />
                </div>

                <div className="pt-6">
                  <Button
                    onClick={generatePlan}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-8 shadow-2xl shadow-voro-primary/20 text-md tracking-[0.3em] font-black"
                  >
                    <Zap size={20} className="fill-current text-white animate-pulse" />
                    SYNTHESIZE METABOLIC PLAN
                  </Button>
                </div>
              </div>
            </Card>

            {/* Aesthetic Advisory panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-10 border-dashed border-white/10 bg-transparent flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_8px_#7C3AED]" />
                  <h4 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] text-gray-400">Biological Directive</h4>
                </div>
                <p className="text-lg font-serif italic text-gray-400 leading-relaxed indent-6">
                  "MACRONUTRIENT allocation determines the genomic transcription of your cellular potential. Custom synthesis aligns chemical properties to avoid the inflammatory cascades associated with standard industrial foods."
                </p>
                <div className="mt-auto pt-6 border-t border-white/5">
                  <p className="text-[0.5rem] font-mono text-gray-600 uppercase tracking-[0.4em]">VORO BIOMETRIC STANDARD // CH_09</p>
                </div>
              </Card>

              <Card className="p-10 border-dashed border-white/10 bg-transparent flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-secondary shadow-[0_0_8px_#10B981]" />
                  <h4 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] text-gray-400">Chronological Synchronicity</h4>
                </div>
                <p className="text-lg font-serif italic text-gray-400 leading-relaxed indent-6">
                  "TIME-BLOCKING provides systemic stability, ensuring your digestive pathways execute optimal enzyme secretions synchronized perfectly with hormonal circadian rhythms for effortless peak state assimilation."
                </p>
                <div className="mt-auto pt-6 border-t border-white/5">
                  <p className="text-[0.5rem] font-mono text-gray-600 uppercase tracking-[0.4em]">CIRCADIAN PROTOCOLS // CH_11</p>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            {/* Control Deck Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-8 bg-[#0A0C14]/40 border border-white/5 rounded-[2rem] backdrop-blur-xl">
              <button
                onClick={() => setMealPlan(null)}
                className="flex items-center gap-3 text-xs font-mono font-black text-gray-400 hover:text-white uppercase tracking-[0.3em] border border-white/10 px-6 py-4 rounded-xl hover:bg-white/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
              >
                <ArrowLeft size={14} />
                <span>Adjust Parameters</span>
              </button>

              <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                <Button
                  onClick={savePlan}
                  disabled={savingState === 'saving' || isSaved}
                  className={`flex items-center gap-3 px-8 py-4 text-xs tracking-[0.2em] font-black rounded-xl shadow-lg transition-all
                    ${isSaved
                      ? '!bg-emerald-500/10 border !border-emerald-500/30 !text-emerald-400 cursor-not-allowed shadow-none'
                      : '!bg-white !text-black shadow-voro-primary/20 hover:scale-105'
                    }
                  `}
                >
                  {savingState === 'saving' ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : isSaved ? (
                    <Check size={14} />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>
                    {savingState === 'saving' ? 'ARCHIVING...' : isSaved ? 'ARCHIVED IN ENCLAVE' : 'SAVE PROTOCOL'}
                  </span>
                </Button>

                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-3 text-xs font-mono font-black text-gray-300 hover:text-white uppercase tracking-[0.2em] border border-white/5 bg-white/[0.02] px-6 py-4 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
                >
                  <Download size={14} />
                  <span>EXPORT BLUEPRINT</span>
                </button>
              </div>
            </div>

            {/* Generation Parameters Overview */}
            <Card className="p-10 border-white/5 bg-[#0A0C14]/20 flex flex-col md:flex-row justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[80px]" />
              <div className="space-y-2">
                <p className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">SYNTHESIZED MATRIX OVERVIEW</p>
                <h4 className="text-2xl font-serif italic font-medium text-white">Metabolic Adaptor Profile</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-12">
                <div className="space-y-1">
                  <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest">DURATION</span>
                  <p className="text-md font-mono text-white font-bold">{formData.duration.toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest">ALLOCATION</span>
                  <p className="text-md font-mono text-white font-bold">{formData.budget.toUpperCase()}</p>
                </div>
                {formData.notes && (
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest">CUSTOM MATRIX</span>
                    <p className="text-md font-serif italic text-voro-primary truncate max-w-[150px]">{formData.notes}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Plan list of Days re-engineered to gorgeous columns of high-fidelity logs */}
            <div className="space-y-8">
              {mealPlan.days.map((day) => {
                const isCardFocused = focusedCardId === day.day;

                return (
                  <Card
                    key={day.day}
                    variant="premium"
                    nodeId={`TROPHIC_BLOCK_${day.day}`}
                    className="p-12 hover:border-white/10 transition-all duration-700 relative overflow-hidden focus-visible:outline-none"
                    tabIndex="0"
                    onFocus={() => setFocusedCardId(day.day)}
                    onBlur={() => setFocusedCardId(null)}
                    style={{
                      transform: isCardFocused
                        ? 'perspective(1200px) rotateX(4deg) rotateY(-4deg) translateY(-4px)'
                        : undefined,
                      transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">

                      {/* Left side: Day Title & High-Performance Macro Telemetry (Col span 5) */}
                      <div className="lg:col-span-5 space-y-8 border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-12">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1 bg-voro-primary/20 text-voro-primary rounded-lg text-[0.55rem] font-mono font-black tracking-widest uppercase">
                              Adaptation Cycle
                            </span>
                          </div>
                          <h3 className="text-5xl font-serif italic font-bold tracking-tight text-white leading-none">
                            Day {day.day}
                          </h3>
                        </div>

                        {/* Macronutrient Dial & Bars with transform: scaleX for performance */}
                        <div className="space-y-5 pt-4">
                          <p className="text-[0.55rem] font-mono font-black text-gray-600 uppercase tracking-[0.4em]">MACRO INTENSITY DEFIANCE</p>

                          {/* Calories block */}
                          <div className="flex justify-between items-baseline p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest">ENERGY MAGNITUDE</span>
                            <span className="text-2xl font-serif italic font-bold text-white tracking-tight">
                              {day.calories} <span className="text-xs font-mono font-bold text-gray-500 uppercase not-italic">kcal</span>
                            </span>
                          </div>

                          {/* Dynamic Progress bars */}
                          <div className="space-y-4 pt-2">
                            {/* Protein */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-[0.6rem] font-mono font-bold text-gray-500">
                                <span className="uppercase tracking-widest text-voro-primary">🍗 PROTEIN ENZYME</span>
                                <span className="text-white">{day.protein}g</span>
                              </div>
                              <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/[0.02] origin-left">
                                <div
                                  className="absolute inset-y-0 left-0 bg-voro-primary rounded-full origin-left transition-transform duration-1000"
                                  style={{ transform: `scaleX(1.0)`, width: '100%' }}
                                />
                              </div>
                            </div>

                            {/* Carbs */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-[0.6rem] font-mono font-bold text-gray-500">
                                <span className="uppercase tracking-widest text-voro-secondary">🍚 CARBON COMPOSITION</span>
                                <span className="text-white">{day.carbs}g</span>
                              </div>
                              <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/[0.02] origin-left">
                                <div
                                  className="absolute inset-y-0 left-0 bg-voro-secondary rounded-full origin-left transition-transform duration-1000"
                                  style={{ transform: `scaleX(0.8)`, width: '100%' }}
                                />
                              </div>
                            </div>

                            {/* Fats */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-[0.6rem] font-mono font-bold text-gray-500">
                                <span className="uppercase tracking-widest text-voro-accent">🥑 LIPID MOISTURE</span>
                                <span className="text-white">{day.fat}g</span>
                              </div>
                              <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/[0.02] origin-left">
                                <div
                                  className="absolute inset-y-0 left-0 bg-voro-accent rounded-full origin-left transition-transform duration-1000"
                                  style={{ transform: `scaleX(0.6)`, width: '100%' }}
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Right side: Meal protocols in luxury list (Col span 7) */}
                      <div className="lg:col-span-7 space-y-6">
                        <p className="text-[0.55rem] font-mono font-black text-gray-600 uppercase tracking-[0.4em]">TROPHIC MEAL PROTOCOLS</p>

                        {/* Breakfast */}
                        <div className="flex gap-6 items-start p-6 bg-white/[0.01] border border-white/5 rounded-2xl group/meal hover:bg-white/[0.03] transition-all">
                          <div className="p-3.5 bg-voro-primary/5 border border-voro-primary/10 rounded-xl text-voro-primary font-mono text-[0.6rem] font-bold tracking-widest">
                            08:00
                          </div>
                          <div className="space-y-1">
                            <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-widest block">BREAKFAST SYNTHESIS</span>
                            <p className="text-xl font-serif italic text-white group-hover/meal:text-voro-primary transition-colors">{day.breakfast}</p>
                          </div>
                        </div>

                        {/* Lunch */}
                        <div className="flex gap-6 items-start p-6 bg-white/[0.01] border border-white/5 rounded-2xl group/meal hover:bg-white/[0.03] transition-all">
                          <div className="p-3.5 bg-voro-secondary/5 border border-voro-secondary/10 rounded-xl text-voro-secondary font-mono text-[0.6rem] font-bold tracking-widest">
                            13:30
                          </div>
                          <div className="space-y-1">
                            <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-widest block">MIDDAY RECOOPERATION</span>
                            <p className="text-xl font-serif italic text-white group-hover/meal:text-voro-secondary transition-colors">{day.lunch}</p>
                          </div>
                        </div>

                        {/* Dinner */}
                        <div className="flex gap-6 items-start p-6 bg-white/[0.01] border border-white/5 rounded-2xl group/meal hover:bg-white/[0.03] transition-all">
                          <div className="p-3.5 bg-voro-accent/5 border border-voro-accent/10 rounded-xl text-voro-accent font-mono text-[0.6rem] font-bold tracking-widest">
                            19:30
                          </div>
                          <div className="space-y-1">
                            <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-widest block">NOCTURNAL ANABOLISM</span>
                            <p className="text-xl font-serif italic text-white group-hover/meal:text-voro-accent transition-colors">{day.dinner}</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
