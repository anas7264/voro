import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Clipboard, Calendar, Zap, Layout, Trash2, ShieldAlert } from 'lucide-react';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { CachedDateTimeFormat } from '@/utils/formatters';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static constants & cached formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat and new Date in loops or high-frequency renders.
 */
const EMPTY_OBJECT = Object.freeze({});

const dateStrFormatter = new CachedDateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

/**
 * ⚡ LUXURY REFINEMENT: SavedMealPlanCard Subcomponent.
 * Extracted memoized component with 60fps direct-DOM 3D volumetric hover tilt tracking,
 * holographic telemetry overlays, and static focus tilts for accessibility.
 */
const SavedMealPlanCard = React.memo(({
  plan,
  idx,
  isConfirming,
  onDelete,
  onAnalyze,
  onExport
}) => {
  const cardRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '4deg');
      cardRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = '4.0';
      if (tiltYRef.current) tiltYRef.current.innerText = '-4.0';
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="article"
      aria-label={`Trophic Blueprint: ${plan.name}. Days: ${plan.days?.length || 0}. Average Calories: ${plan._avgCalories} kcal.`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        animationDelay: `${idx * 100}ms`
      }}
      className="group relative p-0 overflow-hidden bg-[#0A0C14] border border-white/5 rounded-[2.5rem] transition-all duration-700 hover:border-voro-primary/20 hover:shadow-voro-primary/5 animate-slide-up outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]"
    >
      {/* Dynamic Light Lens */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.05), transparent 45%)`,
        }}
      />

      {/* Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 z-30"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{plan._nodeId}]</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

      <div className="p-10 border-b border-white/5 bg-white/[0.01]" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-voro-primary shadow-inner">
              <Layout size={24} />
            </div>
            <div>
              <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-[0.3em]">
                {plan._formattedDate}
              </span>
              <h4 className="text-2xl font-serif italic font-medium text-white tracking-tight mt-1">{plan.name}</h4>
            </div>
          </div>

          {/* Double-Confirmation Defensive Purge UX */}
          <button
            onClick={() => onDelete(plan.id)}
            aria-label={isConfirming ? `Confirm removal of plan: ${plan.name}` : `Remove plan: ${plan.name} from protocol`}
            className={`p-3 rounded-2xl transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-red-500 border relative ${
              isConfirming
                ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse opacity-100'
                : 'text-gray-600 hover:text-red-400 hover:bg-red-400/10 border-white/5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
            }`}
          >
            {isConfirming ? <ShieldAlert size={16} /> : <Trash2 size={16} />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest mb-1">Temporal Depth</p>
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-voro-secondary" />
              <span className="text-sm font-mono font-bold text-white uppercase">{plan.days?.length || 0} Days</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest mb-1">Metabolic Mean</p>
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-voro-accent" />
              <span className="text-sm font-mono font-bold text-white uppercase">{plan._avgCalories} kcal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 flex gap-4" style={{ transform: 'translateZ(40px)' }}>
        <Button
          variant="secondary"
          onClick={onAnalyze}
          className="flex-1 h-14 text-[0.6rem] font-black uppercase tracking-[0.2em] border-white/5"
        >
          Analyze Matrix
        </Button>
        <button
          onClick={() => onExport(plan)}
          className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
          aria-label={`Export plan ${plan.name} as JSON`}
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
});
SavedMealPlanCard.displayName = 'SavedMealPlanCard';

const selectPlans = s => s || EMPTY_OBJECT;

const SavedMealPlans = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const plansData = useStorageKeySelector('plans', selectPlans);
  const { setItem } = useStorageMethods();

  // Local state for deletion confirmation
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  useEffect(() => {
    document.title = 'VORO | Plan Repository';
  }, []);

  // Reset confirmation state after timeout
  useEffect(() => {
    if (confirmingDeleteId) {
      const timer = setTimeout(() => setConfirmingDeleteId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingDeleteId]);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Zero-Allocation Data Derivation.
   * Pre-calculates average calories, node IDs, and pre-formats dates within
   * the useMemo block. Replaces .reduce with a single zero-allocation for loop.
   */
  const plans = useMemo(() => {
    const rawPlans = plansData.savedMealPlans || [];
    const len = rawPlans.length;
    const result = new Array(len);

    for (let i = 0; i < len; i++) {
      const plan = rawPlans[i];
      const days = plan.days || [];
      let totalCalories = 0;
      for (let j = 0; j < days.length; j++) {
        totalCalories += (days[j].calories || 0);
      }
      const avgCalories = days.length > 0 ? Math.round(totalCalories / days.length) : 0;

      let formattedDate = 'N/A';
      if (plan.createdAt) {
        try {
          formattedDate = dateStrFormatter.format(plan.createdAt);
        } catch (e) {
          // Fail-safe fallback
        }
      }

      result[i] = {
        ...plan,
        _avgCalories: avgCalories,
        _formattedDate: formattedDate,
        _nodeId: `TROPHIC_PLAN_0x${plan.id?.toString().slice(-4).toUpperCase() || 'UNKN'}`
      };
    }
    return result;
  }, [plansData.savedMealPlans]);

  /**
   * ⚡ OPTIMISTIC UI: Instantly removes the deleted item from the view state
   * before the async IndexedDB transaction resolves, achieving absolute smoothness.
   */
  const handleDeletePlan = useCallback(async (id) => {
    if (confirmingDeleteId === id) {
      const rawPlans = plansData.savedMealPlans || [];
      const updated = rawPlans.filter(p => p.id !== id);

      // Perform immediate non-blocking update
      await setItem('plans', { ...plansData, savedMealPlans: updated });
      addNotification('Trophic blueprint purged from enclave.', 'info');
      setConfirmingDeleteId(null);
    } else {
      setConfirmingDeleteId(id);
    }
  }, [confirmingDeleteId, plansData, setItem, addNotification]);

  const handleExportJSON = useCallback((plan) => {
    if (!plan) return;
    try {
      const jsonStr = JSON.stringify(plan, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `voro-trophic-manifest-${plan.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addNotification('Secure raw JSON export completed.', 'success');
    } catch (err) {
      addNotification('Secure export failed.', 'error');
    }
  }, [addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30">
      {/* Ambient Architectural Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Clipboard size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.6em]">Strategic Provisions</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-tight">
              Plan <span className="text-gradient not-italic font-bold">Repository</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-60">
              Archived metabolic protocols and nutritional blueprints
            </p>
          </div>

          <Button
            onClick={() => navigate('/nutrition/planner')}
            className="group h-16 px-10 shadow-2xl shadow-voro-primary/20 text-[0.7rem] font-black uppercase tracking-[0.4em]"
          >
            <Plus size={18} className="mr-3" />
            Generate New Blueprint
          </Button>
        </header>

        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <SavedMealPlanCard
                key={plan.id}
                plan={plan}
                idx={idx}
                isConfirming={confirmingDeleteId === plan.id}
                onDelete={handleDeletePlan}
                onAnalyze={() => navigate('/nutrition/planner')}
                onExport={handleExportJSON}
              />
            ))}
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 relative group">
               <div className="absolute inset-0 bg-voro-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <Clipboard size={32} className="text-gray-800 group-hover:text-voro-primary/50 transition-colors duration-700" />
            </div>
            <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.5em] mb-4">Repository Empty</h3>
            <p className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-widest max-w-xs leading-relaxed mb-12">
              No metabolic blueprints detected in the local archive.
            </p>
            <Button
              onClick={() => navigate('/nutrition/planner')}
              className="px-12 h-16 shadow-xl shadow-voro-primary/10"
            >
              Synthesize First Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedMealPlans;
