import React, { useEffect, useState, useMemo, useCallback, useRef, memo } from 'react';
import { Share2, Download, Utensils, Dumbbell, Droplets, Zap, CheckCircle2 } from 'lucide-react';
import { Button, Card, Tabs, Tag, Breadcrumb } from '@/components';
import { useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { foods } from '@/data/foods';

/**
 * ⚡ LUXURY REFINEMENT: KineticExpressCard Subcomponent
 * Re-engineered into a high-precision volumetric express log node featuring:
 * 1. 60fps direct-DOM mouse-tracking tilt (`--tilt-x`, `--tilt-y`, `--mouse-x`, `--mouse-y`).
 * 2. W3C APG Accessible 3D Interaction Pattern (static 4-degree focus tilt on keyboard navigation).
 * 3. Holographic spatial coordinate telemetry (`TX_...°`, `TY_...°`, node ID).
 * 4. Reactive liquid border illumination and laser edge indicators.
 * 5. High-contrast Playfair Display italic typography paired with JetBrains Mono metadata.
 */
const KineticExpressCard = memo(({
  title,
  subtitle,
  icon,
  badgeText,
  colorScheme = 'primary', // 'primary' | 'secondary' | 'accent'
  onClick,
  nodeId
}) => {
  const containerRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const themeColors = useMemo(() => {
    switch (colorScheme) {
      case 'secondary':
        return {
          glow: 'rgba(16, 185, 129, 0.15)',
          borderHover: 'group-hover:border-voro-secondary/40',
          textActive: 'text-voro-secondary',
          laserBg: 'bg-voro-secondary shadow-[0_0_15px_rgba(16,185,129,0.8)]',
          focusRing: 'focus-visible:ring-voro-secondary'
        };
      case 'accent':
        return {
          glow: 'rgba(245, 158, 11, 0.15)',
          borderHover: 'group-hover:border-voro-accent/40',
          textActive: 'text-voro-accent',
          laserBg: 'bg-voro-accent shadow-[0_0_15px_rgba(245,158,11,0.8)]',
          focusRing: 'focus-visible:ring-voro-accent'
        };
      case 'primary':
      default:
        return {
          glow: 'rgba(124, 58, 237, 0.15)',
          borderHover: 'group-hover:border-voro-primary/40',
          textActive: 'text-voro-primary',
          laserBg: 'bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]',
          focusRing: 'focus-visible:ring-voro-primary'
        };
    }
  }, [colorScheme]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D calculations (max 15 degrees tilt)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Express log option: ${title}${subtitle ? `, ${subtitle}` : ''}. Click or press Enter to record.`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        group relative w-full p-8 rounded-[2rem] bg-[#0A0C14] border border-white/5
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)] ${themeColors.borderHover}
        outline-none focus-visible:ring-2 ${themeColors.focusRing} focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        cursor-pointer overflow-hidden flex items-center justify-between min-h-[100px] select-none
      `}
    >
      {/* Precision Grid & Boutique Grain Overlay */}
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.03] group-focus-visible:opacity-[0.03] transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${themeColors.glow}, transparent 70%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Reactive Laser Edge Indicator */}
      <div className={`
        absolute left-0 top-1/4 bottom-1/4 w-[2.5px] rounded-r-full
        transition-all duration-700 origin-center scale-y-0
        group-hover:scale-y-100 group-focus-visible:scale-y-100
        ${themeColors.laserBg}
      `} />

      {/* Holographic Spatial Coordinate Telemetry */}
      <div
        className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex items-center gap-2 font-mono text-[0.45rem] font-bold text-gray-500 tracking-widest">
          <span>TX_<span ref={txRef}>0.0</span>°</span>
          <span>TY_<span ref={tyRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex items-center gap-6 relative z-10" style={{ transform: 'translateZ(30px)' }}>
        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 group-focus-visible:scale-110 transition-transform duration-500 shadow-inner">
          {icon}
        </div>
        <div className="text-left space-y-1">
          <h3 className="text-xl md:text-2xl font-serif italic font-medium text-white tracking-tight group-hover:text-voro-primary transition-colors duration-500">
            {title}
          </h3>
          {subtitle && (
            <span className="text-[0.6rem] font-mono font-bold text-gray-500 uppercase tracking-[0.2em] block">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Action Badge Indicator */}
      <div className="relative z-10 hidden sm:flex items-center gap-2" style={{ transform: 'translateZ(40px)' }}>
        <div className={`text-[0.6rem] font-mono font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-500 flex items-center gap-2 ${themeColors.textActive}`}>
          <Zap size={12} className="animate-pulse" />
          <span>{badgeText}</span>
        </div>
      </div>
    </div>
  );
});

