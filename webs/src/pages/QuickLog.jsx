import React, { useEffect, useState, useMemo, useCallback, useRef, memo } from 'react';
import { Share2, Download, Utensils, Dumbbell, Droplets, Zap, CheckCircle2, Activity, ShieldCheck } from 'lucide-react';
import { Button, Card, Tabs, Header } from '@/components';
import { useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { foods } from '@/data/foods';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted and Frozen static archetype datasets.
 * Prevents array allocations and re-evaluation on render cycles.
 */
const CINEMATIC_STEPS = Object.freeze([
  '[SYS_INIT] SYNCHRONIZING EXPRESS CHANNELS...',
  '[ALIGN_CHANNEL] MAPPING BIOMETRIC PAYLOAD...',
  '[LOGISTICS_ACTIVE] RECORDING EXPRESS TRAJECTORY...'
]);

const EXPRESS_FOODS = Object.freeze([
  { id: 'exp_f1', name: 'Chicken Breast', icon: '🍗', nodeId: '0xEXP_FD_01', calories: 220, protein: 31, carbs: 0, fat: 3.6 },
  { id: 'exp_f2', name: 'White Rice', icon: '🍚', nodeId: '0xEXP_FD_02', calories: 200, protein: 4, carbs: 44, fat: 0.4 },
  { id: 'exp_f3', name: 'Mixed Vegetables', icon: '🥗', nodeId: '0xEXP_FD_03', calories: 85, protein: 3, carbs: 17, fat: 0.5 },
  { id: 'exp_f4', name: 'Gala Apple', icon: '🍎', nodeId: '0xEXP_FD_04', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }
]);

const EXPRESS_WORKOUTS = Object.freeze([
  { id: 'exp_w1', name: 'Bench Press', icon: '🏋️', detail: '4x8 Standard', type: 'Strength', nodeId: '0xEXP_WK_01' },
  { id: 'exp_w2', name: 'Back Squats', icon: '🤸', detail: '4x8 Standard', type: 'Strength', nodeId: '0xEXP_WK_02' },
  { id: 'exp_w3', name: 'Cardio Protocol', icon: '🚴', detail: '30 min Steady', type: 'Cardio', nodeId: '0xEXP_WK_03' },
  { id: 'exp_w4', name: 'Neural Recovery', icon: '🧘', detail: '20 min Flow', type: 'Yoga', nodeId: '0xEXP_WK_04' }
]);

const EXPRESS_HYDRATION = Object.freeze([
  { amount: '250', label: 'Standard', nodeId: '0xEXP_HY_250' },
  { amount: '500', label: 'Protocol', nodeId: '0xEXP_HY_500' },
  { amount: '750', label: 'Advanced', nodeId: '0xEXP_HY_750' },
  { amount: '1000', label: 'Maximum', nodeId: '0xEXP_HY_1000' }
]);

/**
 * ⚡ LUXURY FORGE MASTERCLASS SUBCOMPONENT: KineticExpressCard
 * Volumetric 3D interactive item featuring direct-DOM 60fps rotational tilt,
 * holographic spatial telemetry, sub-pixel hash badging, static 4-degree focus tilt,
 * and liquid border illumination.
 */
const KineticExpressCard = memo(({
  children,
  onClick,
  nodeId,
  accentColor = 'primary',
  actionLabel = 'Execute',
  actionIcon: ActionIcon = Zap
}) => {
  const cardRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D rotational tilt calculation (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '4deg');
      cardRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cardRef.current && !isHovered) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
      if (txRef.current) txRef.current.innerText = "0.0";
      if (tyRef.current) tyRef.current.innerText = "0.0";
    }
  };

  const interactionActive = isHovered || isFocused;
  const isSecondary = accentColor === 'secondary';

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (cardRef.current && !isFocused) {
          cardRef.current.style.setProperty('--tilt-x', '0deg');
          cardRef.current.style.setProperty('--tilt-y', '0deg');
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        w-full relative overflow-hidden text-left p-6 rounded-2xl
        bg-[#0A0C14] border border-white/5 backdrop-blur-xl
        transition-all duration-500 group outline-none
        hover:border-white/20 hover:shadow-[0_30px_60px_rgba(0,0,0,0.7)]
        focus-visible:ring-2 ${isSecondary ? 'focus-visible:ring-voro-secondary' : 'focus-visible:ring-voro-primary'}
        focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408]
        active:scale-[0.98]
      `}
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${isSecondary ? 'rgba(16, 185, 129, 0.12)' : 'rgba(124, 58, 237, 0.12)'}, transparent 60%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-3 right-4 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 z-20"
        style={{ transform: 'translateZ(50px)' }}
      >
        <div className="flex items-center gap-2 font-mono text-[0.4rem] font-bold text-gray-500 tracking-[0.2em]">
          <span>TX_<span ref={txRef}>0.0</span>°</span>
          <span>TY_<span ref={tyRef}>0.0</span>°</span>
          <span className={isSecondary ? 'text-voro-secondary' : 'text-voro-primary'}>[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between" style={{ transform: 'translateZ(30px)' }}>
        {children}

        <div className={`
          text-[0.6rem] font-mono font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
          transition-all duration-500 flex items-center gap-2
          ${isSecondary ? 'text-voro-secondary' : 'text-voro-primary'}
        `}>
          <ActionIcon size={12} className="animate-pulse" />
          <span>{actionLabel}</span>
        </div>
      </div>

      {/* Bottom Liquid Edge Indicator */}
      <div className={`
        absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent
        ${isSecondary ? 'group-hover:via-voro-secondary/40' : 'group-hover:via-voro-primary/40'}
        transition-all duration-700
      `} />
    </button>
  );
});

KineticExpressCard.displayName = "KineticExpressCard";

/**
 * ⚡ CINEMATIC NEURAL ALIGNMENT OVERLAY
 * Counter-rotating orbital rings and diagnostic telemetry overlay.
 * Supports test mode bypass hooks (`window.__VORO_TEST_BYPASS__` or `voro_test_mode`).
 */
const KineticAlignmentOverlay = memo(({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const isTestMode = typeof window !== 'undefined' && (
      window.__VORO_TEST_BYPASS__ ||
      window.voro_test_mode ||
      localStorage.getItem('voro_test_mode') === 'true'
    );

    if (isTestMode) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < CINEMATIC_STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(onComplete, 400);
        return prev;
      });
    }, 550);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020408] backdrop-blur-2xl transition-all duration-700">
      <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />

      {/* Counter-Rotating Orbital Rings */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-10">
        <div className="absolute inset-0 border border-dashed border-voro-primary/30 rounded-full animate-spin [animation-duration:12s]" />
        <div className="absolute w-36 h-36 border border-voro-secondary/40 rounded-full animate-spin [animation-duration:6s] [animation-direction:reverse]" />
        <div className="absolute w-24 h-24 border border-dashed border-voro-accent/20 rounded-full animate-spin [animation-duration:15s]" />
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0A0C14] to-voro-primary/20 border border-white/10 flex items-center justify-center shadow-2xl">
          <Activity size={20} className="text-voro-primary animate-pulse" />
        </div>
      </div>

      <div className="space-y-4 text-center max-w-md px-6">
        <span className="text-[0.55rem] font-mono font-black text-voro-primary tracking-[0.5em] uppercase block animate-pulse">
          EXPRESS_MANIFESTATION_CHANNEL
        </span>
        <div className="h-8 flex items-center justify-center">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest transition-opacity duration-300">
            {CINEMATIC_STEPS[stepIndex]}
          </p>
        </div>
        <div className="w-40 h-1 bg-white/[0.03] rounded-full mx-auto overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-voro-primary animate-kinetic-sweep" />
        </div>
      </div>
    </div>
  );
});

KineticAlignmentOverlay.displayName = "KineticAlignmentOverlay";

/**
 * ⚡ MAIN EXPRESS MANIFESTATION ENCLAVE
 */
const QuickLog = () => {
  const { getItem, updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('food');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'VORO | Express Manifestation Enclave';
  }, []);

  const handleAlignmentComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleQuickFoodLog = useCallback(async (foodName) => {
    const today = new Date().toISOString().split('T')[0];
    const allLogs = getItem('nutrition_log') || {};
    const currentDayLog = allLogs[today] || {
      meals: {},
      water: 0,
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    };

    const foodData = foods.find(f => f.name === foodName) || EXPRESS_FOODS.find(f => f.name === foodName) || {
      name: foodName,
      calories: 250,
      protein: 20,
      carbs: 30,
      fat: 8,
    };

    const entry = {
      id: `express-${Date.now()}`,
      name: foodData.name,
      portion: 100,
      calories: foodData.calories,
      protein: foodData.protein,
      carbs: foodData.carbs,
      fat: foodData.fat,
      timestamp: new Date().toISOString()
    };

    const slot = 'Lunch';
    if (!currentDayLog.meals[slot]) currentDayLog.meals[slot] = [];
    currentDayLog.meals[slot].push(entry);

    currentDayLog.totals.calories += entry.calories;
    currentDayLog.totals.protein += entry.protein;
    currentDayLog.totals.carbs += entry.carbs;
    currentDayLog.totals.fat += entry.fat;

    await updateItem('nutrition_log', { [today]: currentDayLog });
    addNotification(`Express entry: ${foodName} recorded`, 'success');
  }, [getItem, updateItem, addNotification]);

  const handleQuickWorkoutLog = useCallback(async (workoutName, type) => {
    const today = new Date().toISOString().split('T')[0];

    const workoutData = {
      attended: true,
      type: type || 'Strength',
      duration: 45,
      exercises: [],
      volume: 0,
      timestamp: new Date().toISOString(),
    };

    await updateItem('workout_log', { [today]: workoutData });
    addNotification(`Evolution recorded: ${workoutName}`, 'success');
  }, [updateItem, addNotification]);

  const handleQuickWaterLog = useCallback(async (amount) => {
    const today = new Date().toISOString().split('T')[0];
    const allLogs = getItem('nutrition_log') || {};
    const currentDayLog = allLogs[today] || {
      meals: {},
      water: 0,
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    };

    currentDayLog.water += parseInt(amount, 10);

    await updateItem('nutrition_log', { [today]: currentDayLog });
    addNotification(`Hydration matrix updated: +${amount}ml`, 'success');
  }, [getItem, updateItem, addNotification]);

  const quickLogTabs = useMemo(() => [
    {
      id: 'food',
      label: 'Nutrition',
      icon: <Utensils size={16} />,
      content: (
        <div className="animate-slide-up space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em]">
                Trophic Archetype Manifests
              </h3>
              <span className="text-[0.45rem] font-mono text-voro-primary uppercase tracking-widest">
                0xMET_EXPRESS_ARRAY
              </span>
            </div>
            <div className="space-y-4">
              {EXPRESS_FOODS.map(food => (
                <KineticExpressCard
                  key={food.id}
                  nodeId={food.nodeId}
                  onClick={() => handleQuickFoodLog(food.name)}
                  accentColor="primary"
                  actionLabel="Quick Manifest"
                  actionIcon={Zap}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-2xl shadow-inner">
                      {food.icon}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xl font-serif italic font-medium text-white group-hover:text-voro-primary transition-colors">
                        {food.name}
                      </span>
                      <div className="flex items-center gap-3 font-mono text-[0.55rem] text-gray-500">
                        <span>{food.calories} kcal</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span>P: {food.protein}g</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span>C: {food.carbs}g</span>
                      </div>
                    </div>
                  </div>
                </KineticExpressCard>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'workout',
      label: 'Kinetic',
      icon: <Dumbbell size={16} />,
      content: (
        <div className="animate-slide-up space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em]">
                Energy Manifestation Nodes
              </h3>
              <span className="text-[0.45rem] font-mono text-voro-secondary uppercase tracking-widest">
                0xKIN_EXPRESS_ARRAY
              </span>
            </div>
            <div className="space-y-4">
              {EXPRESS_WORKOUTS.map(workout => (
                <KineticExpressCard
                  key={workout.id}
                  nodeId={workout.nodeId}
                  onClick={() => handleQuickWorkoutLog(workout.name, workout.type)}
                  accentColor="secondary"
                  actionLabel="Record Evolution"
                  actionIcon={CheckCircle2}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-2xl shadow-inner">
                      {workout.icon}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xl font-serif italic font-medium text-white group-hover:text-voro-secondary transition-colors">
                        {workout.name}
                      </span>
                      <div className="flex items-center gap-3 font-mono text-[0.55rem] text-gray-500">
                        <span>{workout.detail}</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-voro-secondary">{workout.type}</span>
                      </div>
                    </div>
                  </div>
                </KineticExpressCard>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'water',
      label: 'Hydration',
      icon: <Droplets size={16} />,
      content: (
        <div className="animate-slide-up space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em]">
                Intracellular Matrix Hydration
              </h3>
              <span className="text-[0.45rem] font-mono text-voro-primary uppercase tracking-widest">
                0xHYD_EXPRESS_ARRAY
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXPRESS_HYDRATION.map(water => (
                <KineticExpressCard
                  key={water.amount}
                  nodeId={water.nodeId}
                  onClick={() => handleQuickWaterLog(water.amount)}
                  accentColor="primary"
                  actionLabel="Inject"
                  actionIcon={Droplets}
                >
                  <div className="flex flex-col items-start gap-1 py-2">
                    <div className="text-3xl font-serif italic font-bold text-white group-hover:text-voro-primary transition-colors">
                      +{water.amount}
                      <span className="text-[0.6rem] not-italic font-mono font-black text-voro-primary uppercase ml-1">ml</span>
                    </div>
                    <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest">
                      {water.label} Protocol
                    </span>
                  </div>
                </KineticExpressCard>
              ))}
            </div>
          </div>
        </div>
      )
    },
  ], [handleQuickFoodLog, handleQuickWorkoutLog, handleQuickWaterLog]);

  const activeContent = useMemo(() => {
    return quickLogTabs.find(t => t.id === activeTab)?.content;
  }, [quickLogTabs, activeTab]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Cinematic Alignment Overlay */}
      {isLoading && <KineticAlignmentOverlay onComplete={handleAlignmentComplete} />}

      {/* Ambient Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-[35%] h-[35%] bg-voro-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[15%] right-[10%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-[1000px] mx-auto px-6 md:px-12 py-16">
        {/* Editorial Signature Header */}
        <Header
          eyebrow="Express_Channel // V_MANIFEST"
          title="Express Manifestation"
          subtitle="Rapid sub-second synchronization of your metabolic, kinetic, and hydration trajectory."
          action={
            <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-md">
              <ShieldCheck size={14} className="text-voro-secondary" />
              <span className="text-[0.55rem] font-mono font-bold text-gray-400 uppercase tracking-widest">
                Sub-Second Pipeline Active
              </span>
            </div>
          }
        />

        {/* Tab Selection */}
        <div className="mb-12">
          <Tabs
            tabs={quickLogTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Main Content Chamber */}
        <Card className="p-8 md:p-12 bg-[#0A0C14] border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group backdrop-blur-xl mb-12">
          <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-voro-primary/10 transition-colors duration-1000" />
          {activeContent}
        </Card>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Button
            variant="secondary"
            onClick={() => addNotification('Express history exported', 'info')}
            className="flex items-center justify-center gap-3 !rounded-full px-8 py-4 text-[0.6rem] font-black uppercase tracking-[0.25em]"
          >
            <Download size={14} />
            <span>Export History</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => addNotification('Evolution vector shared', 'info')}
            className="flex items-center justify-center gap-3 !rounded-full px-8 py-4 text-[0.6rem] font-black uppercase tracking-[0.25em]"
          >
            <Share2 size={14} />
            <span>Share Evolution</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickLog;