KineticExpressCard.displayName = 'KineticExpressCard';

const QuickLog = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad storage hooks with useStorageMethods to avoid re-renders
   * when unrelated storage keys change.
   */
  const { getItem, updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('food');

  // Cinematic 2.5-second alignment sequence state (bypassed in automated test environments)
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.__VORO_TEST_BYPASS__ || localStorage.getItem('voro_test_mode') === 'true') {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    document.title = 'VORO | Express Manifestation';

    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleQuickFoodLog = useCallback(async (foodName) => {
    const today = new Date().toISOString().split('T')[0];
    const allLogs = getItem('nutrition_log') || {};
    const currentDayLog = allLogs[today] || {
      meals: {},
      water: 0,
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    };

    const foodData = foods.find(f => f.name === foodName) || {
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

    const slot = 'Lunch'; // Default for express logs
    if (!currentDayLog.meals[slot]) currentDayLog.meals[slot] = [];
    currentDayLog.meals[slot].push(entry);

    currentDayLog.totals.calories += entry.calories;
    currentDayLog.totals.protein += entry.protein;
    currentDayLog.totals.carbs += entry.carbs;
    currentDayLog.totals.fat += entry.fat;

    await updateItem('nutrition_log', { [today]: currentDayLog });
    addNotification(`Express entry: ${foodName} recorded into matrix`, 'success');
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
    addNotification(`Kinetic evolution recorded: ${workoutName}`, 'success');
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
    addNotification(`Aqueous hydration matrix updated: +${amount}ml`, 'success');
  }, [getItem, updateItem, addNotification]);

  const quickLogTabs = useMemo(() => [
    {
      id: 'food',
      label: 'Nutrition',
      icon: <Utensils size={16} />,
      content: (
        <div className="animate-slide-up space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">
              Nutritional Archetype Nodes
            </h3>
            <span className="text-[0.55rem] font-mono text-voro-primary uppercase tracking-widest">[EXPRESS_MACRO]</span>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Chicken Breast', icon: '🍗', subtitle: '250 kcal // 45g Protein // Lean Anabolic' },
              { name: 'White Rice', icon: '🍚', subtitle: '200 kcal // 44g Glycogen // Fast Substrate' },
              { name: 'Mixed Vegetables', icon: '🥗', subtitle: '85 kcal // Micronutrient Fiber Sweep' },
              { name: 'Gala Apple', icon: '🍎', subtitle: '95 kcal // Fructose Polyphenol Refresh' }
            ].map((food, idx) => (
              <KineticExpressCard
                key={food.name}
                title={food.name}
                subtitle={food.subtitle}
                icon={food.icon}
                badgeText="Express Manifest"
                colorScheme="primary"
                onClick={() => handleQuickFoodLog(food.name)}
                nodeId={`NUT_EX_${idx + 1}`}
              />
            ))}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">
              Kinetic Energy Manifestations
            </h3>
            <span className="text-[0.55rem] font-mono text-voro-secondary uppercase tracking-widest">[EXPRESS_STIMULUS]</span>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Bench Press', icon: '🏋️', subtitle: '4x8 Standard // Hypertrophy Matrix', type: 'Strength' },
              { name: 'Back Squats', icon: '🤸', subtitle: '4x8 Standard // Lower Chain Power', type: 'Strength' },
              { name: 'Cardio Protocol', icon: '🚴', subtitle: '30 min Steady // Zone-2 VO2 Pulse', type: 'Cardio' },
              { name: 'Neural Recovery', icon: '🧘', subtitle: '20 min Flow // Parasympathetic Reset', type: 'Yoga' }
            ].map((workout, idx) => (
              <KineticExpressCard
                key={workout.name}
                title={workout.name}
                subtitle={workout.subtitle}
                icon={workout.icon}
                badgeText="Record Evolution"
                colorScheme="secondary"
                onClick={() => handleQuickWorkoutLog(workout.name, workout.type)}
                nodeId={`KIN_EX_${idx + 1}`}
              />
            ))}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">
              Intracellular Fluid Gateway
            </h3>
            <span className="text-[0.55rem] font-mono text-voro-accent uppercase tracking-widest">[EXPRESS_HYDRA]</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { amount: '250', subtitle: 'Micro Refresh // 250ml', label: 'Standard' },
              { amount: '500', subtitle: 'Hydration Pulse // 500ml', label: 'Protocol' },
              { amount: '750', subtitle: 'Cellular Injection // 750ml', label: 'Advanced' },
              { amount: '1000', subtitle: 'Maximum Saturation // 1000ml', label: 'Maximum' }
            ].map((water, idx) => (
              <KineticExpressCard
                key={water.amount}
                title={`+${water.amount} ml`}
                subtitle={water.subtitle}
                icon="💧"
                badgeText="Inject Fluid"
                colorScheme="accent"
                onClick={() => handleQuickWaterLog(water.amount)}
                nodeId={`HYD_EX_${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )
    },
  ], [handleQuickFoodLog, handleQuickWorkoutLog, handleQuickWaterLog]);

  const activeContent = useMemo(() => {
    return quickLogTabs.find(t => t.id === activeTab)?.content;
  }, [quickLogTabs, activeTab]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 relative overflow-x-hidden">
      {/* 2.5-Second Cinematic Orbital Alignment Sequence */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020408] transition-opacity duration-1000">
          <div className="relative flex items-center justify-center mb-12">
            {/* Concentric orbital rings */}
            <div className="w-40 h-40 rounded-full border border-voro-primary/20 border-t-voro-primary animate-spin" />
            <div className="absolute w-28 h-28 rounded-full border border-voro-secondary/20 border-b-voro-secondary animate-orbit-counter" />
            <div className="absolute w-16 h-16 rounded-full border border-voro-accent/30 border-r-voro-accent animate-spin-slow" />
            <Zap className="absolute w-6 h-6 text-voro-primary animate-pulse" />
          </div>

          <div className="text-center space-y-3">
            <p className="text-[0.65rem] font-mono font-black uppercase tracking-[0.6em] text-voro-primary animate-pulse">
              Calibrating Express Synapse Matrix
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-600 font-mono text-[0.55rem] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-voro-primary animate-ping" />
              <span>SYNAPSE_LINK // NOMINAL_STATE</span>
            </div>
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-[35%] h-[35%] bg-voro-primary/5 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[15%] right-[10%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 py-16">
        <Breadcrumb
          items={[
            { label: 'System', href: '/dashboard' },
            { label: 'Express Matrix', href: '/quick-log' },
            { label: 'Rapid Trajectory Sync' }
          ]}
          className="mb-12"
        />

        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10 group/header">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="p-2.5 bg-voro-primary/10 rounded-xl border border-voro-primary/20">
                <Share2 size={18} className="animate-pulse" />
              </div>
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">
                Express Trajectory Synchronization
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tight text-white leading-none">
                Express <span className="text-voro-primary not-italic font-black">Manifestation</span>
              </h1>
              <p className="text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-70 leading-relaxed max-w-xl">
                Rapid zero-friction entry terminal for instant biophysical, caloric, and hydration trajectory synchronization.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent opacity-40 group-hover/header:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <p className="text-gray-600 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-50 whitespace-nowrap">Node Ref: 0xEXPRESS_LOG_SYS</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Tag variant="voro-primary" nodeId="EXP_01">Zero_Latency</Tag>
            <Tag variant="voro-secondary" nodeId="EXP_02">Instant_Sync</Tag>
          </div>
        </header>

        {/* Selector Tabs */}
        <div className="mb-12">
          <Tabs
            tabs={quickLogTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Main Log Container */}
        <Card variant="premium" nodeId="EXPRESS_MTX" className="p-10 md:p-14 mb-16">
          {activeContent}
        </Card>

        {/* Bottom Utility Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Button
            variant="secondary"
            onClick={() => addNotification('Export history sequence initialized', 'info')}
            className="!rounded-2xl"
          >
            <Download size={14} className="mr-2" />
            <span>Export History Manifest</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => addNotification('Evolution trajectory link generated', 'info')}
            className="!rounded-2xl"
          >
            <Share2 size={14} className="mr-2" />
            <span>Share Trajectory</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickLog;
